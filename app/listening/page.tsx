import Link from "next/link";
import { listeningTests } from "@/data";
import { SectionHead, Pill } from "@/components/ui";
import { totalQuestions } from "@/lib/types";

export const metadata = { title: "Listening practice · Band Nine" };

export default function ListeningIndex() {
  return (
    <div>
      <SectionHead
        eyebrow="Listening"
        title="Four sections, read aloud at exam pace."
        sub="The recordings are generated live by your browser's speech engine, so there is nothing to download and every section can be slowed to 0.85× while you build prediction skills. Answer keys, explanations and full transcripts are revealed after you submit."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { t: "Predict the word class", d: "£____ is a number. ____ Street is a capitalised name. Predicting the shape catches the answer even when the speech is fast." },
          { t: "Listen for the correction", d: "Speakers say the wrong answer first, then correct themselves. The second version is the answer — this is deliberate." },
          { t: "Spelling is a mark", d: "Section 1 is effectively a spelling test. Double letters, 'ph' versus 'f', and hyphens all cost marks." },
        ].map((c) => (
          <div key={c.t} className="card p-4">
            <h3 className="text-[12.5px] font-semibold text-tealDeep">{c.t}</h3>
            <p className="mt-1.5 text-[12px] leading-6 text-ink/55">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {listeningTests.map((t) => (
          <div key={t.id} className="card flex flex-col p-5 transition hover:border-tealDeep/30">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-ink">{t.title}</h2>
                <p className="mt-1.5 text-[13px] leading-6 text-ink/50">{t.blurb}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-teal/10 px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-tealDeep">40 min</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.sections.map((s) => (
                <Pill key={s.id}>S{s.number} · {s.title.split("·")[1]?.trim() ?? s.title}</Pill>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
              <div className="text-[11.5px] text-ink/40">
                {t.sections.length} sections · {t.sections.reduce((n, s) => n + totalQuestions(s.groups), 0)} questions
              </div>
              <Link href={`/listening/${t.id}`} className="btn-primary !py-1.5 !text-[12px]">
                Start test →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">How the audio works</h3>
        <p className="mt-2 max-w-3xl text-[13px] leading-6 text-ink/60">
          Each recording is spoken by your browser&apos;s built-in voice, using the accent selected for that section (British, American or
          Australian). Voices vary between operating systems, which is realistic practice for the real test — you will not know your examiner&apos;s
          voice either. If nothing plays, open a second tab once and return: some browsers load speech voices lazily.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          {[
            ["Band 8", "35–36"],
            ["Band 7.5", "32–34"],
            ["Band 7", "30–31"],
            ["Band 6.5", "26–29"],
          ].map(([b, r]) => (
            <div key={b} className="rounded-lg border border-ink/10 bg-ink/[0.025] px-3 py-2">
              <div className="text-[11px] uppercase tracking-wider text-ink/35">{b}</div>
              <div className="text-sm font-semibold text-ink/80">{r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
