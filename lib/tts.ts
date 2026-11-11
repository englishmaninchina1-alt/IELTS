import { envValue } from "./site-env";

/**
 * Narration.
 *
 * ElevenLabs is the preferred voice; the key lives in the Sites secret `ELEVEN`
 * and never reaches the browser because this route returns audio bytes.
 *
 * If that key is missing or the provider rejects it, we fall back to a keyless
 * British (en-GB) voice so the Listen buttons keep working. The fallback is
 * deliberately second choice: it is flatter than a premium voice, but it is
 * still British English and never leaves a student with a dead button.
 */

/** "George" — a warm, middle-aged British (English) voice from the ElevenLabs library. */
export const BRITISH_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const DEFAULT_MODEL = "eleven_multilingual_v2";

export const MAX_NARRATION_CHARS = 1200;

export type VoiceSource = "elevenlabs" | "google";

export type NarrationResult =
  | { ok: true; audio: ArrayBuffer; source: VoiceSource }
  | { ok: false; status: number; reason: string; upstream?: number };

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

/** Split into pieces the keyless endpoint accepts (it caps around 200 characters). */
function chunk(text: string, limit = 180): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let current = "";
  for (const word of words) {
    if (current && current.length + word.length + 1 > limit) {
      out.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) out.push(current);
  return out;
}

async function elevenLabs(text: string): Promise<NarrationResult> {
  const key = await envValue("ELEVEN");
  if (!key) return { ok: false, status: 503, reason: "ELEVEN is not configured" };

  const voiceId = (await envValue("ELEVEN_VOICE_ID")) ?? BRITISH_VOICE_ID;
  const modelId = (await envValue("ELEVEN_MODEL")) ?? DEFAULT_MODEL;

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.8,
            style: 0.15,
            use_speaker_boost: true,
          },
        }),
        signal: AbortSignal.timeout(45_000),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, status: 502, reason: `ElevenLabs ${res.status}: ${detail.slice(0, 200)}`, upstream: res.status };
    }

    return { ok: true, audio: await res.arrayBuffer(), source: "elevenlabs" };
  } catch (error) {
    return { ok: false, status: 502, reason: error instanceof Error ? error.message : "ElevenLabs request failed" };
  }
}

/** Keyless British voice. Returns concatenated MP3 frames, which browsers play as one clip. */
async function britishFallback(text: string): Promise<NarrationResult> {
  const parts = chunk(text);
  if (parts.length === 0) return { ok: false, status: 400, reason: "Nothing to narrate" };

  const buffers: Uint8Array[] = [];
  for (const part of parts) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-GB&client=tw-ob&q=${encodeURIComponent(part)}`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": BROWSER_UA, Accept: "audio/mpeg" },
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) {
        return { ok: false, status: 502, reason: `fallback voice ${res.status}`, upstream: res.status };
      }
      buffers.push(new Uint8Array(await res.arrayBuffer()));
    } catch (error) {
      return { ok: false, status: 502, reason: error instanceof Error ? error.message : "fallback voice failed" };
    }
  }

  const total = buffers.reduce((n, b) => n + b.byteLength, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const b of buffers) {
    merged.set(b, offset);
    offset += b.byteLength;
  }
  return { ok: true, audio: merged.buffer as ArrayBuffer, source: "google" };
}

export async function narrate(text: string): Promise<NarrationResult> {
  const primary = await elevenLabs(text);
  if (primary.ok) return primary;

  console.error("[tts] elevenlabs unavailable:", primary.reason);
  const fallback = await britishFallback(text);
  if (fallback.ok) return fallback;
  console.error("[tts] fallback unavailable:", fallback.reason);
  return { ok: false, status: 502, reason: fallback.reason };
}
