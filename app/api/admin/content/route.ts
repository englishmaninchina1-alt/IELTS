import { isSameOriginRequest } from "@freebuff/auth";
import { requireAdmin } from "@/lib/admin";
import {
  createAnnouncement,
  createPrompt,
  deleteAnnouncement,
  deletePrompt,
  getDb,
  listAnnouncements,
  listPrompts,
  updateAnnouncement,
  updatePrompt,
  type PromptKind,
  type Tone,
} from "@/lib/db";
import { envValue } from "@/lib/site-env";

export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store" };
const TONES: Tone[] = ["info", "success", "warning"];
const KINDS: PromptKind[] = ["Opinion", "Discussion", "Problem–solution", "Two-part", "Advantages"];

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: HEADERS });
}

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function safeHref(value: unknown): string | null {
  const href = text(value, 500);
  if (!href) return null;
  if (href.startsWith("/") || /^https?:\/\//i.test(href)) return href;
  return null;
}

function list(value: unknown, max: number, each = 400): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => text(v, each)).filter(Boolean).slice(0, max);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((v) => v.trim().slice(0, each))
      .filter(Boolean)
      .slice(0, max);
  }
  return [];
}

async function payload(db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  const [announcements, prompts] = await Promise.all([listAnnouncements(db), listPrompts(db)]);
  return { announcements, prompts };
}

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return json({ error: gate.message }, gate.status);
  const db = await getDb();
  if (!db) return json({ error: "The database binding is unavailable." }, 503);
  return json(await payload(db));
}

export async function POST(request: Request) {
  const origin = (await envValue("APP_ORIGIN")) ?? "";
  if (!isSameOriginRequest(request, origin)) return json({ error: "Forbidden" }, 403);

  const gate = await requireAdmin();
  if (!gate.ok) return json({ error: gate.message }, gate.status);

  const db = await getDb();
  if (!db) return json({ error: "The database binding is unavailable." }, 503);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const action = text(body.action, 40);
  const id = Number(body.id);

  switch (action) {
    case "announcement.create": {
      const message = text(body.message, 300);
      if (!message) return json({ error: "A message is required." }, 400);
      const tone = TONES.includes(body.tone as Tone) ? (body.tone as Tone) : "info";
      const newId = await createAnnouncement(db, {
        message,
        linkLabel: text(body.linkLabel, 60) || null,
        linkHref: safeHref(body.linkHref),
        tone,
        active: body.active !== false,
      });
      return json({ ok: true, id: newId, ...(await payload(db)) });
    }
    case "announcement.update": {
      if (!Number.isInteger(id) || id <= 0) return json({ error: "A valid id is required." }, 400);
      await updateAnnouncement(db, id, {
        active: typeof body.active === "boolean" ? body.active : undefined,
        message: typeof body.message === "string" ? text(body.message, 300) || undefined : undefined,
      });
      return json({ ok: true, ...(await payload(db)) });
    }
    case "announcement.delete": {
      if (!Number.isInteger(id) || id <= 0) return json({ error: "A valid id is required." }, 400);
      await deleteAnnouncement(db, id);
      return json({ ok: true, ...(await payload(db)) });
    }
    case "prompt.create": {
      const title = text(body.title, 120);
      const topic = text(body.topic, 60);
      const question = text(body.question, 1200);
      if (!title || !topic || !question) return json({ error: "Title, topic and question are required." }, 400);
      const kind = KINDS.includes(body.kind as PromptKind) ? (body.kind as PromptKind) : "Opinion";
      const newId = await createPrompt(db, {
        title,
        topic,
        kind,
        question,
        outline: list(body.outline, 8),
        vocabulary: list(body.vocabulary, 12, 80),
        active: body.active !== false,
      });
      return json({ ok: true, id: newId, ...(await payload(db)) });
    }
    case "prompt.update": {
      if (!Number.isInteger(id) || id <= 0) return json({ error: "A valid id is required." }, 400);
      await updatePrompt(db, id, { active: body.active === true });
      return json({ ok: true, ...(await payload(db)) });
    }
    case "prompt.delete": {
      if (!Number.isInteger(id) || id <= 0) return json({ error: "A valid id is required." }, 400);
      await deletePrompt(db, id);
      return json({ ok: true, ...(await payload(db)) });
    }
    default:
      return json({ error: "Unknown action." }, 400);
  }
}
