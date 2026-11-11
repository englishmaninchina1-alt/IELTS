import { findPronWord } from "@/data/pronunciation";
import { getOpenAIKey } from "@/lib/ai";
import { scorePronunciation } from "@/lib/pronunciation";

export const runtime = "nodejs";

const TRANSCRIBE_URL = "https://api.openai.com/v1/audio/transcriptions";
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Scores one spoken word. The recording is transcribed server-side with OpenAI
 * and compared with the target word, so the key never reaches the browser.
 */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Expected a multipart form with an audio recording." }, { status: 400 });
  }

  const word = findPronWord(String(form.get("word") ?? ""));
  if (!word) return Response.json({ error: "Choose one of the practice words." }, { status: 400 });

  const audio = form.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) {
    return Response.json({ error: "No recording was received." }, { status: 400 });
  }
  if (audio.size > MAX_BYTES) {
    return Response.json({ error: "That recording is too large. Try a shorter clip." }, { status: 413 });
  }

  const key = await getOpenAIKey();
  if (!key) return Response.json({ error: "Pronunciation scoring is not configured." }, { status: 503 });

  const body = new FormData();
  const ext = audio.type.includes("mp4")
    ? "mp4"
    : audio.type.includes("wav")
      ? "wav"
      : audio.type.includes("ogg")
        ? "ogg"
        : "webm";
  body.append("file", audio, `recording.${ext}`);
  body.append("model", "whisper-1");
  body.append("language", "en");
  body.append("response_format", "json");
  body.append("temperature", "0");

  let res: Response;
  try {
    res = await fetch(TRANSCRIBE_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body,
      signal: AbortSignal.timeout(60_000),
    });
  } catch (error) {
    console.error("[pronunciation] request failed", error instanceof Error ? error.message : error);
    return Response.json({ error: "Scoring is temporarily unavailable." }, { status: 502 });
  }

  if (!res.ok) {
    const detail = await res.text();
    console.error("[pronunciation] OpenAI", res.status, detail.slice(0, 200));
    return Response.json({ error: "Scoring is temporarily unavailable.", upstream: res.status }, { status: 502 });
  }

  const data = (await res.json()) as { text?: string };
  const result = scorePronunciation(word, data.text ?? "");

  return Response.json({
    ok: true,
    word: word.word,
    respell: word.respell,
    band: word.band,
    ...result,
  });
}
