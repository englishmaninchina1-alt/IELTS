"use client";

import { useState } from "react";

const VIDEO = "https://share.synthesia.io/b1fc1b00-cf31-46f4-ba2a-857d0b778998";

/**
 * Video mock exam: a Synthesia examiner runs the full speaking test. The player
 * is only mounted after a click so the page stays fast and nothing is fetched
 * from the third party until the student asks for it.
 */
export default function SpeakingExam() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="card relative overflow-hidden p-5 sm:p-6">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-coral/25 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill-lime">Video mock exam</span>
          <span className="text-[11px] text-ink/35">Full test · 11–14 minutes · Part 1, 2 and 3</span>
        </div>

        <h2 className="mt-3 font-serif text-2xl leading-snug text-ink sm:text-[28px]">
          Sit the most realistic IELTS speaking exam — then get feedback on your answer.
        </h2>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-6 text-ink/55">
          A video examiner takes you through the real structure: Part 1 introduction questions, Part 2 with one minute to prepare and two
          minutes to speak, then the Part 3 discussion. Answer out loud, exactly as you would in the exam room — no pauses, no rewinding.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-ink/10 bg-[#14161c]">
            {playing ? (
              <iframe
                src={VIDEO}
                title="Master the IELTS Speaking Test — video mock exam"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture; microphone; camera"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 grid place-content-center text-center focus:outline-none"
                aria-label="Play the IELTS speaking video exam"
              >
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_260px_at_50%_20%,rgba(199,244,100,0.16),transparent_70%)]" />
                <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime text-ink shadow-[0_10px_30px_-10px_rgba(199,244,100,0.9)] transition group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-limeDeep/40">
                  <span className="ml-1 block h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-ink" />
                </span>
                <span className="relative mt-4 block px-6 font-serif text-lg text-white">Master the IELTS Speaking Test</span>
                <span className="relative mt-1 block text-[11.5px] uppercase tracking-[0.16em] text-white/45">
                  Video examiner · plays here
                </span>
              </button>
            )}
          </div>

          <div>
            <ol className="space-y-2.5">
              {[
                { n: "1", t: "Sit the exam", d: "Watch, listen, and answer aloud on the examiner's cue — including the one-minute preparation." },
                { n: "2", t: "Record your Part 2", d: "Use the recorder below to capture the same two-minute answer on your own cue card." },
                { n: "3", t: "Get the feedback", d: "Fluency, vocabulary, grammar and pronunciation estimates, plus the fixes that raise the band." },
              ].map((s) => (
                <li key={s.n} className="flex gap-2.5 rounded-xl border border-ink/10 bg-ink/[0.02] px-3 py-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink/10 text-[11px] font-bold text-ink/60">{s.n}</span>
                  <span>
                    <span className="block text-[12.5px] font-semibold text-ink">{s.t}</span>
                    <span className="mt-0.5 block text-[11.5px] leading-5 text-ink/45">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-3 flex flex-wrap gap-2">
              <a href="#record" className="btn-primary !py-2 !text-[12.5px]">
                Get feedback on your answer →
              </a>
              <a
                href={VIDEO}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost !py-2 !text-[12.5px]"
              >
                Open in a new tab
              </a>
            </div>
            <p className="mt-2 text-[10.5px] leading-4 text-ink/35">
              If the player is blocked in your browser, open it in a new tab — the exam is the same.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
