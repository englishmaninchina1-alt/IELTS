import { SectionHead, Pill } from "@/components/ui";
import { grammarLessons, commonErrors, sentenceVarietyDrill } from "@/data/grammar";
import { linkingGroups, coherenceRules } from "@/data/linking";

export const metadata = { title: "Grammar, linking words and sentence structure · Band Nine" };

export default function GrammarPage() {
  return (
    <div>
      <SectionHead
        eyebrow="Sentence structure"
        title="Seven structures that do the work of thirty."
        sub="Grammatical range is 25% of your Writing score and 25% of Speaking. Range means variety with control — not long sentences. Each lesson below shows a weak sentence, the upgraded version, and why it scores higher."
      />

      <div className="mb-8 space-y-2.5">
        {grammarLessons.map((l, i) => (
          <details key={l.id} className="card group p-0" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink/10 text-[11px] font-bold text-limeDeep">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-semibold text-ink">{l.title}</h3>
                <p className="truncate text-[11.5px] text-ink/40">{l.goal}</p>
              </div>
              <span className="text-ink/30 transition group-open:rotate-45">＋</span>
            </summary>
            <div className="border-t border-ink/10 px-4 pb-4 pt-3.5">
              <p className="text-[12.5px] leading-6 text-ink/60">{l.why}</p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-ink/[0.03] p-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/35">Forms</h4>
                  <ul className="mt-1.5 space-y-1">
                    {l.structure.map((s) => (
                      <li key={s} className="text-[12px] leading-6 text-ink/60">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-ink/[0.03] p-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/35">In use</h4>
                  <ul className="mt-1.5 space-y-2">
                    {l.examples.map((e) => (
                      <li key={e.sentence}>
                        <p className="font-serif text-[12.5px] italic leading-6 text-tealDeep/90">{e.sentence}</p>
                        <p className="text-[10.5px] leading-4 text-ink/35">{e.note}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h4 className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/35">Upgrade like this</h4>
              <div className="mt-1.5 space-y-1.5">
                {l.upgrades.map((u) => (
                  <div key={u.from} className="rounded-lg border border-ink/10 bg-ink/[0.025] p-2.5">
                    <p className="text-[12px] leading-5 text-coralDeep/75">✗ {u.from}</p>
                    <p className="text-[12.5px] leading-6 text-tealDeep/90">✓ {u.to}</p>
                    <p className="mt-1 text-[10.5px] leading-4 text-ink/35">{u.why}</p>
                  </div>
                ))}
              </div>

              <h4 className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/35">Practice</h4>
              <div className="mt-1.5 space-y-1.5">
                {l.practice.map((p, n) => (
                  <details key={n} className="rounded-lg border border-ink/10 bg-ink/[0.025] p-2.5">
                    <summary className="cursor-pointer list-none text-[12.5px] text-ink/70">{p.prompt}</summary>
                    <p className="mt-2 border-l-2 border-limeDeep/40 pl-2.5 text-[12.5px] leading-6 text-limeDeep/85">{p.model}</p>
                  </details>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl text-ink">Linking words, by function</h2>
            <p className="mt-1 text-[12.5px] text-ink/45">
              Cohesion is 25% of Writing. The error is not using too few connectives — it is using the same three repeatedly.
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {linkingGroups.map((g) => (
            <div key={g.id} className="card p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13.5px] font-semibold text-ink">{g.function}</h3>
                <Pill>{g.items.length} items</Pill>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-5 text-ink/40">{g.description}</p>
              <div className="mt-3 space-y-1.5">
                {g.items.map((it) => (
                  <details key={it.word} className="rounded-lg bg-ink/[0.03] px-2.5 py-1.5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
                      <span className="text-[12.5px] font-medium text-tealDeep/90">{it.word}</span>
                      <span className={`text-[9.5px] uppercase tracking-wider ${it.register === "formal" ? "text-violetDeep/60" : "text-ink/25"}`}>
                        {it.register}
                      </span>
                    </summary>
                    <p className="mt-1.5 font-serif text-[12px] italic leading-6 text-ink/60">{it.example}</p>
                    {it.warning && <p className="mt-1 text-[10.5px] leading-4 text-[#8A6100]/80">⚠ {it.warning}</p>}
                  </details>
                ))}
              </div>
              <div className="mt-3 border-t border-ink/10 pt-2.5">
                {g.practice.slice(0, 1).map((p, i) => (
                  <div key={i}>
                    <p className="text-[11.5px] leading-5 text-coralDeep/70">✗ {p.weak}</p>
                    <p className="text-[12px] leading-6 text-tealDeep/85">✓ {p.strong}</p>
                    <p className="mt-0.5 text-[10.5px] leading-4 text-ink/30">{p.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 grid gap-3 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-serif text-xl text-ink">Common errors that cost marks</h2>
          <div className="mt-3 space-y-2">
            {commonErrors.map((e) => (
              <div key={e.wrong} className="rounded-lg border border-ink/10 bg-ink/[0.025] p-2.5">
                <p className="text-[12px] leading-5 text-coralDeep/80">✗ {e.wrong}</p>
                <p className="text-[12.5px] leading-5 text-tealDeep/90">✓ {e.right}</p>
                <p className="mt-0.5 text-[10.5px] text-ink/30">{e.why}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="card p-5">
            <h2 className="font-serif text-xl text-ink">Six rules of coherence</h2>
            <div className="mt-3 space-y-2.5">
              {coherenceRules.map((r) => (
                <div key={r.rule}>
                  <h3 className="text-[12.5px] font-semibold text-limeDeep">{r.rule}</h3>
                  <p className="mt-0.5 text-[11.5px] leading-5 text-ink/50">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-serif text-xl text-ink">Variety drill</h2>
            <p className="mt-1 text-[11.5px] text-ink/40">Ten simple sentences, upgraded six ways. Cover the right column and try.</p>
            <div className="mt-3 space-y-2">
              {sentenceVarietyDrill.map((d) => (
                <details key={d.simple} className="rounded-lg bg-ink/[0.03] px-2.5 py-2">
                  <summary className="cursor-pointer list-none text-[12.5px] text-ink/65">“{d.simple}”</summary>
                  <p className="mt-1.5 font-serif text-[12.5px] leading-6 text-tealDeep/90">{d.complex}</p>
                  <p className="text-[10.5px] text-ink/30">{d.label}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
