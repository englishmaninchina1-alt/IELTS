import { SectionHead, Pill } from "@/components/ui";
import { tipSections, bandDescriptors, examDay, scoreBudgets } from "@/data/tips";

export const metadata = { title: "Strategy and tips · Band Nine" };

export default function TipsPage() {
  return (
    <div>
      <SectionHead
        eyebrow="Strategy"
        title="What actually separates 6.5 from 7.5."
        sub="Not more vocabulary — better decisions under time pressure. These are the habits that examiners reward, the traps that quietly cap candidates, and the time budgets that make a difference on the day."
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {tipSections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-full border border-ink/15 px-3 py-1 text-[11.5px] font-semibold text-ink/60 transition hover:border-limeDeep/40 hover:text-limeDeep">
            {s.skill}
          </a>
        ))}
        <a href="#bands" className="rounded-full border border-ink/15 px-3 py-1 text-[11.5px] font-semibold text-ink/60 transition hover:border-limeDeep/40 hover:text-limeDeep">
          Band descriptors
        </a>
        <a href="#day" className="rounded-full border border-ink/15 px-3 py-1 text-[11.5px] font-semibold text-ink/60 transition hover:border-limeDeep/40 hover:text-limeDeep">
          Exam day
        </a>
      </div>

      {tipSections.map((s) => (
        <section key={s.id} id={s.id} className="mb-10 scroll-mt-24">
          <div className="mb-4 rounded-2xl border border-ink/10 bg-gradient-to-br from-ink/[0.035] to-transparent p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="lime">{s.skill}</Pill>
              <span className="text-[11px] text-ink/35">{s.tips.length} tactics</span>
            </div>
            <h2 className="mt-2.5 font-serif text-2xl leading-snug text-ink">{s.headline}</h2>
            <p className="mt-2 max-w-3xl text-[13px] leading-6 text-ink/55">{s.mindset}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2.5">
              {s.tips.map((t) => (
                <div key={t.title} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[13px] font-semibold text-ink">{t.title}</h3>
                    {t.level && <Pill tone="coral">{t.level}</Pill>}
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-6 text-ink/55">{t.body}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="card border-coralDeep/20 bg-coral/[0.04] p-4">
                <h3 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-coralDeep/80">Traps</h3>
                <div className="mt-2 space-y-2.5">
                  {s.traps.map((t) => (
                    <div key={t.title}>
                      <h4 className="text-[12.5px] font-semibold text-ink/85">{t.title}</h4>
                      <p className="mt-0.5 text-[11.5px] leading-5 text-ink/50">{t.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h3 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/40">Time budget</h3>
                <div className="mt-2 space-y-1.5">
                  {s.timing.map((t) => (
                    <div key={t.label} className="flex items-start gap-2.5 rounded-lg bg-ink/[0.03] px-2.5 py-1.5">
                      <span className="w-16 shrink-0 text-[11px] font-bold text-tealDeep/80">{t.minutes}</span>
                      <div>
                        <p className="text-[12px] font-medium text-ink/75">{t.label}</p>
                        <p className="text-[10.5px] leading-4 text-ink/35">{t.what}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="bands" className="mb-10 scroll-mt-24">
        <h2 className="font-serif text-2xl text-ink">Band descriptors, in plain English</h2>
        <p className="mt-1 text-[12.5px] text-ink/45">What an examiner is actually looking for at each level. Writing criteria are weighted equally.</p>
        <div className="card mt-3 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-ink/[0.04]">
                <th className="px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-wider text-ink/40">Band</th>
                <th className="px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-wider text-ink/40">Writing</th>
                <th className="px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-wider text-ink/40">Speaking</th>
              </tr>
            </thead>
            <tbody>
              {bandDescriptors.map((b) => (
                <tr key={b.band} className="border-t border-ink/10">
                  <td className="px-4 py-2.5 font-serif text-lg text-limeDeep">{b.band}</td>
                  <td className="px-4 py-2.5 text-[12px] leading-5 text-ink/60">{b.writing}</td>
                  <td className="px-4 py-2.5 text-[12px] leading-5 text-ink/60">{b.speaking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-ink">What each target requires</h2>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {scoreBudgets.map((b) => (
            <div key={b.target} className="card p-4">
              <h3 className="text-[13px] font-bold text-limeDeep">{b.target}</h3>
              <dl className="mt-2 space-y-1 text-[11.5px]">
                <div className="flex gap-2"><dt className="w-20 shrink-0 text-ink/35">Reading</dt><dd className="text-ink/65">{b.reading}</dd></div>
                <div className="flex gap-2"><dt className="w-20 shrink-0 text-ink/35">Listening</dt><dd className="text-ink/65">{b.listening}</dd></div>
                <div className="flex gap-2"><dt className="w-20 shrink-0 text-ink/35">Writing</dt><dd className="text-ink/65">{b.writing}</dd></div>
                <div className="flex gap-2"><dt className="w-20 shrink-0 text-ink/35">Speaking</dt><dd className="text-ink/65">{b.speaking}</dd></div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section id="day" className="scroll-mt-24">
        <h2 className="font-serif text-2xl text-ink">Exam day</h2>
        <div className="mt-3 grid gap-2.5 md:grid-cols-2">
          {examDay.map((e) => (
            <div key={e.title} className="card p-4">
              <h3 className="text-[13px] font-semibold text-tealDeep">{e.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-6 text-ink/55">{e.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
