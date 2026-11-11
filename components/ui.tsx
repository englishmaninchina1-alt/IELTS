"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { bandColour } from "@/lib/band";

export function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "lime" | "teal" | "coral" | "violet" }) {
  const map = {
    default: "border-ink/15 bg-ink/5 text-ink/65",
    lime: "border-limeDeep/30 bg-lime/10 text-limeDeep",
    teal: "border-tealDeep/30 bg-teal/10 text-tealDeep",
    coral: "border-coralDeep/30 bg-coral/10 text-coralDeep",
    violet: "border-violetDeep/30 bg-violet/10 text-violetDeep",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] ${map[tone]}`}>
      {children}
    </span>
  );
}

export function ScoreDial({ band, size = 132, caption }: { band: number; size?: number; caption?: string }) {
  const pct = Math.max(0, Math.min(1, band / 9));
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const stroke = band >= 8 ? "#4E6B0B" : band >= 7 ? "#0F766E" : band >= 6 ? "#B8860B" : "#C2502A";
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(20,22,28,0.09)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          style={{ transition: "stroke-dasharray 700ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <div className={`font-serif text-4xl leading-none ${bandColour(band)}`}>{band > 0 ? band.toFixed(1) : "—"}</div>
        {caption && <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/40">{caption}</div>}
      </div>
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3.5 py-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">{label}</div>
      <div className="mt-1 text-xl font-semibold text-ink">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-ink/45">{sub}</div>}
    </div>
  );
}

export function CriteriaCard({
  name,
  band,
  comment,
  positives,
  improvements,
  weight,
}: {
  name: string;
  band: number;
  comment: string;
  positives: string[];
  improvements: string[];
  weight?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-ink">{name}</h4>
          {weight && <p className="mt-0.5 text-[11px] text-ink/40">{weight}</p>}
        </div>
        <span className={`font-serif text-2xl leading-none ${bandColour(band)}`}>{band.toFixed(1)}</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className={`h-full rounded-full ${band >= 7 ? "bg-teal" : band >= 6 ? "bg-[#E0A32A]" : "bg-coral"}`}
          style={{ width: `${(band / 9) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-[13px] leading-6 text-ink/65">{comment}</p>
      {positives.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {positives.slice(0, 4).map((p, i) => (
            <li key={i} className="flex gap-2 text-[12.5px] leading-5 text-tealDeep/90">
              <span className="mt-0.5 shrink-0">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      {improvements.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {improvements.slice(0, 4).map((p, i) => (
            <li key={i} className="flex gap-2 text-[12.5px] leading-5 text-coralDeep/90">
              <span className="mt-0.5 shrink-0">→</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProgressBar({ value, max, tone = "lime" }: { value: number; max: number; tone?: "lime" | "teal" | "coral" }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  const bg = tone === "teal" ? "bg-teal" : tone === "coral" ? "bg-coral" : "bg-lime";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
      <div className={`h-full rounded-full ${bg} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function CTA({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <Link href={href} className={variant === "primary" ? "btn-primary" : "btn-ghost"}>
      {children}
    </Link>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="card grid place-items-center px-6 py-14 text-center">
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink/50">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Timer({ seconds, running, danger }: { seconds: number; running: boolean; danger: boolean }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums ${
        danger ? "border-coralDeep/40 bg-coral/10 text-coralDeep" : running ? "border-tealDeep/30 bg-teal/5 text-tealDeep" : "border-ink/15 text-ink/60"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${running ? "bg-current" : "bg-ink/30"} ${danger && running ? "rec-dot" : ""}`} />
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </div>
  );
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-limeDeep/80">{eyebrow}</div>}
      <h1 className="section-title">{title}</h1>
      {sub && <p className="mt-2.5 max-w-2xl text-[14.5px] leading-7 text-ink/55">{sub}</p>}
    </div>
  );
}
