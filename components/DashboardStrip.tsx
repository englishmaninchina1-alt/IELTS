"use client";

import Link from "next/link";
import { useProfile } from "@/lib/store";
import { overallBand, bandColour, bandLabel } from "@/lib/band";
import { ProgressBar, ScoreDial } from "./ui";

const SKILLS = [
  { key: "reading", href: "/reading", colour: "text-limeDeep" },
  { key: "listening", href: "/listening", colour: "text-tealDeep" },
  { key: "writing", href: "/writing", colour: "text-violetDeep" },
  { key: "speaking", href: "/speaking", colour: "text-coralDeep" },
] as const;

export default function DashboardStrip() {
  const { profile, ready } = useProfile();
  const bands = SKILLS.map((s) => profile.attempts.find((a) => a.skill === s.key)?.band ?? 0);
  const overall = overallBand(bands.filter(Boolean));
  const taken = profile.attempts.length;

  if (!ready) return <div className="card h-40 animate-pulse" />;

  if (taken === 0) {
    return (
      <div className="card flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">No tests yet — your baseline is one click away.</h3>
          <p className="mt-1 text-[12.5px] leading-6 text-ink/50">
            Start with a 20-minute Reading passage. You will get a raw score, a band from the official conversion table, and an explanation for
            every answer you missed.
          </p>
        </div>
        <Link href="/reading/mock-1" className="btn-primary shrink-0">Take a baseline test →</Link>
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <ScoreDial band={overall} size={112} caption="Overall" />
        <div>
          <div className={`text-[13px] font-semibold ${bandColour(overall)}`}>{bandLabel(overall)}</div>
          <p className="mt-1 max-w-[190px] text-[11.5px] leading-5 text-ink/40">
            {taken} test{taken === 1 ? "" : "s"} completed. Target {profile.target.toFixed(1)}.
          </p>
          <Link href="/progress" className="mt-2 inline-block text-[11.5px] font-semibold text-tealDeep hover:underline">
            Full breakdown →
          </Link>
        </div>
      </div>
      <div className="grid flex-1 gap-2 sm:grid-cols-2">
        {SKILLS.map((s, i) => (
          <Link key={s.key} href={s.href} className="rounded-xl border border-ink/10 bg-ink/[0.025] px-3 py-2 transition hover:border-ink/25">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-medium capitalize text-ink/65">{s.key}</span>
              <span className={`text-[13px] font-semibold ${bands[i] ? s.colour : "text-ink/25"}`}>{bands[i] ? bands[i].toFixed(1) : "—"}</span>
            </div>
            <div className="mt-1.5">
              <ProgressBar value={bands[i]} max={9} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
