"use client";

import { useCallback, useEffect, useState } from "react";
import type { Stats } from "@/lib/analytics";

const RANGES: { days: number; label: string }[] = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "12 months" },
];

const CHANNEL_LABEL: Record<string, string> = {
  direct: "Direct",
  internal: "On-site navigation",
  search: "Search engines",
  social: "Social media",
  referral: "Referrals",
  paid: "Paid",
  email: "Email",
  campaign: "Campaign links",
};

const CHANNEL_COLOUR: Record<string, string> = {
  search: "#0E7490",
  direct: "#6E8F17",
  social: "#6D4AC4",
  referral: "#B8860B",
  paid: "#C2502A",
  email: "#2563EB",
  campaign: "#7C3AED",
  internal: "#94A3B8",
};

const nf = new Intl.NumberFormat("en-GB");
const n = (value: number | undefined) => nf.format(value ?? 0);

function countryName(code: string): string {
  if (!code || code === "Unknown") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function stamp(ts: string): string {
  const date = new Date(ts.includes("T") ? ts : `${ts.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return ts;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-ink/[0.03] px-3.5 py-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">{label}</div>
      <div className="mt-1 font-serif text-2xl leading-none text-ink">{value}</div>
      {sub && <div className="mt-1 text-[11px] leading-4 text-ink/45">{sub}</div>}
    </div>
  );
}

function Bar({ share, colour }: { share: number; colour: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(2, share))}%`, background: colour }} />
    </div>
  );
}

function TrendChart({ series }: { series: Stats["series"] }) {
  if (series.length === 0) return <p className="text-[12.5px] text-ink/45">No days recorded in this range yet.</p>;

  const W = 680;
  const H = 210;
  const pad = { l: 34, r: 10, t: 12, b: 26 };
  const max = Math.max(1, ...series.map((d) => Math.max(d.views, d.visitors)));
  const xFor = (i: number) => pad.l + (series.length === 1 ? (W - pad.l - pad.r) / 2 : ((W - pad.l - pad.r) * i) / (series.length - 1));
  const yFor = (v: number) => H - pad.b - ((H - pad.t - pad.b) * v) / max;
  const line = (key: "views" | "visitors") => series.map((d, i) => `${xFor(i)},${yFor(d[key])}`).join(" ");
  const step = Math.max(1, Math.ceil(series.length / 8));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Page views and visitors over time">
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={pad.l} x2={W - pad.r} y1={yFor(max * f)} y2={yFor(max * f)} stroke="rgba(20,22,28,0.12)" />
            <text x={pad.l - 6} y={yFor(max * f) + 3.5} textAnchor="end" fontSize={9} fill="rgba(20,22,28,0.45)">
              {Math.round(max * f)}
            </text>
          </g>
        ))}
        <polyline points={line("views")} fill="none" stroke="#0E7490" strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={line("visitors")} fill="none" stroke="#6E8F17" strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
        {series.map((d, i) =>
          i % step === 0 || i === series.length - 1 ? (
            <text key={d.day} x={xFor(i)} y={H - pad.b + 16} textAnchor="middle" fontSize={9} fill="rgba(20,22,28,0.6)">
              {d.day.slice(5)}
            </text>
          ) : null
        )}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-[11px] text-ink/60">
          <span className="h-2 w-2 rounded-sm" style={{ background: "#0E7490" }} /> Page views
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-ink/60">
          <span className="h-2 w-2 rounded-sm" style={{ background: "#6E8F17" }} /> Unique visitors
        </span>
      </div>
    </div>
  );
}

type Row = { label: string; note?: string; views: number; visitors?: number; colour?: string };

function RankList({ rows, empty, showVisitors = true }: { rows: Row[]; empty: string; showVisitors?: boolean }) {
  const max = Math.max(1, ...rows.map((r) => r.views));
  if (rows.length === 0) return <p className="text-[12.5px] text-ink/45">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={`${row.label}-${row.note ?? ""}`}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-[12.5px] font-medium text-ink/80">{row.label}</span>
            <span className="shrink-0 text-[11.5px] tabular-nums text-ink/45">
              {n(row.views)}
              {showVisitors && row.visitors !== undefined ? ` · ${n(row.visitors)} visitors` : ""}
            </span>
          </div>
          {row.note && <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.08em] text-ink/35">{row.note}</div>}
          <div className="mt-1">
            <Bar share={(row.views / max) * 100} colour={row.colour ?? "#0E7490"} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function StatsPanel() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (range: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/stats?days=${range}`, { cache: "no-store" });
      const data = (await res.json()) as Stats & { error?: string };
      if (!res.ok) {
        setError(data.error ?? `Could not load stats (${res.status}).`);
        setStats(null);
        return;
      }
      setStats(data);
    } catch {
      setError("Could not reach the server.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(days);
  }, [days, load]);

  const totals = stats?.totals;
  const newCount = stats?.newVsReturning.find((r) => r.kind === "new")?.visitors ?? 0;
  const returning = stats?.newVsReturning.find((r) => r.kind === "returning")?.visitors ?? 0;
  const totalChannelViews = Math.max(1, (stats?.channels ?? []).reduce((sum, c) => sum + c.views, 0));

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3 p-3.5">
        <div className="flex flex-wrap gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${
                days === r.days ? "bg-ink text-paper" : "border border-ink/15 text-ink/60 hover:bg-ink/5"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-ink/40">
            {loading ? "Loading…" : stats ? `Updated ${stamp(stats.generatedAt)} UTC` : "Not loaded"}
          </span>
          <button onClick={() => void load(days)} disabled={loading} className="btn-ghost !px-3 !py-1.5 !text-[11.5px]">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-coralDeep/30 bg-coral/10 px-4 py-3 text-[12.5px] text-coralDeep">{error}</p>
      )}

      {!error && stats && totals && totals.views === 0 && (
        <div className="card p-6">
          <h2 className="font-serif text-xl text-ink">No traffic recorded in this range yet</h2>
          <p className="mt-2 max-w-xl text-[12.5px] leading-6 text-ink/55">
            Tracking starts from the moment this feature was deployed. Views are recorded server-side on every page render, so
            real visitors appear within a minute of arriving. Try a wider range, or open the site in another tab and refresh.
          </p>
        </div>
      )}

      {!error && !stats && loading && <div className="card p-6 text-[12.5px] text-ink/45">Loading site stats…</div>}

      {!error && stats && totals && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Unique visitors" value={n(totals.visitors)} sub={`${n(newCount)} new · ${n(returning)} returning`} />
            <Kpi label="Page views" value={n(totals.views)} sub={`${totals.pagesPerVisitor} pages per visitor`} />
            <Kpi label="Sessions" value={n(totals.sessions)} sub={`${stats.singlePageSessions}% left after one page`} />
            <Kpi label="Today" value={n(stats.today.visitors)} sub={`${n(stats.today.views)} views so far (UTC)`} />
          </div>

          <section className="card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-xl text-ink">Traffic over time</h2>
              <span className="text-[11px] text-ink/40">Last {stats.range} days · UTC</span>
            </div>
            <div className="mt-3">
              <TrendChart series={stats.series} />
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card p-5">
              <h2 className="font-serif text-xl text-ink">Where visitors came from</h2>
              <p className="mt-1 text-[11.5px] text-ink/45">Referrer host of the visit that brought them in.</p>
              <div className="mt-3">
                <RankList
                  empty="No referrers yet — everyone so far arrived directly."
                  rows={(stats.referrers ?? []).map((r) => ({
                    label: r.host === "direct" ? "Direct / no referrer" : r.host === "internal" ? "Internal navigation" : r.host,
                    note: CHANNEL_LABEL[r.channel] ?? r.channel,
                    views: r.views,
                    visitors: r.visitors,
                    colour: CHANNEL_COLOUR[r.channel] ?? "#0E7490",
                  }))}
                />
              </div>
            </section>

            <section className="card p-5">
              <h2 className="font-serif text-xl text-ink">Top pages</h2>
              <p className="mt-1 text-[11.5px] text-ink/45">Most-read pages in this range.</p>
              <div className="mt-3">
                <RankList
                  empty="No pages recorded yet."
                  rows={stats.pages.map((p) => ({ label: p.path, views: p.views, visitors: p.visitors }))}
                />
              </div>
            </section>
          </div>

          <section className="card p-5">
            <h2 className="font-serif text-xl text-ink">Traffic sources</h2>
            <p className="mt-1 text-[11.5px] text-ink/45">Views grouped by how the visitor found the page. Campaign links use their UTM tags.</p>
            <div className="mt-4 space-y-3">
              {(stats.channels ?? []).length === 0 && <p className="text-[12.5px] text-ink/45">No traffic yet.</p>}
              {(stats.channels ?? []).map((c) => (
                <div key={c.channel}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12.5px] font-medium text-ink/80">{CHANNEL_LABEL[c.channel] ?? c.channel}</span>
                    <span className="text-[11.5px] tabular-nums text-ink/45">
                      {n(c.views)} views · {Math.round((c.views / totalChannelViews) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1">
                    <Bar share={(c.views / totalChannelViews) * 100} colour={CHANNEL_COLOUR[c.channel] ?? "#94A3B8"} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card p-5">
              <h2 className="font-serif text-xl text-ink">Countries</h2>
              <p className="mt-1 text-[11.5px] text-ink/45">From the visitor's network location, not a stored IP.</p>
              <div className="mt-3">
                <RankList
                  empty="No country data yet."
                  rows={stats.countries.map((c) => ({ label: countryName(c.country), views: c.views, visitors: c.visitors }))}
                />
              </div>
            </section>

            <section className="card p-5">
              <h2 className="font-serif text-xl text-ink">Devices &amp; browsers</h2>
              <p className="mt-1 text-[11.5px] text-ink/45">Useful for deciding what to design for first.</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <RankList
                  empty="No device data yet."
                  showVisitors={false}
                  rows={stats.devices.map((d) => ({ label: d.device, views: d.views, colour: "#6E8F17" }))}
                />
                <RankList
                  empty="No browser data yet."
                  showVisitors={false}
                  rows={stats.browsers.map((b) => ({ label: b.browser, views: b.views, colour: "#6D4AC4" }))}
                />
              </div>
            </section>
          </div>

          <section className="card p-5">
            <h2 className="font-serif text-xl text-ink">Busiest hours</h2>
            <p className="mt-1 text-[11.5px] text-ink/45">Page views by hour of day, UTC — use this to time new content and announcements.</p>
            <HourStrip hours={stats.hours} />
          </section>

          <section className="card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-xl text-ink">Recent visits</h2>
              <span className="text-[11px] text-ink/40">Latest 20 · times UTC</span>
            </div>
            {stats.recent.length === 0 ? (
              <p className="mt-3 text-[12.5px] text-ink/45">Nothing recorded yet.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-left text-[12px]">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/40">
                      <th className="py-1.5 pr-3 font-bold">When</th>
                      <th className="py-1.5 pr-3 font-bold">Page</th>
                      <th className="py-1.5 pr-3 font-bold">Came from</th>
                      <th className="py-1.5 pr-3 font-bold">Country</th>
                      <th className="py-1.5 font-bold">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent.map((visit, i) => (
                      <tr key={`${visit.ts}-${i}`} className="border-t border-ink/10 text-ink/70">
                        <td className="whitespace-nowrap py-1.5 pr-3 tabular-nums text-ink/50">{stamp(visit.ts)}</td>
                        <td className="py-1.5 pr-3 font-medium text-ink/80">{visit.path}</td>
                        <td className="py-1.5 pr-3">
                          {visit.host === "direct" ? "Direct" : visit.host === "internal" ? "On-site" : visit.host}
                        </td>
                        <td className="py-1.5 pr-3">{visit.country ? countryName(visit.country) : "—"}</td>
                        <td className="py-1.5 capitalize">{visit.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function HourStrip({ hours }: { hours: { hour: number; views: number }[] }) {
  const map = new Map(hours.map((h) => [h.hour, h.views]));
  const values = Array.from({ length: 24 }, (_, h) => map.get(h) ?? 0);
  const max = Math.max(1, ...values);
  return (
    <div className="mt-3">
      <div className="flex h-24 items-end gap-1">
        {values.map((v, h) => (
          <div key={h} className="group flex-1" title={`${String(h).padStart(2, "0")}:00 — ${n(v)} views`}>
            <div
              className="w-full rounded-t-sm bg-teal/70 transition group-hover:bg-teal"
              style={{ height: `${Math.max(3, (v / max) * 88)}px` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-ink/35">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>23</span>
      </div>
    </div>
  );
}
