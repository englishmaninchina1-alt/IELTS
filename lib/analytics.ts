import type { D1 } from "./db";

/**
 * First-party site analytics.
 *
 * Every page view is stored in D1 with no raw IP address: visitors are counted
 * with a one-way hash of IP + user agent, so the dashboard can answer "how many
 * people" without keeping anything that identifies a person. Nothing is sent to
 * a third-party tracker, and the admin dashboard is the only reader.
 */

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS pageviews (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     ts TEXT NOT NULL DEFAULT (datetime('now')),
     path TEXT NOT NULL,
     referrer TEXT,
     ref_host TEXT NOT NULL DEFAULT 'direct',
     channel TEXT NOT NULL DEFAULT 'direct',
     utm_source TEXT,
     utm_medium TEXT,
     utm_campaign TEXT,
     country TEXT,
     region TEXT,
     city TEXT,
     device TEXT NOT NULL DEFAULT 'unknown',
     browser TEXT NOT NULL DEFAULT 'unknown',
     os TEXT NOT NULL DEFAULT 'unknown',
     visitor TEXT NOT NULL,
     session TEXT NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_pageviews_ts ON pageviews(ts)`,
  `CREATE INDEX IF NOT EXISTS idx_pageviews_visitor ON pageviews(visitor)`,
  `CREATE INDEX IF NOT EXISTS idx_pageviews_path ON pageviews(path)`,
  `CREATE INDEX IF NOT EXISTS idx_pageviews_host ON pageviews(ref_host)`,
];

let schemaReady: Promise<void> | null = null;

export async function ensureAnalyticsSchema(db: D1): Promise<void> {
  if (!schemaReady) {
    schemaReady = db
      .batch(SCHEMA.map((sql) => db.prepare(sql)))
      .then(() => undefined)
      .catch((error) => {
        schemaReady = null;
        throw error;
      });
  }
  return schemaReady;
}

const BOT =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pagespeed|monitor|uptime|curl|wget|python-requests|go-http-client|axios|node-fetch|preview/i;

export function looksLikeBot(userAgent: string): boolean {
  return !userAgent || BOT.test(userAgent);
}

export type Channel = "direct" | "internal" | "search" | "social" | "referral" | "paid" | "email" | "campaign";

const SEARCH_HOSTS =
  /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.[a-z.]+|yahoo\.com|yandex\.[a-z.]+|baidu\.com|ecosia\.org|brave\.com|startpage\.com|qwant\.com|ask\.com|naver\.com|seznam\.cz)$/i;

const SOCIAL_HOSTS =
  /(^|\.)(facebook\.com|m\.facebook\.com|instagram\.com|l\.instagram\.com|t\.co|twitter\.com|x\.com|linkedin\.com|lnkd\.in|reddit\.com|pinterest\.[a-z.]+|tiktok\.com|youtube\.com|youtu\.be|whatsapp\.com|t\.me|telegram\.org|snapchat\.com|quora\.com|threads\.net|medium\.com|discord\.com|discord\.gg)$/i;

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

type Attribution = { host: string; channel: Channel; utmSource: string | null; utmMedium: string | null; utmCampaign: string | null };

export function attribute(referrer: string, href: string, ownHost: string): Attribution {
  let utmSource: string | null = null;
  let utmMedium: string | null = null;
  let utmCampaign: string | null = null;
  try {
    const params = new URL(href).searchParams;
    utmSource = params.get("utm_source")?.trim().slice(0, 80) || null;
    utmMedium = params.get("utm_medium")?.trim().slice(0, 80) || null;
    utmCampaign = params.get("utm_campaign")?.trim().slice(0, 80) || null;
  } catch {
    /* relative hrefs are fine — no campaign data */
  }

  const refHost = hostOf(referrer);
  const own = ownHost.toLowerCase().replace(/^www\./, "");

  const campaignChannel = (): Channel | null => {
    const medium = (utmMedium ?? "").toLowerCase();
    if (!utmSource && !utmMedium) return null;
    if (/email|newsletter/.test(medium)) return "email";
    if (/cpc|ppc|paid|display|banner/.test(medium)) return "paid";
    if (/social/.test(medium)) return "social";
    return "campaign";
  };

  const byCampaign = campaignChannel();
  if (byCampaign) {
    return { host: refHost ?? "direct", channel: byCampaign, utmSource, utmMedium, utmCampaign };
  }

  if (!refHost) return { host: "direct", channel: "direct", utmSource, utmMedium, utmCampaign };
  if (refHost === own) return { host: "internal", channel: "internal", utmSource, utmMedium, utmCampaign };
  if (SEARCH_HOSTS.test(refHost)) return { host: refHost, channel: "search", utmSource, utmMedium, utmCampaign };
  if (SOCIAL_HOSTS.test(refHost)) return { host: refHost, channel: "social", utmSource, utmMedium, utmCampaign };
  return { host: refHost, channel: "referral", utmSource, utmMedium, utmCampaign };
}

function deviceOf(ua: string): string {
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|windows phone/i.test(ua)) return "mobile";
  if (/android/i.test(ua)) return "tablet";
  return "desktop";
}

function browserOf(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera mini|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|chromium|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

function osOf(ua: string): string {
  if (/windows nt/i.test(ua)) return "Windows";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/mac os x/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}

async function digest(value: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash))
    .slice(0, 10)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** A clean, same-site path. Never trust the browser to send something sensible. */
export function safePath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  const path = raw.split(/[?#]/)[0].slice(0, 300);
  if (path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/_next")) return null;
  return path || "/";
}

export type VisitInput = {
  path: string;
  href: string;
  referrer: string;
  userAgent: string;
  ip: string;
  sid: string;
  ownHost: string;
  country?: string | null;
  region?: string | null;
  city?: string | null;
};

export async function recordVisit(db: D1, input: VisitInput): Promise<boolean> {
  if (looksLikeBot(input.userAgent)) return false;
  await ensureAnalyticsSchema(db);

  const visitor = await digest(`${input.ip}|${input.userAgent}`);
  const session = await digest(`${input.sid}|${visitor}`);
  const { host, channel, utmSource, utmMedium, utmCampaign } = attribute(input.referrer, input.href, input.ownHost);
  const referrer = input.referrer ? input.referrer.slice(0, 500) : null;

  await db
    .prepare(
      `INSERT INTO pageviews
         (path, referrer, ref_host, channel, utm_source, utm_medium, utm_campaign, country, region, city, device, browser, os, visitor, session)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      input.path,
      referrer,
      host,
      channel,
      utmSource,
      utmMedium,
      utmCampaign,
      input.country || null,
      input.region || null,
      input.city || null,
      deviceOf(input.userAgent),
      browserOf(input.userAgent),
      osOf(input.userAgent),
      visitor,
      session
    )
    .run();

  // Keep the table bounded: drop anything older than six months, rarely.
  if (Math.random() < 0.02) {
    await db.prepare("DELETE FROM pageviews WHERE ts < datetime('now', '-180 days')").run();
  }
  return true;
}

export type Stats = {
  range: number;
  generatedAt: string;
  totals: { views: number; visitors: number; sessions: number; pagesPerVisitor: number };
  today: { views: number; visitors: number };
  singlePageSessions: number;
  series: { day: string; views: number; visitors: number }[];
  pages: { path: string; views: number; visitors: number }[];
  referrers: { host: string; channel: string; views: number; visitors: number }[];
  channels: { channel: string; views: number; visitors: number }[];
  countries: { country: string; views: number; visitors: number }[];
  devices: { device: string; views: number }[];
  browsers: { browser: string; views: number }[];
  hours: { hour: number; views: number }[];
  newVsReturning: { kind: string; visitors: number }[];
  recent: { ts: string; path: string; host: string; channel: string; country: string | null; device: string }[];
};

type TotalsRow = { views: number; visitors: number; sessions: number };
type TodayRow = { views: number; visitors: number };
type DayRow = { day: string; views: number; visitors: number };
type PageRow = { path: string; views: number; visitors: number };
type ReferrerRow = { host: string; channel: string; views: number; visitors: number };
type ChannelRow = { channel: string; views: number; visitors: number };
type CountryRow = { country: string; views: number; visitors: number };
type DeviceRow = { device: string; views: number };
type BrowserRow = { browser: string; views: number };
type HourRow = { hour: number; views: number };
type RecentRow = { ts: string; path: string; ref_host: string; channel: string; country: string | null; device: string };
type NewReturnRow = { kind: string; visitors: number };
type SessionRow = { sessions: number; single: number | null };

export async function getStats(db: D1, days: number): Promise<Stats> {
  await ensureAnalyticsSchema(db);
  const range = [7, 30, 90, 365].includes(days) ? days : 30;
  const mod = `-${range} days`;

  const totals = await db
    .prepare(
      "SELECT COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors, COUNT(DISTINCT session) AS sessions FROM pageviews WHERE ts >= datetime('now', ?)"
    )
    .bind(mod)
    .first<TotalsRow>();

  const today = await db
    .prepare("SELECT COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM pageviews WHERE substr(ts, 1, 10) = date('now')")
    .first<TodayRow>();

  const series = await db
    .prepare(
      "SELECT substr(ts, 1, 10) AS day, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY day ORDER BY day ASC"
    )
    .bind(mod)
    .all<DayRow>();

  const pages = await db
    .prepare(
      "SELECT path, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY path ORDER BY views DESC LIMIT 15"
    )
    .bind(mod)
    .all<PageRow>();

  const referrers = await db
    .prepare(
      "SELECT ref_host AS host, channel, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY ref_host ORDER BY views DESC LIMIT 15"
    )
    .bind(mod)
    .all<ReferrerRow>();

  const channels = await db
    .prepare(
      "SELECT channel, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY channel ORDER BY views DESC"
    )
    .bind(mod)
    .all<ChannelRow>();

  const countries = await db
    .prepare(
      "SELECT COALESCE(NULLIF(country, ''), 'Unknown') AS country, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY country ORDER BY views DESC LIMIT 12"
    )
    .bind(mod)
    .all<CountryRow>();

  const devices = await db
    .prepare("SELECT device, COUNT(*) AS views FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY device ORDER BY views DESC")
    .bind(mod)
    .all<DeviceRow>();

  const browsers = await db
    .prepare("SELECT browser, COUNT(*) AS views FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY browser ORDER BY views DESC LIMIT 8")
    .bind(mod)
    .all<BrowserRow>();

  const hours = await db
    .prepare(
      "SELECT CAST(substr(ts, 12, 2) AS INTEGER) AS hour, COUNT(*) AS views FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY hour ORDER BY hour ASC"
    )
    .bind(mod)
    .all<HourRow>();

  const newVsReturning = await db
    .prepare(
      "SELECT CASE WHEN v = 1 THEN 'new' ELSE 'returning' END AS kind, COUNT(*) AS visitors FROM (SELECT visitor, COUNT(*) AS v FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY visitor) GROUP BY kind"
    )
    .bind(mod)
    .all<NewReturnRow>();

  const sessionRow = await db
    .prepare(
      "SELECT COUNT(*) AS sessions, SUM(CASE WHEN v = 1 THEN 1 ELSE 0 END) AS single FROM (SELECT session, COUNT(*) AS v FROM pageviews WHERE ts >= datetime('now', ?) GROUP BY session)"
    )
    .bind(mod)
    .first<SessionRow>();

  const recent = await db
    .prepare("SELECT ts, path, ref_host, channel, country, device FROM pageviews ORDER BY id DESC LIMIT 20")
    .all<RecentRow>();

  const views = totals?.views ?? 0;
  const visitors = totals?.visitors ?? 0;
  const sessions = sessionRow?.sessions ?? 0;

  return {
    range,
    generatedAt: new Date().toISOString(),
    totals: { views, visitors, sessions, pagesPerVisitor: visitors ? Math.round((views / visitors) * 10) / 10 : 0 },
    today: { views: today?.views ?? 0, visitors: today?.visitors ?? 0 },
    singlePageSessions: sessions ? Math.round(((sessionRow?.single ?? 0) / sessions) * 100) : 0,
    series: series.results,
    pages: pages.results,
    referrers: referrers.results,
    channels: channels.results,
    countries: countries.results,
    devices: devices.results,
    browsers: browsers.results,
    hours: hours.results,
    newVsReturning: newVsReturning.results,
    recent: recent.results.map((r) => ({
      ts: r.ts,
      path: r.path,
      host: r.ref_host,
      channel: r.channel,
      country: r.country,
      device: r.device,
    })),
  };
}
