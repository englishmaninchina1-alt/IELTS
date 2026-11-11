/**
 * IELTS band-score engine.
 *
 * Reading and Listening use the published raw-score conversion tables.
 * Writing and Speaking cannot be marked by a machine to examiner standard, so the
 * functions below produce a *rubric-based estimate* from measurable features of the
 * response (length, structure, range, accuracy signals). Every surface that shows
 * such a score labels it as an estimate and explains which criteria were measured.
 */

export type Skill = "reading" | "listening" | "writing" | "speaking";

export const READING_TABLE: Record<number, number> = {
  40: 9, 39: 9, 38: 8.5, 37: 8.5, 36: 8, 35: 8, 34: 7.5, 33: 7.5, 32: 7.5,
  31: 7, 30: 7, 29: 6.5, 28: 6.5, 27: 6.5, 26: 6, 25: 6, 24: 6, 23: 6,
  22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5, 18: 5, 17: 5, 16: 5, 15: 5,
  14: 4.5, 13: 4.5, 12: 4, 11: 4, 10: 4, 9: 3.5, 8: 3.5, 7: 3,
  6: 3, 5: 2.5, 4: 2.5, 3: 2, 2: 2, 1: 1, 0: 0,
};

export const LISTENING_TABLE: Record<number, number> = {
  40: 9, 39: 9, 38: 8.5, 37: 8.5, 36: 8, 35: 8, 34: 7.5, 33: 7.5, 32: 7.5,
  31: 7, 30: 7, 29: 6.5, 28: 6.5, 27: 6.5, 26: 6.5, 25: 6, 24: 6, 23: 6,
  22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5, 18: 5.5, 17: 5, 16: 5, 15: 5,
  14: 4.5, 13: 4.5, 12: 4, 11: 4, 10: 3.5, 9: 3.5, 8: 3.5, 7: 3,
  6: 3, 5: 2.5, 4: 2.5, 3: 2, 2: 2, 1: 1, 0: 0,
};

export function rawToBand(skill: "reading" | "listening", raw: number): number {
  const table = skill === "reading" ? READING_TABLE : LISTENING_TABLE;
  const clamped = Math.max(0, Math.min(40, Math.round(raw)));
  return table[clamped] ?? 0;
}

/** IELTS overall band = mean of the four skills, rounded to the nearest 0.5. */
export function overallBand(scores: number[]): number {
  const valid = scores.filter((s) => typeof s === "number" && s > 0);
  if (!valid.length) return 0;
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  return Math.round(mean * 2) / 2;
}

export function roundHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

export function bandLabel(band: number): string {
  if (band >= 8.5) return "Expert user";
  if (band >= 8) return "Very good user";
  if (band >= 7) return "Good user";
  if (band >= 6) return "Competent user";
  if (band >= 5) return "Modest user";
  if (band >= 4) return "Limited user";
  if (band >= 3) return "Extremely limited";
  return "Intermittent";
}

export const bandColour = (band: number) =>
  band >= 8 ? "text-limeDeep" : band >= 7 ? "text-tealDeep" : band >= 6 ? "text-[#8A6100]" : "text-coralDeep";

/* ------------------------------------------------------------------ *
 * Writing analysis
 * ------------------------------------------------------------------ */

export type WritingCriterion = {
  key: string;
  name: string;
  band: number;
  comment: string;
  positives: string[];
  improvements: string[];
};

const LINKING_WORDS = [
  "however", "moreover", "furthermore", "therefore", "consequently", "nevertheless",
  "for instance", "for example", "in addition", "although", "whereas", "while",
  "in contrast", "on the other hand", "as a result", "thus", "hence", "despite",
  "in spite of", "because", "since", "in other words", "that said", "admittedly",
  "ultimately", "in conclusion", "to sum up", "firstly", "secondly", "finally",
  "likewise", "similarly", "conversely", "meanwhile", "nonetheless", "thereby",
  "given that", "provided that", "in so far as", "notably", "crucially",
];

const COMPLEX_MARKERS = [
  "although", "though", "even though", "whereas", "while", "unless", "provided",
  "if", "because", "since", "as long as", "in order to", "so that", "despite",
  "in spite of", "which", "who", "whose", "where", "that ", "having ", "being ",
  "thereby", "not only", "rather than", "whose",
];

const FILLERS = ["very", "really", "a lot of", "lots of", "good", "bad", "thing", "things", "stuff", "big", "nice", "people say", "I think that"];

const ACADEMIC_LEXIS = [
  "significant", "substantial", "consequently", "phenomenon", "mitigate", "allocate",
  "infrastructure", "sustainable", "implement", "regulate", "incentive", "detrimental",
  "beneficial", "prevalent", "advocate", "constrain", "deteriorate", "facilitate",
  "undermine", "prioritise", "prioritize", "disparity", "resilience", "feasible",
  "scrutiny", "consensus", "proponent", "criterion", "implication", "trajectory",
  "unprecedented", "widespread", "arguably", "compelling", "marginal", "consolidate",
];

export type WritingAnalysis = {
  words: number;
  sentences: number;
  paragraphs: number;
  avgSentenceLength: number;
  linkingUsed: string[];
  complexCount: number;
  academicUsed: string[];
  typeTokenRatio: number;
  repeatedWords: { word: string; count: number }[];
  longSentences: number;
  criteria: WritingCriterion[];
  band: number;
  summary: string[];
};

const stripMd = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export function analyseWriting(
  text: string,
  opts: { task: 1 | 2; minWords: number; topicWords?: string[]; hasChart?: boolean }
): WritingAnalysis {
  const clean = stripMd(text);
  const wordsRaw = clean.split(/\s+/).filter((w) => /[a-zA-Z']/.test(w));
  const words = wordsRaw.length;
  const lower = clean.toLowerCase();

  const paragraphBlocks = text.split(/\n\s*\n|\r\n\s*\r\n/).map((p) => p.trim()).filter((p) => p.length > 40);
  const paragraphs = paragraphBlocks.length || (words > 0 ? 1 : 0);

  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length > 2);
  const sentenceCount = Math.max(sentences.length, 1);
  const wordCounts = sentences.map((s) => s.split(/\s+/).length);
  const avgSentenceLength = words / sentenceCount;
  const longSentences = wordCounts.filter((n) => n > 34).length;

  const linkingUsed = LINKING_WORDS.filter((l) => lower.includes(l));
  const complexCount = COMPLEX_MARKERS.filter((m) => lower.includes(m)).length;
  const academicUsed = ACADEMIC_LEXIS.filter((a) => lower.includes(a));
  const topicHit = (opts.topicWords ?? []).filter((t) => lower.includes(t.toLowerCase())).length;

  const freq = new Map<string, number>();
  for (const w of wordsRaw.map((w) => w.toLowerCase().replace(/[^a-z']/g, ""))) {
    if (w.length < 5 || ["which", "there", "their", "these", "those", "would", "could", "should", "about", "other", "because", "people"].includes(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const repeatedWords = [...freq.entries()]
    .filter(([, c]) => c >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({ word, count }));

  const unique = new Set(wordsRaw.map((w) => w.toLowerCase().replace(/[^a-z']/g, ""))).size;
  const typeTokenRatio = words ? unique / words : 0;

  /* Task response ------------------------------------------------ */
  const trPos: string[] = [];
  const trImp: string[] = [];
  let tr = 5;
  const ratio = words / opts.minWords;
  if (words === 0) tr = 0;
  else if (ratio < 0.6) { tr = 4; trImp.push(`Only ${words} words — under-length answers are penalised for Task ${opts.task}. Aim for ${opts.minWords}+.`); }
  else if (ratio < 0.9) { tr = 5; trImp.push(`You wrote ${words} words; the minimum is ${opts.minWords}. Add one more developed idea.`); }
  else { tr = 6; trPos.push(`Length is adequate (${words} words).`); }
  if (words >= opts.minWords * 1.08) { tr = Math.min(tr + 0.5, 8); trPos.push("The answer is fully developed in length."); }

  const hasIntro = paragraphs >= 2;
  const hasConclusion = /(in conclusion|to conclude|to sum up|overall|in summary)/i.test(lower);
  const hasPosition = /(i (firmly )?(believe|argue|agree|disagree)|this essay|in my (view|opinion)|i would argue|it is clear that)/i.test(lower);
  const ideaDevelopers = (lower.match(/(for example|for instance|such as|this means|this is why|this is precisely|as a result|which is why|this is because|the reason is|which converts|so that)/g) ?? []).length;

  if (opts.task === 2) {
    if (hasPosition) { trPos.push("A clear position is stated in the introduction."); tr += 0.5; }
    else { trImp.push("State your position explicitly in the introduction — examiners look for it immediately."); tr -= 0.5; }
    if (ideaDevelopers >= 2) { trPos.push(`${ideaDevelopers} ideas are extended with explanation or example.`); tr += 0.5; }
    else { trImp.push("Extend each idea: explain the mechanism, then give a specific example."); tr -= 0.5; }
    if (hasConclusion) { trPos.push("The conclusion restates your position."); tr += 0.5; }
    else trImp.push("Add a conclusion that restates your view in one or two sentences.");
    if (topicHit >= 3) { trPos.push("Topic-specific language is on-task throughout."); tr += 0.5; }
    else trImp.push("Use the exact nouns from the question early on to show you have answered it, not a nearby topic.");
  } else {
    if (/(overall|in general|overview)/i.test(lower)) { trPos.push("An overview sentence is present — this is the highest-value sentence in Task 1."); tr += 1; }
    else { trImp.push("Add an overview that names the two or three biggest features (no data in the overview)."); tr -= 1; }
    if (/\d/.test(clean)) { trPos.push("Data is quoted from the chart."); tr += 0.5; }
    else trImp.push("Support the overview with specific figures and dates.");
    if (/(increase|rose|climbed|grew|surged|declined|fell|dropped|remained|plateaued|peaked)/i.test(lower)) { trPos.push("Trend language is used accurately."); tr += 0.5; }
    else trImp.push("Use precise trend verbs (rose sharply, plateaued, dipped) rather than 'went up'.");
  }
  if (opts.task === 1 && opts.hasChart && !/%.|per cent|percent/.test(lower) && /(bar|pie|line)/i.test(text)) {
    trImp.push("Percentages are the clearest unit for this chart — quote at least three.");
  }

  /* Coherence & cohesion ---------------------------------------- */
  const cPos: string[] = [];
  const cImp: string[] = [];
  let coh = 5;
  if (paragraphs >= (opts.task === 2 ? 4 : 3)) { coh += 1; cPos.push(`${paragraphs} paragraphs — clear visual structure.`); }
  else if (paragraphs >= 2) { coh += 0.5; cPos.push("Paragraphing is at least attempted."); }
  else cImp.push(opts.task === 2 ? "Use four paragraphs: introduction, two body paragraphs, conclusion." : "Use three paragraphs: introduction, overview/body, detailed comparison.");

  if (linkingUsed.length >= 6) { coh += 1; cPos.push(`Good range of connectives (${linkingUsed.length} different items).`); }
  else if (linkingUsed.length >= 3) { coh += 0.5; cPos.push("Connectives are used but could be more varied."); }
  else cImp.push("Add cohesive devices between sentences — however, consequently, whereas, in contrast.");

  if (/(this|these|such|which|the former|the latter)\s/i.test(clean)) { coh += 0.5; cPos.push("Reference words (this / such / the former) link ideas without repetition."); }
  if (/(firstly|first of all|first,|secondly|thirdly|finally)/i.test(lower) && opts.task === 2) cImp.push("Numbered signposts (firstly / secondly) read mechanically at Band 7+. Let the argument create the transitions.");

  /* Lexical resource --------------------------------------------- */
  const lPos: string[] = [];
  const lImp: string[] = [];
  let lex = 5;
  const sophisticated = wordsRaw.filter((w) => w.replace(/[^a-zA-Z]/g, "").length >= 8).length;
  const sophisticatedShare = words ? sophisticated / words : 0;
  if (sophisticatedShare >= 0.15) {
    lex += 1;
    lPos.push(`${Math.round(sophisticatedShare * 100)}% of the words are longer, more precise items rather than general vocabulary.`);
  } else if (sophisticatedShare >= 0.09) {
    lex += 0.5;
    lPos.push("Precise, longer word choices appear regularly.");
  } else {
    lImp.push("Too many short general words — choose the exact term ('declined sharply' rather than 'went down a lot').");
  }

  if (academicUsed.length >= 8) { lex += 1; lPos.push(`Precise academic lexis used: ${academicUsed.slice(0, 6).join(", ")}.`); }
  else if (academicUsed.length >= 4) { lex += 0.5; lPos.push(`Some academic lexis: ${academicUsed.slice(0, 4).join(", ")}.`); }

  if (typeTokenRatio > 0.5 && words > 120) { lex += 0.5; lPos.push("Good lexical variety (few repeated content words)."); }

  if (repeatedWords.length) {
    lImp.push(`Repeated: ${repeatedWords.map((r) => `${r.word} (${r.count}×)`).join(", ")} — paraphrase instead.`);
    lex -= Math.min(0.75, repeatedWords.length * 0.25);
  }
  const fillerHits = FILLERS.filter((f) => new RegExp(`\\b${f}\\b`, "i").test(clean));
  if (fillerHits.length >= 4) { lex -= 0.5; lImp.push(`Informal/filler words: ${fillerHits.slice(0, 5).join(", ")}.`); }
  if (/\b(gonna|wanna|kids|stuff|thing)\b/i.test(lower)) { lex -= 0.5; lImp.push("Avoid conversational words — IELTS Writing is formal."); }

  /* Grammatical range & accuracy --------------------------------- */
  const gPos: string[] = [];
  const gImp: string[] = [];
  let gram = 5;
  if (complexCount >= 4) { gram += 1; gPos.push("Complex subordination is used repeatedly and accurately."); }
  else if (complexCount >= 2) gram += 0.5;
  else gImp.push("Add subordinate clauses: 'Although remote work cuts commuting, it blurs the working day.'");

  const sd = Math.sqrt(wordCounts.reduce((a, b) => a + (b - avgSentenceLength) ** 2, 0) / Math.max(wordCounts.length, 1)) || 0;
  if (sd > 7) { gram += 0.5; gPos.push("Sentence length is varied — short statements punctuate longer ones."); }
  else if (words > 100) gImp.push("Vary sentence length; three long sentences in a row lose the reader.");

  if (/\b(is|are|was|were|be|been|being)\s+\w+(ed|en)\b/.test(lower)) {
    gram += 0.5;
    gPos.push("Passive and impersonal constructions broaden the range of structures.");
  }

  if (longSentences >= 2) { gram -= 0.5; gImp.push(`${longSentences} sentences run over 34 words — split them to keep control.`); }
  if ((lower.match(/\bi think\b/g) ?? []).length >= 3) gImp.push("Three or more 'I think' statements — vary the way you present a view.");
  const errorSignals = (lower.match(/\b(peoples|informations|researches|advices|equipments|childrens|moneys)\b/g) ?? []).length;
  if (errorSignals) { gram -= 0.5; gImp.push("Uncountable nouns were pluralised (information, research, advice take no -s)."); }
  if (/[a-z]\s?,\s?[a-z]/i.test(clean) && (clean.match(/,/g) ?? []).length > words / 12) gImp.push("Comma use looks heavy — check for comma splices.");

  const clamp = (n: number) => Math.max(3, Math.min(9, roundHalf(n)));
  const criteria: WritingCriterion[] = [
    { key: "TR", name: opts.task === 2 ? "Task Response" : "Task Achievement", band: clamp(tr), comment: trComment(tr, opts.task), positives: trPos, improvements: trImp },
    { key: "CC", name: "Coherence & Cohesion", band: clamp(coh), comment: ccComment(coh), positives: cPos, improvements: cImp },
    { key: "LR", name: "Lexical Resource", band: clamp(lex), comment: lrComment(lex), positives: lPos, improvements: lImp },
    { key: "GRA", name: "Grammatical Range & Accuracy", band: clamp(gram), comment: graComment(gram), positives: gPos, improvements: gImp },
  ];

  const band = words === 0 ? 0 : roundHalf(criteria.reduce((a, c) => a + c.band, 0) / 4);
  const summary = buildSummary(criteria, words, opts.minWords);

  return {
    words, sentences: sentenceCount, paragraphs, avgSentenceLength: Number(avgSentenceLength.toFixed(1)),
    linkingUsed, complexCount, academicUsed, typeTokenRatio: Number(typeTokenRatio.toFixed(2)),
    repeatedWords, longSentences, criteria, band, summary,
  };
}

function trComment(b: number, task: 1 | 2) {
  if (b >= 8) return task === 2 ? "Fully addresses all parts of the task with a well-developed position." : "Fully satisfies all requirements; the overview is clear and well supported.";
  if (b >= 7) return task === 2 ? "Addresses all parts of the task; main ideas are extended, though some could be more fully supported." : "Covers the requirements well; the overview is present and data is selected sensibly.";
  if (b >= 6) return task === 2 ? "Addresses the task but some parts are more developed than others." : "Presents an overview with some data support, but coverage is uneven.";
  return task === 2 ? "The response does not yet cover all parts of the task, or the position is unclear." : "The overview is missing or unclear, and data is described rather than selected.";
}
function ccComment(b: number) {
  if (b >= 8) return "Information is sequenced logically and cohesion is managed unobtrusively.";
  if (b >= 7) return "Logical progression is clear; cohesive devices are used flexibly.";
  if (b >= 6) return "Arrangement of ideas is generally clear, but cohesion is sometimes mechanical.";
  return "Organisation is not yet clear; paragraphs or connectives are missing or overused.";
}
function lrComment(b: number) {
  if (b >= 8) return "Wide resource, used precisely; rare slips only.";
  if (b >= 7) return "Sufficient range for flexible, precise expression with occasional inaccuracies.";
  if (b >= 6) return "Adequate range; errors do not impede understanding but limit precision.";
  return "Limited range, with repetition and word-choice errors that distract the reader.";
}
function graComment(b: number) {
  if (b >= 8) return "Wide range of structures used accurately; the majority of sentences are error-free.";
  if (b >= 7) return "Variety of complex structures; frequent error-free sentences.";
  if (b >= 6) return "Mix of simple and complex forms with some errors that rarely impede communication.";
  return "Limited range; errors are frequent and sometimes obscure meaning.";
}

function buildSummary(criteria: WritingCriterion[], words: number, minWords: number): string[] {
  const out: string[] = [];
  const weakest = [...criteria].sort((a, b) => a.band - b.band)[0];
  const strongest = [...criteria].sort((a, b) => b.band - a.band)[0];
  out.push(`Strongest criterion: ${strongest.name} (${strongest.band.toFixed(1)}). Weakest: ${weakest.name} (${weakest.band.toFixed(1)}) — raising it lifts the whole score.`);
  if (words < minWords) out.push(`Add roughly ${minWords - words} words; under-length answers cap Task ${minWords === 250 ? 2 : 1} at Band 5.`);
  const all = criteria.flatMap((c) => c.improvements);
  if (all.length) out.push(`Priority fix: ${all[0]}`);
  return out;
}

/* ------------------------------------------------------------------ *
 * Speaking analysis
 * ------------------------------------------------------------------ */

export type SpeakingAnalysis = {
  words: number;
  wpm: number;
  linkingUsed: string[];
  fillers: number;
  uniqueRatio: number;
  criteria: WritingCriterion[];
  band: number;
  summary: string[];
};

const SPEAK_FILLERS = ["um", "uh", "er", "erm", "like,", "you know", "sort of", "kind of"];

export function analyseSpeaking(transcript: string, seconds: number, part: 1 | 2 | 3): SpeakingAnalysis {
  const clean = stripMd(transcript);
  const wordsRaw = clean.split(/\s+/).filter((w) => /[a-zA-Z']/.test(w));
  const words = wordsRaw.length;
  const minutes = Math.max(seconds / 60, 0.5);
  const wpm = Math.round(words / minutes);
  const lower = clean.toLowerCase();
  const linkingUsed = LINKING_WORDS.filter((l) => lower.includes(l));
  const fillers = SPEAK_FILLERS.reduce((acc, f) => acc + ((lower.match(new RegExp(`\\b${f}\\b`, "g")) ?? []).length), 0);
  const unique = new Set(wordsRaw.map((w) => w.toLowerCase())).size;
  const uniqueRatio = words ? unique / words : 0;

  let fluency = 5;
  const fPos: string[] = [], fImp: string[] = [];
  const targetWpm = part === 2 ? 130 : 140;
  if (words === 0) fluency = 0;
  else {
    if (wpm > targetWpm - 40 && wpm < targetWpm + 60) { fluency += 1; fPos.push(`Pace of ${wpm} wpm is conversational.`); }
    else if (wpm < targetWpm - 60) { fluency -= 0.5; fImp.push(`You spoke at ${wpm} wpm — slow delivery suggests hesitation. Aim for 120–160.`); }
    else { fluency -= 0.5; fImp.push(`At ${wpm} wpm you will sound rushed. Slow down and use pauses instead of fillers.`); }
    if (fillers > words / 22) { fluency -= 0.5; fImp.push(`${fillers} fillers detected — pause silently instead of saying "um".`); }
    else if (fillers < 3) { fluency += 0.5; fPos.push("Very few fillers."); }
  }

  let lex = 5;
  const lPos: string[] = [], lImp: string[] = [];
  if (uniqueRatio > 0.6) { lex += 1; lPos.push("Wide range of word choices with little repetition."); }
  else if (uniqueRatio > 0.48) lex += 0.5;
  else lImp.push("You repeated a lot of the question's words — paraphrase in the first sentence of each answer.");
  if (/(i mean|actually|to be honest|from my perspective|what strikes me|the thing is)/i.test(lower)) { lex += 0.5; lPos.push("Natural conversational markers add fluency."); }

  let gram = 5;
  const gPos: string[] = [], gImp: string[] = [];
  const complex = (lower.match(/\b(which|that|although|while|because|if|when|where|who|whose|having|rather than|so that)\b/g) ?? []).length;
  if (complex >= 5) { gram += 0.5; gPos.push("Subordinate clauses are used to extend answers."); }
  else gImp.push("Extend answers with 'which…', 'because…', 'even though…' instead of separate short sentences.");

  let coh = 5;
  const cPos: string[] = [], cImp: string[] = [];
  if (linkingUsed.length >= 4) { coh += 0.5; cPos.push(`Discourse markers: ${linkingUsed.slice(0, 4).join(", ")}.`); }
  else cImp.push("Signpost your answer: 'There are two reasons, the first of which is…'.");
  if (part === 2 && words < 180) { coh -= 1; cImp.push("Part 2 answers should run 1½–2 minutes (roughly 220–300 words). Cover the last bullet point."); }
  if (part === 1 && words > 120) cImp.push("Part 1 answers should be 2–4 sentences; longer answers invite harder follow-ups.");

  const clamp = (n: number) => Math.max(3, Math.min(9, roundHalf(n)));
  const criteria: WritingCriterion[] = [
    { key: "FC", name: "Fluency & Coherence", band: clamp(fluency), comment: fluencyComment(fluency), positives: fPos, improvements: fImp },
    { key: "LR", name: "Lexical Resource", band: clamp(lex), comment: lrComment(lex), positives: lPos, improvements: lImp },
    { key: "GRA", name: "Grammatical Range & Accuracy", band: clamp(gram), comment: graComment(gram), positives: gPos, improvements: gImp },
    { key: "P", name: "Coherence of Answer", band: clamp(coh), comment: speakCohComment(coh), positives: cPos, improvements: cImp },
  ];
  const band = words === 0 ? 0 : roundHalf(criteria.reduce((a, c) => a + c.band, 0) / 4);
  const summary = [
    `Estimated from ${words} words over ${Math.round(seconds)}s.`,
    `Weakest area: ${[...criteria].sort((a, b) => a.band - b.band)[0].name}.`,
  ];
  if (criteria.flatMap((c) => c.improvements).length) summary.push(`Priority fix: ${criteria.flatMap((c) => c.improvements)[0]}`);

  return { words, wpm, linkingUsed, fillers, uniqueRatio: Number(uniqueRatio.toFixed(2)), criteria, band, summary };
}

function speakCohComment(b: number) {
  if (b >= 8) return "Ideas are sequenced so clearly that the structure never demands attention.";
  if (b >= 7) return "Answers have a clear shape: position, reason, example, qualification.";
  if (b >= 6) return "Answers are understandable but sometimes drift; signposting is limited.";
  return "Answers lack a recognisable structure and are difficult to follow.";
}

function fluencyComment(b: number) {
  if (b >= 8) return "Speaks at length without noticeable effort; hesitation is content-related, not linguistic.";
  if (b >= 7) return "Speaks at length with only occasional repetition or self-correction.";
  if (b >= 6) return "Willing to speak at length but coherence and fluency are sometimes strained.";
  return "Frequent pauses and false starts interrupt the message.";
}
