import { getDb, listPrompts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    if (!db) return Response.json({ prompts: [] });
    const prompts = await listPrompts(db, true);
    return Response.json(
      {
        prompts: prompts.map((p) => ({
          id: `db-${p.id}`,
          title: p.title,
          topic: p.topic,
          kind: p.kind,
          question: p.question,
          outline: p.outline,
          ideas: [],
          vocabulary: p.vocabulary,
          model: "",
        })),
      },
      { headers: { "Cache-Control": "public, max-age=60" } }
    );
  } catch {
    return Response.json({ prompts: [] });
  }
}
