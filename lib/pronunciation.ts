import type { PronWord } from "@/data/pronunciation";

/**
 * Scores a recording by comparing what the speech model heard with the target
 * word. This measures intelligibility — whether a listener would recognise the
 * word — not how "British" the accent sounds.
 */

export type PronScore = {
  score: number;
  heard: string;
  verdict: string;
  feedback: string[];
};

const clean = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

function similarity(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  if (!longest) return 0;
  return 1 - levenshtein(a, b) / longest;
}

export function scorePronunciation(word: PronWord, transcript: string): PronScore {
  const target = clean(word.word);
  const heardRaw = (transcript ?? "").replace(/\s+/g, " ").trim();
  const heard = clean(heardRaw);

  if (!heard) {
    return {
      score: 0,
      heard: "",
      verdict: "We didn't catch any speech in that recording.",
      feedback: [
        "Try again, saying the word once, clearly, about a hand's width from the microphone.",
        "Check that the right microphone is selected and that recording isn't muted.",
      ],
    };
  }

  const tokens = heard.split(" ");
  let best = similarity(target, heard);
  for (const token of tokens) best = Math.max(best, similarity(target, token));

  const exact = heard === target || tokens.includes(target);
  const score = exact ? 100 : Math.max(0, Math.min(96, Math.round(best * 100)));

  let verdict: string;
  if (score >= 92) verdict = "Clear — a listener would understand this word immediately.";
  else if (score >= 75) verdict = "Recognisable, but at least one sound drifted from the British shape.";
  else if (score >= 50) verdict = "Only partly recognised — the word came out with the wrong shape.";
  else verdict = "Not recognised this time. Slow down and work through the respelling beat by beat.";

  const feedback: string[] = [word.focus];

  if (!exact && heardRaw) {
    feedback.push(`The scorer heard “${heardRaw.slice(0, 70)}”. Compare that with ${word.respell}.`);
  }
  if (score < 75) {
    feedback.push("Say the word in slow motion first — one beat at a time — then join it up at normal speed.");
    feedback.push("Record again straight afterwards. Muscle memory builds faster when the slow and fast versions are back to back.");
  } else if (score < 100) {
    feedback.push("Keep the stressed beat long and let the unstressed beats fall away — that contrast is what sounds natural.");
  } else {
    feedback.push("Now use it in a full sentence so the word keeps its shape inside connected speech.");
  }

  return { score, heard: heardRaw.slice(0, 140), verdict, feedback };
}
