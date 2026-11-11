"use client";

import { useEffect, useMemo, useState } from "react";
import { task1Prompts, task2Prompts, type Task2Prompt } from "@/data/writing";
import { analyseWriting, type WritingAnalysis } from "@/lib/band";
import { useProfile } from "@/lib/store";
import { CriteriaCard, Pill, ProgressBar, ScoreDial, Timer } from "./ui";
import ChartView from "./ChartView";

type Task = 1 | 2;

const STOP = new Set(["some", "people", "believe", "think", "that", "which", "their", "there", "about", "would", "could", "should", "this", "these", "those", "essay", "discuss", "views", "opinion", "extent", "agree", "disagree", "give", "your", "own"]);

function topicWords(prompt: string): string[] {
  return prompt
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP.has(w))
    .slice(0, 24);
}

export default function WritingStudio() {
  const [task, setTask] = useState<Task>(2);
  const [t1Id, setT1Id] = useState(task1Prompts[0].id);
  const [t2Id, setT2Id] = useState(task2Prompts[0].id);
  const [text, setText] = useState("");
  const [seconds, setSeconds] = useState(40 * 60);
  const [running, setRunning] = useState(false);
  const [analysis, setAnalysis] = useState<WritingAnalysis | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);
  const { recordAttempt } = useProfile();
  const [extraPrompts, setExtraPrompts] = useState<Task2Prompt[]>([]);

  // Prompts published from the admin panel are appended to the built-in eight.
  useEffect(() => {
    let live = true;
    fetch("/api/writing-prompts")
      .then((r) => (r.ok ? r.json() : { prompts: [] }))
      .then((data: { prompts?: Task2Prompt[] }) => {
        if (live && Array.isArray(data.prompts)) setExtraPrompts(data.prompts);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const allTask2 = useMemo(() => [...task2Prompts, ...extraPrompts], [extraPrompts]);

  const t1 = task1Prompts.find((p) => p.id === t1Id) ?? task1Prompts[0];
  const t2 = allTask2.find((p) => p.id === t2Id) ?? allTask2[0];
  const prompt = task === 1 ? t1.prompt : t2.question;
  const minWords = task === 1 ? 150 : 250;
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  useEffect(() => {
    setSeconds(task === 1 ? 20 * 60 : 40 * 60);
    setRunning(false);
    setAnalysis(null);
    setShowModel(false);
  }, [task]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    try {
      const draft = window.localStorage.getItem("ielts-coach-draft");
      if (draft && !text) {
        setText(draft);
        window.localStorage.removeItem("ielts-coach-draft");
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mark = () => {
    if (!text.trim()) return;
    const result = analyseWriting(text, {
      task,
      minWords,
      topicWords: topicWords(prompt),
      hasChart: task === 1 && t1.chart.kind !== "process",
    });
    setAnalysis(result);
    recordAttempt({ skill: "writing", label: `${task === 1 ? "Task 1" : "Task 2"} · ${task === 1 ? t1.title : t2.title}`, band: result.band });
    setTimeout(() => document.getElementById("writing-feedback")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const model = task === 1 ? t1.model : t2.model;
  const hasModel = model.trim().length > 0;
  const modelWords = useMemo(() => model.split(/\s+/).filter(Boolean).length, [model]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0">
        <div className="card mb-3 flex flex-wrap items-center gap-2 p-3">
          <div className="flex rounded-lg bg-ink/5 p-0.5">
            <button onClick={() => setTask(1)} className={`tab ${task === 1 ? "tab-active" : ""}`}>Task 1</button>
            <button onClick={() => setTask(2)} className={`tab ${task === 2 ? "tab-active" : ""}`}>Task 2</button>
          </div>
          <select
            value={task === 1 ? t1Id : t2Id}
            onChange={(e) => (task === 1 ? setT1Id(e.target.value) : setT2Id(e.target.value))}
            className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-2.5 py-1.5 text-[12.5px] text-ink/85 focus:border-tealDeep focus:outline-none"
          >
            {(task === 1 ? task1Prompts : allTask2).map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} · {p.topic}
              </option>
            ))}
          </select>
          <Timer seconds={seconds} running={running} danger={seconds < 300} />
          <button className="btn-ghost !py-1.5 !text-[12px]" onClick={() => setRunning((r) => !r)}>
            {running ? "Pause" : seconds === (task === 1 ? 1200 : 2400) ? "Start timer" : "Resume"}
          </button>
        </div>

        <div className={`mb-3 rounded-2xl p-5 ${task === 1 ? "bg-[#f7f4ee] text-[#14161c]" : "card"}`}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${task === 1 ? "text-[#14161c]/45" : "text-ink/40"}`}>
              {task === 1 ? "Academic Task 1 · 150 words · 20 minutes" : `Task 2 · 250 words · 40 minutes · ${t2.kind}`}
            </span>
            {task === 2 && <Pill tone="teal">{t2.topic}</Pill>}
          </div>
          <p className={`text-[14.5px] font-medium leading-7 ${task === 1 ? "text-[#14161c]" : "text-ink/90"}`}>{prompt}</p>

          {task === 1 && (
            <div className="mt-4">
              <div className="rounded-xl border border-[#14161c]/10 bg-ink/60 p-4">
                <h4 className="mb-3 text-center text-[12px] font-bold text-[#14161c]/70">{t1.chart.title}</h4>
                <ChartView chart={t1.chart} />
              </div>
            </div>
          )}

          {task === 2 && (
            <div className="mt-4">
              <button className="text-[12px] font-semibold text-tealDeep hover:underline" onClick={() => setShowIdeas((s) => !s)}>
                {showIdeas ? "Hide idea bank" : "Open idea bank — 3 arguments, an outline and topic vocabulary"}
              </button>
              {showIdeas && (
                <div className="mt-3 space-y-3 rounded-xl border border-ink/10 bg-ink/[0.03] p-4">
                  <div>
                    <h5 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/40">Structure</h5>
                    <ol className="mt-1.5 space-y-1">
                      {t2.outline.map((o, i) => (
                        <li key={i} className="flex gap-2 text-[12.5px] leading-6 text-ink/65">
                          <span className="text-limeDeep">{i + 1}.</span>
                          {o}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h5 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/40">Arguments you could use</h5>
                    <div className="mt-1.5 space-y-2">
                      {t2.ideas.length === 0 && (
                        <p className="text-[12px] leading-6 text-ink/45">
                          No argument bank for this one — open the AI Coach to brainstorm three claims of your own.
                        </p>
                      )}
                      {t2.ideas.map((i, n) => (
                        <div key={n} className="rounded-lg border border-ink/10 bg-ink/[0.025] p-2.5">
                          <p className="text-[12.5px] font-semibold leading-5 text-ink/85">{i.claim}</p>
                          <p className="mt-1 text-[12px] leading-5 text-ink/50">
                            <span className="text-tealDeep">because</span> {i.because}
                          </p>
                          <p className="mt-0.5 text-[12px] leading-5 text-ink/50">
                            <span className="text-coralDeep">e.g.</span> {i.example}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {t2.vocabulary.map((v) => (
                      <span key={v} className="rounded-md bg-violet/10 px-2 py-0.5 text-[11px] text-violetDeep">{v}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/40">Your answer</span>
            <div className="flex items-center gap-2">
              <span className={`text-[11.5px] font-semibold ${words >= minWords ? "text-tealDeep" : words > 0 ? "text-[#8A6100]" : "text-ink/35"}`}>
                {words} / {minWords} words
              </span>
              <div className="w-16">
                <ProgressBar value={Math.min(words, minWords)} max={minWords} tone={words >= minWords ? "teal" : "coral"} />
              </div>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              task === 1
                ? "Write your 150-word summary. Start with a paraphrase of the question, then an overview, then two detail paragraphs…\n\nTip: press Tab twice to indent paragraphs."
                : "Write your 250-word essay. Introduction (position), two developed body paragraphs, conclusion…\n\nTip: each body paragraph = claim → why → example → consequence."
            }
            spellCheck
            className="min-h-[320px] w-full resize-y rounded-xl border border-ink/10 bg-white p-4 text-[14px] leading-7 text-ink/90 placeholder:text-ink/25 focus:border-tealDeep/50 focus:outline-none"
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button className="btn-primary" onClick={mark} disabled={!text.trim()}>
              Get band estimate
            </button>
            {hasModel && (
              <button className="btn-ghost" onClick={() => setShowModel((s) => !s)}>
                {showModel ? "Hide" : "Show"} model answer
              </button>
            )}
            <button className="btn-quiet" onClick={() => { setText(""); setAnalysis(null); }}>
              Clear
            </button>
            <span className="ml-auto text-[11px] text-ink/30">{minWords === 250 ? "Aim for 260–290 words." : "Aim for 160–190 words."}</span>
          </div>
        </div>

        {showModel && hasModel && (
          <div className="card mt-3 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-limeDeep">Model answer · Band 8+</h3>
              <span className="text-[11px] text-ink/40">{modelWords} words</span>
            </div>
            <div className="space-y-3 text-[13.5px] leading-7 text-ink/75">
              {model.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-4 border-t border-ink/10 pt-3">
              <h4 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/40">Language worth stealing</h4>
              <div className="mt-2 space-y-1">
                {(task === 1 ? t1.language : t2.vocabulary).map((l) => (
                  <p key={l} className="text-[12.5px] leading-6 text-tealDeep/85">• {l}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-3">
        {!analysis && (
          <>
            <div className="card p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">How the estimate works</h3>
              <p className="mt-2 text-[12.5px] leading-6 text-ink/60">
                Your answer is measured against the four official criteria — length and task coverage, paragraphing and cohesion, lexical range,
                and grammatical variety. Each is scored, then averaged.
              </p>
              <p className="mt-2 rounded-lg bg-[#B45309]/[0.07] px-2.5 py-2 text-[11.5px] leading-5 text-[#8A6100]/90">
                This is a diagnostic estimate, not an examiner&apos;s mark. It cannot judge whether your ideas are true or well chosen.
              </p>
            </div>
            <div className="card p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Checklist before you submit</h3>
              <ul className="mt-2 space-y-2 text-[12.5px] leading-6 text-ink/60">
                {(task === 1 ? t1.traps : t2.outline).map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-limeDeep/70">□</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {analysis && (
          <div id="writing-feedback" className="animate-fade-up space-y-3">
            <div className="card flex items-center gap-4 p-4">
              <ScoreDial band={analysis.band} size={104} caption="Est." />
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-ink">Estimated band</p>
                <p className="mt-0.5 text-[11.5px] leading-5 text-ink/45">
                  {analysis.words} words · {analysis.paragraphs} paragraph{analysis.paragraphs === 1 ? "" : "s"} · {analysis.sentences} sentences
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Pill tone={analysis.avgSentenceLength > 14 && analysis.avgSentenceLength < 26 ? "teal" : "coral"}>
                    {analysis.avgSentenceLength} words/sentence
                  </Pill>
                  <Pill tone={analysis.linkingUsed.length >= 4 ? "teal" : "coral"}>{analysis.linkingUsed.length} linkers</Pill>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">What to fix first</h3>
              <ul className="mt-2 space-y-1.5">
                {analysis.summary.map((s, i) => (
                  <li key={i} className="text-[12.5px] leading-6 text-ink/70">{s}</li>
                ))}
              </ul>
            </div>

            {analysis.criteria.map((c) => (
              <CriteriaCard key={c.key} name={c.name} band={c.band} comment={c.comment} positives={c.positives} improvements={c.improvements} />
            ))}

            <div className="card p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Measured features</h3>
              <dl className="mt-2 space-y-1.5 text-[12px]">
                <Row k="Linkers used" v={analysis.linkingUsed.slice(0, 8).join(", ") || "none detected"} />
                <Row k="Complex structures" v={`${analysis.complexCount} markers`} />
                <Row k="Academic lexis" v={analysis.academicUsed.slice(0, 6).join(", ") || "none"} />
                <Row k="Type–token ratio" v={String(analysis.typeTokenRatio)} />
                {analysis.repeatedWords.length > 0 && (
                  <Row k="Repeated words" v={analysis.repeatedWords.map((r) => `${r.word} (${r.count})`).join(", ")} />
                )}
              </dl>
            </div>

            {hasModel && (
              <div className="card p-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Compare with the model</h3>
                <p className="mt-1.5 text-[12px] leading-6 text-ink/50">
                  The model answer is {modelWords} words. Read it once for structure, then rewrite your weakest paragraph using its shape — not its
                  sentences.
                </p>
                <button className="btn-ghost mt-3 w-full" onClick={() => setShowModel(true)}>
                  Show model answer
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-32 shrink-0 text-ink/35">{k}</dt>
      <dd className="min-w-0 break-words text-ink/65">{v}</dd>
    </div>
  );
}
