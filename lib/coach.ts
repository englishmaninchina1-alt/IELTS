/**
 * The Coach engine.
 *
 * Two layers:
 *  1. A deterministic idea generator (works offline, no key, no network) that turns a
 *     student's own brainstorm into a structured plan and a full sample answer.
 *  2. An optional LLM layer (app/api/coach) used when an OpenAI-compatible key is set.
 *
 * The local layer is deliberately transparent: it does not pretend to be a language model.
 * It supplies the scaffolding students most often lack — a position, two developed ideas,
 * a concession, and the sentence frames that connect them.
 */

export type Idea = { claim: string; because: string; example: string; soWhat?: string };

export type CoachPlan = {
  topic: string;
  kind: string;
  intro: string;
  bodies: string[];
  conclusion: string;
  full: string;
  vocabulary: string[];
  linkers: string[];
  notes: string[];
  words: number;
};

export type TopicProfile = {
  id: string;
  name: string;
  keywords: string[];
  issue: string;
  positions: string[];
  ideas: Idea[];
  counter: string;
  rebuttal: string;
  vocabulary: string[];
  angle?: string;
};

export const topicProfiles: TopicProfile[] = [
  {
    id: "ai-work",
    name: "AI and employment",
    keywords: ["artificial intelligence", "ai", "automation", "robot", "algorithm", "machine learning", "jobs", "employment", "labour", "labor"],
    issue: "whether intelligent machines will leave more people working, or fewer",
    positions: [
      "new roles will appear, but not for the same people or at the same speed",
      "the total number of jobs may recover while the route into skilled work disappears",
      "the technology is beneficial, but only where retraining is funded publicly",
    ],
    ideas: [
      {
        claim: "automation removes the routine tasks from which expertise used to be built",
        because: "junior work is how beginners develop judgement",
        example: "a trainee solicitor who no longer drafts routine contracts never learns to spot an unusual clause",
        soWhat: "the occupation survives while the ladder into it is removed",
      },
      {
        claim: "the roles that are created require qualifications the displaced workers do not have",
        because: "model oversight and data work are technical and concentrated in a few cities",
        example: "a system that automates a thousand invoice checks may create two positions to manage exceptions",
        soWhat: "a technology story quietly becomes an education story",
      },
      {
        claim: "the damage is concentrated in the transition rather than the endpoint",
        because: "historical evidence suggests re-employment takes about a decade",
        example: "a fifty-five-year-old administrator cannot wait ten years for a new equilibrium",
        soWhat: "aggregate prosperity and local decline can coexist",
      },
    ],
    counter: "the long-run record of automation is one of net job creation",
    rebuttal: "that record was built when displaced workers could retrain within a single lifetime, and when the new roles were geographically close to the old ones",
    vocabulary: ["displacement", "task-level automation", "occupational ladder", "reskilling", "structural unemployment", "net effect", "transition cost"],
  },
  {
    id: "social-media",
    name: "Social media and young people",
    keywords: ["social media", "teenager", "children", "screen time", "online", "platform", "tiktok", "instagram", "ban", "age limit"],
    issue: "whether restricting young people's access to social platforms protects them or merely inconveniences them",
    positions: [
      "the harm is real, but a ban is the wrong instrument",
      "regulation should target addictive design rather than the age of the user",
      "a minimum age is justified, provided it is enforced through devices rather than self-declaration",
    ],
    ideas: [
      {
        claim: "the harm comes from product design rather than from the child's weakness",
        because: "feeds are engineered to extend sessions, and the optimisation does not distinguish between adults and adolescents",
        example: "infinite scroll and late-night notifications are deliberate commercial choices",
        soWhat: "blaming users for the effects of a designed system is a category error",
      },
      {
        claim: "a blanket prohibition removes support that some young people cannot find elsewhere",
        because: "online communities are often the only accessible source of identity and advice",
        example: "a teenager in a small town with no other peers like them",
        soWhat: "a law intended to protect the vulnerable would deprive them first",
      },
      {
        claim: "age assurance has become technically feasible",
        because: "device-level verification is now available in several jurisdictions",
        example: "recent online safety legislation requires highly effective age assurance for certain services",
        soWhat: "the objection that 'it cannot be enforced' is no longer decisive",
      },
    ],
    counter: "determined teenagers have always circumvented age gates",
    rebuttal: "circumvention reduces exposure at population scale even when it fails for individuals, which is how most public health measures work",
    vocabulary: ["age assurance", "algorithmic recommendation", "duty of care", "developmental stage", "unintended consequence", "blanket prohibition"],
  },
  {
    id: "environment",
    name: "Environment and climate",
    keywords: ["climate", "environment", "carbon", "emission", "pollution", "recycling", "sustainable", "green", "renewable", "plastic", "temperature"],
    issue: "how responsibility for environmental damage should be distributed",
    positions: [
      "individual action matters, but systemic change is the decisive lever",
      "the costs of pollution should be paid by producers rather than by the public",
      "regulation is more effective than persuasion because it changes the default",
    ],
    ideas: [
      {
        claim: "individual choices are constrained by the infrastructure available",
        because: "a household cannot insulate a building it does not own, or take a train that does not run",
        example: "heat pump uptake tracks subsidy levels far more closely than environmental concern",
        soWhat: "exhorting consumers to act without changing the options is a policy that fails predictably",
      },
      {
        claim: "cumulative consumption still shifts markets",
        because: "sustained demand lowers the cost of low-carbon alternatives",
        example: "the collapse in solar prices followed two decades of policy-driven demand",
        soWhat: "personal action is not sufficient, but it is not meaningless",
      },
      {
        claim: "the 'personal footprint' framing was promoted by the industries it protects",
        because: "it transfers responsibility from producers to consumers",
        example: "the carbon footprint calculator originated in an oil company's advertising campaign",
        soWhat: "the language of individual guilt has a commercial history",
      },
    ],
    counter: "consumers ultimately create the demand that producers satisfy",
    rebuttal: "demand is shaped by price, infrastructure and information, all of which are set by policy rather than by virtue",
    vocabulary: ["carbon footprint", "infrastructure lock-in", "extended producer responsibility", "greenwashing", "systemic", "regulatory lever"],
  },
  {
    id: "education",
    name: "Education",
    keywords: ["education", "school", "university", "student", "teacher", "exam", "curriculum", "vocational", "degree", "learning"],
    issue: "what education should be for, and who should pay for it",
    positions: [
      "the balance between academic and vocational routes is wrong, but the problem is prestige rather than numbers",
      "education should be judged by what students can do, not by what they can recall",
      "university is valuable for reasons that have nothing to do with the graduate premium",
    ],
    ideas: [
      {
        claim: "graduate supply has outrun graduate demand",
        because: "when a third of the workforce holds a degree, it stops distinguishing candidates",
        example: "graduates in some subjects earn less over a lifetime than qualified electricians",
        soWhat: "the private return on a degree now varies enormously by subject",
      },
      {
        claim: "technical routes are stigmatised rather than inferior",
        because: "funding and prestige follow the academic pathway",
        example: "high-quality apprenticeship schemes are routinely oversubscribed",
        soWhat: "the shortage is of supply, not of demand",
      },
      {
        claim: "assessment shapes what students learn",
        because: "students optimise for what is measured",
        example: "examinations that reward recall produce revision rather than understanding",
        soWhat: "reforming assessment is the most direct way to reform teaching",
      },
    ],
    counter: "universities produce research and civic value that no training scheme replaces",
    rebuttal: "that is an argument for a strong university sector, not for sending half the population through it",
    vocabulary: ["graduate premium", "parity of esteem", "skills mismatch", "apprenticeship", "overqualification", "attainment gap"],
  },
  {
    id: "cities",
    name: "Cities and transport",
    keywords: ["city", "cities", "urban", "transport", "traffic", "commut", "housing", "rent", "public transport", "congestion", "cycle"],
    issue: "how cities should be organised when the way people work has changed",
    positions: [
      "the single-use business district is obsolete and should be converted to mixed use",
      "congestion must be priced rather than endured",
      "the problem is not density but the absence of alternatives to the car",
    ],
    ideas: [
      {
        claim: "the daytime economy of a business district collapses when workers stop arriving",
        because: "cafés, cleaners and shops depend on a fixed office population",
        example: "central business districts in several countries remain quiet on Mondays and Fridays",
        soWhat: "a district built for one purpose has no second purpose to fall back on",
      },
      {
        claim: "vacancy becomes a fiscal problem before it becomes an aesthetic one",
        because: "local revenue is often tied to occupied commercial floorspace",
        example: "a city with a fifth of its offices empty still maintains the same roads and services",
        soWhat: "the cost is borne by residents who never worked there",
      },
      {
        claim: "conversion to housing restores activity across the whole day",
        because: "residents use a district in the evening as well as the morning",
        example: "office-to-apartment schemes in North American cities",
        soWhat: "the fix is structural, not promotional",
      },
    ],
    counter: "not every office building can be converted economically",
    rebuttal: "that is an argument for targeting the scheme, not for abandoning it",
    vocabulary: ["footfall", "mixed-use zoning", "vacancy rate", "adaptive reuse", "agglomeration", "congestion pricing"],
  },
  {
    id: "health",
    name: "Health",
    keywords: ["health", "hospital", "doctor", "exercise", "diet", "obesity", "mental", "sleep", "medical", "vaccine"],
    issue: "whether health is a matter of personal responsibility or public provision",
    positions: [
      "prevention is cheaper than treatment, yet health systems consistently underfund it",
      "individual behaviour is shaped by environment, so the environment is the proper target",
      "access should depend on need rather than on ability to pay",
    ],
    ideas: [
      {
        claim: "the largest determinants of health lie outside the clinic",
        because: "housing, income and diet matter more than most medical interventions",
        example: "life expectancy between adjacent neighbourhoods can differ by a decade",
        soWhat: "a health service that treats only illness is treating the symptom",
      },
      {
        claim: "preventative spending produces returns that are invisible for a decade",
        because: "the benefit is an illness that never happened",
        example: "screening programmes and vaccination",
        soWhat: "politicians are rewarded for buildings, not for absent disease",
      },
      {
        claim: "chronic conditions consume the majority of health budgets",
        because: "they are managed rather than cured, often for decades",
        example: "diabetes and cardiovascular disease",
        soWhat: "small changes in lifestyle at population scale outperform expensive late treatment",
      },
    ],
    counter: "people should be free to make their own choices about their bodies",
    rebuttal: "choice is meaningful only where the alternatives are genuinely available, which is a question of planning and price",
    vocabulary: ["preventative care", "chronic illness", "sedentary lifestyle", "health inequality", "screening", "public health"],
  },
  {
    id: "technology",
    name: "Technology and privacy",
    keywords: ["privacy", "data", "technology", "internet", "surveillance", "phone", "digital", "cyber", "information"],
    issue: "how much of private life should be visible to institutions and companies",
    positions: [
      "privacy has changed form rather than disappeared, and it remains enforceable",
      "consent is meaningless when refusing is impractical, so regulation must move to design",
      "the benefits of data collection are real, but they should not be assumed to outweigh the costs",
    ],
    ideas: [
      {
        claim: "consent has been hollowed out by design",
        because: "nobody reads the terms, and refusal usually means exclusion from a service",
        example: "the choice between accepting tracking and losing access to a platform",
        soWhat: "agreement extracted under those conditions is not meaningful",
      },
      {
        claim: "privacy is a legal relationship rather than a physical condition",
        because: "what counts as a violation is defined by statute",
        example: "data protection law requires a lawful basis before processing",
        soWhat: "the loss of privacy is a political decision, not a technical inevitability",
      },
      {
        claim: "surveillance changes behaviour before it is ever abused",
        because: "people who believe they are watched censor themselves",
        example: "users avoiding legitimate medical or political searches",
        soWhat: "the chilling effect harms society even when no record is read",
      },
    ],
    counter: "most people willingly trade data for convenient services",
    rebuttal: "revealed preference under a constrained choice is weak evidence of what people actually want",
    vocabulary: ["data minimisation", "informed consent", "surveillance", "chilling effect", "anonymisation", "purpose limitation"],
  },
  {
    id: "globalisation",
    name: "Globalisation and economy",
    keywords: ["globalisation", "globalization", "trade", "import", "export", "multinational", "supply chain", "economy", "tariff", "inequality"],
    issue: "whether the integration of economies has delivered more than it has cost",
    positions: [
      "globalisation has raised average incomes while concentrating the losses geographically",
      "the benefits are genuine but the adjustment costs were never honestly accounted for",
      "efficiency should not be the only criterion; resilience matters too",
    ],
    ideas: [
      {
        claim: "the gains from trade are diffuse while the losses are concentrated",
        because: "consumers save a little each, and a whole town loses at once",
        example: "manufacturing regions that never recovered from offshoring",
        soWhat: "the politics of trade is driven by the losers, who are identifiable and angry",
      },
      {
        claim: "lean supply chains are efficient until a single link fails",
        because: "optimising for cost removes the slack that absorbs shocks",
        example: "the disruption caused by a shortage of one component in one country",
        soWhat: "resilience is a cost worth paying, though it is invisible when nothing goes wrong",
      },
      {
        claim: "cultural exchange runs alongside economic integration",
        because: "goods carry habits and ideas with them",
        example: "food, music and language travel faster than trade agreements",
        soWhat: "the fear of homogenisation is real but frequently overstated",
      },
    ],
    counter: "cheaper imports raise the real income of the poorest consumers most",
    rebuttal: "that is true in the aggregate and false in the specific town where the factory closed",
    vocabulary: ["supply chain", "comparative advantage", "offshoring", "resilience", "adjustment cost", "protectionism"],
  },
  {
    id: "media",
    name: "Media and information",
    keywords: ["media", "news", "misinformation", "fake", "journalism", "advertising", "attention", "bias", "press"],
    issue: "how a society should obtain information it can trust",
    positions: [
      "the problem is the incentive structure of attention, not the intelligence of readers",
      "platforms should be accountable for the systems they design rather than for individual posts",
      "media literacy helps at the margin but cannot substitute for regulation",
    ],
    ideas: [
      {
        claim: "engagement metrics reward provocation",
        because: "outrage travels further than nuance, and reach is allocated by reaction",
        example: "studies find false stories are shared more widely than accurate ones",
        soWhat: "the distortion is a property of the ranking system, not of any editor's intention",
      },
      {
        claim: "corrections struggle against how beliefs form",
        because: "people evaluate claims by source and by fit with existing views",
        example: "a correction that repeats the myth in order to deny it often reinforces it",
        soWhat: "the format of a correction matters as much as its accuracy",
      },
      {
        claim: "the effective interventions are unglamorous",
        because: "small frictions reduce impulsive sharing",
        example: "a few seconds of delay before reposting and a visible source label",
        soWhat: "design changes outperform campaigns that ask people to be careful",
      },
    ],
    counter: "regulating speech risks handing governments a tool of control",
    rebuttal: "regulating the design of a distribution system is not the same as regulating what may be said",
    vocabulary: ["misinformation", "polarisation", "sensationalism", "credibility", "algorithmic amplification", "public interest"],
  },
];

const GENERIC: TopicProfile = {
  id: "generic",
  name: "General argument",
  keywords: [],
  issue: "the question posed",
  positions: [
    "the benefits are real, but they are unevenly distributed",
    "the policy addresses a symptom rather than the cause",
  ],
  ideas: [
    { claim: "the practical consequences matter more than the principle", because: "policies are judged by what they change on the ground", example: "a rule that is widely ignored produces cynicism rather than compliance", soWhat: "implementation is the real test" },
    { claim: "the costs fall on people who did not choose them", because: "decisions are usually taken by those who bear least of the risk", example: "residents near a new development absorb the disruption, not the developer", soWhat: "fairness is a question of who pays, not only of what is done" },
  ],
  counter: "there are legitimate arguments on the other side",
  rebuttal: "those arguments describe what is desirable, not what is achievable",
  vocabulary: ["consequence", "implementation", "incentive", "distribution", "trade-off"],
};

export function detectTopic(prompt: string): TopicProfile {
  const lower = prompt.toLowerCase();
  let best: { p: TopicProfile; score: number } = { p: GENERIC, score: 0 };
  for (const p of topicProfiles) {
    const score = p.keywords.reduce((n, k) => n + (lower.includes(k) ? (k.includes(" ") ? 2 : 1) : 0), 0);
    if (score > best.score) best = { p, score };
  }
  return best.p;
}

const cap = (s: string) => {
  const t = s.trim().replace(/\s+/g, " ");
  if (!t) return "";
  const c = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?]$/.test(c) ? c : `${c}.`;
};

const clause = (s: string) => s.trim().replace(/[.!?]+$/, "");

/** Natural noun phrase for the intro, so acronyms are not lowercased into nonsense. */
function topicPhrase(name: string): string {
  const map: Record<string, string> = {
    "AI and employment": "artificial intelligence and employment",
    "Social media and young people": "social media and young people",
    "Environment and climate": "environmental responsibility",
    Education: "education",
    "Cities and transport": "urban transport and housing",
    Health: "public health",
    "Technology and privacy": "technology and privacy",
    "Globalisation and economy": "globalisation",
    "Media and information": "the media and public trust",
    "General argument": "",
  };
  return map[name] ?? name.toLowerCase();
}

/** Build a full sample answer from the student's own ideas. */
export function buildEssay(input: {
  prompt: string;
  position: string;
  ideas: Idea[];
  counter: string;
  topicName?: string;
  vocabulary?: string[];
}): CoachPlan {
  const topic = input.topicName ?? detectTopic(input.prompt).name;
  const ideas = input.ideas.filter((i) => clause(i.claim) && clause(i.because));
  const safeIdeas = ideas.length ? ideas : detectTopic(input.prompt).ideas.slice(0, 2);

  const phrase = topicPhrase(topic);
  const intro =
    `${phrase ? `The question of ${phrase}` : "This question"} is frequently debated, and the arguments on both sides are not trivial. ` +
    `While ${clause(input.counter) || "there are reasonable objections"}, I would argue that ${clause(input.position)}. ` +
    `Two developments support this view.`;

  const bodies = safeIdeas.map((i, idx) => {
    const lead = idx === 0 ? "The most important consideration is that" : "A second factor is that";
    const exampleClause = /^(a|an|the|in|for|at)\b/i.test(clause(i.example))
      ? `A clear illustration is ${clause(i.example)}.`
      : `For instance, ${clause(i.example)}.`;
    const soWhat = i.soWhat
      ? `${cap(i.soWhat)}`
      : idx === 0
        ? "The effect is cumulative rather than immediate, which is why it is easy to underestimate."
        : "This suggests that the issue cannot be resolved by appealing to individual responsibility alone.";
    return `${lead} ${clause(i.claim)}. This matters because ${clause(i.because)}. ${exampleClause} ${soWhat}`;
  });

  const concession = input.counter
    ? `Admittedly, ${clause(input.counter)}. Nevertheless, ${clause(
        detectTopic(input.prompt).rebuttal
      )}.`
    : "";

  const conclusion =
    `In conclusion, although ${clause(input.counter) || "the opposing case has merit"}, the evidence points to a clearer conclusion: ` +
    `${clause(input.position)}. The practical implication is that ${clause(
      safeIdeas[safeIdeas.length - 1]?.soWhat ?? "policy should target the structure of the problem rather than its symptoms"
    )}.`;

  const paragraphs = [intro, ...bodies, concession, conclusion].filter(Boolean);
  const full = paragraphs.map((p) => (p.endsWith(".") ? p : `${p}.`)).join("\n\n");
  const words = full.split(/\s+/).filter(Boolean).length;

  return {
    topic,
    kind: "Task 2 essay",
    intro,
    bodies,
    conclusion,
    full,
    vocabulary: input.vocabulary ?? detectTopic(input.prompt).vocabulary,
    linkers: ["While …", "The most important consideration is that …", "This matters because …", "A clear illustration is …", "Admittedly …", "Nevertheless …", "In conclusion …"],
    notes: [
      words < 250 ? `This draft is ${words} words. Task 2 requires at least 250 — add a third body paragraph or extend the first.` : `At ${words} words this is a comfortable length for Task 2.`,
      "Read it once for logic only: does each paragraph follow from the one before?",
      "Then replace two or three of your general phrases with the topic vocabulary below.",
    ],
    words,
  };
}

/** Build a 2-minute Part 2 speaking answer from cue notes. */
export function buildSpeakingAnswer(input: { prompt: string; notes: string[]; feeling: string; topic?: string }): CoachPlan {
  const notes = input.notes.map((n) => clause(n)).filter(Boolean);
  const spokenTopic = clause(input.prompt)
    .replace(/^describe\s+/i, "")
    .replace(/\byour\b/gi, "my")
    .replace(/\byou\b/gi, "I")
    .replace(/^(a|an|the)\s+/i, "$1 ");
  const opener = `I'd like to talk about ${spokenTopic}.`;
  const chunks: string[] = [opener];

  if (notes[0]) chunks.push(`${cap(notes[0])} That is probably the first thing I should explain.`);
  if (notes[1]) chunks.push(`As for ${/^how|^what|^why|^when/i.test(notes[1]) ? "the details" : "the second point"}, ${clause(notes[1])}.`);
  if (notes[2]) chunks.push(`What makes it memorable, though, is that ${clause(notes[2])}.`);
  if (notes[3]) chunks.push(`Looking back, ${clause(notes[3])}.`);
  if (input.feeling) chunks.push(`If I had to describe how I felt, I would say ${clause(input.feeling)}.`);
  chunks.push(
    "So, in summary, it is not the most dramatic thing that has happened to me, but it changed how I think about the subject, which is why I remember it so clearly."
  );

  const full = chunks.join(" ");
  const words = full.split(/\s+/).filter(Boolean).length;

  return {
    topic: input.topic ?? detectTopic(input.prompt).name,
    kind: "Speaking Part 2",
    intro: opener,
    bodies: chunks.slice(1, -1),
    conclusion: chunks[chunks.length - 1],
    full,
    vocabulary: ["What makes it memorable is …", "Looking back, …", "If I had to describe …", "As for …", "which is why I …"],
    linkers: ["So,", "What makes it memorable, though, is …", "Looking back, …", "As for …", "In summary, …"],
    notes: [
      `This answer is ${words} words. At a natural pace that is roughly ${Math.round((words / 140) * 60)} seconds — Part 2 should run 90–120 seconds.`,
      "Do not memorise it. Learn the four signposts and improvise the content.",
      "Record yourself delivering it once, then listen only for fillers.",
    ],
    words,
  };
}

/** Extract candidate ideas from a free-text brainstorm box. */
export function extractIdeas(text: string): string[] {
  return text
    .split(/\n|;|(?<=\.)\s+|,\s+(?=(?:because|since|which|as|so|but|although)\b)/i)
    .map((s) => s.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((s) => s.split(/\s+/).length >= 3)
    .slice(0, 12);
}

export const openingBank = [
  "It is tempting to treat this as a simple question of cost, but the real difficulty is structural.",
  "The debate is usually framed as a choice between two goods, which is precisely why it is unresolved.",
  "Few issues divide opinion as sharply, and few are as poorly understood.",
  "Behind the disagreement lies an empirical question that neither side has answered convincingly.",
  "The claim sounds reasonable until one considers who would actually bear the cost.",
  "It would be convenient if the answer were a matter of individual behaviour; unfortunately it is not.",
];

export const conclusionBank = [
  "The realistic objective is not a reversal of the trend but a redistribution of its costs.",
  "What is required is not more enthusiasm but better-designed institutions.",
  "The choice is not between change and stability; it is between change that is planned and change that is not.",
  "On balance the case for action is stronger, provided the action is precise.",
];
