import { envValue } from "./site-env";

/**
 * Server-side OpenAI client.
 *
 * The key lives in the Sites secret `OPENAI` and is read through the Worker env,
 * never shipped to the browser. Plain `next dev` falls back to .env.local.
 */

const ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

export type ChatMessage = { role: "system" | "user"; content: string };

export type CompletionResult = { ok: true; text: string; model: string } | { ok: false; reason: string };

export async function getOpenAIKey(): Promise<string | undefined> {
  return envValue("OPENAI");
}

export async function completeChat(input: {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}): Promise<CompletionResult> {
  const key = await getOpenAIKey();
  if (!key) return { ok: false, reason: "OPENAI is not configured" };
  const model = (await envValue("COACH_MODEL")) ?? DEFAULT_MODEL;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: input.temperature ?? 0.7,
        max_tokens: input.maxTokens ?? 900,
        messages: input.messages,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, reason: `OpenAI ${res.status}: ${detail.slice(0, 200)}` };
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return { ok: false, reason: "OpenAI returned an empty completion" };
    return { ok: true, text, model };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "OpenAI request failed" };
  }
}
