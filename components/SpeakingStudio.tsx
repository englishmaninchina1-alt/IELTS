"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cueCards, part1Sets } from "@/data/speaking";
import { analyseSpeaking, type SpeakingAnalysis } from "@/lib/band";
import { useProfile } from "@/lib/store";
import { CriteriaCard, Pill, ProgressBar, ScoreDial } from "./ui";
import ListenButton from "./ListenButton";

type Part = 1 | 2 | 3;

export default function SpeakingStudio() {
  const [part, setPart] = useState<Part>(2);
  const [setIdx, setSetIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [prep, setPrep] = useState(60);
  const [speakTime, setSpeakTime] = useState(0);
  const [phase, setPhase] = useState<"idle" | "prep" | "speaking" | "done">("idle");
  const [notes, setNotes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [noSpeech, setNoSpeech] = useState(false);
  const [analysis, setAnalysis] = useState<SpeakingAnalysis | null>(null);
  const [selfScores, setSelfScores] = useState({ fc: 6, lr: 6, gra: 6, p: 6 });
  const [showSample, setShowSample] = useState(false);

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const srRef = useRef<any>(null);
  const speakTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { recordAttempt } = useProfile();

  const set = part1Sets[setIdx];
  const card = cueCards[cardIdx];

  const reset = useCallback(() => {
    setPhase("idle");
    setPrep(60);
    setSpeakTime(0);
    setTranscript("");
    setAnalysis(null);
    setShowSample(false);
    setAudioUrl(null);
    setNotes("");
    if (speakTimer.current) clearInterval(speakTimer.current);
    if (srRef.current) {
      try { srRef.current.stop(); } catch { /* already stopped */ }
    }
  }, []);

  useEffect(() => {
    reset();
  }, [part, cardIdx, setIdx, qIdx, reset]);

  useEffect(
    () => () => {
      if (speakTimer.current) clearInterval(speakTimer.current);
      if (recRef.current && recRef.current.state === "recording") recRef.current.stop();
    },
    []
  );

  useEffect(() => {
    if (phase !== "prep") return;
    const t = setInterval(() => {
      setPrep((p) => {
        if (p <= 1) {
          clearInterval(t);
          startSpeaking();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startSpeaking = () => {
    setPhase("speaking");
    setSpeakTime(0);
    if (speakTimer.current) clearInterval(speakTimer.current);
    speakTimer.current = setInterval(() => setSpeakTime((s) => s + 1), 1000);
  };

  const stopSpeaking = () => {
    setPhase("done");
    if (speakTimer.current) clearInterval(speakTimer.current);
    if (recRef.current && recRef.current.state === "recording") recRef.current.stop();
    setRecording(false);
    if (srRef.current) {
      try { srRef.current.stop(); } catch { /* ignore */ }
    }
  };

  const toggleRecording = async () => {
    if (recording) {
      recRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      recRef.current = mr;
      setRecording(true);
    } catch {
      setNoSpeech(true);
    }
  };

  const toggleTranscript = () => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setNoSpeech(true);
      return;
    }
    if (srRef.current) {
      try { srRef.current.stop(); } catch { /* ignore */ }
      srRef.current = null;
      return;
    }
    const r = new SR();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-GB";
    r.onresult = (e: any) => {
      let out = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) out += e.results[i][0].transcript + " ";
      }
      if (out) setTranscript((t) => (t + " " + out).trim());
    };
    r.onerror = () => setNoSpeech(true);
    r.start();
    srRef.current = r;
  };

  const assess = () => {
    if (!transcript.trim()) return;
    const result = analyseSpeaking(transcript, Math.max(speakTime, 45), part);
    setAnalysis(result);
    recordAttempt({ skill: "speaking", label: `Part ${part} · ${part === 2 ? card.topic : part === 1 ? set.topic : card.topic}`, band: result.band, seconds: undefined as never } as any);
  };

  const selfBand = useMemo(
    () => Math.round(((selfScores.fc + selfScores.lr + selfScores.gra + selfScores.p) / 4) * 2) / 2,
    [selfScores]
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-3">
        <div className="card flex flex-wrap items-center gap-2 p-3">
          <div className="flex rounded-lg bg-ink/5 p-0.5">
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => setPart(p as Part)} className={`tab ${part === p ? "tab-active" : ""}`}>
                Part {p}
              </button>
            ))}
          </div>
          {part === 1 ? (
            <select
              value={setIdx}
              onChange={(e) => setSetIdx(Number(e.target.value))}
              className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-2.5 py-1.5 text-[12.5px] text-ink/85 focus:outline-none"
            >
              {part1Sets.map((s, i) => (
                <option key={s.id} value={i}>{s.topic}</option>
              ))}
            </select>
          ) : (
            <select
              value={cardIdx}
              onChange={(e) => setCardIdx(Number(e.target.value))}
              className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-2.5 py-1.5 text-[12.5px] text-ink/85 focus:outline-none"
            >
              {cueCards.map((c, i) => (
                <option key={c.id} value={i}>{c.topic}</option>
              ))}
            </select>
          )}
          <span className="rounded-lg bg-ink/5 px-2.5 py-1.5 text-[11px] text-ink/45">
            {part === 1 ? "4–5 min" : part === 2 ? "1 min prep + 2 min" : "4–5 min"}
          </span>
        </div>

        {part === 1 && (
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <Pill tone="violet">Part 1 · {set.topic}</Pill>
              <span className="text-[11px] text-ink/35">Question {qIdx + 1} of {set.questions.length}</span>
            </div>
            <h2 className="font-serif text-2xl leading-snug text-ink">{set.questions[qIdx]}</h2>
            <p className="mt-2 text-[12.5px] leading-6 text-ink/45">
              Answer, add a reason, add a small detail — then stop. Two to four sentences is the target.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={() => setQIdx((i) => (i + 1) % set.questions.length)}>Next question →</button>
              <button className="btn-ghost" onClick={() => setShowSample((s) => !s)}>{showSample ? "Hide" : "Show"} model answer</button>
            </div>
            {showSample && (
              <div className="mt-4 space-y-3 rounded-xl border border-ink/10 bg-ink/[0.03] p-4">
                <p className="text-[13.5px] leading-7 text-ink/75">{set.sampleAnswer}</p>
                <ListenButton text={set.sampleAnswer} className="btn-quiet !py-1.5 !text-[12px]" />
                <div className="border-t border-ink/10 pt-3">
                  <h4 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/40">Upgrade like this</h4>
                  {set.upgrade.map((u, i) => (
                    <div key={i} className="mt-2">
                      <p className="text-[12px] text-coralDeep/80">✗ {u.basic}</p>
                      <p className="text-[12.5px] text-tealDeep/90">✓ {u.better}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {part === 2 && (
          <div className="space-y-3">
            <div className="card-paper p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#14161c]/45">Candidate task card</span>
                <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C7F464]">Part 2</span>
              </div>
              <h2 className="font-serif text-xl leading-snug text-[#14161c]">{card.prompt}</h2>
              <p className="mt-3 text-[12.5px] font-semibold text-[#14161c]/50">You should say:</p>
              <ul className="mt-1 space-y-1">
                {card.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-[14px] leading-7 text-[#14161c]/80">
                    <span className="text-[#14161c]/30">•</span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-[#14161c]/10 pt-2.5 text-[12.5px] italic text-[#14161c]/60">
                and explain {card.bullets[card.bullets.length - 1].replace(/^and explain /, "")}
              </p>
            </div>

            <div className="card p-5">
              <div className="flex flex-wrap items-center gap-3">
                {phase === "idle" && (
                  <button className="btn-primary" onClick={() => setPhase("prep")}>Start 1-minute preparation</button>
                )}
                {phase === "prep" && (
                  <div className="flex flex-1 items-center gap-3">
                    <div className="font-mono text-2xl tabular-nums text-[#8A6100]">00:{String(prep).padStart(2, "0")}</div>
                    <div className="flex-1"><ProgressBar value={60 - prep} max={60} tone="coral" /></div>
                    <button className="btn-ghost !py-1.5 !text-[12px]" onClick={startSpeaking}>Speak now</button>
                  </div>
                )}
                {phase === "speaking" && (
                  <div className="flex flex-1 items-center gap-3">
                    <div className={`font-mono text-2xl tabular-nums ${speakTime > 120 ? "text-coralDeep" : "text-tealDeep"}`}>
                      {String(Math.floor(speakTime / 60)).padStart(2, "0")}:{String(speakTime % 60).padStart(2, "0")}
                    </div>
                    <div className="flex-1"><ProgressBar value={speakTime} max={120} tone="teal" /></div>
                    <button className="btn-primary !py-1.5 !text-[12px]" onClick={stopSpeaking}>Stop</button>
                  </div>
                )}
                {phase === "done" && (
                  <div className="flex flex-1 items-center gap-3">
                    <span className="text-sm text-ink/70">Spoke for {speakTime}s {speakTime >= 90 ? "— good length" : "— aim for 90–120s"}</span>
                    <button className="btn-ghost !py-1.5 !text-[12px]" onClick={reset}>Try again</button>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Preparation notes (5 words, not sentences)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={"who / where\nhow you learned\nwhat happened\nhow you felt"}
                    className="h-24 w-full resize-none rounded-lg border border-ink/15 bg-white p-2.5 font-mono text-[12px] leading-6 text-ink/80 placeholder:text-ink/25 focus:border-tealDeep focus:outline-none"
                  />
                </div>
                <div>
                  <label className="label">Your transcript {transcript ? `(${transcript.split(/\s+/).length} words)` : ""}</label>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Speak and click Transcribe, or paste what you said here to get a band estimate."
                    className="h-24 w-full resize-none rounded-lg border border-ink/15 bg-white p-2.5 text-[12px] leading-6 text-ink/80 placeholder:text-ink/25 focus:border-tealDeep focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-ghost !py-2 !text-[12px]" onClick={toggleRecording}>
                  {recording ? "■ Stop recording" : "● Record yourself"}
                </button>
                <button className="btn-ghost !py-2 !text-[12px]" onClick={toggleTranscript}>
                  {srRef.current ? "■ Stop transcribing" : "◉ Transcribe (Chrome)"}
                </button>
                <button className="btn-primary !py-2 !text-[12px]" onClick={assess} disabled={!transcript.trim()}>
                  Score my answer
                </button>
                <button className="btn-quiet !py-2 !text-[12px]" onClick={() => setShowSample((s) => !s)}>
                  {showSample ? "Hide" : "Show"} band 8 model
                </button>
              </div>

              {audioUrl && (
                <audio controls src={audioUrl} className="mt-3 w-full">
                  Your browser does not support audio playback.
                </audio>
              )}
              {noSpeech && (
                <p className="mt-2 text-[11.5px] leading-5 text-[#8A6100]/80">
                  Recording or live transcription is unavailable in this browser. Type or paste your answer instead — the scoring engine works
                  on text.
                </p>
              )}

              {showSample && (
                <div className="mt-4 space-y-3 rounded-xl border border-ink/10 bg-ink/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-limeDeep">Model answer · 2 minutes</h4>
                    <ListenButton text={card.sample} className="btn-quiet !py-1.5 !text-[12px]" />
                  </div>
                  <div className="space-y-3 text-[13.5px] leading-7 text-ink/75">
                    {card.sample.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                  <div className="flex flex-wrap gap-1.5 border-t border-ink/10 pt-3">
                    {card.vocabulary.map((v) => (
                      <span key={v} className="rounded-md bg-violet/10 px-2 py-0.5 text-[11px] text-violetDeep">{v}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {part === 3 && (
          <div className="card p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Pill tone="teal">Part 3 · Discussion</Pill>
              <span className="text-[11px] text-ink/35">Follow-up to “{card.topic}”</span>
            </div>
            <div className="space-y-2.5">
              {card.part3.map((q, i) => (
                <div key={i} className="rounded-xl border border-ink/10 bg-ink/[0.025] p-3.5">
                  <p className="text-[14px] leading-6 text-ink/85">{q}</p>
                  <p className="mt-1.5 text-[11.5px] leading-5 text-ink/40">
                    Structure: position → reason → example → acknowledgement of the other side.
                  </p>
                </div>
              ))}
            </div>
            <button className="btn-ghost mt-4 !py-2 !text-[12px]" onClick={() => setShowSample((s) => !s)}>
              {showSample ? "Hide" : "Show"} a Part 3 answer shape
            </button>
            {showSample && (
              <div className="mt-3 rounded-xl border border-ink/10 bg-ink/[0.03] p-4 text-[13px] leading-7 text-ink/70">
                <p>
                  “{card.part3[0]}” — <span className="text-ink/90">I think the honest answer is that it depends on the industry, but there is a
                  clear pattern.</span> The reason is that the cost of retraining falls on individuals while the benefit is shared, so firms
                  under-invest. Take construction: a company will pay for one crane operator&apos;s certification but not for a hundred. Having said
                  that, some countries have solved this by pooling the funding, which suggests it is a political choice rather than a technical
                  limit.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="space-y-3">
        {!analysis ? (
          <>
            <div className="card p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Score yourself honestly</h3>
              <p className="mt-1.5 text-[12px] leading-6 text-ink/50">
                The examiner cannot mark what you do not say. Use the descriptors to place each criterion, then compare with the estimate below.
              </p>
              <div className="mt-3 space-y-3">
                {([
                  ["fc", "Fluency & coherence", "Speaks at length; ideas connect logically"],
                  ["lr", "Lexical resource", "Precise, varied vocabulary; paraphrases"],
                  ["gra", "Grammatical range", "Complex forms with control"],
                  ["p", "Pronunciation", "Clear stress; listener understands without effort"],
                ] as const).map(([k, label, hint]) => (
                  <div key={k}>
                    <div className="flex items-center justify-between">
                      <label className="text-[12px] font-medium text-ink/70">{label}</label>
                      <span className="text-[12px] font-bold text-tealDeep">{selfScores[k].toFixed(1)}</span>
                    </div>
                    <input
                      type="range" min={4} max={9} step={0.5} value={selfScores[k]}
                      onChange={(e) => setSelfScores((s) => ({ ...s, [k]: Number(e.target.value) }))}
                      className="mt-1 w-full accent-[#0F766E]"
                    />
                    <p className="text-[10.5px] text-ink/30">{hint}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-teal/10 px-3 py-2">
                <span className="text-[11.5px] text-tealDeep/80">Self-assessed band</span>
                <span className="font-serif text-xl text-tealDeep">{selfBand.toFixed(1)}</span>
              </div>
            </div>
            <div className="card p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Part 2 survival rules</h3>
              <ul className="mt-2 space-y-2 text-[12px] leading-5 text-ink/55">
                <li>• Use the whole minute of preparation. Write five words, not sentences.</li>
                <li>• Speak until the examiner stops you. Stopping at 60 seconds costs more than any grammar error.</li>
                <li>• If you go blank, say so in English and restart — silence cannot be marked.</li>
                <li>• Cover the last bullet point: it is the one candidates forget.</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="animate-fade-up space-y-3">
            <div className="card flex items-center gap-4 p-4">
              <ScoreDial band={analysis.band} size={104} caption="Est." />
              <div>
                <p className="text-[12px] font-semibold text-ink">Estimated band</p>
                <p className="mt-0.5 text-[11.5px] leading-5 text-ink/45">
                  {analysis.words} words · {analysis.wpm} wpm · {analysis.fillers} fillers
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Pill tone={analysis.words >= 180 ? "teal" : "coral"}>{analysis.words} words</Pill>
                  <Pill tone={analysis.fillers <= 3 ? "teal" : "coral"}>{analysis.fillers} fillers</Pill>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Priority fixes</h3>
              <ul className="mt-2 space-y-1.5">
                {analysis.summary.map((s, i) => <li key={i} className="text-[12.5px] leading-6 text-ink/70">{s}</li>)}
              </ul>
            </div>
            {analysis.criteria.map((c) => (
              <CriteriaCard key={c.key} name={c.name} band={c.band} comment={c.comment} positives={c.positives} improvements={c.improvements} />
            ))}
            <button className="btn-ghost w-full" onClick={reset}>Record another answer</button>
          </div>
        )}
      </aside>
    </div>
  );
}
