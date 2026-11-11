"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pronWords, type PronWord } from "@/data/pronunciation";
import ListenButton from "./ListenButton";
import { Pill, ProgressBar } from "./ui";

type Attempt = { score: number; heard: string; verdict: string; feedback: string[] };
type Filter = "all" | "band7" | "band8";

const scoreTone = (score: number) =>
  score >= 90 ? "text-tealDeep" : score >= 75 ? "text-limeDeep" : score >= 60 ? "text-amberDeep" : "text-coralDeep";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All 200" },
  { id: "band7", label: "Band 7" },
  { id: "band8", label: "Band 8" },
];

export default function PronunciationCoach() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<PronWord>(pronWords[0]);
  const [phase, setPhase] = useState<"idle" | "arming" | "recording" | "scoring">("idle");
  const [seconds, setSeconds] = useState(0);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState("");
  const [best, setBest] = useState<Record<string, number>>({});

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const wordRef = useRef<PronWord>(selected);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    wordRef.current = selected;
  }, [selected]);

  const stopRecording = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (autoRef.current) {
      clearTimeout(autoRef.current);
      autoRef.current = null;
    }
    if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const score = useCallback(async (blob: Blob, word: PronWord) => {
    setPhase("scoring");
    setError("");
    try {
      const body = new FormData();
      body.append("word", word.word);
      body.append("audio", blob, "recording.webm");
      const res = await fetch("/api/pronunciation", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as Partial<Attempt> & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Scoring is unavailable right now.");
        setPhase("idle");
        return;
      }
      const next: Attempt = {
        score: Number(data.score ?? 0),
        heard: String(data.heard ?? ""),
        verdict: String(data.verdict ?? ""),
        feedback: Array.isArray(data.feedback) ? data.feedback.map(String) : [],
      };
      setAttempt(next);
      setBest((b) => ({ ...b, [word.word]: Math.max(b[word.word] ?? 0, next.score) }));
      setPhase("idle");
    } catch {
      setError("Could not reach the scorer. Check your connection and try again.");
      setPhase("idle");
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError("");
    setAttempt(null);
    setSeconds(0);

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("This browser can't record audio. Chrome, Edge, Firefox and Safari all support it over HTTPS.");
      return;
    }

    setPhase("arming");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((m) =>
        MediaRecorder.isTypeSupported?.(m)
      );
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size > 0) void score(blob, wordRef.current);
        else {
          setError("That recording was empty. Try again and speak straight after the button.");
          setPhase("idle");
        }
      };
      rec.start();
      recRef.current = rec;
      setPhase("recording");
      tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      autoRef.current = setTimeout(stopRecording, 10_000);
    } catch {
      setPhase("idle");
      setError("Microphone access was blocked. Allow it in your browser settings, then try again.");
    }
  }, [score, stopRecording]);

  useEffect(() => () => stopRecording(), [stopRecording]);

  useEffect(() => {
    stopRecording();
    setAttempt(null);
    setError("");
    setPhase("idle");
    setSeconds(0);
  }, [selected, stopRecording]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pronWords.filter((w) => {
      if (filter === "band7" && w.band !== 7) return false;
      if (filter === "band8" && w.band !== 8) return false;
      if (!q) return true;
      return (
        w.word.includes(q) || w.meaning.toLowerCase().includes(q) || w.respell.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  const busy = phase === "arming" || phase === "scoring";

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,430px)]">
      <div className="card min-w-0 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a word or meaning…"
            className="field !w-auto min-w-[160px] flex-1 !py-2"
            aria-label="Search the pronunciation list"
          />
          <div className="flex rounded-lg bg-ink/5 p-0.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`tab ${filter === f.id ? "tab-active" : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-2 px-1 text-[11px] text-ink/40">
          {visible.length} of {pronWords.length} words · tap a word to practise it
        </p>

        <ul className="mt-1 max-h-[600px] divide-y divide-ink/[0.06] overflow-y-auto">
          {visible.map((w) => {
            const active = w.word === selected.word;
            return (
              <li key={w.word}>
                <button
                  onClick={() => setSelected(w)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition ${
                    active ? "bg-lime/15" : "hover:bg-ink/[0.035]"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className={`text-[14.5px] font-semibold ${active ? "text-ink" : "text-ink/80"}`}>
                        {w.word}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-violetDeep/70">
                        {w.band}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[11.5px] tracking-wide text-ink/45">{w.respell}</span>
                  </span>
                  {best[w.word] !== undefined && (
                    <span className={`shrink-0 text-[11px] font-bold tabular-nums ${scoreTone(best[w.word])}`}>
                      {best[w.word]}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-ink/45">No word matches that search.</li>
          )}
        </ul>
      </div>

      <div className="space-y-3 self-start lg:sticky lg:top-20">
        <div className="card p-5">
          <div className="flex items-center justify-between gap-3">
            <Pill tone="violet">Band {selected.band} word</Pill>
            <span className="text-[11px] text-ink/35">{selected.ipa}</span>
          </div>

          <h3 className="mt-3 font-serif text-3xl leading-none text-ink">{selected.word}</h3>
          <p className="mt-1.5 text-[13px] text-ink/50">{selected.meaning}</p>

          <div className="mt-4 rounded-xl border border-ink/10 bg-ink/[0.03] px-3.5 py-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/40">Say it like this</div>
            <div className="mt-1 font-mono text-[15px] tracking-wide text-ink">{selected.respell}</div>
            <div className="mt-1 text-[11px] text-ink/40">Capitals mark the stressed beat · British English</div>
          </div>

          <p className="mt-3 flex gap-2 text-[12.5px] leading-6 text-ink/65">
            <span className="mt-0.5 shrink-0 text-violetDeep">→</span>
            <span>{selected.focus}</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ListenButton text={selected.word} />
            {phase === "recording" ? (
              <button onClick={stopRecording} className="btn-primary !bg-coral !text-ink">
                ■ Stop and score · {seconds}s
              </button>
            ) : (
              <button onClick={startRecording} disabled={busy} className="btn-primary">
                {phase === "arming" ? "Starting microphone…" : phase === "scoring" ? "Scoring…" : "🎙 Record this word"}
              </button>
            )}
          </div>

          {error && <p className="mt-2 text-[12px] leading-5 text-coralDeep">{error}</p>}
          <p className="mt-2 text-[11px] leading-5 text-ink/40">
            Up to 10 seconds. The recording is sent to the scorer, used once, and not stored.
          </p>
        </div>

        <div className="card p-5" aria-live="polite">
          {phase === "scoring" && <p className="text-sm text-ink/55">Listening back and marking your pronunciation…</p>}

          {!attempt && phase !== "scoring" && (
            <div>
              <h4 className="text-sm font-semibold text-ink">Your score</h4>
              <p className="mt-1.5 text-[12.5px] leading-6 text-ink/50">
                Record the word and you'll get a mark out of 100, what the scorer heard, and the exact sounds to
                change. The mark measures how clearly the word is recognised — not how British you sound.
              </p>
            </div>
          )}

          {attempt && phase !== "scoring" && (
            <div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/40">Score</div>
                  <div className={`font-serif text-5xl leading-none ${scoreTone(attempt.score)}`}>
                    {attempt.score}
                    <span className="ml-1 font-sans text-sm font-semibold text-ink/35">/100</span>
                  </div>
                </div>
                {best[selected.word] !== undefined && (
                  <span className="pill">Best {best[selected.word]}</span>
                )}
              </div>

              <div className="mt-3">
                <ProgressBar value={attempt.score} max={100} tone={attempt.score >= 75 ? "teal" : "coral"} />
              </div>

              <p className="mt-3 text-[13px] font-medium leading-6 text-ink/75">{attempt.verdict}</p>

              {attempt.heard && (
                <p className="mt-2 text-[12px] leading-5 text-ink/45">
                  The scorer heard: <span className="font-medium text-ink/70">“{attempt.heard}”</span>
                </p>
              )}

              <ul className="mt-3 space-y-2 border-t border-ink/10 pt-3">
                {attempt.feedback.map((f, i) => (
                  <li key={i} className="flex gap-2 text-[12.5px] leading-6 text-ink/65">
                    <span className="mt-0.5 shrink-0 text-violetDeep">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button onClick={startRecording} className="btn-ghost mt-4 !py-2 !text-[12.5px]">
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
