import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { getStats } from "@/lib/analytics";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HEADERS = { "Cache-Control": "private, no-store" };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: HEADERS });
}

export async function GET(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return json({ error: gate.message }, gate.status);

  const db = await getDb();
  if (!db) return json({ error: "The database binding is unavailable, so no traffic can be reported." }, 503);

  const days = Number(new URL(request.url).searchParams.get("days") ?? 30);
  try {
    return json(await getStats(db, Number.isFinite(days) ? days : 30));
  } catch (error) {
    console.error("[stats]", error instanceof Error ? error.message : error);
    return json({ error: "The stats query failed." }, 500);
  }
}
