import { detectTopic, buildEssay, buildSpeakingAnswer } from "@/lib/coach";
import { completeChat } from "@/lib/ai";

export const runtime = "nodejs";

const WRITING_SYSTEM = `You are an experienced IELTS examiner and tutor writing model answers at Band 8-9.
Rules:
- British spelling. Formal academic register. No contractions, no rhetorical questions.
- Answer every part of the question. State a clear position in the introduction.
- Four paragraphs: introduction, two developed body paragraphs, conclusion.
- Each body paragraph: claim, explanation of the mechanism, a specific example, and a consequence.
- Include one concession and rebut it.
- 250-320 words. Return only the essay, no headings, no commentary.`;

const SPEAKING_SYSTEM = `You are an experienced IELTS speaking examiner and tutor producing Band 8-9 spoken answers.
Rules:
- British English, natural spoken register: contractions are expected, slang is not.
- First person, conversational, with clear signposting and one or two natural fillers at most.
- Cover every bullet on the cue card, and end with the explanation the card asks for.
- Vary sentence length; use one idiom or collocation per answer, never a list of them.
- 180-260 words, which is roughly the right length for two minutes at speaking pace.
- Return only the monologue, no headings, no stage directions, no commentary.`;

export async function POST(req: Request) {
  let body: {
    mode?: "writing" | "speaking";
    prompt?: string;
    position?: string;
    ideas?: { claim: string; because: string; example: string; soWhat?: string }[];
    counter?: string;
    notes?: string[];
    feeling?: string;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = (body.prompt ?? "").slice(0, 1200);
  if (!prompt.trim()) return Response.json({ error: "A question or cue card is required." }, { status: 400 });

  const isSpeaking = body.mode === "speaking";
  const userMsg = isSpeaking
    ? `Cue card: ${prompt}\nStudent's own notes:\n${(body.notes ?? []).map((n) => `- ${n}`).join("\n") || "- none given"}\nEmotion to convey: ${
        body.feeling ?? "not given"
      }\n\nWrite the answer as a spoken monologue.`
    : `Question: ${prompt}\nStudent's position: ${body.position ?? "not stated"}\nStudent's ideas:\n${
        (body.ideas ?? []).map((i, n) => `${n + 1}. claim: ${i.claim} | reason: ${i.because} | example: ${i.example}`).join("\n") ||
        "none given"
      }\nCounter-argument to acknowledge: ${body.counter ?? "none given"}\n\nWrite the essay, incorporating the student's own ideas where they are usable.`;

  const completion = await completeChat({
    messages: [
      { role: "system", content: isSpeaking ? SPEAKING_SYSTEM : WRITING_SYSTEM },
      { role: "user", content: userMsg },
    ],
    temperature: 0.75,
    maxTokens: 1000,
  });

  if (completion.ok && completion.text.length > 120) {
    return Response.json({
      source: "openai",
      model: completion.model,
      text: completion.text,
      words: completion.text.split(/\s+/).filter(Boolean).length,
      notes: ["Written by OpenAI. Check it against the question before trusting it — models drift off-task."],
    });
  }

  if (!completion.ok) console.error("[coach]", completion.reason);

  const local = isSpeaking
    ? buildSpeakingAnswer({ prompt, notes: body.notes ?? [], feeling: body.feeling ?? "" })
    : buildEssay({
        prompt,
        position: body.position ?? detectTopic(prompt).positions[0],
        ideas: body.ideas ?? [],
        counter: body.counter ?? detectTopic(prompt).counter,
        topicName: detectTopic(prompt).name,
      });

  return Response.json({
    source: "local",
    text: local.full,
    words: local.words,
    notes: local.notes,
    vocabulary: local.vocabulary,
    linkers: local.linkers,
    notice: completion.ok
      ? "The model returned too short a draft, so this came from the built-in coach engine."
      : "The coach could not reach OpenAI, so this draft came from the built-in coach engine.",
  });
}
