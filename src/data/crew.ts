import { Sun, Shield, Wind, type LucideIcon } from "lucide-react";

/**
 * ICHOR crew data.
 *
 * The roster is keyed by Discord role names so it can later be replaced by a
 * live fetch from the Discord API (GET /guilds/{id}/members) without touching
 * any UI code. Keep `discordRoleName` in each division and each rank exactly
 * matching the role names in the Ichor Discord server.
 */

export const DISCORD_INVITE = "https://discord.gg/uPadxKJGp";
export const DISCORD_GUILD_ID = "1360204829414129776";

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
      "Under the sign of Apollo, the Sunborne are the mind of Ichor. They read the field before anyone moves — calling strategy, running specialist roles, and turning plans into clean wins. Where the crew moves as one, it is because the Sunborne charted the line.",
    specialties: [
      "Battle strategy & callouts",
      "Specialist roles",
      "Field intelligence",
      "Fleet coordination",
    ],
    icon: Sun,
    accent: "gold",
    discordRoleName: "Celestials",
  },
  {
    key: "aegis",
    name: "The Aegis Knights",
    short: "Aegis",
    patron: "Athena",
    epithet: "Steel, discipline & the held line",
    role: "The frontline",
    description:
      "Athena's own. The Aegis Knights are the shield of Ichor — disciplined, steadfast, and sworn to the crew. They hold the line, keep order, and make sure no one is left behind.",
    specialties: [
      "Defense & crew protection",
      "Discipline & drilling",
      "Holding the line",
      "Morale & standards",
    ],
    icon: Shield,
    accent: "steel",
    discordRoleName: "Knights",
  },
  {
    key: "windbound",
    name: "The Windbound Saints",
    short: "Windbound",
    patron: "Hermes",
    epithet: "Speed, cunning & open horizons",
    role: "The pathfinders",
    description:
      "Blessed by Hermes, the Windbound run ahead of the crew. Explorers, scouts and gatherers — they chart unknown islands, run trade and salvage, and keep every hold of Ichor full.",
    specialties: [
      "Exploration & scouting",
      "Resource gathering",
      "Trade routes & logistics",
      "Cartography",
    ],
    icon: Wind,
    accent: "ichor",
    discordRoleName: "Saints",
  },
];

export type Rank = {
  name: string;
  discordRoleName: string;
  /** Plain-language meaning of the title */
  note?: string;
  weight: number; // higher = more senior, used for roster ordering
};

export const ranks: Rank[] = [
  { name: "Grand Marshal", discordRoleName: "Grand Marshal", note: "Captain", weight: 200 },
  { name: "Knight Commander", discordRoleName: "Knight Commander", note: "Vice-Captain", weight: 190 },
  { name: "Saint of War", discordRoleName: "Saint of War", note: "Left Hand", weight: 185 },
  { name: "Divine Council", discordRoleName: "Divine Council", weight: 180 },

  { name: "Oracle of the Sun", discordRoleName: "Oracle of the Sun", note: "Celestials Commander", weight: 170 },
  { name: "The Archon of Athena", discordRoleName: "The Archon of Athena", note: "Knights Commander", weight: 170 },
  { name: "Grand Arbiter of Hermes", discordRoleName: "Grand Arbiter of Hermes", note: "Saints Commander", weight: 170 },

  { name: "Solar Eclipse", discordRoleName: "Solar Eclipse", note: "Celestials Vice Commander", weight: 160 },
  { name: "Lunar Eclipse", discordRoleName: "Lunar Eclipse", note: "Celestials Vice Commander", weight: 160 },
  { name: "The Divine Spear", discordRoleName: "The Divine Spear", note: "Knights Vice Commander", weight: 160 },
  { name: "The Holy Shield", discordRoleName: "The Holy Shield", note: "Knights Vice Commander", weight: 160 },
  { name: "The Warden of Stars", discordRoleName: "The Warden of Stars", note: "Saints Vice Commander", weight: 160 },
  { name: "The Shorekeeper", discordRoleName: "The Shorekeeper", note: "Saints Vice Commander", weight: 160 },

  { name: "Main Crew", discordRoleName: "Main Crew", weight: 150 },

  { name: "Celestials", discordRoleName: "Celestials", note: "Division member", weight: 140 },
  { name: "Knights", discordRoleName: "Knights", note: "Division member", weight: 140 },
  { name: "Saints", discordRoleName: "Saints", note: "Division member", weight: 140 },

  { name: "GrandFleet Member", discordRoleName: "GrandFleet Member", weight: 130 },
];

export const rankWeight = (rank: string) =>
  ranks.find((r) => r.name === rank)?.weight ?? 0;

export type Member = {
  /** Discord display name */
  name: string;
  rank: string;
  division: DivisionKey | null;
  /** True when the member holds the Main Crew role */
  mainCrew?: boolean;
  /** Optional in-game / preferred role blurb */
  title?: string;
};

/**
 * Placeholder roster. Replace these entries with your real crew, or swap this
 * array for a Discord-synced fetch (members mapped by their role names).
 */
export const roster: Member[] = [
  { name: "Grand Marshal Name", rank: "Grand Marshal", division: null, mainCrew: true, title: "Captain" },
  { name: "Knight Commander Name", rank: "Knight Commander", division: null, mainCrew: true, title: "Vice-Captain" },
  { name: "Saint of War Name", rank: "Saint of War", division: null, mainCrew: true, title: "Left Hand" },
  { name: "Council Member", rank: "Divine Council", division: null, mainCrew: true },

  { name: "Oracle Name", rank: "Oracle of the Sun", division: "sunborne", mainCrew: true, title: "Division Commander" },
  { name: "Solar Eclipse Name", rank: "Solar Eclipse", division: "sunborne", mainCrew: true, title: "Vice Commander" },
  { name: "Celestial Member", rank: "Celestials", division: "sunborne" },

  { name: "Archon Name", rank: "The Archon of Athena", division: "aegis", mainCrew: true, title: "Division Commander" },
  { name: "Divine Spear Name", rank: "The Divine Spear", division: "aegis", mainCrew: true, title: "Vice Commander" },
  { name: "Knight Member", rank: "Knights", division: "aegis" },

  { name: "Arbiter Name", rank: "Grand Arbiter of Hermes", division: "windbound", mainCrew: true, title: "Division Commander" },
  { name: "Warden Name", rank: "The Warden of Stars", division: "windbound", mainCrew: true, title: "Vice Commander" },
  { name: "Saint Member", rank: "Saints", division: "windbound" },

  { name: "Main Crew Name", rank: "Main Crew", division: null, mainCrew: true },
  { name: "Fleet Member", rank: "GrandFleet Member", division: null },
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
