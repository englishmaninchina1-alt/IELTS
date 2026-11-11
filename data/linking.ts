export type LinkingGroup = {
  id: string;
  function: string;
  description: string;
  items: { word: string; register: "neutral" | "formal" | "informal"; example: string; warning?: string }[];
  practice: { weak: string; strong: string; note: string }[];
};

export const linkingGroups: LinkingGroup[] = [
  {
    id: "addition",
    function: "Adding information",
    description: "Signals a second point that supports the first. Useful in body paragraphs, but do not stack them — three 'moreovers' in four sentences reads mechanically.",
    items: [
      { word: "Moreover", register: "formal", example: "Moreover, the policy would cost less than the current subsidy." },
      { word: "Furthermore", register: "formal", example: "Furthermore, the evidence for the claim is thin." },
      { word: "In addition", register: "neutral", example: "In addition, employers report difficulty filling technical roles." },
      { word: "What is more", register: "neutral", example: "What is more, the scheme pays for itself within three years." },
      { word: "Not only … but also", register: "formal", example: "The measure not only cuts emissions but also reduces household bills.", warning: "Invert the subject after 'not only': 'Not only does it cut emissions…'" },
      { word: "Coupled with", register: "formal", example: "Coupled with rising rents, the shortage has pushed young families outward." },
    ],
    practice: [
      { weak: "Also it is cheap. Also it is popular.", strong: "Not only is it inexpensive, but it is also politically popular.", note: "Combine and vary: repeated 'also' is the commonest cohesion weakness at Band 6." },
      { weak: "It helps the environment. Moreover it helps the economy. Moreover it helps people.", strong: "It benefits the environment and the economy alike, and its social effects are largely positive.", note: "Three identical connectives in a row is worse than none." },
    ],
  },
  {
    id: "contrast",
    function: "Contrasting",
    description: "Shows a difference between two facts. This is the group examiners notice most, because comparison is the engine of Task 1 and of a balanced Task 2.",
    items: [
      { word: "However", register: "formal", example: "The initial cost is high. However, the savings accrue within a decade." },
      { word: "Nevertheless", register: "formal", example: "The evidence is limited; nevertheless, the direction is consistent." },
      { word: "By contrast", register: "formal", example: "Berlin's commute grew modestly. By contrast, Austin's rose by 58%." },
      { word: "Whereas", register: "formal", example: "Whereas Germany recycled 69%, the United States managed 35%.", warning: "Introduces a clause, not a noun phrase: 'whereas the US' ✓, 'whereas in the US' ✗" },
      { word: "While", register: "neutral", example: "While rail use doubled, walking declined." },
      { word: "Conversely", register: "formal", example: "Cities with frequent services gained passengers; conversely, those that cut them lost riders." },
      { word: "That said", register: "neutral", example: "That said, the scheme is not without cost." },
    ],
    practice: [
      { weak: "Cars went down. But trains went up.", strong: "Car use fell sharply, whereas rail patronage more than doubled.", note: "Join contrast into one sentence with 'whereas'; a full stop plus 'But' is too informal." },
      { weak: "However the price is high.", strong: "However, the price remains the principal obstacle.", note: "Comma after a sentence-initial 'However'." },
    ],
  },
  {
    id: "cause",
    function: "Cause and reason",
    description: "Explains why something happens. In Task 2 the reason is usually the most important sentence in a body paragraph — it is what separates Band 6 from Band 7.",
    items: [
      { word: "because", register: "neutral", example: "Repair is worthwhile because manufacturing dominates the lifetime footprint." },
      { word: "since", register: "neutral", example: "Since most journeys are short, cycling is practical." },
      { word: "owing to", register: "formal", example: "Owing to staff shortages, collections were reduced.", warning: "Followed by a noun phrase, not a clause." },
      { word: "due to", register: "neutral", example: "The decline was due to cheaper flights." },
      { word: "given that", register: "formal", example: "Given that the technology exists, the barrier is political." },
      { word: "in so far as", register: "formal", example: "The argument holds in so far as costs are shared.", warning: "Use sparingly; it reads as decoration if overused." },
    ],
    practice: [
      { weak: "It is bad because it is bad for people.", strong: "It is harmful because it concentrates pollution in the neighbourhoods least able to avoid it.", note: "A reason must add information; 'because it is bad' repeats the claim." },
    ],
  },
  {
    id: "effect",
    function: "Result and consequence",
    description: "States what follows. Reaching a consequence — rather than stopping at the assertion — is how a paragraph earns its marks for development.",
    items: [
      { word: "Therefore", register: "formal", example: "Therefore, the subsidy should be redirected rather than increased." },
      { word: "Consequently", register: "formal", example: "Consequently, many graduates accept work below their qualification." },
      { word: "As a result", register: "neutral", example: "As a result, occupancy fell below the level needed to break even." },
      { word: "Thus", register: "formal", example: "Thus a policy intended to help tenants raised their rents.", warning: "Do not use 'thus' as a synonym for 'so' in speech; it is written register." },
      { word: "Thereby", register: "formal", example: "The rule caps part prices, thereby extending the life of appliances.", warning: "Follow with a participle (-ing), never a full clause." },
      { word: "This means that", register: "neutral", example: "This means that the poorest households pay the most per unit." },
    ],
    practice: [
      { weak: "The city is crowded. It is a problem.", strong: "The city is now so crowded that average journey times have risen by a fifth, which in turn deters people from using public transport.", note: "Chain the consequence: cause → effect → further effect." },
    ],
  },
  {
    id: "concession",
    function: "Conceding and rebutting",
    description: "Admits the opposing point before answering it. This is the single most effective structure for a Band 7+ discussion essay, because it shows you can hold two ideas at once.",
    items: [
      { word: "Although", register: "neutral", example: "Although the technology is promising, its adoption has been slow." },
      { word: "Even so", register: "neutral", example: "The cost has fallen. Even so, few households have switched." },
      { word: "Admittedly", register: "formal", example: "Admittedly, no policy can eliminate the shortage entirely." },
      { word: "Despite", register: "formal", example: "Despite substantial investment, waiting times lengthened.", warning: "Follow with a noun or -ing form, not a clause." },
      { word: "It is true that … but", register: "neutral", example: "It is true that automation creates roles, but they are not interchangeable with those it removes." },
      { word: "While this is a fair point,", register: "formal", example: "While this is a fair point, it understates the cost of transition." },
    ],
    practice: [
      { weak: "Some people say no. I say yes.", strong: "Admittedly, a ban would protect some children. Nevertheless, it would also remove the online communities on which others depend.", note: "Concede specifically, then rebut specifically." },
    ],
  },
  {
    id: "example",
    function: "Illustrating",
    description: "A specific example converts an opinion into an argument. In the Writing test, an invented but plausible example is acceptable; a vague one is not.",
    items: [
      { word: "for instance", register: "neutral", example: "For instance, a couchette costs less than a discounted flight." },
      { word: "such as", register: "neutral", example: "Cities such as Lisbon and Vienna have expanded night services." },
      { word: "a case in point", register: "formal", example: "Calgary's office conversion programme is a case in point." },
      { word: "to illustrate", register: "formal", example: "To illustrate, one study found an eight-degree difference between adjacent districts." },
      { word: "specifically", register: "neutral", example: "The effect is concentrated in one group, specifically older workers." },
    ],
    practice: [
      { weak: "For example, many countries have this problem.", strong: "For example, France banned domestic flights on routes served by a train under two and a half hours.", note: "Name the country, the policy or the number. 'Many countries' is not an example." },
    ],
  },
  {
    id: "sequence",
    function: "Sequencing and signposting",
    description: "Guides the reader through your structure. In Task 1 processes this is essential; in Task 2 use it lightly.",
    items: [
      { word: "First / firstly", register: "neutral", example: "The first stage is the collection of used bottles." },
      { word: "Once …", register: "neutral", example: "Once sorted, the glass is washed to remove labels." },
      { word: "Subsequently", register: "formal", example: "The cullet is subsequently melted at 1,500°C." },
      { word: "At this point", register: "neutral", example: "At this point the mixture is cooled and moulded." },
      { word: "Finally", register: "neutral", example: "Finally, the bottles are distributed to retailers." },
      { word: "Ultimately", register: "formal", example: "Ultimately, the process returns the material to the same supply chain." },
    ],
    practice: [
      { weak: "First this. Second this. Third this. Fourth this.", strong: "The process begins with collection; once the glass has been sorted and washed, it is crushed and melted before being moulded into new bottles.", note: "Combine stages into sentences; do not give each stage its own numbered sentence." },
    ],
  },
  {
    id: "conclusion",
    function: "Concluding",
    description: "Signals that you are finishing. Never introduce a new argument after these markers — the examiner will treat it as an unfinished essay.",
    items: [
      { word: "In conclusion", register: "formal", example: "In conclusion, the benefits are real but unevenly distributed." },
      { word: "To sum up", register: "neutral", example: "To sum up, the technology is a supplement rather than a substitute." },
      { word: "Overall", register: "neutral", example: "Overall, recycling rates rose in all four countries.", warning: "In Task 1, 'Overall' is for the overview paragraph near the start, not the end." },
      { word: "On balance", register: "formal", example: "On balance, the case for regulation is stronger than the case against." },
    ],
    practice: [
      { weak: "In conclusion, I agree. Also there is another reason which is money.", strong: "In conclusion, although cost is a genuine obstacle, the evidence favours regulation.", note: "A conclusion restates; it does not add." },
    ],
  },
];

export const coherenceRules = [
  { rule: "One idea per paragraph", detail: "A body paragraph should make a single claim, explain it, illustrate it, and stop. Two claims in one paragraph usually means neither is developed." },
  { rule: "Topic sentence first", detail: "Open with the claim, not with background. 'The main objection is economic.' Then explain." },
  { rule: "Reference backwards", detail: "Use 'this', 'such', 'the former', 'the latter' to link sentences without repeating nouns. This is cohesion that examiners actually reward." },
  { rule: "Do not announce, argue", detail: "'In this essay I will discuss both sides and give my opinion' is a table of contents, not an argument. State the position instead." },
  { rule: "Vary sentence length deliberately", detail: "A short sentence after two long ones creates emphasis. Uniform 25-word sentences read as a wall." },
  { rule: "Paragraph length: 3–6 sentences", detail: "One-sentence paragraphs and 12-line paragraphs both signal weak control." },
];
