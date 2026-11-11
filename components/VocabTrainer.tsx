"use client";

import { useMemo, useState } from "react";
import { vocabulary, vocabTopics, type VocabEntry } from "@/data/vocab";
import { useProfile } from "@/lib/store";
import { Pill, ProgressBar } from "./ui";

type Mode = "browse" | "cards" | "quiz";

export default function VocabTrainer() {
  const [mode, setMode] = useState<Mode>("browse");
  const [topic, setTopic] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quiz, setQuiz] = useState<{ word: VocabEntry; options: string[]; answered: string | null } | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const { profile, update } = useProfile();

  const filtered = useMemo(
    () =>
      vocabulary.filter(
        (v) =>
          (topic === "all" || v.topic === topic) &&
          (!query.trim() || `${v.word} ${v.meaning} ${v.topic}`.toLowerCase().includes(query.toLowerCase()))
      ),
    [topic, query]
  );

  const card = filtered[cardIdx % Math.max(filtered.length, 1)];

  const mark = (word: string, correct: boolean) => {
    update((p) => {
      const existing = p.vocab[word] ?? { word, box: 0, seen: 0, correct: 0, lastSeen: "" };
      return {
        ...p,
        vocab: {
          ...p.vocab,
          [word]: {
            word,
            box: correct ? Math.min(5, existing.box + 1) : Math.max(0, existing.box - 1),
            seen: existing.seen + 1,
            correct: existing.correct + (correct ? 1 : 0),
            lastSeen: new Date().toISOString(),
          },
        },
      };
    });
  };

  const nextQuiz = (exclude?: string) => {
    const pool = filtered.length > 3 ? filtered : vocabulary;
    let pick = pool[Math.floor(Math.random() * pool.length)];
    if (exclude) {
      let guard = 0;
      while (pick.word === exclude && guard++ < 10) pick = pool[Math.floor(Math.random() * pool.length)];
    }
    const distractors = vocabulary
      .filter((v) => v.word !== pick.word && v.topic === pick.topic)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => v.word);
    const options = [pick.word, ...distractors].sort(() => Math.random() - 0.5);
    setQuiz({ word: pick, options, answered: null });
  };

  const mastered = Object.values(profile.vocab).filter((v) => v.box >= 3).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg bg-ink/5 p-0.5">
          {(["browse", "cards", "quiz"] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); if (m === "quiz" && !quiz) nextQuiz(); }} className={`tab ${mode === m ? "tab-active" : ""}`}>
              {m === "browse" ? "Browse" : m === "cards" ? "Flashcards" : "Quiz"}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a word or meaning…"
          className="field max-w-[220px] !py-1.5 !text-[12.5px]"
        />
        <div className="ml-auto flex items-center gap-3 text-[11.5px] text-ink/40">
          <span>{vocabulary.length} words</span>
          <span className="text-tealDeep">{mastered} mastered</span>
        </div>
      </div>

      <div className="hide-scroll mb-4 flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => { setTopic("all"); setCardIdx(0); }}
          className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-semibold transition ${
            topic === "all" ? "border-limeDeep bg-lime text-ink" : "border-ink/15 text-ink/55 hover:text-ink"
          }`}
        >
          All topics
        </button>
        {vocabTopics.map((t) => (
          <button
            key={t}
            onClick={() => { setTopic(t); setCardIdx(0); }}
            className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-semibold transition ${
              topic === t ? "border-limeDeep bg-lime text-ink" : "border-ink/15 text-ink/55 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {mode === "browse" && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => {
            const box = profile.vocab[v.word]?.box ?? 0;
            return (
              <div key={v.word + v.topic} className="card flex flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink">{v.word}</h3>
                    <span className="text-[11px] italic text-ink/35">{v.pos} · {v.topic}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Pill tone={v.band.startsWith("8") ? "violet" : v.band.startsWith("7") ? "teal" : "default"}>Band {v.band}</Pill>
                    {box > 0 && <span className="text-[10px] text-limeDeep">● {box}/5</span>}
                  </div>
                </div>
                <p className="mt-2 text-[12.5px] leading-6 text-ink/65">{v.meaning}</p>
                <p className="mt-2 border-l-2 border-limeDeep/40 pl-2.5 font-serif text-[12.5px] italic leading-6 text-ink/55">{v.example}</p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {v.collocations.map((c) => (
                    <span key={c} className="rounded bg-ink/[0.05] px-1.5 py-0.5 text-[10.5px] text-ink/50">{c}</span>
                  ))}
                </div>
                <div className="mt-auto pt-2 text-[10.5px] text-ink/30">≈ {v.synonyms.join(", ")}</div>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="col-span-full py-10 text-center text-sm text-ink/40">No words match that search.</p>}
        </div>
      )}

      {mode === "cards" && card && (
        <div className="mx-auto max-w-xl">
          <div className="mb-3 flex items-center justify-between text-[11.5px] text-ink/40">
            <span>{card.topic} · {card.band}</span>
            <span>{(cardIdx % filtered.length) + 1} / {filtered.length}</span>
          </div>
          <div className="mb-3"><ProgressBar value={(cardIdx % filtered.length) + 1} max={filtered.length} tone="teal" /></div>

          <button
            onClick={() => setFlipped((f) => !f)}
            className="card grid min-h-[260px] w-full place-items-center p-8 text-center transition hover:border-tealDeep/30"
          >
            {!flipped ? (
              <div>
                <div className="font-serif text-3xl text-ink">{card.word}</div>
                <div className="mt-2 text-[12px] italic text-ink/40">{card.pos}</div>
                <div className="mt-6 text-[11px] uppercase tracking-[0.16em] text-ink/25">tap to reveal</div>
              </div>
            ) : (
              <div className="w-full">
                <div className="text-[14px] leading-7 text-ink/85">{card.meaning}</div>
                <p className="mt-3 border-l-2 border-limeDeep/40 pl-3 text-left font-serif text-[13px] italic leading-7 text-ink/60">{card.example}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {card.collocations.map((c) => (
                    <span key={c} className="rounded bg-ink/[0.05] px-1.5 py-0.5 text-[10.5px] text-ink/50">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </button>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className="btn-ghost"
              onClick={() => { mark(card.word, false); setFlipped(false); setCardIdx((i) => i + 1); }}
            >
              Again
            </button>
            <button
              className="btn-primary"
              onClick={() => { mark(card.word, true); setFlipped(false); setCardIdx((i) => i + 1); }}
            >
              Knew it
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-ink/30">
            Cards progress 0 → 5. Anything at 3+ counts as mastered.
          </p>
        </div>
      )}

      {mode === "quiz" && quiz && (
        <div className="mx-auto max-w-xl">
          <div className="mb-3 flex items-center justify-between text-[11.5px] text-ink/40">
            <span>{quiz.word.topic}</span>
            <span>{score.right} / {score.total} correct</span>
          </div>
          <div className="card p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink/35">Which word means…</p>
            <p className="mt-2 text-[16px] leading-7 text-ink/90">{quiz.word.meaning}</p>
            <div className="mt-5 space-y-2">
              {quiz.options.map((o) => {
                const isRight = o === quiz.word.word;
                const chosen = quiz.answered === o;
                return (
                  <button
                    key={o}
                    disabled={!!quiz.answered}
                    onClick={() => {
                      setQuiz({ ...quiz, answered: o });
                      setScore((s) => ({ right: s.right + (isRight ? 1 : 0), total: s.total + 1 }));
                      mark(quiz.word.word, isRight);
                    }}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left text-[13px] font-medium transition ${
                      quiz.answered
                        ? isRight
                          ? "border-tealDeep bg-teal/15 text-tealDeep"
                          : chosen
                            ? "border-coralDeep bg-coral/10 text-coralDeep"
                            : "border-ink/10 text-ink/35"
                        : "border-ink/15 text-ink/75 hover:border-tealDeep/40 hover:bg-ink/5"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {quiz.answered && (
              <div className="mt-4 rounded-lg bg-ink/[0.04] p-3">
                <p className="font-serif text-[13px] italic leading-6 text-ink/60">{quiz.word.example}</p>
                <button className="btn-primary mt-3 w-full !py-2 !text-[12px]" onClick={() => nextQuiz(quiz.word.word)}>
                  Next word →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
