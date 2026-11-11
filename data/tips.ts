export type Tip = { title: string; body: string; level?: string };

export type TipSection = {
  id: string;
  skill: string;
  headline: string;
  mindset: string;
  tips: Tip[];
  traps: Tip[];
  timing: { label: string; minutes: string; what: string }[];
};

export const tipSections: TipSection[] = [
  {
    id: "reading",
    skill: "Reading",
    headline: "Read the question first, then the passage — but only the part you need.",
    mindset:
      "Academic Reading is not a comprehension test; it is a search task with a time limit. Nobody expects you to understand every word, and nobody is impressed if you do. Band 8 readers routinely leave whole sentences unread.",
    tips: [
      { title: "Skim for structure in 90 seconds", body: "Read the first sentence of each paragraph only. Write a three-word label beside each one in your head. You now have a map, and the questions will point at a paragraph rather than at the passage." },
      { title: "Match the question to the paragraph", body: "Names, numbers and capitals are anchors. Search for them physically with your finger or cursor. The answer sentence is almost always within two lines of the anchor." },
      { title: "TRUE / FALSE / NOT GIVEN is a logic test", body: "TRUE = the passage says it. FALSE = the passage says the opposite. NOT GIVEN = the passage does not address it. If you are arguing with the text, it is NOT GIVEN. If you are arguing with the world, it is FALSE.", level: "Most-missed" },
      { title: "Do not answer from knowledge", body: "Every answer must be traceable to a line in the passage. Real-world facts you happen to know are a trap, especially in passages about science." },
      { title: "Gap-fill: copy exactly, check the grammar", body: "The word you insert must fit grammatically. If the gap follows 'a', the answer is singular. If it follows 'were', it is plural. Grammar eliminates wrong candidates faster than meaning does." },
      { title: "Headings: match the topic sentence", body: "The heading summarises the paragraph's main idea, which is usually in the first or second sentence. A heading that is true but minor is the distractor." },
      { title: "Never leave a blank", body: "There is no penalty for a wrong answer. In the last two minutes, fill every remaining gap with your best guess — statistically worth one or two marks." },
      { title: "Transfer answers as you go", body: "Waiting until the end to copy 40 answers is how candidates lose the section they have just finished. Write the answer on the answer sheet immediately." },
    ],
    traps: [
      { title: "The 'also true' trap", body: "In TRUE/FALSE/NOT GIVEN, an option that is factually true but not stated is still NOT GIVEN." },
      { title: "Word-matching bait", body: "If an option repeats four words from the passage, it is usually the distractor. Correct options paraphrase." },
      { title: "Spending 6 minutes on one question", body: "Every question is worth one mark. Flag it, move on, come back. The questions are not weighted by difficulty." },
    ],
    timing: [
      { label: "Passage 1", minutes: "17 min", what: "Easiest passage. Bank the marks and build confidence." },
      { label: "Passage 2", minutes: "20 min", what: "Standard difficulty. Do the factual question types first." },
      { label: "Passage 3", minutes: "23 min", what: "Hardest. Do gap-fill and matching before the inference questions." },
      { label: "Transfer", minutes: "0 min", what: "You have been writing answers down as you go — this is your buffer." },
    ],
  },
  {
    id: "listening",
    skill: "Listening",
    headline: "The answer is spoken before you expect it, and again after.",
    mindset:
      "Listening rewards prediction, not attention. Candidates who 'just listen hard' lose the thread after one missed word. Candidates who predict the answer's shape hear it even when the recording is fast.",
    tips: [
      { title: "Predict the word class before it is said", body: "£____ is a number. ____ Street is a proper noun, capitalised. ____ days is a plural noun. Knowing the shape means you catch the answer even if you miss the sentence." },
      { title: "Section 1 is a spelling test", body: "Names, addresses and postcodes are dictated slowly, often twice. Write them immediately, then check: double letters, 'ph' versus 'f', hyphens. One spelling error loses the mark." },
      { title: "Listen for the correction", body: "The speaker says the wrong answer first, then corrects themselves: 'Tuesday — no, sorry, Thursday.' The second version is the answer. This is deliberate.", level: "Most-missed" },
      { title: "Numbers: beware teens and tens", body: "Fifteen/fifty, thirteen/thirty. The stress falls differently: fifTEEN, FIFty. Also listen for 'a quarter to', 'the day after tomorrow', and prices like 'four ninety-nine'." },
      { title: "Do not stop after a missed answer", body: "The recording does not wait. If you miss one, guess and rejoin at the next question — losing three more marks while you think about the one you missed is the most common failure pattern." },
      { title: "Multiple choice: read all three options first", body: "The distractors are all mentioned. Note why each one is wrong as you listen; the option that is true but not the main point is usually the trap." },
      { title: "Section 4 has no pause", body: "It is a continuous lecture. Read the notes before it begins and mark where each gap is, so your eye is already in position." },
    ],
    traps: [
      { title: "Synonym, not repetition", body: "The recording says 'not allowed' where the question says 'prohibited'. If you are waiting for the exact word, you will miss it." },
      { title: "Word limit", body: "If it says NO MORE THAN TWO WORDS, 'the main entrance' is three words and scores zero. Hyphenated words count as one." },
      { title: "Over-writing", body: "Write the answer, not the sentence. You need the key word, not the grammar around it." },
    ],
    timing: [
      { label: "Before each section", minutes: "30–45 s", what: "Read the questions and underline what type of answer is needed." },
      { label: "During", minutes: "—", what: "Answer in the question booklet; never on the answer sheet during the recording." },
      { label: "Transfer", minutes: "10 min", what: "Copy carefully. Check spelling, plurals and word limits." },
    ],
  },
  {
    id: "writing",
    skill: "Writing",
    headline: "Answer the question that is written, in the structure the examiner expects.",
    mindset:
      "The four criteria are weighted equally. Most candidates obsess over vocabulary and lose marks on Task Response and Coherence. A simply written essay that answers the question fully outscores a sophisticated one that drifts.",
    tips: [
      { title: "Spend 4 minutes planning, every time", body: "A plan is not a luxury. Four minutes deciding your position and two developed ideas prevents the mid-essay panic that produces repetition and contradiction." },
      { title: "Underline the question's parts", body: "'Discuss both views and give your own opinion' has three requirements. Miss the opinion and you cap at Band 5 for Task Response regardless of how good the English is.", level: "Most-missed" },
      { title: "The overview is worth more than any other sentence", body: "In Task 1, no overview means Band 5 for Task Achievement. Write two sentences naming the biggest features, with no numbers, immediately after the introduction." },
      { title: "Group, don't list", body: "In Task 1, organise by similarity (all the countries that rose, or the highest versus the lowest), not by reading the chart left to right. In Task 2, one idea per paragraph, developed." },
      { title: "Paraphrase the question — once", body: "Restate the question in different words in your introduction, then stop. Do not paraphrase it again in the conclusion." },
      { title: "Extend every idea: claim → because → for instance → so what", body: "A claim alone is Band 6. A claim with a reason is Band 6.5. A claim, reason, specific example and consequence is Band 7+." },
      { title: "Leave 3 minutes to check articles and plurals", body: "The most frequent Band 6 grammar errors are 'a/the' and singular/plural agreement, and they are the easiest to fix on a second read." },
      { title: "Task 2 is worth twice Task 1", body: "If time is short, protect Task 2. Twenty minutes for Task 1, forty for Task 2, five to check." },
    ],
    traps: [
      { title: "Memorised sentences", body: "'In this day and age, it is a hotly debated topic…' Examiners are trained to spot memorised language and discount it." },
      { title: "Data dump", body: "Listing every number in a chart is not analysis. Select three or four figures that support a comparison." },
      { title: "Informal register", body: "'Kids', 'stuff', 'a lot of', contractions and rhetorical questions all lower Lexical Resource in Writing." },
    ],
    timing: [
      { label: "Task 1 plan", minutes: "3 min", what: "Identify the biggest features and the comparison. Decide your overview." },
      { label: "Task 1 write", minutes: "15 min", what: "Introduction, overview, two detail paragraphs. 150–190 words." },
      { label: "Task 2 plan", minutes: "5 min", what: "Position plus two developed ideas plus a counterargument." },
      { label: "Task 2 write", minutes: "33 min", what: "Four paragraphs, 250–290 words." },
      { label: "Check", minutes: "4 min", what: "Articles, plurals, word count, and whether you answered every part." },
    ],
  },
  {
    id: "speaking",
    skill: "Speaking",
    headline: "Speak in paragraphs, not sentences.",
    mindset:
      "Examiners assess four things: fluency, vocabulary, grammar and pronunciation. They cannot assess what you do not say. An answer that is short, safe and correct scores lower than an answer that is long, imperfect and interesting.",
    tips: [
      { title: "Part 1: two to four sentences, then stop", body: "Answer, add a reason, add a small detail. Then stop. Long Part 1 answers invite harder follow-ups and eat your confidence." },
      { title: "Use the 'because / but / so' engine", body: "Every answer can be extended with a reason, a contrast and a consequence. This is the fastest route from Band 5 to Band 6.5." },
      { title: "Part 2: use the one-minute preparation", body: "Write five words, not sentences: one per bullet plus an extra detail. Then speak for the full two minutes. Stopping at 60 seconds costs more than any grammar error.", level: "Most-missed" },
      { title: "Part 2: tell a story with a turn", body: "Start with context, describe the situation, then say what happened and how you felt. A narrative with a complication is more fluent than a list of facts." },
      { title: "Part 3: answer the general question generally", body: "There is no 'right' answer. State a position, give a reason, give an example, and acknowledge the other side. That structure alone is Band 7 coherence." },
      { title: "Buy time in English, not silence", body: "'That's an interesting question — I suppose there are two ways to look at it.' This is a legitimate fluency device, not cheating." },
      { title: "Fix your three worst errors", body: "Record yourself. Almost everyone has two or three recurring errors (third-person 's', past tense, articles). Fix those before adding complex grammar." },
      { title: "Pronunciation: stress the content words", body: "You do not need a British accent. You need clear word stress and sentence stress. Say 'I didn't say HE took it' and hear how meaning moves." },
    ],
    traps: [
      { title: "One-word answers", body: "'Do you like music?' — 'Yes.' The examiner cannot award a band for language that was not produced." },
      { title: "Repeating the question", body: "'Do I like music? Yes, I like music.' Paraphrase instead: 'I'm fairly obsessive about it, actually.'" },
      { title: "Memorised Part 2 answers", body: "Examiners hear the same ten topics every week. A rehearsed answer collapses under one follow-up question." },
    ],
    timing: [
      { label: "Part 1", minutes: "4–5 min", what: "Familiar topics. Short, natural, extended answers." },
      { label: "Part 2", minutes: "1 min + 2 min", what: "One minute to prepare with paper. Speak for 1½–2 minutes." },
      { label: "Part 3", minutes: "4–5 min", what: "Abstract discussion. Longer answers with reasoning." },
    ],
  },
];

export const bandDescriptors = [
  { band: "9", writing: "Fully developed position; cohesion attracts no attention; wide, precise vocabulary; error-free sentences.", speaking: "Fluent, fully coherent, precise, effortless." },
  { band: "8", writing: "Sufficiently develops the task; logically sequenced; rare slips; wide range with occasional inaccuracy.", speaking: "Fluent with occasional hesitation; wide vocabulary; mostly error-free." },
  { band: "7", writing: "Clear position, extended ideas; flexible connectives; some less common vocabulary; frequent error-free sentences.", speaking: "Speaks at length without effort; some flexibility; a few errors that do not impede." },
  { band: "6", writing: "Addresses the task but some parts underdeveloped; mechanical cohesion; adequate vocabulary with errors that do not impede.", speaking: "Willing to speak at length but fluency strained; adequate range; errors sometimes impede." },
  { band: "5", writing: "Task only partly addressed; no clear overview or position; limited organisation; noticeable errors.", speaking: "Frequent pauses; limited range; errors cause some difficulty." },
  { band: "4", writing: "Minimal response; incoherent in places; limited vocabulary; frequent errors.", speaking: "Frequent breakdowns; very limited range." },
];

export const examDay = [
  { title: "The week before", body: "Stop learning new grammar. Do two full timed mocks, at the same time of day as your test, and mark them honestly. Sleep is worth more than revision at this stage." },
  { title: "Listening is first", body: "You cannot pause the recording, and your concentration is highest at the start. Arrive early, use the bathroom, and do not chat with other candidates about the test." },
  { title: "Reading: watch the clock, not the passage", body: "Take a watch if the room has no clock. At 20 minutes you should be finishing Passage 1; at 40, Passage 2. If you are behind, the answer is to move on, not to read faster." },
  { title: "Writing: Task 2 gets the time", body: "Write Task 1 in 20 minutes even if it is unfinished, then move to Task 2. A complete Task 2 with a weak Task 1 scores higher than the reverse." },
  { title: "Speaking: it is a conversation, not an interrogation", body: "The examiner is following a script and has no discretion about the questions. Treat it as a discussion with a polite stranger and the fluency follows." },
  { title: "If you go blank", body: "Say so in English and keep going: 'I've lost my train of thought — let me start that again.' Silence is the only thing that cannot be marked." },
];

export const scoreBudgets = [
  { target: "6.5 overall", reading: "27–29 / 40", listening: "26–29 / 40", writing: "6.5 in two criteria, 6 in the others", speaking: "6+ with fluency and vocabulary at 6.5" },
  { target: "7.0 overall", reading: "30–32 / 40", listening: "30–31 / 40", writing: "7 in Task Response and Coherence, 6.5 elsewhere", speaking: "7 in fluency, 6.5–7 elsewhere" },
  { target: "7.5 overall", reading: "33–34 / 40", listening: "32–34 / 40", writing: "7 in three criteria, no criterion below 6.5", speaking: "7+ consistently, 7.5 in vocabulary" },
  { target: "8.0 overall", reading: "35–36 / 40", listening: "35–36 / 40", writing: "7.5+ across all four criteria", speaking: "8 in fluency and vocabulary" },
];
