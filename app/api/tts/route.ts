import { MAX_NARRATION_CHARS, narrate } from "@/lib/tts";

export const runtime = "nodejs";

/**
 * Narration endpoint. Returns audio bytes so the ElevenLabs key stays on the server.
 * Text is capped, which also bounds the cost of a single call.
 */
export async function POST(req: Request) {
  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = (body.text ?? "").replace(/\s+/g, " ").trim();
  if (!text) return Response.json({ error: "Some text is required." }, { status: 400 });

  const clipped = text.length > MAX_NARRATION_CHARS ? `${text.slice(0, MAX_NARRATION_CHARS)}…` : text;
  const result = await narrate(clipped);

  if (!result.ok) {
    console.error("[tts]", result.reason);
    return Response.json(
      { error: "Narration is temporarily unavailable.", upstream: result.upstream },
      { status: result.status }
    );
  }

  return new Response(result.audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(result.audio.byteLength),
      "Cache-Control": "private, max-age=86400",
      "X-Voice-Source": result.source,
    },
  });
}
