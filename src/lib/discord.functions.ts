import { createServerFn } from "@tanstack/react-start";
import {
  DISCORD_GUILD_ID,
  divisions,
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
 * Pulls every member of the Ichor Discord and maps their roles onto our
 * divisions and ranks (matched by the `discordRoleName` fields in crew.ts).
 *
 * Requires a bot in the server with the SERVER MEMBERS INTENT enabled.
 */
export const getRoster = createServerFn({ method: "GET" }).handler(
  async (): Promise<RosterResult> => {
    const token = process.env["DISCORD_BOT_TOKEN"];
    const guildId = process.env["DISCORD_GUILD_ID"] || DISCORD_GUILD_ID;
    const syncedAt = new Date().toISOString();

    if (!token || !guildId) {
      return {
        members: fallbackRoster,
        source: "fallback",
        error: "Discord bot token not configured.",
        syncedAt,
      };
    }

    const headers = { Authorization: `Bot ${token}` };

    try {
      const rolesRes = await fetch(`${API}/guilds/${guildId}/roles`, { headers });
      if (!rolesRes.ok) {
        throw new Error(`roles ${rolesRes.status}`);
      }
      const roles = (await rolesRes.json()) as DiscordRole[];
      const roleNameById = new Map(roles.map((r) => [r.id, r.name]));

      // Paginate members (1000 max per page).
      const all: DiscordMember[] = [];
      let after = "0";
      for (let page = 0; page < 10; page++) {
        const res = await fetch(
          `${API}/guilds/${guildId}/members?limit=1000&after=${after}`,
          { headers },
        );
        if (!res.ok) {
          throw new Error(`members ${res.status}`);
        }
        const batch = (await res.json()) as DiscordMember[];
        all.push(...batch);
        if (batch.length < 1000) break;
        after = batch[batch.length - 1]!.user.id;
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
          if (key === "main crew") mainCrew = true;
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

        if (rank && isMainCrewRank(rank.name)) mainCrew = true;

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
            division,
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
        return {
          members: fallbackRoster,
          source: "fallback",
          error: "No members matched the configured Discord roles.",
          syncedAt,
        };
      }

      return { members, source: "live", error: null, syncedAt };
    } catch (err) {
      console.error("[discord] roster sync failed", err);
      return {
        members: fallbackRoster,
        source: "fallback",
        error: "Could not reach Discord right now.",
        syncedAt,
      };
    }
  },
);
