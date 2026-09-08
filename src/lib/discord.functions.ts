import { createServerFn } from "@tanstack/react-start";
import {
  DISCORD_GUILD_ID,
  divisions,
  isDivisionCommanderRank,
  isMainCrewRank,
  ranks,
  roster as fallbackRoster,
  type DivisionKey,
  type Member,
} from "@/data/crew";

export type RosterResult = {
  members: Member[];
  /** "live" = straight from Discord, "fallback" = the hand-written list */
  source: "live" | "fallback";
  error: string | null;
  syncedAt: string;
};

type DiscordRole = { id: string; name: string };
type DiscordMember = {
  roles: string[];
  nick: string | null;
  user: { id: string; username: string; global_name: string | null; bot?: boolean };
};

const API = "https://discord.com/api/v10";

/**
 * Fetch wrapper that respects Discord's 429 rate limit: waits the
 * Retry-After window and retries instead of erroring out.
 */
async function discordFetch(
  url: string,
  headers: Record<string, string>,
  attempt = 0,
): Promise<Response> {
  const res = await fetch(url, { headers });
  if (res.status === 429 && attempt < 4) {
    let bodyRetryAfter = 0;
    try {
      const body = (await res.clone().json()) as { retry_after?: number };
      bodyRetryAfter = Number(body.retry_after) || 0;
    } catch {
      // Some Discord edge responses are HTML and only provide headers.
    }

    const retryAfter = Math.min(
      Math.max(
        Number(res.headers.get("Retry-After")) || 0,
        Number(res.headers.get("X-RateLimit-Reset-After")) || 0,
        bodyRetryAfter,
        (attempt + 1) * 2,
      ),
      40,
    );
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000 + 250));
    return discordFetch(url, headers, attempt + 1);
  }
  return res;
}

/**
 * Short-lived cache so a burst of page loads doesn't hammer Discord's API
 * (which is what triggers 429s in the first place).
 */
let cache: { result: RosterResult; expires: number } | null = null;
let inFlight: Promise<RosterResult> | null = null;
/** Last successful live roster — served whenever Discord refuses a refresh. */
let lastGood: { members: Member[]; syncedAt: string } | null = null;
const CACHE_TTL_MS = 15 * 60_000;
const ERROR_CACHE_TTL_MS = 60_000;

function cacheResult(result: RosterResult, ttl: number) {
  cache = { result, expires: Date.now() + ttl };
  return result;
}

async function fetchRoster(): Promise<RosterResult> {
  const token = process.env["DISCORD_BOT_TOKEN"];
  const guildId = process.env["DISCORD_GUILD_ID"] || DISCORD_GUILD_ID;
  const syncedAt = new Date().toISOString();

  // If an external roster URL is provided (e.g., GitHub Actions writes data/roster.json),
  // prefer that to avoid calling Discord from hosts that share egress IPs.
  const externalUrl = process.env["EXTERNAL_ROSTER_URL"];
  if (externalUrl) {
    try {
      const extRes = await fetch(externalUrl);
      if (extRes.ok) {
        const payload = await extRes.json();
        if (Array.isArray(payload?.members)) {
          // If members already match Member[] shape (have rank/division), use directly.
          const first = payload.members[0];
          if (first && typeof first.rank === 'string') {
            return cacheResult(
              {
                members: payload.members as Member[],
                source: "live",
                error: null,
                syncedAt: payload.syncedAt ?? syncedAt,
              },
              CACHE_TTL_MS,
            );
          }

          // Otherwise, payload.members is expected to be [{ name, roles: [roleName...] }, ...]
          // Map role names to ranks/divisions using the same rules as the live Discord sync.
          const divisionByRole = new Map<string, DivisionKey>(
            divisions.map((d) => [d.discordRoleName.toLowerCase(), d.key]),
          );
          const rankByRole = new Map(
            ranks.map((r) => [r.discordRoleName.toLowerCase(), r]),
          );

          const members: Member[] = [];
          for (const m of payload.members) {
            const names: string[] = Array.isArray(m.roles) ? m.roles.filter(Boolean) : [];
            const displayName = m.name ?? 'Unknown';

            let division: DivisionKey | null = null;
            let mainCrew = false;
            const held: (typeof ranks)[number][] = [];

            for (const name of names) {
              const key = name.toLowerCase();
              const d = divisionByRole.get(key);
              if (d && !division) division = d;
              const r = rankByRole.get(key);
              if (r) held.push(r);
            }

            held.sort((a, b) => b.weight - a.weight);
            const rank = held[0] ?? null;

            if (!rank && !division) continue;

            if (rank && isMainCrewRank(rank.name)) {
              mainCrew = true;
              division = null;
            } else if (rank?.division) {
              division = rank.division;
            }

            const council = held.find((r) => r.name === "Divine Council");
            const commander = held.find((r) => isDivisionCommanderRank(r.name));

            if (council && commander) {
              members.push({ name: displayName, rank: council.name, division: null, mainCrew: true });
              members.push({ name: displayName, rank: commander.name, division: commander.division ?? division, mainCrew: false });
              continue;
            }

            members.push({ name: displayName, rank: rank?.name ?? "GrandFleet Member", division, mainCrew });
          }

          if (members.length > 0) {
            return cacheResult({ members, source: "live", error: null, syncedAt: payload.syncedAt ?? syncedAt }, CACHE_TTL_MS);
          }
        }
      } else {
        console.warn("[discord] external roster returned non-ok:", extRes.status);
      }
    } catch (e) {
      console.warn("[discord] external roster fetch failed", e);
      // fall-through to normal Discord sync
    }
  }

  if (!token || !guildId) {
    return cacheResult({
      members: fallbackRoster,
      source: "fallback",
      error: "Discord bot token not configured.",
      syncedAt,
    }, ERROR_CACHE_TTL_MS);
  }

  const headers = { Authorization: `Bot ${token}` };

  try {
    const rolesRes = await discordFetch(`${API}/guilds/${guildId}/roles`, headers);
    if (!rolesRes.ok) {
      throw new Error(`roles ${rolesRes.status}`);
    }
    const roles = (await rolesRes.json()) as DiscordRole[];
    const roleNameById = new Map(roles.map((r) => [r.id, r.name]));

    // Paginate members (1000 max per page).
    const all: DiscordMember[] = [];
    let after = "0";
    for (let page = 0; page < 10; page++) {
      const res = await discordFetch(
        `${API}/guilds/${guildId}/members?limit=1000&after=${after}`,
        headers,
      );
      if (!res.ok) {
        throw new Error(`members ${res.status}`);
      }
      const batch = (await res.json()) as DiscordMember[];
      all.push(...batch);
      if (batch.length < 1000) break;
      const lastMember = batch.at(-1);
      if (!lastMember) break;
      after = lastMember.user.id;
    }

    const divisionByRole = new Map<string, DivisionKey>(
      divisions.map((d) => [d.discordRoleName.toLowerCase(), d.key]),
    );
    const rankByRole = new Map(
      ranks.map((r) => [r.discordRoleName.toLowerCase(), r]),
    );

    const members: Member[] = [];
    for (const m of all) {
      if (m.user.bot) continue;
      const names = m.roles
        .map((id) => roleNameById.get(id))
        .filter((n): n is string => Boolean(n));

      let division: DivisionKey | null = null;
      let mainCrew = false;
      const held: (typeof ranks)[number][] = [];

      for (const name of names) {
        const key = name.toLowerCase();
        const d = divisionByRole.get(key);
        if (d && !division) division = d;
        const r = rankByRole.get(key);
        if (r) held.push(r);
      }

      // Highest rank in the hierarchy wins when someone holds several.
      held.sort((a, b) => b.weight - a.weight);
      const rank = held[0] ?? null;

      // Only show people who actually hold a crew rank or a division role.
      if (!rank && !division) continue;

      const displayName = m.nick ?? m.user.global_name ?? m.user.username;

      if (rank && isMainCrewRank(rank.name)) {
        mainCrew = true;
        // Crew-wide ranks (Captain, Vice-Captain, Left Hand, Divine Council,
        // Main Crew) belong to no division, even if they hold a division role.
        division = null;
      } else if (rank?.division) {
        // Commanders and vice commanders sit under their own division.
        division = rank.division;
      }

      // Exception: Divine Council + a division commander rank shows twice —
      // once under Main Crew, once under their division.
      const council = held.find((r) => r.name === "Divine Council");
      const commander = held.find((r) => isDivisionCommanderRank(r.name));

      if (council && commander) {
        members.push({
          name: displayName,
          rank: council.name,
          division: null,
          mainCrew: true,
        });
        members.push({
          name: displayName,
          rank: commander.name,
          division: commander.division ?? division,
          mainCrew: false,
        });
        continue;
      }

      members.push({
        name: displayName,
        rank: rank?.name ?? "GrandFleet Member",
        division,
        mainCrew,
      });
    }

    if (members.length === 0) {
      return cacheResult({
        members: fallbackRoster,
        source: "fallback",
        error: "No members matched the configured Discord roles.",
        syncedAt,
      }, ERROR_CACHE_TTL_MS);
    }

    lastGood = { members, syncedAt };
    return cacheResult(
      { members, source: "live", error: null, syncedAt },
      CACHE_TTL_MS,
    );
  } catch (err) {
    console.error("[discord] roster sync failed", err);
    const detail = err instanceof Error ? err.message : "unknown error";
    // Discord (especially from shared hosting IPs) rate-limits often — if we
    // have a previous good sync, keep showing it instead of dropping the page.
    if (lastGood) {
      return cacheResult({
        members: lastGood.members,
        source: "live",
        error: `Discord rate-limited the refresh — showing the last good sync (${detail})`,
        syncedAt: lastGood.syncedAt,
      }, ERROR_CACHE_TTL_MS);
    }
    return cacheResult({
      members: fallbackRoster,
      source: "fallback",
      error: `Discord sync failed: ${detail}`,
      syncedAt,
    }, ERROR_CACHE_TTL_MS);
  }
}

/**
 * Pulls every member of the Ichor Discord and maps their roles onto our
 * divisions and ranks (matched by the `discordRoleName` fields in crew.ts).
 *
 * Requires a bot in the server with the SERVER MEMBERS INTENT enabled.
 */
export const getRoster = createServerFn({ method: "GET" }).handler(
  async (): Promise<RosterResult> => {
    const syncedAt = new Date().toISOString();

    if (cache && cache.expires > Date.now()) {
      return { ...cache.result, syncedAt };
    }

    if (inFlight) return inFlight;

    inFlight = fetchRoster();
    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  },
);
