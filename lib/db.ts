import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * The small slice of the D1 API this app uses. Typed locally so the project
 * does not need @cloudflare/workers-types.
 */
type Statement = {
  bind: (...values: unknown[]) => Statement;
  first: <T>() => Promise<T | null>;
  all: <T>() => Promise<{ results: T[] }>;
  run: () => Promise<{ success: boolean }>;
};

export type D1 = {
  prepare: (sql: string) => Statement;
  batch: (statements: Statement[]) => Promise<unknown>;
};

export function getDbFromEnv(env: unknown): D1 | null {
  const db = (env as Record<string, unknown> | null)?.DB;
  return db && typeof (db as D1).prepare === "function" ? (db as D1) : null;
}

export async function getDb(): Promise<D1 | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return getDbFromEnv(env);
  } catch (error) {
    console.error("[db] binding unavailable:", error instanceof Error ? error.message : error);
    return null;
  }
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS announcements (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     message TEXT NOT NULL,
     link_label TEXT,
     link_href TEXT,
     tone TEXT NOT NULL DEFAULT 'info',
     active INTEGER NOT NULL DEFAULT 1,
     created_at TEXT NOT NULL DEFAULT (datetime('now')),
     updated_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,
  `CREATE TABLE IF NOT EXISTS writing_prompts (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     title TEXT NOT NULL,
     topic TEXT NOT NULL,
     kind TEXT NOT NULL DEFAULT 'Opinion',
     question TEXT NOT NULL,
     outline TEXT NOT NULL DEFAULT '[]',
     vocabulary TEXT NOT NULL DEFAULT '[]',
     active INTEGER NOT NULL DEFAULT 1,
     created_at TEXT NOT NULL DEFAULT (datetime('now')),
     updated_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,
  `CREATE TABLE IF NOT EXISTS student_progress (
     user_sub TEXT PRIMARY KEY,
     email TEXT,
     data TEXT NOT NULL,
     updated_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,
];

let schemaReady: Promise<void> | null = null;

/** Idempotent, run once per isolate before the first query. */
export async function ensureSchema(db: D1): Promise<void> {
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

export type Tone = "info" | "success" | "warning";

export type Announcement = {
  id: number;
  message: string;
  linkLabel: string | null;
  linkHref: string | null;
  tone: Tone;
  active: boolean;
  updatedAt: string;
};

export type PromptKind = "Opinion" | "Discussion" | "Problem–solution" | "Two-part" | "Advantages";

export type Prompt = {
  id: number;
  title: string;
  topic: string;
  kind: PromptKind;
  question: string;
  outline: string[];
  vocabulary: string[];
  active: boolean;
  updatedAt: string;
};

type AnnouncementRow = {
  id: number;
  message: string;
  link_label: string | null;
  link_href: string | null;
  tone: string;
  active: number;
  updated_at: string;
};

type PromptRow = {
  id: number;
  title: string;
  topic: string;
  kind: string;
  question: string;
  outline: string;
  vocabulary: string;
  active: number;
  updated_at: string;
};

const TONES: Tone[] = ["info", "success", "warning"];
const KINDS: PromptKind[] = ["Opinion", "Discussion", "Problem–solution", "Two-part", "Advantages"];

function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function toAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    message: row.message,
    linkLabel: row.link_label,
    linkHref: row.link_href,
    tone: (TONES.includes(row.tone as Tone) ? row.tone : "info") as Tone,
    active: row.active === 1,
    updatedAt: row.updated_at,
  };
}

function toPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    title: row.title,
    topic: row.topic,
    kind: (KINDS.includes(row.kind as PromptKind) ? row.kind : "Opinion") as PromptKind,
    question: row.question,
    outline: parseList(row.outline),
    vocabulary: parseList(row.vocabulary),
    active: row.active === 1,
    updatedAt: row.updated_at,
  };
}

export async function listAnnouncements(db: D1, activeOnly = false): Promise<Announcement[]> {
  await ensureSchema(db);
  const sql = activeOnly
    ? "SELECT * FROM announcements WHERE active = 1 ORDER BY updated_at DESC, id DESC LIMIT 20"
    : "SELECT * FROM announcements ORDER BY updated_at DESC, id DESC LIMIT 50";
  const { results } = await db.prepare(sql).all<AnnouncementRow>();
  return results.map(toAnnouncement);
}

export async function createAnnouncement(
  db: D1,
  input: { message: string; linkLabel?: string | null; linkHref?: string | null; tone?: Tone; active?: boolean }
): Promise<number> {
  await ensureSchema(db);
  const row = await db
    .prepare(
      "INSERT INTO announcements (message, link_label, link_href, tone, active) VALUES (?, ?, ?, ?, ?) RETURNING id"
    )
    .bind(
      input.message,
      input.linkLabel ?? null,
      input.linkHref ?? null,
      TONES.includes(input.tone ?? "info") ? input.tone ?? "info" : "info",
      input.active === false ? 0 : 1
    )
    .first<{ id: number }>();
  return row?.id ?? 0;
}

export async function updateAnnouncement(
  db: D1,
  id: number,
  patch: { message?: string; linkLabel?: string | null; linkHref?: string | null; tone?: Tone; active?: boolean }
): Promise<void> {
  await ensureSchema(db);
  const sets: string[] = [];
  const values: unknown[] = [];
  if (typeof patch.message === "string") {
    sets.push("message = ?");
    values.push(patch.message);
  }
  if (patch.linkLabel !== undefined) {
    sets.push("link_label = ?");
    values.push(patch.linkLabel || null);
  }
  if (patch.linkHref !== undefined) {
    sets.push("link_href = ?");
    values.push(patch.linkHref || null);
  }
  if (patch.tone && TONES.includes(patch.tone)) {
    sets.push("tone = ?");
    values.push(patch.tone);
  }
  if (typeof patch.active === "boolean") {
    sets.push("active = ?");
    values.push(patch.active ? 1 : 0);
  }
  if (!sets.length) return;
  sets.push("updated_at = datetime('now')");
  await db.prepare(`UPDATE announcements SET ${sets.join(", ")} WHERE id = ?`).bind(...values, id).run();
}

export async function deleteAnnouncement(db: D1, id: number): Promise<void> {
  await ensureSchema(db);
  await db.prepare("DELETE FROM announcements WHERE id = ?").bind(id).run();
}

export async function listPrompts(db: D1, activeOnly = false): Promise<Prompt[]> {
  await ensureSchema(db);
  const sql = activeOnly
    ? "SELECT * FROM writing_prompts WHERE active = 1 ORDER BY updated_at DESC, id DESC LIMIT 60"
    : "SELECT * FROM writing_prompts ORDER BY updated_at DESC, id DESC LIMIT 100";
  const { results } = await db.prepare(sql).all<PromptRow>();
  return results.map(toPrompt);
}

export async function createPrompt(
  db: D1,
  input: { title: string; topic: string; kind?: PromptKind; question: string; outline?: string[]; vocabulary?: string[]; active?: boolean }
): Promise<number> {
  await ensureSchema(db);
  const row = await db
    .prepare(
      "INSERT INTO writing_prompts (title, topic, kind, question, outline, vocabulary, active) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id"
    )
    .bind(
      input.title,
      input.topic,
      KINDS.includes(input.kind ?? "Opinion") ? input.kind ?? "Opinion" : "Opinion",
      input.question,
      JSON.stringify(input.outline ?? []),
      JSON.stringify(input.vocabulary ?? []),
      input.active === false ? 0 : 1
    )
    .first<{ id: number }>();
  return row?.id ?? 0;
}

export async function updatePrompt(db: D1, id: number, patch: { active?: boolean }): Promise<void> {
  await ensureSchema(db);
  if (typeof patch.active !== "boolean") return;
  await db
    .prepare("UPDATE writing_prompts SET active = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(patch.active ? 1 : 0, id)
    .run();
}

export async function deletePrompt(db: D1, id: number): Promise<void> {
  await ensureSchema(db);
  await db.prepare("DELETE FROM writing_prompts WHERE id = ?").bind(id).run();
}
