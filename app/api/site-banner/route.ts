import { getDb, listAnnouncements } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    if (!db) return Response.json({ announcements: [] });
    const announcements = await listAnnouncements(db, true);
    return Response.json(
      { announcements },
      { headers: { "Cache-Control": "public, max-age=30" } }
    );
  } catch {
    // The banner is decoration: never break a page because it failed.
    return Response.json({ announcements: [] });
  }
}
