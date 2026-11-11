export type GrammarLesson = {
  id: string;
  title: string;
  goal: string;
  why: string;
  structure: string[];
  examples: { sentence: string; note: string }[];
  upgrades: { from: string; to: string; why: string }[];
  practice: { prompt: string; model: string }[];
};

export const grammarLessons: GrammarLesson[] = [
  {
    id: "l1",
    title: "Simple, compound and complex sentences",
    goal: "Control three sentence types and combine them so that no two consecutive sentences have the same shape.",
    why: "Grammatical Range and Accuracy is 25% of your Writing score. Range means variety of structures, not length. A page of short correct sentences is Band 5; a page of long tangled ones is also Band 5.",
    structure: [
      "Simple: one independent clause — The policy failed.",
      "Compound: two independent clauses joined by and / but / so / yet — The policy failed, but the idea was sound.",
      "Complex: one independent clause plus a dependent clause — Although the policy failed, the idea was sound.",
      "The dependent clause can lead or follow. Leading is more formal and creates emphasis.",
    ],
    examples: [
      { sentence: "Although recycling rates rose, landfill volumes barely fell.", note: "Concessive clause first — sets up a contrast the reader now expects you to resolve." },
      { sentence: "Cities that pedestrianised their centres reported higher retail turnover.", note: "Defining relative clause embedded in the subject." },
      { sentence: "The cost fell; adoption rose.", note: "Two short clauses with a semicolon — use once per essay for rhythm." },
    ],
    upgrades: [
      { from: "The city built more roads. Traffic got worse.", to: "Although the city built more roads, traffic congestion worsened, because new capacity attracts drivers who previously stayed at home.", why: "Adds concession and a cause without adding a new paragraph." },
      { from: "Many students use AI. Teachers are worried.", to: "The growing use of AI by students has alarmed teachers, many of whom cannot tell whether an essay is original.", why: "Nominalisation ('the growing use') plus a non-defining relative clause." },
    ],
    practice: [
      { prompt: "Combine: Remote work is popular. City centres are empty. (Use a concessive clause.)", model: "Although remote work has proved popular with employees, it has left many city centres short of activity." },
      { prompt: "Combine into one complex sentence: The scheme was expensive. It reduced reoffending.", model: "Even though the scheme was expensive, it reduced reoffending by a third, which made it cheaper than imprisonment." },
    ],
  },
  {
    id: "l2",
    title: "Relative clauses",
    goal: "Add information to a noun without starting a new sentence.",
    why: "Relative clauses are the most reliable way to show grammatical range while keeping sentences controlled. They also let you define precisely rather than vaguely.",
    structure: [
      "Defining (no commas): identifies which one — Workers who lack training are most at risk.",
      "Non-defining (with commas): adds extra information — The scheme, which began in 2019, has been extended.",
      "Whose / where / when for possession, place and time.",
      "Reduce to a participle clause to sound more formal: 'students who study abroad' → 'students studying abroad'.",
    ],
    examples: [
      { sentence: "The households most affected are those whose homes predate insulation standards.", note: "'whose' avoids a clumsy 'the homes of which'." },
      { sentence: "Night trains, which were written off as obsolete in 2010, are returning to European timetables.", note: "Non-defining clause carries the contrast." },
      { sentence: "Reformers argue for a system in which assessment rewards reasoning rather than recall.", note: "Preposition + which for formal precision." },
    ],
    upgrades: [
      { from: "Some people do not have a bank account. They cannot receive the payment.", to: "People who do not hold a bank account cannot receive the payment, which excludes precisely those the scheme was designed to help.", why: "Combines two weak sentences and adds consequence." },
      { from: "The report was published last year. It found a large gap.", to: "A report published last year found a substantial gap between the two groups.", why: "Reduced relative clause — no 'which was'." },
    ],
    practice: [
      { prompt: "Combine with 'whose': The company lost money. Its product had been recalled.", model: "The company whose product had been recalled lost a substantial share of the market." },
      { prompt: "Reduce the clause: Students who are preparing for IELTS need timed practice.", model: "Students preparing for IELTS need timed practice." },
    ],
  },
  {
    id: "l3",
    title: "Conditionals and hypotheticals",
    goal: "Use if-clauses accurately, including the second and third conditional.",
    why: "Conditionals let you discuss consequences and alternatives — exactly what Task 2 requires when you evaluate a proposal. Errors here are conspicuous because the meaning changes completely with the tense.",
    structure: [
      "Zero: If + present, present — general truth: If prices rise, demand falls.",
      "First: If + present, will — realistic future: If the city builds the line, congestion will ease.",
      "Second: If + past, would — hypothetical present: If the city built the line, congestion would ease.",
      "Third: If + had + past participle, would have — hypothetical past: If the city had built the line, congestion would have eased.",
      "Inversion for formality: Were the tax raised, behaviour would change. / Had the scheme been piloted, the flaw would have emerged.",
    ],
    examples: [
      { sentence: "If governments priced carbon at its social cost, renewable energy would compete without subsidy.", note: "Second conditional — a hypothetical policy with its consequence." },
      { sentence: "Had the pilot been evaluated honestly, the scheme would not have been rolled out nationally.", note: "Inverted third conditional — elevated and compact." },
      { sentence: "Unless enforcement improves, the rule will remain symbolic.", note: "'Unless' already means 'if not' — do not write 'unless … not'." },
    ],
    upgrades: [
      { from: "If we do not act, it will be bad.", to: "Unless emissions fall sharply this decade, the temperature targets agreed in Paris will be missed.", why: "Specific condition, specific consequence, no vague 'bad'." },
      { from: "Maybe the government should spend more.", to: "Were the government to redirect a fraction of the subsidy, the scheme would pay for itself.", why: "Inversion plus a concrete comparison." },
    ],
    practice: [
      { prompt: "Rewrite as a third conditional: The ban was not enforced. Traffic did not fall.", model: "Had the ban been enforced, traffic volumes would have fallen." },
      { prompt: "Rewrite formally: If the council raised the charge, fewer people would drive.", model: "Were the council to raise the charge, fewer people would drive." },
    ],
  },
  {
    id: "l4",
    title: "The passive and impersonal structures",
    goal: "Shift focus from the doer to the action, and sound appropriately academic.",
    why: "Task 1 processes require the passive. In Task 2, impersonal structures ('It is widely argued that…') let you report views without repeating 'some people say'.",
    structure: [
      "Passive: be + past participle — The glass is crushed. The policy was introduced in 2019.",
      "Reporting passive: It is argued / believed / estimated that …",
      "Passive with modal: The rule must be enforced. / Parts can now be replaced.",
      "Avoid agentless passives when the actor matters: 'Mistakes were made' hides responsibility — which is sometimes the point, and sometimes evasive.",
    ],
    examples: [
      { sentence: "Once the bottles have been sorted, they are washed and crushed into cullet.", note: "Two passives in sequence — standard for process description." },
      { sentence: "It is often claimed that automation creates more work than it destroys.", note: "Reporting passive distances the writer from the claim." },
      { sentence: "The decision cannot be delegated to a system that is unable to explain itself.", note: "Passive with modal, plus a relative clause." },
    ],
    upgrades: [
      { from: "They collect the rubbish every week.", to: "Household waste is collected weekly.", why: "Processes and routines are described in the passive." },
      { from: "People think that exams are unfair.", to: "Examinations are widely regarded as an imprecise measure of ability.", why: "Reporting passive plus precise lexis." },
    ],
    practice: [
      { prompt: "Make it passive: The company transports the bottles to a plant.", model: "The bottles are transported to a processing plant." },
      { prompt: "Rewrite impersonally: Many people say online learning is worse.", model: "Online learning is often said to be inferior to classroom teaching." },
    ],
  },
  {
    id: "l5",
    title: "Nominalisation",
    goal: "Turn verbs and adjectives into nouns to raise the register of your writing.",
    why: "Nominalisation is the single clearest marker of academic register, and it enables dense sentences. Overdo it and the prose becomes unreadable, so use it where a sentence is doing analytical work.",
    structure: [
      "Verb → noun: fail → failure; consume → consumption; decline → a decline.",
      "Adjective → noun: likely → likelihood; able → ability.",
      "The verb 'to be' often disappears: 'Prices rose sharply' → 'The sharp rise in prices'.",
      "Keep the agent clear — nominalisation can hide who did what.",
    ],
    examples: [
      { sentence: "The sharp rise in energy costs contributed to the decline in manufacturing output.", note: "Two nominalised clauses, one finite verb ('contributed') — dense but readable." },
      { sentence: "Their inability to enforce the rule undermined its credibility.", note: "'Unable' becomes 'inability' and the sentence gains a subject." },
    ],
    upgrades: [
      { from: "The population is getting older quickly. This is a problem for hospitals.", to: "The rapid ageing of the population places growing pressure on hospital capacity.", why: "Adjective+noun becomes a noun phrase that can be the subject." },
      { from: "People consume too much, and this damages the environment.", to: "Excessive consumption is a principal driver of environmental degradation.", why: "Nominalisation plus precise causal lexis." },
    ],
    practice: [
      { prompt: "Nominalise: The government failed to act, and this made things worse.", model: "The government's failure to act exacerbated the situation." },
      { prompt: "Nominalise: Costs increased, so fewer people bought houses.", model: "The increase in costs led to a decline in house purchases." },
    ],
  },
  {
    id: "l6",
    title: "Participle and reduced clauses",
    goal: "Compress two clauses into one and vary your openings.",
    why: "Participle clauses give you sentence openings other than 'The' or 'However'. They also let you connect cause and result elegantly.",
    structure: [
      "Present participle (-ing) for simultaneous action or cause: Facing rising costs, the firm cut staff.",
      "Perfect participle (having + past participle) for an earlier action: Having secured funding, the team began.",
      "Past participle for passive reduction: Built in 1890, the bridge now needs repair.",
      "The subject of the participle must be the subject of the main clause — otherwise you create a 'dangling modifier'.",
    ],
    examples: [
      { sentence: "Facing a shortage of drivers, the operator reduced its timetable.", note: "Cause, compactly expressed." },
      { sentence: "Having been rejected twice, the proposal was finally approved.", note: "Perfect passive participle — earlier event, passive." },
      { sentence: "Built from recycled steel, the bridge carries a fraction of the traffic it once did.", note: "Past participle opening adds information without a clause." },
    ],
    upgrades: [
      { from: "The city installed sensors. It reduced its energy bill by a third.", to: "Having installed sensors on street lights, the city cut its energy bill by nearly a third.", why: "Two sentences become one with a clear causal link." },
      { from: "The report was written quickly. It contained several errors.", to: "Written in haste, the report contained several errors.", why: "Past participle replaces a passive relative clause." },
    ],
    practice: [
      { prompt: "Combine with a participle: She read the data. She changed her conclusion.", model: "Having read the data carefully, she revised her conclusion." },
      { prompt: "Fix the dangling modifier: Walking through the city, the sensors recorded high temperatures.", model: "Walking through the city, I noticed that the sensors recorded high temperatures." },
    ],
  },
  {
    id: "l7",
    title: "Emphasis: cleft sentences and inversion",
    goal: "Put weight on the most important idea.",
    why: "These structures are rare enough to be impressive when accurate, and conspicuous when wrong. One or two in a Task 2 essay is enough.",
    structure: [
      "It-cleft: It is the cost, not the principle, that divides opinion.",
      "What-cleft: What matters most is whether the rule can be enforced.",
      "Negative inversion: Not only does it reduce cost, but it also improves reliability.",
      "Adverbial inversion: Rarely has a policy been so widely misunderstood.",
    ],
    examples: [
      { sentence: "It is the design of the feed, rather than the child, that requires regulation.", note: "It-cleft — directs attention to the true subject of the argument." },
      { sentence: "What the evidence does not show is that bans reduce use.", note: "What-cleft used to introduce a limitation." },
      { sentence: "Not only does the scheme cost less, but it also produces better outcomes.", note: "Inversion after 'not only' — auxiliary before subject." },
    ],
    upgrades: [
      { from: "The cost is the main problem.", to: "It is cost, rather than principle, that remains the main obstacle.", why: "It-cleft plus a contrast." },
      { from: "This is the most important point.", to: "What matters most is not the technology but who controls the data it produces.", why: "What-cleft that carries content rather than announcing it." },
    ],
    practice: [
      { prompt: "Rewrite with an it-cleft: Teachers matter more than buildings.", model: "It is teachers, not buildings, that determine the quality of a school." },
      { prompt: "Invert: It not only saves money but also saves time.", model: "Not only does it save money, but it also saves time." },
    ],
  },
];

export const commonErrors = [
  { wrong: "In my opinion, I think that…", right: "In my opinion, … / I think that …", why: "Double opinion marker. Choose one." },
  { wrong: "People is…", right: "People are…", why: "'People' is plural. 'Persons' exists but is legal register." },
  { wrong: "Nowadays, many people… (used in every essay)", right: "Over the past decade / In most cities today…", why: "Overused opener; examiners read it hundreds of times a day." },
  { wrong: "This essay will discuss both sides and give my opinion.", right: "State the position: 'Although both arguments have merit, the economic case is stronger.'", why: "A table of contents is not an argument." },
  { wrong: "The amount of people increased.", right: "The number of people increased.", why: "'Amount' for uncountable nouns; 'number' for countable." },
  { wrong: "Less people", right: "Fewer people", why: "'Fewer' with countable nouns." },
  { wrong: "Informations / advices / researches", right: "Information / advice / research", why: "Uncountable in English — no plural -s." },
  { wrong: "According to me", right: "In my view", why: "'According to' attributes to a source, not to yourself." },
  { wrong: "It is more better", right: "It is better", why: "Double comparative." },
  { wrong: "Every people", right: "Everyone / every person", why: "'Every' takes a singular noun." },
  { wrong: "Although… but…", right: "Although…, …", why: "Choose one connector; both together is a classic Band 5 error." },
  { wrong: "For example, in my country… (with no detail)", right: "For example, in 2024 the German government required…", why: "An example needs a specific detail, not a location." },
  { wrong: "I very like it", right: "I really like it / I like it very much", why: "'Very' cannot modify a verb." },
  { wrong: "Discuss about the topic", right: "Discuss the topic", why: "'Discuss' is transitive." },
  { wrong: "The reason is because…", right: "The reason is that…", why: "Redundant structure." },
];

export const sentenceVarietyDrill = [
  { simple: "Traffic is bad.", complex: "Because the city has added capacity without pricing it, traffic has worsened despite the new roads.", label: "Concession + cause" },
  { simple: "Online learning is useful.", complex: "Online learning, which was adopted in haste, has proved more durable than its critics predicted.", label: "Non-defining relative clause" },
  { simple: "The government should act.", complex: "Were the government to price carbon honestly, the market would do most of the remaining work.", label: "Inverted conditional" },
  { simple: "Costs are rising.", complex: "What has driven costs upward is not wages but the price of energy.", label: "What-cleft" },
  { simple: "The policy helped people.", complex: "Having cut waiting times by half, the policy delivered where previous reforms had not.", label: "Perfect participle" },
  { simple: "Many people disagree.", complex: "There is little consensus on whether the scheme has succeeded, which is itself informative.", label: "There-construction + comment clause" },
];
