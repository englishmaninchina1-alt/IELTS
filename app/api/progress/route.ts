import { isSameOriginRequest } from "@freebuff/auth";
import { getDb } from "@/lib/db";
import { loadProgress, saveProgress } from "@/lib/progress-db";
import { sanitizeProfile } from "@/lib/progress-shape";
import { envValue } from "@/lib/site-env";
import { requireUser } from "@/lib/user";

export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store" };
const MAX_BYTES = 150_000;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: HEADERS });
}

export async function GET() {
  const gate = await requireUser();
  if (!gate.ok) return json({ error: gate.message }, gate.status);

  const db = await getDb();
  if (!db) return json({ error: "The database binding is unavailable." }, 503);

  const stored = await loadProgress(db, gate.user.sub);
  let profile = null;
  if (stored) {
    try {
      profile = sanitizeProfile(JSON.parse(stored.data));
    } catch {
      profile = null;
    }
  }
  return json({ profile, updatedAt: stored?.updatedAt ?? null });
}

export async function PUT(request: Request) {
  const origin = (await envValue("APP_ORIGIN")) ?? "";
  if (!isSameOriginRequest(request, origin)) return json({ error: "Forbidden" }, 403);

  const gate = await requireUser();
  if (!gate.ok) return json({ error: gate.message }, gate.status);

  const db = await getDb();
  if (!db) return json({ error: "The database binding is unavailable." }, 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const incoming = body && typeof body === "object" ? (body as { profile?: unknown }).profile : undefined;
  const profile = sanitizeProfile(incoming);
  if (!profile) return json({ error: "A profile object is required." }, 400);

  const data = JSON.stringify(profile);
  if (data.length > MAX_BYTES) return json({ error: "Saved progress is too large." }, 413);

  const updatedAt = await saveProgress(db, gate.user.sub, gate.user.email ?? null, data);
  return json({ ok: true, updatedAt, profile });
}
