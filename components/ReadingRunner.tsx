"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Question, QuestionGroup, ReadingTest } from "@/lib/types";
import { isCorrect } from "@/lib/types";
import { rawToBand } from "@/lib/band";
import { useProfile } from "@/lib/store";
import { ScoreDial, Timer, ProgressBar } from "./ui";

export default function ReadingRunner({ test }: { test: ReadingTest }) {
  const [passageIdx, setPassageIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [seconds, setSeconds] = useState(60 * 60);
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviewPassage, setReviewPassage] = useState(0);
  const [mobileTab, setMobileTab] = useState<"passage" | "questions">("passage");
  const { recordAttempt } = useProfile();

  const passage = test.passages[passageIdx];
  const allGroups = useMemo(() => test.passages.flatMap((p) => p.groups), [test]);
  const allQuestions = useMemo(() => allGroups.flatMap((g) => g.questions), [allGroups]);
  const answered = allQuestions.filter((q) => (answers[q.id] ?? "").trim().length > 0).length;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const correctCount = useMemo(
    () => allQuestions.filter((q) => isCorrect(q, answers[q.id])).length,
    [allQuestions, answers]
  );
  const band = rawToBand("reading", correctCount);

  const submit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    setRunning(false);
    recordAttempt({ skill: "reading", label: test.title, band, raw: correctCount, total: allQuestions.length, minutes: Math.round((3600 - seconds) / 60) });
  }, [submitted, recordAttempt, test.title, band, correctCount, allQuestions.length, seconds]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submit]);

  if (submitted) {
    const review = test.passages[reviewPassage];
    return (
      <div className="animate-fade-up">
        <div className="card mb-5 flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
          <ScoreDial band={band} caption="Reading" />
          <div className="flex-1">
            <h2 className="font-serif text-2xl text-ink">Mock test complete</h2>
            <p className="mt-1 text-sm text-ink/55">
              {correctCount} of {allQuestions.length} correct · {Math.round((3600 - seconds) / 60)} minutes used · band
              conversion from the published Academic Reading table.
            </p>
            <div className="mt-4 max-w-md">
              <ProgressBar value={correctCount} max={allQuestions.length} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Review answers below
              </button>
              <button className="btn-ghost" onClick={() => location.reload()}>
                Retake test
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {test.passages.map((p, i) => {
              const qs = p.groups.flatMap((g) => g.questions);
              const got = qs.filter((q) => isCorrect(q, answers[q.id])).length;
              return (
                <div key={p.id} className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-ink/40">P{i + 1}</div>
                  <div className="text-lg font-semibold text-ink">
                    {got}
                    <span className="text-xs text-ink/40">/{qs.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {test.passages.map((p, i) => (
            <button key={p.id} className={`tab ${reviewPassage === i ? "tab-active" : ""}`} onClick={() => setReviewPassage(i)}>
              Passage {i + 1}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card-paper max-h-[70vh] overflow-y-auto p-6">
            <h3 className="font-serif text-xl">{review.title}</h3>
            <div className="mt-4 space-y-4">
              {review.paragraphs.map((p) => (
                <div key={p.label} className="flex gap-3">
                  <span className="mt-1 shrink-0 font-bold text-[#14161c]/40">{p.label}</span>
                  <p className="passage-body">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {review.groups.flatMap((g) => g.questions).map((q) => {
              const given = answers[q.id] ?? "";
              const ok = isCorrect(q, given);
              return (
                <div key={q.id} className={`card p-4 ${ok ? "border-tealDeep/25" : "border-coralDeep/25"}`}>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-[11px] font-bold ${ok ? "bg-teal/15 text-tealDeep" : "bg-coral/15 text-coralDeep"}`}>
                      {q.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13.5px] leading-6 text-ink/85">{q.text}</p>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12px]">
                        <span className={ok ? "text-tealDeep" : "text-coralDeep"}>Your answer: {given || "—"}</span>
                        {!ok && <span className="text-ink/60">Correct: {q.answer}</span>}
                      </div>
                      <p className="mt-2 border-l-2 border-ink/10 pl-3 text-[12.5px] leading-6 text-ink/45">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-4 border-b border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex gap-1">
            {test.passages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setPassageIdx(i)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${
                  passageIdx === i ? "bg-lime text-ink" : "border border-ink/15 text-ink/60 hover:bg-ink/10"
                }`}
              >
                Passage {i + 1}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-2 text-[12px] text-ink/45 sm:flex">
            <span>{answered}/{allQuestions.length} answered</span>
            <div className="w-24">
              <ProgressBar value={answered} max={allQuestions.length} tone="teal" />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Timer seconds={seconds} running={running} danger={seconds < 300} />
            {!running ? (
              <button className="btn-primary !py-1.5 !text-[12px]" onClick={() => setRunning(true)}>
                {seconds === 3600 ? "Start 60:00" : "Resume"}
              </button>
            ) : (
              <button className="btn-ghost !py-1.5 !text-[12px]" onClick={() => setRunning(false)}>
                Pause
              </button>
            )}
            <button className="btn-primary !py-1.5 !text-[12px]" onClick={submit}>
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3 flex gap-1.5 lg:hidden">
        <button className={`tab ${mobileTab === "passage" ? "tab-active" : ""}`} onClick={() => setMobileTab("passage")}>Passage</button>
        <button className={`tab ${mobileTab === "questions" ? "tab-active" : ""}`} onClick={() => setMobileTab("questions")}>
          Questions ({answered}/{allQuestions.length})
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className={`${mobileTab === "questions" ? "hidden lg:block" : ""}`}>
          <div className="card-paper sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto p-6 sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#14161c]/10 pb-3">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#14161c]/45">
                Reading Passage {passageIdx + 1} · {passage.topic}
              </span>
              <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#14161c]/60">
                {passage.difficulty}
              </span>
            </div>
            <h2 className="font-serif text-2xl leading-snug text-[#14161c]">{passage.title}</h2>
            <div className="mt-5 space-y-4">
              {passage.paragraphs.map((p) => (
                <div key={p.label} className="flex gap-3">
                  <span className="mt-1 shrink-0 font-bold text-[#14161c]/40">{p.label}</span>
                  <p className="passage-body">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${mobileTab === "passage" ? "hidden lg:block" : ""}`}>
          <div className="space-y-4">
            {passage.groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                answers={answers}
                flagged={flagged}
                onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v }))}
                onFlag={(id) => setFlagged((f) => ({ ...f, [id]: !f[id] }))}
              />
            ))}
            <div className="flex justify-between gap-2 pt-1">
              <button className="btn-ghost" disabled={passageIdx === 0} onClick={() => setPassageIdx((i) => Math.max(0, i - 1))}>
                ← Previous passage
              </button>
              {passageIdx < test.passages.length - 1 ? (
                <button className="btn-primary" onClick={() => setPassageIdx((i) => i + 1)}>
                  Next passage →
                </button>
              ) : (
                <button className="btn-primary" onClick={submit}>
                  Submit test
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupCard({
  group,
  answers,
  flagged,
  onChange,
  onFlag,
}: {
  group: QuestionGroup;
  answers: Record<string, string>;
  flagged: Record<string, boolean>;
  onChange: (id: string, v: string) => void;
  onFlag: (id: string) => void;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <p className="mb-4 border-l-2 border-limeDeep/60 pl-3 text-[12.5px] font-medium leading-6 text-ink/70">{group.instruction}</p>
      <div className="space-y-4">
        {group.questions.map((q) => (
          <QuestionRow
            key={q.id}
            q={q}
            kind={group.kind}
            sharedOptions={group.sharedOptions}
            value={answers[q.id] ?? ""}
            flagged={!!flagged[q.id]}
            onChange={(v) => onChange(q.id, v)}
            onFlag={() => onFlag(q.id)}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionRow({
  q,
  kind,
  sharedOptions,
  value,
  flagged,
  onChange,
  onFlag,
}: {
  q: Question;
  kind: QuestionGroup["kind"];
  sharedOptions?: string[];
  value: string;
  flagged: boolean;
  onChange: (v: string) => void;
  onFlag: () => void;
}) {
  const choices =
    kind === "tfng" ? ["TRUE", "FALSE", "NOT GIVEN"] : kind === "ynng" ? ["YES", "NO", "NOT GIVEN"] : kind === "mcq" ? q.options ?? [] : [];

  return (
    <div className={`rounded-xl border p-3 transition ${flagged ? "border-[#B45309]/45 bg-[#B45309]/[0.05]" : "border-ink/10 bg-ink/[0.025]"}`}>
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink/10 text-[11px] font-bold text-ink/70">{q.number}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] leading-6 text-ink/85">{q.text}</p>

          {(kind === "tfng" || kind === "ynng") && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {choices.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange(c)}
                  className={`rounded-lg border px-2.5 py-1 text-[11.5px] font-semibold transition ${
                    value === c ? "border-limeDeep bg-lime text-ink" : "border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {kind === "mcq" && (
            <div className="mt-2.5 space-y-1.5">
              {choices.map((c, i) => (
                <button
                  key={c}
                  onClick={() => onChange(c)}
                  className={`flex w-full items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition ${
                    value === c ? "border-limeDeep bg-lime/10 text-ink" : "border-ink/10 text-ink/60 hover:border-ink/25 hover:text-ink/90"
                  }`}
                >
                  <span className="font-bold text-ink/40">{"ABCD"[i]}</span>
                  <span>{c}</span>
                </button>
              ))}
            </div>
          )}

          {kind === "heading" && (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2.5 w-full rounded-lg border border-ink/15 bg-white px-2.5 py-2 text-[12.5px] text-ink/85 focus:border-tealDeep focus:outline-none"
            >
              <option value="">Select a heading…</option>
              {(sharedOptions ?? []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          )}

          {(kind === "gap" || kind === "short") && (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Your answer"
              className="mt-2.5 w-full rounded-lg border border-ink/15 bg-white px-2.5 py-2 text-[12.5px] text-ink placeholder:text-ink/25 focus:border-tealDeep focus:outline-none"
            />
          )}
        </div>
        <button
          onClick={onFlag}
          title="Flag for review"
          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[13px] leading-none transition ${flagged ? "text-[#8A6100]" : "text-ink/20 hover:text-ink/50"}`}
        >
          ⚑
        </button>
      </div>
    </div>
  );
}
