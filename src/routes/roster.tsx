import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Users, Anchor, RefreshCw } from "lucide-react";
import { getRoster } from "@/lib/discord.functions";
import {
  DISCORD_INVITE,
  accentStyles,
  divisions,
  isMainCrewRank,
  rankWeight,
  type DivisionKey,
} from "@/data/crew";
import jollyRogerAsset from "@/assets/ichor-jolly-roger.png.asset.json";

const jollyRoger = jollyRogerAsset.url;

const rosterQueryOptions = queryOptions({
  queryKey: ["roster"],
  queryFn: () => getRoster(),
  staleTime: 60_000,
});


export const Route = createFileRoute("/roster")({
  head: () => ({
    meta: [
      { title: "ICHOR Roster — The Crew of the Red Wing" },
      {
        name: "description",
        content:
          "The full Ichor crew roster, sorted by Discord rank and division: Sunborne Celestials, Aegis Knights and Windbound Saints.",
      },
      { property: "og:title", content: "ICHOR Roster — The Crew of the Red Wing" },
      {
        property: "og:description",
        content:
          "Every hand aboard Ichor, grouped by division and rank straight from our Discord roles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(rosterQueryOptions),
  component: RosterPage,
});

type Filter = DivisionKey | "all" | "main";

function RosterPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const { data } = useSuspenseQuery(rosterQueryOptions);

  const members = useMemo(
    () =>
      data.members
        .filter((m) =>
          filter === "all"
            ? true
            : filter === "main"
              ? isMainCrewRank(m.rank)
              : m.division === filter,
        )
        .sort(
          (a, b) =>
            rankWeight(b.rank) - rankWeight(a.rank) ||
            a.name.localeCompare(b.name),
        ),
    [filter, data.members],
  );



  return (
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 50% 0%, oklch(0.82 0.012 250 / 10%), transparent 70%), radial-gradient(ellipse 50% 30% at 50% 60%, oklch(0.48 0.19 25 / 10%), transparent 70%)",
        }}
      />

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={jollyRoger}
            alt="ICHOR Jolly Roger"
            className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
          />
          <span className="font-display text-lg font-bold tracking-[0.3em] text-silver">
            ICHOR
          </span>
        </Link>
        <div className="flex items-center gap-8 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span className="text-gold">Roster</span>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <header className="py-12 text-center">
          <p className="flex items-center justify-center gap-2 font-mono text-xs tracking-[0.35em] text-ichor uppercase">
            {data.source === "live" ? (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                Live from our Discord roles
              </>
            ) : (
              <>
                <Users className="h-3.5 w-3.5" />
                Discord sync pending
              </>
            )}
          </p>

          <h1 className="mt-4 font-display text-5xl font-black tracking-[0.12em] text-regalia animate-sheen sm:text-6xl">
            THE ROSTER
          </h1>
          <div className="rule-regalia mx-auto mt-6 max-w-md" />
          <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground sm:text-base">
            Every hand aboard, ranked and sorted by division. Ranks and division
            membership mirror the roles you hold in the Ichor Discord.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All Hands
          </FilterButton>
          <FilterButton
            active={filter === "main"}
            onClick={() => setFilter("main")}
            accent="gold"
          >
            Main Crew
          </FilterButton>
          {divisions.map((d) => (

            <FilterButton
              key={d.key}
              active={filter === d.key}
              onClick={() => setFilter(d.key)}
              accent={d.accent}
            >
              {d.short}
            </FilterButton>
          ))}
        </div>

        {/* Roster grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => {
            const division = divisions.find((d) => d.key === m.division);
            const accent = division ? accentStyles[division.accent] : null;
            return (
              <article
                key={`${m.name}-${i}`}
                className={`surface-plate group flex items-center gap-4 rounded-xl border border-border p-5 transition-all duration-300 hover:-translate-y-0.5 ${accent?.ring ?? "hover:border-gold"}`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-display text-lg font-bold ${accent?.bg ?? "bg-muted"} ${accent?.text ?? "text-steel"}`}
                >
                  {m.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold text-foreground">
                    {m.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase">
                    <span className="text-gold">{m.rank}</span>
                    {division && (
                      <>
                        <span className="text-muted-foreground/50"> · </span>
                        <span className={accent!.text}>{division.short}</span>
                      </>
                    )}
                  </p>
                  {m.title && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {m.title}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {members.length === 0 && (
          <p className="py-16 text-center font-mono text-sm text-muted-foreground">
            No crew listed under this banner yet.
          </p>
        )}

        <div className="mt-14 rounded-xl border border-ichor/25 surface-plate px-8 py-10 text-center">
          <h2 className="font-display text-2xl font-bold text-silver">
            Want your name on this list?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Join the Discord, pick your division, and your rank shows up here.
          </p>
          <a
            href={DISCORD_INVITE}
            className="mt-6 inline-block rounded-md bg-primary px-7 py-3 font-mono text-sm font-semibold tracking-widest text-primary-foreground uppercase transition-all hover:shadow-[0_0_30px_oklch(0.48_0.19_25/60%)]"
          >
            Enter the Discord
          </a>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6">
          <Anchor className="h-3.5 w-3.5 text-ichor" />
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            ICHOR — Rell Seas Crew
          </p>
        </div>
      </footer>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "gold" | "steel" | "ichor";
}) {
  const activeClass = active
    ? accent
      ? `${accentStyles[accent].bg} ${accentStyles[accent].text} ${accentStyles[accent].border}`
      : "bg-gold/10 text-gold border-gold/45"
    : "border-border text-muted-foreground hover:text-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-5 py-2 font-mono text-xs tracking-[0.2em] uppercase transition-all ${activeClass}`}
    >
      {children}
    </button>
  );
}
