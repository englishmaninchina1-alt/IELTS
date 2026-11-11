"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ListeningTest, Question, QuestionGroup } from "@/lib/types";
import { isCorrect } from "@/lib/types";
import { rawToBand } from "@/lib/band";
import { useProfile } from "@/lib/store";
import { ProgressBar, ScoreDial } from "./ui";

type Status = "idle" | "playing" | "paused" | "done";

export default function ListeningRunner({ test }: { test: ListeningTest }) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [rate, setRate] = useState(0.95);
  const [submitted, setSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [voiceCount, setVoiceCount] = useState(0);
  const [supported, setSupported] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  const queueRef = useRef<{ text: string; lang: string; speaker: string }[]>([]);
  const posRef = useRef(0);
  const playingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { recordAttempt } = useProfile();

  const section = test.sections[sectionIdx];
  const allQuestions = useMemo(() => test.sections.flatMap((s) => s.groups.flatMap((g) => g.questions)), [test]);
  const sectionQuestions = useMemo(() => section.groups.flatMap((g) => g.questions), [section]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const load = () => setVoiceCount(window.speechSynthesis.getVoices().length);
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(
    () => () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  const pickVoice = useCallback(
    (lang: string, speaker: string) => {
      const voices = window.speechSynthesis.getVoices();
      const exact = voices.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(lang.toLowerCase()));
      const fallback = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
      const pool = exact.length ? exact : fallback;
      if (!pool.length) return undefined;
      // Deterministic per-speaker choice so different speakers sound different.
      let h = 0;
      for (const ch of speaker) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      return pool[h % pool.length];
    },
    []
  );

  const speakNext = useCallback(() => {
    if (!playingRef.current) return;
    const q = queueRef.current[posRef.current];
    if (!q) {
      setStatus("done");
      playingRef.current = false;
      return;
    }
    const u = new SpeechSynthesisUtterance(q.text);
    const v = pickVoice(q.lang, q.speaker);
    if (v) u.voice = v;
    u.lang = q.lang;
    u.rate = rate;
    u.pitch = q.speaker.length % 2 === 0 ? 1.05 : 0.95;
    u.onend = () => {
      if (!playingRef.current) return;
      posRef.current += 1;
      setTimeout(() => speakNext(), 420);
    };
    u.onerror = () => {
      if (!playingRef.current) return;
      posRef.current += 1;
      setTimeout(() => speakNext(), 300);
    };
    window.speechSynthesis.speak(u);
  }, [pickVoice, rate]);

  const play = useCallback(
    (fromStart: boolean) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      if (fromStart) {
        queueRef.current = section.script.map((l) => ({ text: l.text, lang: section.voice, speaker: l.speaker }));
        posRef.current = 0;
        setElapsed(0);
      }
      playingRef.current = true;
      setStatus("playing");
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      speakNext();
    },
    [section, speakNext]
  );

  const pause = () => {
    playingRef.current = false;
    window.speechSynthesis.cancel();
    setStatus("paused");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const stop = () => {
    playingRef.current = false;
    window.speechSynthesis.cancel();
    posRef.current = 0;
    setStatus("idle");
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const correctCount = useMemo(() => allQuestions.filter((q) => isCorrect(q, answers[q.id])).length, [allQuestions, answers]);
  const band = rawToBand("listening", correctCount);
  const sectionScore = sectionQuestions.filter((q) => isCorrect(q, answers[q.id])).length;

  const submit = () => {
    if (submitted) return;
    stop();
    setSubmitted(true);
    recordAttempt({ skill: "listening", label: test.title, band, raw: correctCount, total: allQuestions.length });
  };

  if (!supported) {
    return (
      <div className="card p-6">
        <h2 className="font-serif text-xl text-ink">This browser cannot play the audio</h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          The listening section is read aloud by your browser&apos;s built-in speech engine, which this browser does not expose. Try Chrome,
          Edge or Safari. You can still read the transcript and answer the questions, but that is not real listening practice.
        </p>
        <button className="btn-ghost mt-4" onClick={() => setShowTranscript(true)}>
          Show transcript
        </button>
        {showTranscript && (
          <div className="mt-4 space-y-2 rounded-xl bg-ink/5 p-4 text-[13px] leading-6 text-ink/70">
            {section.script.map((l, i) => (
              <p key={i}>
                <span className="font-semibold text-tealDeep">{l.speaker}: </span>
                {l.text}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="animate-fade-up">
        <div className="card mb-5 flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
          <ScoreDial band={band} caption="Listening" />
          <div className="flex-1">
            <h2 className="font-serif text-2xl text-ink">Listening test complete</h2>
            <p className="mt-1 text-sm text-ink/55">
              {correctCount} of {allQuestions.length} correct. Bands are converted from the published Listening raw-score table.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {test.sections.map((s, i) => {
                const qs = s.groups.flatMap((g) => g.questions);
                const got = qs.filter((q) => isCorrect(q, answers[q.id])).length;
                return (
                  <div key={s.id} className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-ink/40">Section {i + 1}</div>
                    <div className="text-lg font-semibold text-ink">
                      {got}
                      <span className="text-xs text-ink/40">/{qs.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button className="btn-ghost" onClick={() => location.reload()}>
            Retake
          </button>
        </div>

        <div className="space-y-4">
          {test.sections.map((s, si) => (
            <div key={s.id} className="card p-5">
              <h3 className="font-serif text-lg text-ink">
                Section {si + 1} · {s.title}
              </h3>
              <p className="mt-0.5 text-[12px] text-ink/40">{s.context}</p>
              <div className="mt-4 space-y-2.5">
                {s.groups.flatMap((g) => g.questions).map((q) => {
                  const given = answers[q.id] ?? "";
                  const ok = isCorrect(q, given);
                  return (
                    <div key={q.id} className={`rounded-lg border px-3 py-2 ${ok ? "border-tealDeep/20 bg-teal/[0.03]" : "border-coralDeep/25 bg-coral/[0.03]"}`}>
                      <div className="flex items-start gap-2.5">
                        <span className={`text-[11px] font-bold ${ok ? "text-tealDeep" : "text-coralDeep"}`}>{q.number}</span>
                        <div className="min-w-0">
                          <p className="text-[13px] leading-6 text-ink/80">{q.text}</p>
                          <div className="mt-1 flex flex-wrap gap-x-4 text-[11.5px]">
                            <span className={ok ? "text-tealDeep" : "text-coralDeep"}>You: {given || "—"}</span>
                            {!ok && <span className="text-ink/55">Answer: {q.answer}</span>}
                          </div>
                          <p className="mt-1 text-[11.5px] leading-5 text-ink/40">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-[12px] font-semibold text-tealDeep/80">Transcript</summary>
                <div className="mt-2 space-y-1.5 rounded-lg bg-ink/[0.04] p-3 text-[12.5px] leading-6 text-ink/60">
                  {s.script.map((l, i) => (
                    <p key={i}>
                      <span className="font-semibold text-ink/75">{l.speaker}: </span>
                      {l.text}
                    </p>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-4 border-b border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {test.sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setSectionIdx(i);
                stop();
              }}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition ${
                sectionIdx === i ? "bg-lime text-ink" : "border border-ink/15 text-ink/60 hover:bg-ink/10"
              }`}
            >
              S{i + 1}
            </button>
          ))}
          <div className="hidden items-center gap-2 text-[11.5px] text-ink/45 sm:flex">
            <span>{Object.keys(answers).filter((k) => answers[k]).length}/{allQuestions.length}</span>
            <div className="w-20">
              <ProgressBar value={Object.keys(answers).filter((k) => answers[k]).length} max={allQuestions.length} tone="teal" />
            </div>
          </div>
          <button className="btn-primary ml-auto !py-1.5 !text-[12px]" onClick={submit}>
            Submit test
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="card overflow-hidden">
            <div className={`px-4 py-3 ${status === "playing" ? "bg-teal/10" : "bg-ink/[0.03]"}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">Section {section.number}</span>
                <span className={`pill ${status === "playing" ? "border-tealDeep/40 text-tealDeep" : ""}`}>
                  {status === "playing" ? "Playing" : status === "paused" ? "Paused" : status === "done" ? "Finished" : "Ready"}
                </span>
              </div>
              <h2 className="mt-1.5 font-serif text-lg leading-snug text-ink">{section.title}</h2>
              <p className="mt-1 text-[11.5px] leading-5 text-ink/45">{section.context}</p>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                {status === "idle" || status === "done" ? (
                  <button className="btn-primary flex-1" onClick={() => play(true)}>
                    ▶ Play recording
                  </button>
                ) : status === "playing" ? (
                  <button className="btn-ghost flex-1" onClick={pause}>
                    ❚❚ Pause
                  </button>
                ) : (
                  <>
                    <button className="btn-primary flex-1" onClick={() => play(false)}>
                      ▶ Resume
                    </button>
                    <button className="btn-ghost" onClick={stop}>
                      ↺
                    </button>
                  </>
                )}
              </div>

              <div>
                <div className="mb-1 flex justify-between text-[10.5px] font-semibold uppercase tracking-wider text-ink/35">
                  <span>Speed</span>
                  <span>{rate.toFixed(2)}×</span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.2}
                  step={0.05}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-[#5A7C10]"
                />
                <p className="mt-1 text-[10.5px] leading-4 text-ink/30">
                  Exam pace is 1.00×. Slow it to 0.85× while you build prediction skills, then return.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-ink/10 bg-ink/[0.025] px-3 py-2 text-[11.5px] text-ink/50">
                <span>Elapsed</span>
                <span className="font-mono tabular-nums text-ink/80">
                  {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
                </span>
              </div>

              <div className="rounded-lg border border-[#B45309]/30 bg-[#B45309]/[0.05] p-2.5">
                <p className="text-[11px] leading-5 text-[#8A6100]/90">
                  Play once, as in the exam. This section is scored {sectionScore}/{sectionQuestions.length} so far.
                </p>
              </div>

              <button className="btn-quiet w-full !text-[11.5px]" onClick={() => setShowTranscript((s) => !s)}>
                {showTranscript ? "Hide transcript" : "Show transcript (practice mode)"}
              </button>
              {showTranscript && (
                <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-lg bg-ink/[0.04] p-3 text-[12px] leading-6 text-ink/60">
                  {section.script.map((l, i) => (
                    <p key={i}>
                      <span className="font-semibold text-ink/75">{l.speaker}: </span>
                      {l.text}
                    </p>
                  ))}
                </div>
              )}
              {voiceCount === 0 && (
                <p className="text-[10.5px] leading-4 text-coralDeep/70">
                  No speech voices detected yet. If nothing plays, open a new tab once and return — some browsers load voices lazily.
                </p>
              )}
            </div>
          </div>

          <div className="card p-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Before you press play</h4>
            <ul className="mt-2 space-y-1.5 text-[12px] leading-5 text-ink/55">
              <li>• Read every question and predict the answer&apos;s type (number, name, plural).</li>
              <li>• The recording corrects itself — the second version is the answer.</li>
              <li>• A missed answer is worth one mark. Do not stop.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          {section.groups.map((g) => (
            <div key={g.id} className="card p-4 sm:p-5">
              <p className="mb-3.5 border-l-2 border-limeDeep/60 pl-3 text-[12.5px] font-medium leading-6 text-ink/70">{g.instruction}</p>
              <div className="space-y-3">
                {g.questions.map((q) => (
                  <ListeningRow key={q.id} q={q} kind={g.kind} value={answers[q.id] ?? ""} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListeningRow({ q, kind, value, onChange }: { q: Question; kind: QuestionGroup["kind"]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink/10 text-[11px] font-bold text-ink/65">{q.number}</span>
      <div className="min-w-0 flex-1">
        {kind === "mcq" ? (
          <>
            <p className="text-[13.5px] leading-6 text-ink/85">{q.text}</p>
            <div className="mt-1.5 space-y-1">
              {(q.options ?? []).map((o, i) => (
                <button
                  key={o}
                  onClick={() => onChange(o)}
                  className={`flex w-full items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition ${
                    value === o ? "border-limeDeep bg-lime/10 text-ink" : "border-ink/10 text-ink/60 hover:border-ink/25"
                  }`}
                >
                  <span className="font-bold text-ink/40">{"ABC"[i]}</span>
                  {o}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-ink/10 bg-ink/[0.025] px-3 py-2">
            <p className="text-[13px] leading-6 text-ink/80">{q.text}</p>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type the answer exactly as you hear it"
              className="mt-1.5 w-full rounded-md border-b border-ink/20 bg-transparent pb-1 text-[13px] text-limeDeep placeholder:text-ink/25 focus:border-limeDeep focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
