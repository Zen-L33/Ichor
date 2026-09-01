import { createFileRoute, Link } from "@tanstack/react-router";
import { Anchor, Users } from "lucide-react";
import {
  DISCORD_INVITE,
  accentStyles,
  divisions,
  ranks,
} from "@/data/crew";
import jollyRogerAsset from "@/assets/ichor-jolly-roger.png.asset.json";

const jollyRoger = jollyRogerAsset.url;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICHOR — Rell Seas Crew" },
      {
        name: "description",
        content:
          "Ichor is a Rell Seas crew of three divisions: the Sunborne Celestials of Apollo, the Aegis Knights of Athena, and the Windbound Saints of Hermes.",
      },
      { property: "og:title", content: "ICHOR — Rell Seas Crew" },
      {
        property: "og:description",
        content:
          "Three divisions under one banner — Sunborne Celestials, Aegis Knights, Windbound Saints.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -5%, oklch(0.82 0.012 250 / 14%), transparent 70%), radial-gradient(ellipse 40% 30% at 18% 30%, oklch(0.85 0.14 95 / 8%), transparent 70%), radial-gradient(ellipse 45% 35% at 50% 45%, oklch(0.48 0.19 25 / 12%), transparent 70%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={jollyRoger}
            alt="ICHOR Jolly Roger"
            className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
          />
          <span className="font-display text-lg font-bold tracking-[0.3em] text-silver">
            ICHOR
          </span>
        </a>
        <div className="flex items-center gap-6 font-mono text-xs tracking-widest text-muted-foreground uppercase sm:gap-8">
          <a href="#divisions" className="transition-colors hover:text-gold">
            Divisions
          </a>
          <Link to="/roster" className="transition-colors hover:text-gold">
            Roster
          </Link>
          <a href="#join" className="transition-colors hover:text-gold">
            Join
          </a>
        </div>
      </nav>

      <main id="top" className="relative z-10">
        {/* Hero */}
        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-10 pb-20 text-center sm:pt-14">
          <div className="relative animate-float-slow">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 scale-110 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.48 0.19 25 / 26%) 0%, oklch(0.85 0.14 95 / 10%) 45%, transparent 68%)",
              }}
            />
            <img
              src={jollyRoger}
              alt="The Jolly Roger of the Ichor crew — a silver knight's helm with crimson wings and crossed swords"
              className="h-64 w-64 animate-flicker object-contain drop-shadow-[0_0_40px_oklch(0.48_0.19_25/45%)] sm:h-80 sm:w-80"
            />
          </div>

          <p className="mt-10 flex items-center gap-2 font-mono text-xs tracking-[0.35em] text-ichor uppercase">
            <Anchor className="h-3.5 w-3.5" />
            Rell Seas Crew
          </p>
          <h1 className="mt-4 font-display text-6xl font-black tracking-[0.15em] text-regalia animate-sheen sm:text-8xl">
            ICHOR
          </h1>
          <div className="rule-regalia mt-6 max-w-sm" />
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Steel in our hands, storms in our blood, gold on the horizon. Three
            divisions, one banner — and the whole of the Rell Seas beneath our
            boots.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={DISCORD_INVITE}
              className="rounded-md bg-primary px-7 py-3 font-mono text-sm font-semibold tracking-widest text-primary-foreground uppercase transition-all hover:shadow-[0_0_30px_oklch(0.48_0.19_25/60%)]"
            >
              Join the Crew
            </a>
            <Link
              to="/roster"
              className="rounded-md border border-gold/40 bg-gold/5 px-7 py-3 font-mono text-sm font-semibold tracking-widest text-gold uppercase transition-all hover:bg-gold/15"
            >
              View the Roster
            </Link>
          </div>

          {/* Division quick strip */}
          <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {divisions.map((d) => {
              const accent = accentStyles[d.accent];
              return (
                <a
                  key={d.key}
                  href="#divisions"
                  className={`rounded-lg border border-border bg-card/60 px-4 py-3 transition-colors ${accent.ring}`}
                >
                  <p className={`font-mono text-[0.6rem] tracking-[0.25em] uppercase ${accent.text}`}>
                    {d.role}
                  </p>
                  <p className="mt-1 font-display text-sm font-bold text-foreground">
                    {d.short}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Divisions */}
        <section id="divisions" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24">
          <div className="mb-12 text-center">
            <p className="font-mono text-xs tracking-[0.35em] text-ichor uppercase">
              Three banners, one crew
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-wider text-silver sm:text-5xl">
              The Divisions
            </h2>
            <div className="rule-regalia mx-auto mt-5 max-w-xs" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {divisions.map((division) => {
              const Icon = division.icon;
              const accent = accentStyles[division.accent];
              return (
                <article
                  key={division.key}
                  className={`surface-plate group relative overflow-hidden rounded-xl border border-border p-8 transition-all duration-300 ${accent.ring} hover:-translate-y-1`}
                >
                  <div
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-px ${accent.dot} opacity-50`}
                  />
                  <div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg border ${accent.border} ${accent.bg}`}
                  >
                    <Icon className={`h-7 w-7 ${accent.text}`} />
                  </div>
                  <p className={`font-mono text-xs tracking-[0.25em] uppercase ${accent.text}`}>
                    {division.role} · {division.patron}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-foreground">
                    {division.name}
                  </h3>
                  <p className="mt-1 font-mono text-[0.7rem] tracking-wide text-muted-foreground/80 italic">
                    {division.epithet}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {division.description}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {division.specialties.map((s) => (
                      <li
                        key={s}
                        className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground"
                      >
                        <span className={`h-1 w-1 rounded-full ${accent.dot}`} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* Join / Discord */}
        <section id="join" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24">
          <div className="surface-plate relative overflow-hidden rounded-2xl border border-ichor/30 px-8 py-14 text-center">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 100% at 50% 100%, oklch(0.48 0.19 25 / 20%), transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold tracking-wider text-regalia animate-sheen sm:text-4xl">
                Sail Under the Red Wing
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
                Recruitment runs through our Discord. Prove yourself, pick your
                division, and raise the flag with us.
              </p>
              <a
                href={DISCORD_INVITE}
                className="mt-8 inline-block rounded-md bg-primary px-8 py-3 font-mono text-sm font-semibold tracking-widest text-primary-foreground uppercase transition-all hover:shadow-[0_0_30px_oklch(0.48_0.19_25/60%)]"
              >
                Enter the Discord
              </a>
              <p className="mt-4 font-mono text-xs text-muted-foreground/60">
                Discord invite link goes live once we connect the server.
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
            <span className="text-gold">Sunborne</span> ·{" "}
            <span className="text-steel">Aegis</span> ·{" "}
            <span className="text-ichor">Windbound</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
