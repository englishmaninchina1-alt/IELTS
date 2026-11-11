"use client";

import type { Chart } from "@/data/writing";

const PALETTE = ["#6E8F17", "#0E7490", "#C2502A", "#6D4AC4", "#B8860B", "#2563EB"];

export default function ChartView({ chart }: { chart: Chart }) {
  if (chart.kind === "pie") return <PieView chart={chart} />;
  if (chart.kind === "line") return <LineView chart={chart} />;
  if (chart.kind === "bar") return <BarView chart={chart} />;
  if (chart.kind === "table") return <TableView chart={chart} />;
  return <ProcessView chart={chart} />;
}

function Legend({ items }: { items: { label: string; colour: string }[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5 text-[11px] font-medium text-[#14161c]/60">
          <span className="h-2 w-2 rounded-sm" style={{ background: i.colour }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

function BarView({ chart }: { chart: Extract<Chart, { kind: "bar" }> }) {
  const W = 560;
  const H = 260;
  const pad = { l: 34, r: 10, t: 14, b: 42 };
  const max = Math.max(...chart.series.flatMap((s) => s.values)) * 1.15;
  const groupW = (W - pad.l - pad.r) / chart.categories.length;
  const barW = Math.min(22, (groupW - 14) / chart.series.length);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={chart.title}>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = pad.t + (H - pad.t - pad.b) * (1 - f);
          return (
            <g key={f}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="rgba(20,22,28,0.12)" strokeWidth={1} />
              <text x={pad.l - 8} y={y + 3.5} textAnchor="end" fontSize={9} fill="rgba(20,22,28,0.45)">
                {Math.round(max * f)}
              </text>
            </g>
          );
        })}
        {chart.categories.map((cat, ci) => {
          const gx = pad.l + ci * groupW;
          return (
            <g key={cat}>
              {chart.series.map((s, si) => {
                const v = s.values[ci];
                const h = ((H - pad.t - pad.b) * v) / max;
                const x = gx + groupW / 2 - (chart.series.length * barW + 6) / 2 + si * (barW + 6);
                return (
                  <g key={s.label}>
                    <rect x={x} y={H - pad.b - h} width={barW} height={h} rx={3} fill={s.colour ?? PALETTE[si]} opacity={0.92} />
                    <text x={x + barW / 2} y={H - pad.b - h - 4} textAnchor="middle" fontSize={9} fontWeight={600} fill="rgba(20,22,28,0.65)">
                      {v}
                    </text>
                  </g>
                );
              })}
              <text x={gx + groupW / 2} y={H - pad.b + 15} textAnchor="middle" fontSize={9.5} fill="rgba(20,22,28,0.7)">
                {cat}
              </text>
            </g>
          );
        })}
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="rgba(20,22,28,0.25)" />
      </svg>
      <Legend items={chart.series.map((s, i) => ({ label: s.label, colour: s.colour ?? PALETTE[i] }))} />
    </div>
  );
}

function LineView({ chart }: { chart: Extract<Chart, { kind: "line" }> }) {
  const W = 560;
  const H = 260;
  const pad = { l: 34, r: 12, t: 14, b: 40 };
  const max = Math.max(...chart.series.flatMap((s) => s.values)) * 1.12;
  const stepX = (W - pad.l - pad.r) / Math.max(1, chart.categories.length - 1);
  const yFor = (v: number) => H - pad.b - ((H - pad.t - pad.b) * v) / max;
  const xFor = (i: number) => pad.l + i * stepX;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={chart.title}>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={pad.l} x2={W - pad.r} y1={yFor(max * f)} y2={yFor(max * f)} stroke="rgba(20,22,28,0.12)" />
            <text x={pad.l - 8} y={yFor(max * f) + 3.5} textAnchor="end" fontSize={9} fill="rgba(20,22,28,0.45)">
              {Math.round(max * f)}
            </text>
          </g>
        ))}
        {chart.series.map((s, si) => {
          const colour = s.colour ?? PALETTE[si];
          const pts = s.values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");
          return (
            <g key={s.label}>
              <polyline points={pts} fill="none" stroke={colour} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
              {s.values.map((v, i) => (
                <circle key={i} cx={xFor(i)} cy={yFor(v)} r={3} fill="#fff" stroke={colour} strokeWidth={2} />
              ))}
            </g>
          );
        })}
        {chart.categories.map((c, i) => (
          <text key={c} x={xFor(i)} y={H - pad.b + 15} textAnchor="middle" fontSize={9.5} fill="rgba(20,22,28,0.7)">
            {c}
          </text>
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="rgba(20,22,28,0.25)" />
      </svg>
      <Legend items={chart.series.map((s, i) => ({ label: s.label, colour: s.colour ?? PALETTE[i] }))} />
    </div>
  );
}

function PieView({ chart }: { chart: Extract<Chart, { kind: "pie" }> }) {
  const R = 74;
  const C = 90;

  const arcs = (values: number[], offsetX: number) => {
    let angle = -Math.PI / 2;
    return values.map((v, i) => {
      const slice = (v / 100) * Math.PI * 2;
      const x1 = offsetX + C + R * Math.cos(angle);
      const y1 = C + R * Math.sin(angle);
      angle += slice;
      const x2 = offsetX + C + R * Math.cos(angle);
      const y2 = C + R * Math.sin(angle);
      const large = slice > Math.PI ? 1 : 0;
      const mid = angle - slice / 2;
      const lx = offsetX + C + R * 0.62 * Math.cos(mid);
      const ly = C + R * 0.62 * Math.sin(mid);
      return { d: `M ${offsetX + C} ${C} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`, fill: PALETTE[i % PALETTE.length], lx, ly, v };
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-center gap-2">
        {chart.series.map((s, si) => (
          <div key={s.label} className="text-center">
            <svg viewBox="0 0 180 190" className="h-44 w-44">
              {arcs(s.values, 0).map((a, i) => (
                <g key={i}>
                  <path d={a.d} fill={a.fill} opacity={0.95} stroke="#f7f4ee" strokeWidth={1.5} />
                  <text x={a.lx} y={a.ly} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="rgba(20,22,28,0.8)">
                    {a.v}%
                  </text>
                </g>
              ))}
            </svg>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#14161c]/60">{s.label}</div>
          </div>
        ))}
      </div>
      <Legend items={chart.categories.map((c, i) => ({ label: c, colour: PALETTE[i % PALETTE.length] }))} />
    </div>
  );
}

function TableView({ chart }: { chart: Extract<Chart, { kind: "table" }> }) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-[#14161c]/15">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-ink/[0.06]">
              {chart.columns.map((c) => (
                <th key={c} className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#14161c]/60">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((r, i) => (
              <tr key={i} className="border-t border-[#14161c]/10">
                {r.map((cell, j) => (
                  <td key={j} className={`px-3 py-2 ${j === 0 ? "font-medium text-[#14161c]" : "text-[#14161c]/75"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProcessView({ chart }: { chart: Extract<Chart, { kind: "process" }> }) {
  return (
    <ol className="space-y-2">
      {chart.steps.map((s, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-[#C7F464]">{i + 1}</span>
          <span className="pt-0.5 text-[13.5px] leading-6 text-[#14161c]/80">{s}</span>
        </li>
      ))}
      <li className="pt-1 pl-9 text-[11px] font-semibold uppercase tracking-wider text-[#14161c]/40">↻ the cycle then repeats</li>
    </ol>
  );
}
