import { Sun, Shield, Wind, type LucideIcon } from "lucide-react";

/**
 * ICHOR crew data.
 *
 * The roster is keyed by Discord role names so it can later be replaced by a
 * live fetch from the Discord API (GET /guilds/{id}/members) without touching
 * any UI code. Keep `discordRoleName` in each division and each rank exactly
 * matching the role names in the ICHOR Discord server.
 */

export const DISCORD_INVITE = "#join"; // TODO: paste the real invite URL
export const DISCORD_GUILD_ID = ""; // TODO: paste the ICHOR server ID

export type DivisionKey = "sunborne" | "aegis" | "windbound";
export type AccentKey = "gold" | "steel" | "ichor";

export type Division = {
  key: DivisionKey;
  name: string;
  short: string;
  patron: string;
  epithet: string;
  role: string;
  description: string;
  specialties: string[];
  icon: LucideIcon;
  accent: AccentKey;
  discordRoleName: string;
};

export const divisions: Division[] = [
  {
    key: "sunborne",
    name: "The Sunborne Celestials",
    short: "Sunborne",
    patron: "Apollo",
    epithet: "Light, foresight & precision",
    role: "The backbone",
    description:
      "Under the sign of Apollo, the Sunborne are the mind of ICHOR. They read the field before the first blade is drawn — calling strategy, running specialist roles, and turning smart combat into clean victories. Where the crew moves as one, it is because the Sunborne charted the line.",
    specialties: [
      "Battle strategy & callouts",
      "Specialist loadouts",
      "Precision / ranged combat",
      "Fleet coordination",
    ],
    icon: Sun,
    accent: "gold",
    discordRoleName: "Sunborne Celestials",
  },
  {
    key: "aegis",
    name: "The Aegis Knights",
    short: "Aegis",
    patron: "Athena",
    epithet: "Steel, discipline & the held line",
    role: "The frontline",
    description:
      "Athena's own. The Aegis Knights meet the enemy first and leave last — shields locked, oaths kept. They anchor every engagement, absorb the charge, and hold ground long enough for the rest of ICHOR to finish the work.",
    specialties: [
      "Frontline assault",
      "Boarding & defense",
      "Tank / bruiser builds",
      "Crew protection",
    ],
    icon: Shield,
    accent: "steel",
    discordRoleName: "Aegis Knights",
  },
  {
    key: "windbound",
    name: "The Windbound Saints",
    short: "Windbound",
    patron: "Hermes",
    epithet: "Speed, cunning & open horizons",
    role: "The pathfinders",
    description:
      "Blessed by Hermes, the Windbound run ahead of the crew. Explorers, scouts and gatherers — they chart unknown islands, run trade and salvage, and keep every hold of ICHOR full before a fight ever starts.",
    specialties: [
      "Exploration & scouting",
      "Resource gathering",
      "Trade routes & logistics",
      "Mobility / flanking",
    ],
    icon: Wind,
    accent: "ichor",
    discordRoleName: "Windbound Saints",
  },
];

export type Rank = {
  name: string;
  discordRoleName: string;
  weight: number; // higher = more senior, used for roster ordering
};

export const ranks: Rank[] = [
  { name: "Captain", discordRoleName: "Captain", weight: 100 },
  { name: "First Mate", discordRoleName: "First Mate", weight: 90 },
  { name: "Division Lead", discordRoleName: "Division Lead", weight: 80 },
  { name: "Officer", discordRoleName: "Officer", weight: 70 },
  { name: "Veteran", discordRoleName: "Veteran", weight: 60 },
  { name: "Crew", discordRoleName: "Crew", weight: 50 },
  { name: "Recruit", discordRoleName: "Recruit", weight: 40 },
];

export const rankWeight = (rank: string) =>
  ranks.find((r) => r.name === rank)?.weight ?? 0;

export type Member = {
  /** Discord display name */
  name: string;
  rank: string;
  division: DivisionKey | null;
  /** Optional in-game / preferred role blurb */
  title?: string;
};

/**
 * Placeholder roster. Replace these entries with your real crew, or swap this
 * array for a Discord-synced fetch (members mapped by their role names).
 */
export const roster: Member[] = [
  { name: "Captain Name", rank: "Captain", division: null, title: "Crew Leader" },
  { name: "First Mate Name", rank: "First Mate", division: null, title: "Second in command" },

  { name: "Sunborne Lead", rank: "Division Lead", division: "sunborne", title: "Strategist" },
  { name: "Sunborne Officer", rank: "Officer", division: "sunborne", title: "Sharpshooter" },
  { name: "Sunborne Member", rank: "Crew", division: "sunborne", title: "Specialist" },

  { name: "Aegis Lead", rank: "Division Lead", division: "aegis", title: "Shieldbearer" },
  { name: "Aegis Officer", rank: "Officer", division: "aegis", title: "Vanguard" },
  { name: "Aegis Member", rank: "Crew", division: "aegis", title: "Bruiser" },

  { name: "Windbound Lead", rank: "Division Lead", division: "windbound", title: "Pathfinder" },
  { name: "Windbound Officer", rank: "Officer", division: "windbound", title: "Quartermaster" },
  { name: "Windbound Member", rank: "Crew", division: "windbound", title: "Scout" },

  { name: "New Recruit", rank: "Recruit", division: null },
];

export const accentStyles: Record<
  AccentKey,
  { text: string; border: string; bg: string; ring: string; dot: string }
> = {
  gold: {
    text: "text-gold",
    border: "border-gold/45",
    bg: "bg-gold/10",
    ring: "hover:border-gold/60",
    dot: "bg-gold",
  },
  steel: {
    text: "text-steel",
    border: "border-steel/45",
    bg: "bg-steel/10",
    ring: "hover:border-steel/60",
    dot: "bg-steel",
  },
  ichor: {
    text: "text-ichor",
    border: "border-ichor/45",
    bg: "bg-ichor/10",
    ring: "hover:border-ichor/60",
    dot: "bg-ichor",
  },
};
