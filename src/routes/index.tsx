import { createFileRoute } from "@tanstack/react-router";
import { Sun, Shield, Wind, Anchor } from "lucide-react";
import jollyRoger from "@/assets/ichor-jolly-roger.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICHOR — Rell Seas Crew" },
      {
        name: "description",
        content:
          "ICHOR is a Rell Seas crew. Three divisions under one banner: the Sunborne Celestials, the Aegis Knights, and the Windbound Saints.",
      },
      { property: "og:title", content: "ICHOR — Rell Seas Crew" },
      {
        property: "og:description",
        content:
          "Three divisions under one banner: the Sunborne Celestials, the Aegis Knights, and the Windbound Saints.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// TODO: paste the Discord invite URL here when the integration step happens.
const DISCORD_INVITE = "#join";

const divisions = [
  {
    name: "The Sunborne Celestials",
    epithet: "Radiance & fury",
    description:
      "The crew's burning spearhead. The Sunborne strike first and brightest, turning the tide of battle with overwhelming offense.",
    icon: Sun,
    accent: "gold",
  },
  {
    name: "The Aegis Knights",
    epithet: "Steel & oath",
    description:
      "The unbreakable wall of ICHOR. Clad in discipline, the Aegis hold the line, guard the fleet, and never yield an inch.",
    icon: Shield,
    accent: "steel",
  },
  {
    name: "The Windbound Saints",
    epithet: "Storm & speed",
    description:
      "Swift as the gale and twice as cruel. The Windbound scout, flank, and vanish before the enemy knows the wind has turned.",
    icon: Wind,
    accent: "seafoam",
  },
] as const;

type AccentKey = "gold" | "steel" | "seafoam";

const accentStyles: Record<AccentKey, { ring: string; text: string; bg: string }> = {
  gold: {
    ring: "hover:border-gold/50",
    text: "text-gold",
    bg: "bg-gold/10",
  },
  steel: {
    ring: "hover:border-steel/50",
    text: "text-steel",
    bg: "bg-steel/10",
  },
  seafoam: {
    ring: "hover:border-seafoam/50",
    text: "text-seafoam",
    bg: "bg-seafoam/10",
  },
};

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -5%, oklch(0.78 0.02 250 / 12%), transparent 70%), radial-gradient(ellipse 45% 35% at 50% 42%, oklch(0.48 0.19 25 / 10%), transparent 70%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={jollyRoger.url}
            alt="ICHOR Jolly Roger"
            className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
          />
          <span className="font-display text-lg font-bold tracking-[0.3em] text-foreground">
            ICHOR
          </span>
        </a>
        <div className="hidden items-center gap-8 font-mono text-xs tracking-widest text-muted-foreground uppercase sm:flex">
          <a href="#divisions" className="transition-colors hover:text-foreground">
            Divisions
          </a>
          <a href="#join" className="transition-colors hover:text-foreground">
            Join
          </a>
        </div>
      </nav>

      <main id="top" className="relative z-10">
        {/* Hero */}
        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-10 pb-20 text-center sm:pt-16">
          <div className="relative animate-float-slow">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 scale-110 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.48 0.19 25 / 25%) 0%, transparent 65%)",
              }}
            />
            <img
              src={jollyRoger.url}
              alt="The Jolly Roger of the ICHOR crew — a silver knight's helm with crimson wings and crossed swords"
              className="h-64 w-64 animate-flicker object-contain drop-shadow-[0_0_40px_oklch(0.48_0.19_25/40%)] sm:h-80 sm:w-80"
            />
          </div>

          <p className="mt-10 flex items-center gap-2 font-mono text-xs tracking-[0.35em] text-ichor uppercase">
            <Anchor className="h-3.5 w-3.5" />
            Rell Seas Crew
          </p>
          <h1 className="mt-4 font-display text-6xl font-black tracking-[0.15em] text-foreground text-glow-ichor sm:text-8xl">
            ICHOR
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            The blood of the sea runs red. Three divisions, one banner — and the
            whole of the Rell Seas ahead of us.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={DISCORD_INVITE}
              className="rounded-md bg-primary px-7 py-3 font-mono text-sm font-semibold tracking-widest text-primary-foreground uppercase transition-all hover:bg-ichor hover:shadow-[0_0_30px_oklch(0.48_0.19_25/50%)]"
            >
              Join the Crew
            </a>
            <a
              href="#divisions"
              className="rounded-md border border-border bg-secondary/50 px-7 py-3 font-mono text-sm font-semibold tracking-widest text-secondary-foreground uppercase transition-colors hover:border-steel/40 hover:text-foreground"
            >
              The Divisions
            </a>
          </div>
        </section>

        {/* Divisions */}
        <section id="divisions" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24">
          <div className="mb-12 text-center">
            <p className="font-mono text-xs tracking-[0.35em] text-ichor uppercase">
              Three banners, one crew
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-wider text-foreground sm:text-5xl">
              The Divisions
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {divisions.map((division) => {
              const Icon = division.icon;
              const accent = accentStyles[division.accent];
              return (
                <article
                  key={division.name}
                  className={`group rounded-xl border border-border bg-card p-8 transition-all duration-300 ${accent.ring} hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_oklch(0_0_0/80%)]`}
                >
                  <div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg ${accent.bg}`}
                  >
                    <Icon className={`h-7 w-7 ${accent.text}`} />
                  </div>
                  <p className={`font-mono text-xs tracking-[0.25em] uppercase ${accent.text}`}>
                    {division.epithet}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-card-foreground">
                    {division.name}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {division.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Join / Discord */}
        <section id="join" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24">
          <div className="relative overflow-hidden rounded-2xl border border-ichor/30 bg-card px-8 py-14 text-center">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 100% at 50% 100%, oklch(0.48 0.19 25 / 18%), transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold tracking-wider text-foreground text-glow-ichor sm:text-4xl">
                Sail Under the Red Wing
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
                Recruitment runs through our Discord. Prove yourself, pick your
                division, and raise the flag with us.
              </p>
              <a
                href={DISCORD_INVITE}
                className="mt-8 inline-block rounded-md bg-primary px-8 py-3 font-mono text-sm font-semibold tracking-widest text-primary-foreground uppercase transition-all hover:bg-ichor hover:shadow-[0_0_30px_oklch(0.48_0.19_25/50%)]"
              >
                Enter the Discord
              </a>
              <p className="mt-4 font-mono text-xs text-muted-foreground/60">
                Discord invite links here once connected.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            ICHOR — Rell Seas Crew
          </p>
          <p className="font-mono text-xs text-muted-foreground/60">
            Sunborne · Aegis · Windbound
          </p>
        </div>
      </footer>
    </div>
  );
}
