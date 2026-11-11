import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isSameOriginRequest } from "@freebuff/auth";
import { getDb } from "@/lib/db";
import { recordVisit, safePath } from "@/lib/analytics";
import { envValue } from "@/lib/site-env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Page-view beacon. Public by design: it records a view, nothing else.
 * The response is always empty, so a blocked or failed beacon never affects
 * what a student sees.
 */
function noContent(status = 204) {
  return new Response(null, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = (await envValue("APP_ORIGIN")) ?? "";
  if (request.headers.get("origin") && !isSameOriginRequest(request, origin)) {
    return new Response(null, { status: 403 });
  }

  let body: { path?: unknown; href?: unknown; referrer?: unknown; sid?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return noContent(400);
  }

  const path = safePath(body.path);
  if (!path) return noContent();

  const db = await getDb();
  if (!db) return noContent();

  let cf: Record<string, unknown> | null = null;
  try {
    const context = (await getCloudflareContext({ async: true })) as unknown as { cf?: Record<string, unknown> };
    cf = context.cf ?? null;
  } catch {
    /* not running inside workerd */
  }

  const requestUrl = new URL(request.url);
  const forwarded = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0].trim();
  const sid = typeof body.sid === "string" ? body.sid.slice(0, 64) : "";
  const href = typeof body.href === "string" ? body.href.slice(0, 2000) : requestUrl.toString();
  const referrer = typeof body.referrer === "string" ? body.referrer : "";

  try {
    await recordVisit(db, {
      path,
      href,
      referrer,
      userAgent: request.headers.get("user-agent") ?? "",
      ip: ip || "unknown",
      sid: sid || request.headers.get("user-agent")?.slice(0, 24) || "unknown",
      ownHost: requestUrl.hostname,
      country: (cf?.country as string | undefined) ?? request.headers.get("cf-ipcountry"),
      region: (cf?.region as string | undefined) ?? null,
      city: (cf?.city as string | undefined) ?? null,
    });
  } catch (error) {
    console.error("[track]", error instanceof Error ? error.message : error);
  }

  return noContent();
}
