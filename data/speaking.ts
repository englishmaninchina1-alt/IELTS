export type SpeakingPart1Set = {
  id: string;
  topic: string;
  questions: string[];
  sampleAnswer: string;
  upgrade: { basic: string; better: string }[];
};

export type CueCard = {
  id: string;
  topic: string;
  prompt: string;
  bullets: string[];
  part3: string[];
  sample: string;
  vocabulary: string[];
};

export const part1Sets: SpeakingPart1Set[] = [
  {
    id: "p1-work",
    topic: "Work and study",
    questions: [
      "Do you work or are you a student?",
      "What do you enjoy most about it?",
      "Would you like to change anything about your job or course?",
      "Is there a skill you would like to learn for work?",
    ],
    sampleAnswer:
      "I'm a final-year student, studying environmental engineering. What I enjoy most is the fieldwork, actually — we spent a week measuring water quality in a river last term, and it made the theory click in a way lectures never did. If I could change one thing, I'd reduce the amount of assessment by examination; we do a lot of memorising when the real skill is designing a study. And I'd like to learn GIS properly, because everyone in the field uses it and I've only taught myself the basics.",
    upgrade: [
      { basic: "I like my course because it is interesting.", better: "What I enjoy most is the fieldwork — it made the theory click in a way lectures never did." },
      { basic: "I want to learn more computer skills.", better: "I'd like to learn GIS properly, because everyone in the field uses it and I've only taught myself the basics." },
    ],
  },
  {
    id: "p1-home",
    topic: "Home and neighbourhood",
    questions: [
      "Where are you living at the moment?",
      "What do you like about your neighbourhood?",
      "Has the area changed since you moved there?",
      "Would you prefer to live in a city or the countryside?",
    ],
    sampleAnswer:
      "I rent a small flat on the edge of the city centre, about twenty minutes' walk from the market. The thing I like most is that everything is within reach — there's a bakery downstairs, a tram stop on the corner, and a park five minutes away. It has changed quite a lot, actually: three of the shops on the street have become cafés, which is nice for me but has pushed rents up. Long term I'd rather live somewhere quieter, though I suspect I'd miss the convenience within a week.",
    upgrade: [
      { basic: "My area is good because there are many shops.", better: "Everything is within reach — a bakery downstairs, a tram stop on the corner, and a park five minutes away." },
      { basic: "The area has changed a lot.", better: "Three of the shops on the street have become cafés, which is nice for me but has pushed rents up." },
    ],
  },
  {
    id: "p1-tech",
    topic: "Technology",
    questions: [
      "How often do you use your phone?",
      "Is there an app you couldn't live without?",
      "Do you think you spend too much time online?",
      "How do you feel about AI assistants?",
    ],
    sampleAnswer:
      "Probably more than I'd like to admit — I check it first thing, which is a habit I'm trying to break. The one app I'd genuinely miss is a maps app, because I have a terrible sense of direction and it has rescued me in about six countries. As for time online, yes, though I'd distinguish between passive scrolling and actually talking to people, which I don't regret. AI assistants I'm cautiously positive about: they're useful for drafting and for explaining things, but I wouldn't trust one with anything I couldn't check myself.",
    upgrade: [
      { basic: "I use my phone a lot every day.", better: "Probably more than I'd like to admit — I check it first thing, which is a habit I'm trying to break." },
      { basic: "AI is good and bad.", better: "I'm cautiously positive: they're useful for drafting, but I wouldn't trust one with anything I couldn't check myself." },
    ],
  },
  {
    id: "p1-leisure",
    topic: "Free time",
    questions: [
      "What do you do in your free time?",
      "Do you prefer indoor or outdoor activities?",
      "Did you have the same hobbies when you were a child?",
      "Is there something new you'd like to try?",
    ],
    sampleAnswer:
      "I run, badly but regularly, and I read a lot — mostly non-fiction, which is either a virtue or an inability to relax, depending on who you ask. I'd say I prefer outdoor activities in principle, though the weather where I live makes it a fairly theoretical preference between November and March. As a child I was completely different: I played chess obsessively and almost never went outside. Something I'd like to try is climbing, but I'd want a proper course first rather than being lowered off a wall by someone who knows what they're doing while I panic.",
    upgrade: [
      { basic: "I like running and reading.", better: "I run, badly but regularly, and I read a lot — mostly non-fiction, which is either a virtue or an inability to relax." },
      { basic: "I was different as a child.", better: "I played chess obsessively and almost never went outside, which is the opposite of now." },
    ],
  },
];

export const cueCards: CueCard[] = [
  {
    id: "c1",
    topic: "A skill you learned",
    prompt: "Describe a skill you learned that took a long time to master.",
    bullets: [
      "what the skill was",
      "how you learned it",
      "how long it took",
      "and explain how you felt when you finally mastered it",
    ],
    part3: [
      "Why do some skills take longer to learn than others?",
      "Should schools teach practical skills as well as academic subjects?",
      "Is it easier to learn a skill as a child or as an adult?",
      "Will people need to retrain more often in the future?",
    ],
    sample:
      "I'd like to talk about learning to swim properly — not just staying afloat, but swimming with some technique. I grew up in a town with no pool, so I only learned in my twenties, when a friend dragged me to adult lessons at a sports centre near my office.\n\nWe went once a week for about eight months, which sounds excessive for swimming, but I was genuinely frightened of deep water and that was the real obstacle rather than the physical one. My instructor was quite patient — she spent the first month just getting me to put my face in the water without panicking. Once that was done, the actual strokes came fairly quickly: front crawl took perhaps six weeks to coordinate, and breathing on the side took longer still.\n\nWhat made the difference was repetition and, honestly, being embarrassed into continuing, because the other people in the class were mostly in their sixties and considerably braver than me. I also started going on my own on Sunday mornings, which was when it stopped feeling like a lesson and started feeling like something I did.\n\nThe moment I remember is swimming a full length of the 25-metre pool without stopping. It's a small thing, and children do it every day, but I'd been avoiding water for twenty years, so it felt disproportionate. What I took from it is that the hard part of most skills isn't the technique; it's the fear or the habit that stops you practising.",
    vocabulary: ["stay afloat", "coordinate", "repetition", "disproportionate", "the real obstacle", "dragged me to"],
  },
  {
    id: "c2",
    topic: "A person who influenced you",
    prompt: "Describe a person who has had a significant influence on you.",
    bullets: [
      "who the person is",
      "how you know them",
      "what they did",
      "and explain why they influenced you",
    ],
    part3: [
      "What kind of people influence young people most?",
      "Should celebrities be role models?",
      "Do parents influence children more than teachers?",
      "How has social media changed who influences us?",
    ],
    sample:
      "I'd like to describe my first manager, a woman called Rana, who ran a small logistics office where I had my first proper job at nineteen.\n\nI knew her only for about eighteen months, and in that time she did nothing dramatic. What she did was explain things. Whenever I made a mistake — and I made plenty, mostly through impatience — she would ask me to walk her through what I had assumed, and then she would tell me precisely which assumption had been wrong. She never once said 'you should have known'.\n\nWhat influenced me was not a single act but a standard. She was scrupulous about small things: if a delivery was late, she rang the customer before the customer rang us. I remember thinking that was unnecessary, and then watching it turn several complaints into repeat orders. It taught me that reliability is a form of marketing, which is not something I would have believed at nineteen.\n\nThe reason she had such an effect, I think, is timing. At that age I had no model of how a professional behaves, so I simply absorbed hers: how to admit an error, how to disagree without a fight, how to be on time. Ten years later, when I manage people, I catch myself using her sentences.\n\nAnd I'd add one thing — she was not a mentor in any formal sense. She never offered advice I hadn't asked for. That restraint is probably the part I most admire now, and the part I find hardest to imitate.",
    vocabulary: ["scrupulous", "walk her through", "a standard rather than an act", "absorbed hers", "restraint", "turn complaints into repeat orders"],
  },
  {
    id: "c3",
    topic: "A current news story",
    prompt: "Describe a news story you have followed recently.",
    bullets: [
      "what the story was about",
      "where you saw it",
      "why you followed it",
      "and explain how you feel about the outcome",
    ],
    part3: [
      "How do most people get their news today?",
      "Should social media companies be responsible for false information?",
      "Is it important to follow international news?",
      "Will printed newspapers disappear?",
    ],
    sample:
      "The story I've followed most closely is the introduction of age limits for social media accounts in a couple of countries — the UK and Australia have both moved on this, and the debate has been intense.\n\nI followed it mainly through a technology newsletter and the parliamentary committee recordings, which are long but surprisingly gripping. The reason it caught my attention is personal: I have a thirteen-year-old niece who is on three platforms, and my sister and I disagree about whether that's fine. I wanted to form a view rather than repeat one.\n\nWhat struck me from the hearings was how little either side could prove. The companies argued that the evidence on harm is contested; the campaigners argued that waiting for certainty is itself a decision. Both were right, which made the certainty of the headlines look silly.\n\nAs for how I feel about the outcome, I'm uneasy. I think the harm is real, but I'm not convinced a ban is the right instrument, because it removes the support groups that some teenagers depend on and it's easy to evade. If I had to legislate, I'd regulate the design instead — no algorithmic recommendation for minors, no notifications at night — because that targets the mechanism rather than the child.\n\nSo I suppose I've ended up disagreeing with both sides, which is uncomfortable but probably appropriate for a story this new.",
    vocabulary: ["gripping", "contested", "instrument", "evade", "mechanism rather than", "form a view rather than repeat one"],
  },
  {
    id: "c4",
    topic: "A place you would like to live",
    prompt: "Describe a place you would like to live in for a while.",
    bullets: [
      "where it is",
      "how you know about it",
      "what you would do there",
      "and explain why you would like to live there",
    ],
    part3: [
      "Why do people move to different cities?",
      "What problems do newcomers to a city face?",
      "Is it better to live in one place your whole life?",
      "How can cities make newcomers feel welcome?",
    ],
    sample:
      "The place I'd choose is Lisbon, though I'd want to be honest that I've only spent ten days there, which is exactly the sort of visit that turns a city into a fantasy.\n\nI know it partly from that trip and partly from a friend who moved there three years ago and now speaks Portuguese badly and enthusiastically. What appeals to me is the scale: it's a capital city that you can walk across, with hills that make it feel larger than it is. I also like that the Atlantic is right there — you can be on a beach in half an hour on a train.\n\nIf I lived there, I'd want to work, not just sit in cafés. My plan, such as it is, would be to keep my current job remotely for a year and use the time to learn the language properly, because I think living somewhere without learning the language is just exporting your own country. I'd also want to join a rowing club, which is a very specific ambition based on having seen people rowing on the river at seven in the morning and feeling envious.\n\nWhy Lisbon specifically? Partly climate, partly cost, but mostly a feeling I can't defend — the city is a bit shabby in a way I find appealing, and people seem to spend a lot of time outdoors talking to each other. That's not a reason to move, and I'd want to test it with a longer stay before I did anything irreversible.",
    vocabulary: ["scale", "shabby in an appealing way", "exporting your own country", "irreversible", "a fantasy", "defend a feeling"],
  },
  {
    id: "c5",
    topic: "A decision you regret",
    prompt: "Describe a decision you made that you later regretted.",
    bullets: [
      "what the decision was",
      "why you made it",
      "what happened afterwards",
      "and explain what you learned from it",
    ],
    part3: [
      "Do people learn more from mistakes or from success?",
      "Should young people be allowed to make their own decisions?",
      "Is it possible to make decisions without regret?",
      "How do people make difficult choices?",
    ],
    sample:
      "The decision I regret is choosing my undergraduate degree for the wrong reason. I picked economics because it sounded respectable and because my father approved of it, rather than because I had any interest in it.\n\nI made it at seventeen, which is an age at which 'what do you want to do with your life' is an unreasonable question, and I answered it by looking at what sounded impressive rather than what I actually enjoyed. I was good at the maths and completely uninterested in the conclusions, which is a bad combination — I could do the work, so nobody noticed I wasn't engaged.\n\nWhat happened is that I finished with a decent grade, a mild dislike of the subject, and no idea what to do next. I spent two years in a job I found tedious before I realised, mostly by accident, that I liked environmental work. I then did a master's in a different field, which cost money and time that I would not have needed to spend at twenty-one.\n\nWhat I learned is narrower than 'follow your passion', which I think is unhelpful advice. What I learned is that interest is worth more than prestige, and that if you can do something competently without caring about it, nobody will intervene — the warning has to come from you. I also learned to distrust the question 'what sounds impressive', which is how seventeen-year-olds and, frankly, a lot of thirty-year-olds choose things.\n\nI don't regret it entirely, because I use the economics constantly. I regret the two wasted years more than the degree.",
    vocabulary: ["respectable", "uninterested in the conclusions", "tedious", "unhelpful advice", "the warning has to come from you", "narrower than"],
  },
  {
    id: "c6",
    topic: "A piece of technology",
    prompt: "Describe a piece of technology you find useful.",
    bullets: [
      "what it is",
      "how long you have had it",
      "how you use it",
      "and explain why you find it so useful",
    ],
    part3: [
      "Has technology made life simpler or more complicated?",
      "Do older people find new technology difficult?",
      "Should schools give every child a laptop?",
      "What technology do you expect to see in ten years?",
    ],
    sample:
      "The piece of technology I'd talk about is a pair of noise-cancelling headphones, which is an unglamorous answer but an honest one. I've had them for about four years, and they were a gift I initially thought was excessive.\n\nI use them in three ways. The first is on public transport, where they turn a loud bus into a quiet room, which means I can read. The second is in shared offices, where the alternative is being interrupted every eight minutes. The third, and the one that surprised me, is for concentration at home: putting them on with nothing playing has become a signal to myself that I am working, which is a psychological trick as much as an acoustic one.\n\nWhy they matter to me is that I have a fairly short attention span and a low tolerance for noise, and before I had them I used to leave the office to find quiet, which cost time and looked antisocial. Now I stay put. That's a small efficiency, but it's a daily one, and daily ones compound.\n\nI'd add that I don't think it's a pure good. There's a real argument that wearing headphones in public reduces the small interactions that make a city pleasant, and I notice I'm less likely to help someone who is lost when I can't hear them. So I take them off in shops. It's a compromise, but a fair one.",
    vocabulary: ["unglamorous", "excessive", "acoustic", "low tolerance for", "compound", "a fair compromise"],
  },
  {
    id: "c7",
    topic: "A tradition in your country",
    prompt: "Describe a tradition in your country that you think is important.",
    bullets: [
      "what the tradition is",
      "when it happens",
      "who takes part",
      "and explain why you think it is important",
    ],
    part3: [
      "Why do some traditions disappear?",
      "Should governments spend money preserving traditions?",
      "Are festivals becoming more commercial?",
      "How do traditions differ between generations?",
    ],
    sample:
      "I'd like to describe a tradition that happens in my region in late spring, which is essentially a village-wide open house. Nobody agrees on its origin, which is part of its charm — one version says it began as a harvest custom, another as a way of settling disputes.\n\nOn the first Saturday in May, every household on the main street sets a table outside its door with whatever it has made: bread, cheese, pickles, a very strong drink that I would not recommend. Anyone can walk from one end of the street to the other and eat at every table. There is no ticket and no charge, and the only rule is that you must not skip anybody, which is enforced by elderly women with terrifying effectiveness.\n\nEveryone takes part, from small children to people in their nineties, and it has survived emigration because families time their visits home around it. In the last decade it has grown slightly — there is now a band and a raffle — but the structure hasn't changed.\n\nI think it matters because it is one of the few occasions when the whole village is obliged to be in the same place at the same time, and obliged is the right word. Modern life is very good at letting you avoid people. This does not let you. I've watched neighbours who had not spoken for two years exchange a plate of bread because refusing would be worse than the feud.\n\nThat's why I'd defend it, and why I'd resist making it a tourist attraction. Its value is that it is not for visitors.",
    vocabulary: ["open house", "part of its charm", "obliged to", "enforced by", "feud", "resist making it a tourist attraction"],
  },
  {
    id: "c8",
    topic: "A goal you are working towards",
    prompt: "Describe a goal you are working towards at the moment.",
    bullets: [
      "what the goal is",
      "when you started",
      "what you are doing to achieve it",
      "and explain why this goal matters to you",
    ],
    part3: [
      "Why do people set goals?",
      "Is it better to have short-term or long-term goals?",
      "What stops people achieving their goals?",
      "Should employers help staff reach personal goals?",
    ],
    sample:
      "My goal at the moment is to reach an overall IELTS band of seven and a half, which I need for a postgraduate course in the Netherlands. I started about four months ago, though I'd known it was coming for a year and had been avoiding it.\n\nWhat I'm doing is fairly structured, because I failed the first attempt by preparing vaguely. I do twenty minutes of vocabulary every morning on the way to work, using a spaced-repetition app, which is the only method that has ever worked for me. Twice a week I write a Task 2 essay and mark it against the descriptors myself before I look at a model answer, because the act of marking teaches you what examiners notice. And I record myself speaking for two minutes every evening, which I find excruciating, but my fluency has improved more from that than from anything else.\n\nWhy it matters is partly practical — no band, no course — but there's a second reason. My writing in my own language is decent and my writing in English is childish, and the gap is embarrassing. I'd like to close it, not just reach a number.\n\nThe difficulty is that progress is not linear. I got a six the first time and a six and a half three months later, and there have been weeks when the essays got worse. What keeps me going is having a fixed date, because an open-ended goal is very easy to postpone indefinitely.",
    vocabulary: ["excruciating", "spaced repetition", "mark against the descriptors", "the gap is embarrassing", "progress is not linear", "open-ended goal"],
  },
];
