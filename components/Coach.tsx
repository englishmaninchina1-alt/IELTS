"use client";

import { useMemo, useState } from "react";
import { detectTopic, buildEssay, buildSpeakingAnswer, openingBank, conclusionBank, extractIdeas, type Idea } from "@/lib/coach";
import { Pill } from "./ui";
import ListenButton from "./ListenButton";

type Mode = "writing" | "speaking";

const emptyIdea = (): Idea => ({ claim: "", because: "", example: "", soWhat: "" });

export default function Coach() {
  const [mode, setMode] = useState<Mode>("writing");
  const [prompt, setPrompt] = useState(
    "Some people believe that artificial intelligence will create more jobs than it destroys. To what extent do you agree or disagree?"
  );
  const [position, setPosition] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([emptyIdea(), emptyIdea()]);
  const [counter, setCounter] = useState("");
  const [brainstorm, setBrainstorm] = useState("");
  const [feeling, setFeeling] = useState("");
  const [output, setOutput] = useState<{ text: string; source: string; notes: string[]; words: number; vocabulary?: string[]; notice?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [advanced, setAdvanced] = useState<{ open: boolean; text: string }>({ open: false, text: "" });

  const profile = useMemo(() => detectTopic(prompt), [prompt]);
  const extracted = useMemo(() => extractIdeas(brainstorm), [brainstorm]);

  const suggest = () => {
    const p = profile;
    setPosition(p.positions[0]);
    setIdeas(p.ideas.slice(0, 2).map((i) => ({ ...i })));
    setCounter(p.counter);
    setOutput(null);
  };

  const useExtracted = () => {
    const next = extracted.slice(0, 3).map((e, i) => ({
      claim: e,
      because: ideas[i]?.because ?? "",
      example: ideas[i]?.example ?? "",
      soWhat: ideas[i]?.soWhat ?? "",
    }));
    setIdeas(next.length ? next : ideas);
  };

  const generate = async () => {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          prompt,
          position: position || profile.positions[0],
          ideas: ideas.filter((i) => i.claim && i.because),
          counter: counter || profile.counter,
          notes: mode === "speaking" ? (brainstorm ? extractIdeas(brainstorm) : ideas.map((i) => i.claim).filter(Boolean)) : [],
          feeling,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOutput({ text: data.text, source: data.source, notes: data.notes ?? [], words: data.words ?? 0, vocabulary: data.vocabulary, notice: data.notice });
        return;
      }
    } catch {
      /* fall back below */
    }
    const local =
      mode === "speaking"
        ? buildSpeakingAnswer({ prompt, notes: ideas.map((i) => i.claim).filter(Boolean), feeling })
        : buildEssay({
            prompt,
            position: position || profile.positions[0],
            ideas: ideas.filter((i) => i.claim && i.because),
            counter: counter || profile.counter,
            topicName: profile.name,
          });
    setOutput({ text: local.full, source: "local", notes: local.notes, words: local.words, vocabulary: local.vocabulary });
    setLoading(false);
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const openInStudio = () => {
    if (!output) return;
    try {
      window.localStorage.setItem("ielts-coach-draft", output.text);
      window.location.href = "/writing";
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <div className="card p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex rounded-lg bg-ink/5 p-0.5">
              <button onClick={() => setMode("writing")} className={`tab ${mode === "writing" ? "tab-active" : ""}`}>Task 2 essay</button>
              <button onClick={() => setMode("speaking")} className={`tab ${mode === "speaking" ? "tab-active" : ""}`}>Part 2 talk</button>
            </div>
            <Pill tone="lime">{profile.name}</Pill>
          </div>

          <label className="label">{mode === "writing" ? "The question" : "The cue card"}</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="field resize-y text-[13px] leading-6"
            placeholder={mode === "writing" ? "Paste any Task 2 question…" : "Describe a skill you learned that took a long time to master…"}
          />

          <div className="mt-3">
            <label className="label">Your position (one sentence)</label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder={profile.positions[0]}
              className="field text-[13px]"
            />
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {profile.positions.slice(0, 2).map((p) => (
                <button key={p} onClick={() => setPosition(p)} className="rounded-md border border-ink/15 px-2 py-1 text-[11px] text-ink/55 transition hover:border-limeDeep/40 hover:text-limeDeep">
                  use: {p.slice(0, 44)}…
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Brainstorm</h3>
            <button onClick={suggest} className="rounded-md border border-limeDeep/30 bg-lime/10 px-2 py-1 text-[11px] font-semibold text-limeDeep">
              ✨ Suggest ideas for this topic
            </button>
          </div>
          <textarea
            value={brainstorm}
            onChange={(e) => setBrainstorm(e.target.value)}
            rows={3}
            placeholder={
              mode === "writing"
                ? "Dump your ideas here, one per line. The coach will pull out possible claims and turn them into paragraphs."
                : "Five words only: who / how / what happened / how you felt / why it matters."
            }
            className="field resize-y text-[13px] leading-6"
          />
          {extracted.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink/35">{extracted.length} ideas detected</span>
                <button onClick={useExtracted} className="text-[11px] font-semibold text-tealDeep hover:underline">Move into the plan →</button>
              </div>
              {extracted.slice(0, 4).map((e, i) => (
                <p key={i} className="truncate rounded bg-ink/[0.04] px-2 py-1 text-[11.5px] text-ink/55">• {e}</p>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Your two developed ideas</h3>
          <div className="space-y-3">
            {ideas.map((idea, i) => (
              <div key={i} className="rounded-xl border border-ink/10 bg-ink/[0.025] p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink/35">Body paragraph {i + 1}</span>
                  {ideas.length > 1 && (
                    <button onClick={() => setIdeas((a) => a.filter((_, n) => n !== i))} className="text-[11px] text-ink/30 hover:text-coralDeep">remove</button>
                  )}
                </div>
                <input
                  value={idea.claim}
                  onChange={(e) => setIdeas((a) => a.map((x, n) => (n === i ? { ...x, claim: e.target.value } : x)))}
                  placeholder="Claim — what is true? e.g. automation removes the tasks juniors learn on"
                  className="field mb-1.5 text-[12.5px]"
                />
                <input
                  value={idea.because}
                  onChange={(e) => setIdeas((a) => a.map((x, n) => (n === i ? { ...x, because: e.target.value } : x)))}
                  placeholder="Why — the mechanism. e.g. junior work is how judgement is learned"
                  className="field mb-1.5 text-[12.5px]"
                />
                <input
                  value={idea.example}
                  onChange={(e) => setIdeas((a) => a.map((x, n) => (n === i ? { ...x, example: e.target.value } : x)))}
                  placeholder="Example — one specific case"
                  className="field mb-1.5 text-[12.5px]"
                />
                <input
                  value={idea.soWhat ?? ""}
                  onChange={(e) => setIdeas((a) => a.map((x, n) => (n === i ? { ...x, soWhat: e.target.value } : x)))}
                  placeholder="So what — the consequence (optional)"
                  className="field text-[12.5px]"
                />
              </div>
            ))}
          </div>
          <button onClick={() => setIdeas((a) => [...a, emptyIdea()])} className="btn-quiet mt-2 w-full !py-1.5 !text-[12px]">
            + Add a third idea
          </button>
        </div>

        <div className="card p-4">
          <label className="label">{mode === "writing" ? "Counter-argument you will concede" : "How you felt (one line)"}</label>
          <input
            value={mode === "writing" ? counter : feeling}
            onChange={(e) => (mode === "writing" ? setCounter(e.target.value) : setFeeling(e.target.value))}
            placeholder={mode === "writing" ? profile.counter : "genuinely proud, though slightly embarrassed at how long it took"}
            className="field text-[13px]"
          />
          <button onClick={generate} disabled={loading} className="btn-primary mt-3 w-full">
            {loading ? "Thinking…" : mode === "writing" ? "Generate the essay" : "Generate the talk"}
          </button>
          <p className="mt-2 text-[11px] leading-5 text-ink/30">
            Drafts are written by OpenAI from your own ideas, with exam-standard structures as a fallback — the badge on the result tells you which.
            Use “British voice” to hear any answer read aloud at exam pace.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {!output ? (
          <div className="card grid place-items-center px-5 py-16 text-center">
            <div className="mb-3 text-3xl">✎</div>
            <h3 className="font-serif text-xl text-ink">Your sample answer appears here</h3>
            <p className="mt-2 max-w-xs text-[12.5px] leading-6 text-ink/45">
              The coach works on your ideas, not generic ones. Fill in the claim / why / example rows — or press “Suggest ideas” and edit what it
              gives you.
            </p>
            <div className="mt-5 w-full max-w-xs space-y-1.5 text-left">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink/30">Opening lines you can borrow</p>
              {openingBank.slice(0, 3).map((o) => (
                <button key={o} onClick={() => setPrompt((p) => p)} className="block w-full rounded-lg bg-ink/[0.04] px-2.5 py-1.5 text-left text-[11.5px] leading-5 text-ink/50 hover:bg-ink/[0.07]">
                  {o}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="card p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Pill tone={output.source === "openai" || output.source === "llm" ? "violet" : "lime"}>
                  {output.source === "openai" || output.source === "llm" ? "OpenAI draft" : "Coach engine draft"}
                </Pill>
                <span className="text-[11px] text-ink/40">{output.words} words</span>
                <div className="ml-auto flex items-start gap-1.5">
                  <ListenButton text={output.text} className="btn-ghost !px-2.5 !py-1 !text-[11px]" />
                  <button onClick={copy} className="btn-ghost !px-2.5 !py-1 !text-[11px]">{copied ? "Copied" : "Copy"}</button>
                  {mode === "writing" && (
                    <button onClick={openInStudio} className="btn-primary !px-2.5 !py-1 !text-[11px]">Check my score →</button>
                  )}
                </div>
              </div>
              {output.notice && <p className="mb-2 text-[11.5px] leading-5 text-[#8A6100]">{output.notice}</p>}
              <div className="max-h-[62vh] overflow-y-auto pr-1">
                <div className="space-y-3.5 text-[13.5px] leading-7 text-ink/80">
                  {output.text.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            </div>

            {output.notes.length > 0 && (
              <div className="card p-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Before you trust this draft</h3>
                <ul className="mt-2 space-y-1.5">
                  {output.notes.map((n, i) => <li key={i} className="text-[12.5px] leading-6 text-ink/65">• {n}</li>)}
                </ul>
              </div>
            )}

            {output.vocabulary && output.vocabulary.length > 0 && (
              <div className="card p-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Use this vocabulary</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {output.vocabulary.map((v) => (
                    <span key={v} className="rounded-md bg-violet/10 px-2 py-0.5 text-[11px] text-violetDeep">{v}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="card p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">Now do the work</h3>
              <p className="mt-1.5 text-[12.5px] leading-6 text-ink/55">
                Reading a model answer does not raise a band. Rewrite this one from memory in your own words, then paste it into the Writing studio
                for a scored read. Keep the structure, lose the sentences.
              </p>
              <div className="mt-2 grid gap-1.5">
                {conclusionBank.slice(0, 2).map((c) => (
                  <p key={c} className="rounded-lg bg-ink/[0.04] px-2.5 py-1.5 text-[11.5px] leading-5 text-ink/45">“{c}”</p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
