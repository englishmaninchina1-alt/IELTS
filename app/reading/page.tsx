import Link from "next/link";
import { readingTests } from "@/data";
import { SectionHead, Pill } from "@/components/ui";
import { totalQuestions } from "@/lib/types";

export const metadata = { title: "Reading practice · Band Nine" };

export default function ReadingIndex() {
  return (
    <div>
      <SectionHead
        eyebrow="Academic Reading"
        title="Three passages. Forty questions. Sixty minutes."
        sub="Full mock tests built around the topics examiners are actually setting now — sustainable travel, AI and work, smart cities, food security, misinformation and consumer rights. Answer keys explain the reasoning, not just the letter."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { t: "Skim for structure first", d: "90 seconds on the first sentence of each paragraph gives you a map. The questions then point at a paragraph rather than a page." },
          { t: "TRUE / FALSE / NOT GIVEN is logic", d: "If you find yourself arguing with the passage, it is NOT GIVEN. If you are arguing with the world, it is FALSE." },
          { t: "Never leave a blank", d: "There is no negative marking. In the last two minutes, guess everything you have not answered." },
        ].map((c) => (
          <div key={c.t} className="card p-4">
            <h3 className="text-[12.5px] font-semibold text-limeDeep">{c.t}</h3>
            <p className="mt-1.5 text-[12px] leading-6 text-ink/55">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {readingTests.map((t) => (
          <div key={t.id} className="card group flex flex-col p-5 transition hover:border-limeDeep/30">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-ink">{t.title}</h2>
                <p className="mt-1.5 text-[13px] leading-6 text-ink/50">{t.blurb}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-lime/10 px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-limeDeep">60 min</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.topics.map((topic) => (
                <Pill key={topic}>{topic}</Pill>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
              <div className="text-[11.5px] text-ink/40">
                {t.passages.length} passages · {t.passages.reduce((n, p) => n + totalQuestions(p.groups), 0)} questions
              </div>
              <Link href={`/reading/${t.id}`} className="btn-primary !py-1.5 !text-[12px]">
                Start test →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Score conversion (Academic Reading)</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Band 9", "39–40"],
            ["Band 8", "35–36"],
            ["Band 7", "30–32"],
            ["Band 6.5", "27–29"],
            ["Band 6", "23–26"],
            ["Band 5.5", "19–22"],
            ["Band 5", "15–18"],
            ["Band 4.5", "13–14"],
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
