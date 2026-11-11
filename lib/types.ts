export type QuestionKind = "tfng" | "ynng" | "mcq" | "heading" | "gap" | "short" | "multi";

export type Question = {
  id: string;
  number: number;
  text: string;
  options?: string[];
  answer: string;
  accept?: string[];
  explanation: string;
};

export type QuestionGroup = {
  id: string;
  instruction: string;
  kind: QuestionKind;
  sharedOptions?: string[];
  questions: Question[];
};

export type Passage = {
  id: string;
  title: string;
  subtitle: string;
  paragraphs: { label: string; text: string }[];
  groups: QuestionGroup[];
  topic: string;
  difficulty: "Foundation" | "Standard" | "Advanced";
  timeMinutes: number;
};

export type ReadingTest = {
  id: string;
  title: string;
  blurb: string;
  topics: string[];
  passages: Passage[];
};

export type ListeningSection = {
  id: string;
  number: number;
  title: string;
  context: string;
  /** Spoken script. Read aloud by the browser's speech synthesiser. */
  script: { speaker: string; text: string }[];
  voice: "en-GB" | "en-US" | "en-AU";
  groups: QuestionGroup[];
};

export type ListeningTest = {
  id: string;
  title: string;
  blurb: string;
  sections: ListeningSection[];
};

export function totalQuestions(groups: QuestionGroup[]): number {
  return groups.reduce((n, g) => n + g.questions.length, 0);
}

export function normaliseAnswer(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,;:!?'"()]/g, "")
    .replace(/^(the|a|an)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isCorrect(q: Question, given: string | undefined): boolean {
  if (!given) return false;
  const g = normaliseAnswer(given);
  if (normaliseAnswer(q.answer) === g) return true;
  return (q.accept ?? []).some((a) => normaliseAnswer(a) === g);
}
