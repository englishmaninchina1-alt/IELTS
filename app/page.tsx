import Link from "next/link";
import DashboardStrip from "@/components/DashboardStrip";
import { Pill } from "@/components/ui";

const skills = [
  {
    href: "/reading",
    label: "Reading",
    accent: "text-limeDeep",
    ring: "hover:border-limeDeep/35",
    blurb: "Two full Academic mock tests — 6 passages, 80 questions, 60-minute timer.",
    detail: ["TRUE/FALSE/NOT GIVEN logic training", "Matching headings and gap-fill", "Answer key with reasoning"],
  },
  {
    href: "/listening",
    label: "Listening",
    accent: "text-tealDeep",
    ring: "hover:border-tealDeep/35",
    blurb: "Four sections per test, spoken aloud at exam pace with British, American and Australian voices.",
    detail: ["Spelling and number traps", "Play-once exam mode", "Full transcript after you submit"],
  },
  {
    href: "/writing",
    label: "Writing",
    accent: "text-violetDeep",
    ring: "hover:border-violetDeep/35",
    blurb: "Five Task 1 charts and eight Task 2 questions, scored against the four official criteria.",
    detail: ["Live word count and 40-minute timer", "Criteria-by-criteria feedback", "Band 8 model answers"],
  },
  {
    href: "/speaking",
    label: "Speaking",
    accent: "text-coralDeep",
    ring: "hover:border-coralDeep/35",
    blurb: "Real exam structure: one minute to prepare, two minutes to speak, recorded and transcribed.",
    detail: ["Part 1, 2 and 3 question banks", "Record and play back", "Fluency, vocabulary and grammar estimate"],
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-white via-[#fffdf7] to-[#f2eee3] px-6 py-10 sm:px-10 sm:py-14">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime/35 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet/25 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="lime">Academic &amp; General preparation</Pill>
            <span className="text-[11px] text-ink/35">Updated for 2026 topics</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-[56px]">
            Practise all four skills.<br />
            Get a band, not a<br />
            <span className="text-limeDeep">pat on the back.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink/60">
            Full mock tests in Reading, Listening, Writing and Speaking — marked against the real IELTS tables and criteria, with an explanation
            for every mark you lose. Plus the vocabulary, sentence structures and ideas that actually move a 6.5 to a 7.5.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link href="/reading/mock-1" className="btn-primary">Start a full mock test</Link>
            <Link href="/coach" className="btn-ghost">Open the AI Coach</Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11.5px] text-ink/40">
            <span>✓ 2 full Reading tests</span>
            <span>✓ 2 full Listening tests</span>
            <span>✓ 13 Writing tasks</span>
            <span>✓ Band estimates in seconds</span>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <DashboardStrip />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-serif text-2xl text-ink">The four papers</h2>
          <span className="text-[11.5px] text-ink/35">Everything is timed and scored</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {skills.map((s) => (
            <Link key={s.href} href={s.href} className={`card group flex flex-col p-5 transition ${s.ring}`}>
              <div className="flex items-start justify-between">
                <h3 className={`font-serif text-xl ${s.accent}`}>{s.label}</h3>
                <span className="text-ink/20 transition group-hover:translate-x-0.5 group-hover:text-ink/50">→</span>
              </div>
              <p className="mt-2 text-[13px] leading-6 text-ink/55">{s.blurb}</p>
              <ul className="mt-3 space-y-1">
                {s.detail.map((d) => (
                  <li key={d} className="flex gap-2 text-[12px] text-ink/40">
                    <span className="text-ink/25">·</span>
                    {d}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-3 lg:grid-cols-3">
        <div className="card relative overflow-hidden p-6 lg:col-span-2">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lime/35 blur-2xl" />
          <Pill tone="lime">AI Coach</Pill>
          <h2 className="mt-3 font-serif text-2xl leading-snug text-ink">Stuck on what to write? Start with an argument.</h2>
          <p className="mt-2 max-w-lg text-[13px] leading-6 text-ink/55">
            The coach reads your question, identifies the topic, and offers positions, reasons and examples. Give it your own brainstorm and it
            turns them into a structured essay with a concession and a conclusion — then hands you the vocabulary to improve it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/coach" className="btn-primary !py-2 !text-[12.5px]">Brainstorm an essay →</Link>
            <Link href="/vocabulary" className="btn-ghost !py-2 !text-[12.5px]">Vocabulary bank</Link>
            <Link href="/grammar" className="btn-ghost !py-2 !text-[12.5px]">Sentence structure</Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-serif text-xl text-ink">How scoring works</h2>
          <div className="mt-3 space-y-3 text-[12px] leading-6 text-ink/55">
            <div>
              <span className="font-semibold text-limeDeep">Reading &amp; Listening</span>
              <p>Raw score out of 40, converted with the published band tables. Exact, not estimated.</p>
            </div>
            <div>
              <span className="font-semibold text-tealDeep">Writing &amp; Speaking</span>
              <p>Four criteria measured from your response, averaged and rounded to the nearest half band. Diagnostic, not official.</p>
            </div>
            <div>
              <span className="font-semibold text-violetDeep">Overall</span>
              <p>Mean of the four, rounded — exactly how IELTS calculates the overall band.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl text-ink">Where the marks are actually lost</h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "No overview in Task 1", d: "Caps Task Achievement at Band 5 no matter how good the English is. Two sentences, no numbers." },
            { n: "02", t: "Arguing with a NOT GIVEN", d: "If the passage does not address the statement, the answer is NOT GIVEN — even if it is obviously true." },
            { n: "03", t: "Stopping at 60 seconds", d: "In Speaking Part 2, an incomplete answer costs more than any grammar error. Keep speaking." },
            { n: "04", t: "Waiting for the exact word", d: "Listening paraphrases. If you are waiting to hear 'prohibited', you will miss 'not allowed'." },
          ].map((c) => (
            <div key={c.n} className="card p-4">
              <div className="font-serif text-2xl text-ink/15">{c.n}</div>
              <h3 className="mt-1 text-[12.5px] font-semibold text-ink">{c.t}</h3>
              <p className="mt-1.5 text-[11.5px] leading-5 text-ink/45">{c.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Link href="/tips" className="btn-ghost !py-2 !text-[12.5px]">Full strategy guide →</Link>
        </div>
      </section>
    </div>
  );
}
