"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProfile } from "@/lib/store";
import { overallBand, bandLabel, bandColour } from "@/lib/band";
import { EmptyState, Pill, ProgressBar, ScoreDial, SectionHead, Stat } from "@/components/ui";
import ProgressAccount from "@/components/ProgressAccount";

const SKILLS = ["reading", "listening", "writing", "speaking"] as const;

export default function ProgressPage() {
  const { profile, update, ready } = useProfile();

  const latest = useMemo(
    () => SKILLS.map((s) => ({ skill: s, band: profile.attempts.find((a) => a.skill === s)?.band ?? 0 })),
    [profile.attempts]
  );
  const overall = overallBand(latest.map((l) => l.band).filter(Boolean));
  const total = profile.attempts.length;
  const mastered = Object.values(profile.vocab).filter((v) => v.box >= 3).length;
  const gap = profile.target && overall ? (profile.target - overall).toFixed(1) : null;

  if (!ready) return <div className="py-20 text-center text-sm text-ink/40">Loading your progress…</div>;

  return (
    <div>
      <SectionHead
        eyebrow="Your progress"
        title="The honest picture."
        sub="Every completed test is recorded here — with the raw score, the band and the date. Saved in this browser, and to your account when you sign in."
      />

      <ProgressAccount />

      {total === 0 ? (
        <EmptyState
          title="No tests yet"
          body="Once you complete a Reading, Listening, Writing or Speaking task, your band appears here and builds into a trend you can actually act on."
          action={<Link href="/reading" className="btn-primary">Start with a Reading test →</Link>}
        />
      ) : (
        <>
          <div className="mb-4 grid gap-3 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="card flex flex-col items-center p-5">
              <ScoreDial band={overall} size={150} caption="Overall estimate" />
              <p className={`mt-2 text-[13px] font-semibold ${bandColour(overall)}`}>{bandLabel(overall)}</p>
              <p className="mt-1 text-center text-[11px] leading-5 text-ink/35">
                Mean of your four most recent skill scores, rounded to the nearest half band.
              </p>
              {gap && Number(gap) > 0 && (
                <p className="mt-2 rounded-lg bg-lime/10 px-2.5 py-1.5 text-center text-[11px] leading-5 text-limeDeep">
                  {gap} bands to your target of {profile.target.toFixed(1)}
                </p>
              )}
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {latest.map(({ skill, band }) => {
                const attempts = profile.attempts.filter((a) => a.skill === skill);
                const trend = attempts.slice(0, 6).reverse();
                return (
                  <div key={skill} className="card p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[13px] font-semibold capitalize text-ink">{skill}</h3>
                      <span className={`font-serif text-xl ${band > 0 ? bandColour(band) : "text-ink/25"}`}>{band > 0 ? band.toFixed(1) : "—"}</span>
                    </div>
                    <div className="mt-1 text-[10.5px] text-ink/35">
                      {attempts.length} attempt{attempts.length === 1 ? "" : "s"} · {skill === "reading" || skill === "listening" ? "raw-score table" : "rubric estimate"}
                    </div>
                    <div className="mt-2"><ProgressBar value={band} max={9} tone={band >= 7 ? "teal" : "lime"} /></div>
                    {trend.length > 1 && (
                      <div className="mt-2 flex h-8 items-end gap-1">
                        {trend.map((a) => (
                          <div key={a.id} className="flex-1 rounded-sm bg-teal/40" style={{ height: `${Math.max(8, (a.band / 9) * 100)}%` }} title={`${a.band}`} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Stat label="Tests taken" value={total} />
            <Stat label="Day streak" value={profile.streak.days} sub={profile.streak.lastDay ?? "—"} />
            <Stat label="Words mastered" value={mastered} sub={`of ${Object.keys(profile.vocab).length} studied`} />
            <Stat label="Target" value={profile.target.toFixed(1)} sub={profile.testDate ? `Test: ${profile.testDate}` : "no test date set"} />
          </div>

          <div className="card mb-4 p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="label">Target band</label>
                <input
                  type="number" min={4} max={9} step={0.5} value={profile.target}
                  onChange={(e) => update((p) => ({ ...p, target: Math.min(9, Math.max(4, Number(e.target.value) || 6)) }))}
                  className="field w-24 !py-1.5"
                />
              </div>
              <div>
                <label className="label">Test date</label>
                <input
                  type="date" value={profile.testDate ?? ""}
                  onChange={(e) => update((p) => ({ ...p, testDate: e.target.value || null }))}
                  className="field w-44 !py-1.5"
                />
              </div>
              <div className="ml-auto">
                <button
                  className="btn-quiet !text-[11.5px]"
                  onClick={() => {
                    if (confirm("Delete all your saved progress? This cannot be undone.")) {
                      update(() => ({ attempts: [], vocab: {}, streak: { lastDay: null, days: 0 }, target: 7, testDate: null, name: "", coachHistory: [] }));
                    }
                  }}
                >
                  Reset all progress
                </button>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink/40">Attempt history</h3>
              <span className="text-[11px] text-ink/30">latest first</span>
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-ink/35">Date</th>
                    <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-ink/35">Skill</th>
                    <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-ink/35">Task</th>
                    <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-ink/35">Raw</th>
                    <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-ink/35">Band</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.attempts.slice(0, 40).map((a) => (
                    <tr key={a.id} className="border-t border-ink/5">
                      <td className="whitespace-nowrap px-4 py-2 text-[11.5px] text-ink/40">
                        {new Date(a.date).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}
                      </td>
                      <td className="px-4 py-2">
                        <Pill tone={a.skill === "reading" ? "lime" : a.skill === "listening" ? "teal" : a.skill === "writing" ? "violet" : "coral"}>{a.skill}</Pill>
                      </td>
                      <td className="max-w-[240px] truncate px-4 py-2 text-[12px] text-ink/70">{a.label}</td>
                      <td className="px-4 py-2 text-[11.5px] text-ink/45">{a.raw !== undefined ? `${a.raw}/${a.total}` : "—"}</td>
                      <td className={`px-4 py-2 text-[13px] font-semibold ${bandColour(a.band)}`}>{a.band.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
