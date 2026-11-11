export type ChartSeries = { label: string; values: number[]; colour?: string };

export type Chart =
  | { kind: "bar"; title: string; unit: string; categories: string[]; series: ChartSeries[] }
  | { kind: "line"; title: string; unit: string; categories: string[]; series: ChartSeries[] }
  | { kind: "pie"; title: string; unit: string; categories: string[]; series: ChartSeries[] }
  | { kind: "table"; title: string; columns: string[]; rows: (string | number)[][] }
  | { kind: "process"; title: string; steps: string[] };

export type Task1Prompt = {
  id: string;
  title: string;
  topic: string;
  chart: Chart;
  prompt: string;
  model: string;
  language: string[];
  traps: string[];
};

export type Task2Prompt = {
  id: string;
  title: string;
  topic: string;
  kind: "Opinion" | "Discussion" | "Problem–solution" | "Two-part" | "Advantages";
  question: string;
  outline: string[];
  ideas: { claim: string; because: string; example: string }[];
  vocabulary: string[];
  model: string;
};

export const task1Prompts: Task1Prompt[] = [
  {
    id: "t1-1",
    title: "Household recycling rates",
    topic: "Environment",
    chart: {
      kind: "bar",
      title: "Percentage of household waste recycled, 2010 and 2024",
      unit: "%",
      categories: ["Germany", "South Korea", "United Kingdom", "United States"],
      series: [
        { label: "2010", values: [45, 49, 24, 24], colour: "#5EEAD4" },
        { label: "2024", values: [69, 63, 44, 35], colour: "#C7F464" },
      ],
    },
    prompt:
      "The chart below shows the percentage of household waste recycled in four countries in 2010 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    model:
      "The bar chart compares the proportion of household waste recycled in four countries at two points, 2010 and 2024.\n\nOverall, recycling rates rose in all four countries over the period, and Germany and South Korea remained consistently ahead of the United Kingdom and the United States. The most striking change, however, was in the UK, where the figure almost doubled.\n\nIn 2010, Germany already recycled 45% of household waste, the highest of the four, with South Korea marginally behind at 49% — although by 2024 Korea had been overtaken, reaching 63% against Germany's 69%. Both countries thus maintained high rates throughout, and both added roughly twenty percentage points over the fourteen years.\n\nThe English-speaking countries started from a much lower base. The UK recycled 24% in 2010, identical to the United States, but climbed steeply to 44% by 2024, a rise of twenty points. The US also improved, though far more modestly, from 24% to 35%. As a result, the gap between the UK and the US widened from nothing to nine percentage points, while the gap between Germany and the US grew from twenty-one to thirty-four points.",
    language: [
      "the proportion of … rose from X to Y",
      "Germany remained consistently ahead of …",
      "South Korea was marginally behind at 49%",
      "the figure almost doubled",
      "started from a much lower base",
      "improved only modestly",
      "the gap widened from … to …",
    ],
    traps: [
      "No overview = capped at Band 5 for Task Achievement. The overview must contain no numbers.",
      "Do not explain why recycling rose — there is no data on causes.",
      "Compare, don't list: 'Germany, Korea, UK and the US' one by one is a Band 5 answer.",
    ],
  },
  {
    id: "t1-2",
    title: "Average commuting time",
    topic: "Cities and transport",
    chart: {
      kind: "line",
      title: "Average one-way commute, minutes, 2000–2025",
      unit: "minutes",
      categories: ["2000", "2005", "2010", "2015", "2020", "2025"],
      series: [
        { label: "London", values: [42, 45, 48, 51, 47, 53], colour: "#C7F464" },
        { label: "Berlin", values: [31, 31, 33, 34, 32, 36], colour: "#5EEAD4" },
        { label: "Austin", values: [24, 26, 29, 33, 31, 38], colour: "#FF8A6B" },
      ],
    },
    prompt:
      "The graph below shows the average one-way commuting time in three cities between 2000 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    model:
      "The line graph illustrates how long commuters in London, Berlin and Austin spent travelling to work in a single direction between 2000 and 2025.\n\nOverall, journey times lengthened in all three cities across the quarter-century, with London consistently the slowest and Austin the fastest. Austin's commute grew most rapidly, however, and by 2025 it had almost caught up with Berlin.\n\nLondon's commuters already faced the longest journey in 2000, at 42 minutes, and this rose fairly steadily to 51 minutes in 2015. There followed a sharp dip to 47 minutes in 2020, presumably reflecting changed working patterns, before the figure climbed to a peak of 53 minutes.\n\nBerlin followed a gentler path. Its average rose by only three minutes between 2000 and 2015, dipped slightly in 2020, and finished at 36 minutes — an increase of five minutes overall. Austin, by contrast, began at just 24 minutes, the lowest of the three, but grew almost every year, reaching 33 minutes in 2015 and 38 by 2025. This represented a rise of 58%, far greater than in either European city. Whereas Austin's commuters spent twelve minutes less in transit than Berlin's in 2000, by 2025 the difference was only two minutes.",
    language: [
      "rose fairly steadily to …",
      "there followed a sharp dip to …",
      "before the figure climbed to a peak of …",
      "followed a gentler path",
      "grew almost every year",
      "an increase of five minutes overall",
      "whereas … by 2025 the difference was only …",
    ],
    traps: [
      "All three series must be followed to the end — a line that stops at 2015 loses marks.",
      "The dip in 2020 is data, not a trend; report it, don't over-explain it.",
      "Percentages versus absolute values: 'a rise of 58%' and 'a rise of 14 minutes' are different claims.",
    ],
  },
  {
    id: "t1-3",
    title: "Electricity generation mix",
    topic: "Energy",
    chart: {
      kind: "pie",
      title: "Sources of electricity generation, 2010 and 2025",
      unit: "%",
      categories: ["Coal", "Gas", "Nuclear", "Wind & solar", "Hydro"],
      series: [
        { label: "2010", values: [41, 28, 14, 8, 9], colour: "#FF8A6B" },
        { label: "2025", values: [16, 25, 15, 36, 8], colour: "#C7F464" },
      ],
    },
    prompt:
      "The pie charts below show the sources of electricity generation in one country in 2010 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    model:
      "The two pie charts show how electricity was generated in a single country in 2010 and again in 2025.\n\nOverall, the country's electricity mix was transformed over the fifteen years. Coal, dominant at the start of the period, was reduced to a minority share, while wind and solar grew more than fourfold to become the largest single source.\n\nIn 2010, coal accounted for 41% of generation, with gas providing a further 28%. Together, fossil fuels therefore supplied more than two-thirds of all electricity. Nuclear contributed 14%, hydro 9% and wind and solar only 8%.\n\nBy 2025 the picture had reversed. Coal had fallen by twenty-five percentage points to 16%, and wind and solar had risen to 36%, an increase of 28 points and the largest shift of any category. Gas declined modestly, from 28% to 25%, while nuclear edged up by one point to 15%. Hydro was the most stable source, falling by a single point to 8%. The combined share of renewables thus rose from 17% to 44%, whereas fossil fuels fell from 69% to 41% — meaning that low-carbon sources, including nuclear, produced well over half of the country's electricity by the end of the period.",
    language: [
      "was transformed over the fifteen years",
      "was reduced to a minority share",
      "grew more than fourfold",
      "accounted for 41% of generation",
      "together, fossil fuels supplied more than two-thirds",
      "by 2025 the picture had reversed",
      "the most stable source",
      "the combined share of … rose from … to …",
    ],
    traps: [
      "Two charts need two short paragraphs plus an overview; a single paragraph is hard to follow.",
      "Percentages must sum sensibly — do not invent a total that contradicts the chart.",
      "Avoid 'the biggest' without a unit: biggest by percentage points or by proportion of change?",
    ],
  },
  {
    id: "t1-4",
    title: "Transport mode share",
    topic: "Urban transport",
    chart: {
      kind: "table",
      title: "How people travelled to work in one city (%), 2005 and 2025",
      columns: ["Mode", "2005", "2025", "Change"],
      rows: [
        ["Car (alone)", 58, 41, "−17"],
        ["Car (shared)", 9, 7, "−2"],
        ["Bus", 14, 16, "+2"],
        ["Rail", 8, 19, "+11"],
        ["Cycling", 3, 12, "+9"],
        ["Walking", 8, 5, "−3"],
      ],
    },
    prompt:
      "The table below shows the percentage of commuters using different modes of transport to get to work in one city in 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    model:
      "The table compares the share of commuters using six modes of transport in a single city in 2005 and 2025.\n\nOverall, private car use fell markedly over the twenty years, while rail and cycling expanded, so that the car was no longer the choice of an outright majority by 2025. Bus and walking changed comparatively little.\n\nIn 2005, driving alone was overwhelmingly the most common method, at 58%, with shared car journeys adding a further 9%. Public transport accounted for 22% between bus and rail, while active travel — cycling and walking — made up only 11%.\n\nBy 2025 the positions had shifted considerably. Solo driving had dropped seventeen percentage points to 41%, and shared car use declined slightly to 7%, so that cars as a whole fell from 67% to 48%. Rail recorded the largest proportional gain, more than doubling from 8% to 19%, and cycling quadrupled from 3% to 12%. Bus use rose marginally, from 14% to 16%, whereas walking declined from 8% to 5%. Taken together, public transport and active travel thus grew from 33% of journeys to 52%, overtaking the private car for the first time.",
    language: [
      "fell markedly over the twenty years",
      "the choice of an outright majority",
      "recorded the largest proportional gain",
      "more than doubling from … to …",
      "quadrupled from 3% to 12%",
      "rose marginally",
      "taken together, … grew from … to …",
      "overtaking the private car for the first time",
    ],
    traps: [
      "Tables hide their story — you must find the comparison, then group rows (cars / public transport / active travel).",
      "Do not read every cell aloud. Six rows × three columns is far too much detail.",
      "Use the change column as a check, not as your main source of sentences.",
    ],
  },
  {
    id: "t1-5",
    title: "Recycling glass bottles",
    topic: "Process",
    chart: {
      kind: "process",
      title: "The recycling of glass bottles",
      steps: [
        "Used bottles collected from kerbside bins",
        "Transported to a processing plant",
        "Sorted by colour: clear, green, brown",
        "Washed to remove labels and caps",
        "Crushed into small fragments (cullet)",
        "Melted in a furnace at 1,500°C",
        "Molten glass moulded into new bottles",
        "Filled and distributed to retailers",
      ],
    },
    prompt:
      "The diagram below shows the process by which used glass bottles are recycled. Summarise the information by selecting and reporting the main features.",
    model:
      "The diagram illustrates the stages by which used glass bottles are collected and converted into new ones.\n\nOverall, the process consists of eight principal stages, moving from household collection through sorting and melting to the manufacture and distribution of new bottles. It is a continuous cycle rather than a linear one, since the output becomes the input once again.\n\nThe process begins when consumers place empty bottles in kerbside bins. These are then transported by lorry to a processing plant, where the first task is to separate the glass by colour into clear, green and brown streams, because different colours cannot be melted together. Once sorted, the bottles are washed to remove labels, caps and any residue.\n\nAt the following stage the cleaned glass is crushed into small fragments known as cullet. This cullet is then fed into a furnace and melted at a temperature of 1,500°C. The molten glass is subsequently moulded into new bottles, which are filled and distributed to retailers before reaching households again, at which point the cycle repeats. It is worth noting that the melting stage is by far the most energy-intensive, which is why the process is only worthwhile when the glass is clean and correctly separated.",
    language: [
      "The diagram illustrates the stages by which …",
      "moving from collection through sorting to …",
      "a continuous cycle rather than a linear one",
      "The process begins when …",
      "At the following stage …",
      "is subsequently moulded into …",
      "at which point the cycle repeats",
      "by far the most energy-intensive",
    ],
    traps: [
      "A process diagram has no numbers, so use sequencing language: first, once, subsequently, at which point.",
      "Use the passive: 'the glass is crushed', not 'they crush the glass'.",
      "Add one interpretive sentence at the end (about energy or scale) to reach Band 7+.",
    ],
  },
];

export const task2Prompts: Task2Prompt[] = [
  {
    id: "t2-1",
    title: "AI and entry-level jobs",
    topic: "Work and technology",
    kind: "Opinion",
    question:
      "Some people believe that artificial intelligence will create more jobs than it destroys. To what extent do you agree or disagree with this view?",
    outline: [
      "Introduction: disagree in part — new jobs will appear, but not for the same people or at the same speed.",
      "Body 1: what AI replaces. Routine cognitive work, entry-level tasks; why this damages the ladder into skilled work.",
      "Body 2: what AI creates. New roles exist, but they require different training and are fewer per unit of output.",
      "Body 3 (optional): the transition problem — geography, age, retraining cost.",
      "Conclusion: net job numbers may recover; the damage is in distribution and timing.",
    ],
    ideas: [
      {
        claim: "AI removes the tasks from which expertise used to be built",
        because: "junior work is how graduates learn judgement",
        example: "a trainee solicitor who no longer drafts routine contracts never learns to spot a bad clause",
      },
      {
        claim: "New roles are not interchangeable with the old ones",
        because: "they demand different qualifications and are concentrated in a few cities",
        example: "data annotation and model evaluation employ far fewer people than the clerical work they replace",
      },
      {
        claim: "The transition is the real problem, not the endpoint",
        because: "economists measure a decade-long gap between displacement and re-employment",
        example: "a 52-year-old administrative worker cannot wait ten years for a new equilibrium",
      },
    ],
    vocabulary: [
      "displacement", "occupational ladder", "task-level automation", "transferable skills",
      "structural unemployment", "reskilling", "net effect", "labour-intensive",
    ],
    model:
      "The claim that artificial intelligence will generate more employment than it eliminates is a comfortable one, and probably true in the long run. In the short run, however, I believe it is misleading, because the jobs created and the jobs lost are rarely available to the same people at the same time.\n\nThe work that AI performs most reliably is routine cognitive labour: drafting standard correspondence, summarising documents, producing first versions of code. This is precisely the work that employers have traditionally given to new entrants. A junior lawyer who spends two years reviewing boilerplate contracts learns, gradually, to recognise an unusual clause. If the software reviews the contracts, the firm saves money and the trainee never acquires that judgement. The occupation survives; the route into it does not.\n\nDefenders of the technology point, reasonably, to new roles in model training, oversight and compliance. These exist, and some are well paid. But they are not equivalent in number. A system that automates the checking of a thousand invoices may create two positions to manage exceptions; the arithmetic does not favour a one-to-one replacement. They also require quantitative skills that the displaced clerical workforce does not have, which converts a technology story into an education story.\n\nThis is why the timescale matters more than the total. Economists who study previous waves of automation find that re-employment typically takes a decade, and that older workers frequently never return to equivalent status. A country can be richer and a particular town poorer at the same moment.\n\nIn conclusion, I would not argue that AI will reduce total employment. I would argue that the reassuring aggregate hides an uneven distribution of gain and loss, and that governments which treat the aggregate as the whole story will be unprepared for the second.",
    },
  {
    id: "t2-2",
    title: "A minimum age for social media",
    topic: "Children and technology",
    kind: "Discussion",
    question:
      "Some countries are considering banning social media for children under sixteen. Discuss both views and give your own opinion.",
    outline: [
      "Introduction: both sides have merit; I favour a graduated approach over an outright ban.",
      "Body 1: the case for a ban — developmental harm, addictive design, enforcement now technically possible.",
      "Body 2: the case against — isolation of vulnerable young people, loss of access to support, unenforceable in practice.",
      "Body 3: the alternative — design regulation, age-appropriate accounts, digital literacy.",
      "Conclusion: the harm is real; the instrument is wrong.",
    ],
    ideas: [
      {
        claim: "A ban addresses the design of the product, not the child's weakness",
        because: "feeds are engineered to maximise time spent",
        example: "infinite scroll and notification timing are deliberate commercial choices",
      },
      {
        claim: "Blanket bans remove a lifeline for some teenagers",
        because: "minority young people rely on online communities for support they cannot find locally",
        example: "a teenager in a small town with no other LGBT peers",
      },
      {
        claim: "Age verification is now technically feasible",
        because: "device-level age assurance exists in several jurisdictions",
        example: "the UK's Online Safety Act requires highly effective age assurance for certain services",
      },
      {
        claim: "Design regulation is more precise than prohibition",
        because: "it targets the mechanism of harm while preserving the benefit",
        example: "disabling algorithmic recommendation and late-night notifications for minors",
      },
    ],
    vocabulary: [
      "age assurance", "algorithmic recommendation", "developmental stage", "duty of care",
      "unintended consequence", "blanket prohibition", "regulatory burden", "digital literacy",
    ],
    model:
      "Several governments are now prepared to legislate a minimum age for social media, usually sixteen. The proposal deserves a serious answer rather than a reflexive one, since both the harm it addresses and the liberty it restricts are real.\n\nThe strongest argument for a ban is that the harm is not a matter of individual weakness but of product design. Feeds are optimised to extend sessions, and the optimisation does not distinguish between an adult with a developed capacity for self-regulation and a thirteen-year-old without one. Adolescent mental health has deteriorated over precisely the period in which smartphone use became near-universal, and while correlation is not causation, the pattern is difficult to dismiss. Age assurance technology has also improved to the point where enforcement is no longer fanciful.\n\nAgainst this, a blanket prohibition would remove something genuinely valuable. For a teenager who is isolated geographically, or whose family does not accept them, an online community may be the only available source of support. A law passed to protect the vulnerable would deprive exactly those young people first. There is also a practical objection: determined children have always circumvented age gates, and a ban may simply push use onto unregulated platforms where no safeguards exist at all.\n\nIn my view, the mistake lies in treating the technology as a single object that can be permitted or forbidden. What causes harm is a set of design choices — infinite scroll, algorithmic recommendation, night-time notifications — and those can be regulated directly. Requiring age-appropriate accounts, disabling recommendation for minors and restricting notifications after a certain hour would preserve the connective benefit while removing the mechanism of harm.\n\nA minimum age is therefore the wrong instrument, though it is aimed at the right target. Precision would serve children better than prohibition.",
    },
  {
    id: "t2-3",
    title: "Empty city centres",
    topic: "Cities and remote work",
    kind: "Problem–solution",
    question:
      "In many cities, remote working has left central business districts short of activity. What problems does this cause, and what measures could address them?",
    outline: [
      "Introduction: the problem is one of use, not of buildings; conversion and diversification are the realistic answers.",
      "Body 1: problems — lost trade for cafés and shops, falling property values, reduced tax base, dead streets at night.",
      "Body 2: solutions — convert offices to housing, mixed-use zoning, cultural and civic uses, transport pricing.",
      "Body 3: evaluate — conversion is expensive and not every building works; the honest answer is partial.",
      "Conclusion: the era of the single-use district is over.",
    ],
    ideas: [
      {
        claim: "The daytime economy of the district collapses",
        because: "sandwich shops, dry cleaners and cafés depend on a fixed office population",
        example: "central London footfall on Mondays and Fridays remains well below pre-2020 levels",
      },
      {
        claim: "Vacancy becomes fiscal",
        because: "business rates and property taxes are calculated on occupied floorspace",
        example: "a city with 20% office vacancy loses revenue while still providing the same infrastructure",
      },
      {
        claim: "Conversion to housing restores evening activity",
        because: "residents use a district across the whole day rather than eight hours of it",
        example: "Calgary's incentive programme to convert offices into apartments",
      },
      {
        claim: "Not every building can be converted",
        because: "floor plates, window depth and plumbing make some towers uneconomic",
        example: "deep-plan 1970s blocks with no openable windows",
      },
    ],
    vocabulary: [
      "footfall", "mixed-use zoning", "vacancy rate", "adaptive reuse", "fiscal base",
      "agglomeration", "dead zone", "incentive scheme", "deep-plan floor plate",
    ],
    model:
      "The shift to hybrid work has emptied the core of many cities on two or three days a week, and the consequences extend well beyond the inconvenience of quieter streets.\n\nThe immediate problem is economic. A business district is a single-purpose machine: it imports workers in the morning and exports them at night, and an entire ecosystem of cafés, dry cleaners, gyms and independent shops exists to serve that population. When the population falls by forty per cent, those businesses do not shrink proportionally; many close. Vacancy then becomes a fiscal problem, since local government revenue is often tied to occupied commercial floorspace while the cost of maintaining roads, transit and services is unchanged. The social cost is subtler: a district that is active for only part of the week loses the casual encounters that make cities productive.\n\nThe most persuasive solution is adaptive reuse. Converting obsolete offices into apartments brings residents who occupy the area across the whole day, supporting evening trade and restoring a reason to keep the streets lit. Several North American cities have introduced tax incentives for exactly this, and early results suggest that where the building type permits conversion, it works.\n\nIt does not always permit conversion. Deep-plan towers with no openable windows and centralised services are expensive to divide into dwellings, and a scheme that ignores this will subsidise failure. A realistic programme therefore combines conversion where the structure allows it, mixed-use zoning that lets retail, light industry and culture occupy ground floors, and a deliberate effort to move civic functions — libraries, clinics, colleges — into the empty space.\n\nThe single-use business district was a historical accident, not a natural form. Recognising that is the first step towards replacing it.",
    },
  {
    id: "t2-4",
    title: "Who should act on climate?",
    topic: "Environment and responsibility",
    kind: "Discussion",
    question:
      "Some argue that individuals can do little to address climate change and that only governments and large companies can make a difference. Discuss both views and give your own opinion.",
    outline: [
      "Introduction: the dichotomy is false, but the emphasis on systems is broadly correct.",
      "Body 1: individual action matters — consumption signals, voting, social norms, cumulative effect.",
      "Body 2: the stronger case for systemic action — infrastructure determines what is possible; a person cannot choose a train that does not run.",
      "Body 3: how they interact — individual behaviour shapes political feasibility; 'footprint' framing was a deliberate corporate strategy.",
      "Conclusion: act individually, but do not mistake that for the main lever.",
    ],
    ideas: [
      {
        claim: "Individual choices are constrained by infrastructure",
        because: "a household cannot insulate a building it does not own or take a bus that does not exist",
        example: "heat pump uptake tracks subsidy levels more closely than environmental concern",
      },
      {
        claim: "Cumulative consumption is not trivial",
        because: "aggregate demand shifts markets and signals to producers",
        example: "the rapid fall in renewable costs followed sustained policy-driven demand",
      },
      {
        claim: "The personal-footprint framing was promoted by industry",
        because: "it shifted responsibility from producers to consumers",
        example: "the origin of the carbon footprint calculator in a major oil company's advertising campaign",
      },
      {
        claim: "Systemic change requires political permission",
        because: "governments do not legislate against the habits of majorities",
        example: "congestion charges and low-traffic neighbourhoods succeed where residents support them",
      },
    ],
    vocabulary: [
      "systemic", "carbon footprint", "infrastructure lock-in", "collective action",
      "regulatory lever", "greenwashing", "political feasibility", "structural constraint",
    ],
    model:
      "The argument that individual action is futile against climate change is partly right, and the way it is usually made is partly dishonest. Sorting household waste will not stabilise the atmosphere; nor is it meaningless.\n\nConsider first the case for personal responsibility. Consumption is not passive. When a sufficient number of households choose renewable tariffs, efficient appliances or less meat, supply chains respond, and the price of low-carbon alternatives falls. The collapse in the cost of solar generation over the past fifteen years was driven by policy, but policy followed demand. Individual choices also have a social dimension: the neighbour who installs a heat pump normalises the technology in a way that no advertisement can.\n\nYet the structural argument is stronger. Most emissions are determined by systems a person cannot alter alone. A tenant cannot insulate a building owned by somebody else; a commuter cannot take a train that was never built; a family in a car-dependent suburb has no realistic alternative to driving. Where infrastructure makes the low-carbon option easy, uptake is high; where it does not, exhortation fails, as every recycling campaign in a city without collection facilities has demonstrated. It is also relevant that the language of personal footprints was popularised by the industry with the largest interest in redirecting attention away from production.\n\nThe two positions are not symmetrical, therefore, and they are not exclusive. Individuals should act, because the action is real and because it creates the political permission that systemic change requires. But they should not be persuaded that this is the main lever. Governments set standards, price carbon and build infrastructure; those decisions dwarf the rest.\n\nIn short, the responsible position is to reduce one's own impact without pretending that doing so is sufficient, and to spend at least as much effort on the decisions that actually set the total.",
    },
  {
    id: "t2-5",
    title: "Fast fashion",
    topic: "Consumption",
    kind: "Problem–solution",
    question:
      "The production of cheap clothing has increased enormously in recent decades. Why has this happened, and what can be done to reduce its environmental impact?",
    outline: [
      "Introduction: causes are economic; remedies must be regulatory and design-led rather than moral.",
      "Body 1: causes — global supply chains, synthetic fibre costs, social media-driven trend cycles, price deflation.",
      "Body 2: consequences — textile waste, microplastics, water use in cotton, landfill export.",
      "Body 3: solutions — extended producer responsibility, durability standards, repair infrastructure, resale.",
      "Conclusion: the cheapest garment is expensive somewhere else.",
    ],
    ideas: [
      {
        claim: "Synthetic fibres made clothing cheap",
        because: "polyester costs a fraction of wool or cotton and can be produced at scale",
        example: "a t-shirt can now retail for less than the price of a coffee",
      },
      {
        claim: "Social platforms compressed trend cycles",
        because: "trends are set and discarded within weeks rather than seasons",
        example: "an outfit worn once for a photograph and returned",
      },
      {
        claim: "Extended producer responsibility shifts the cost",
        because: "manufacturers pay for collection and recycling by volume",
        example: "France's EPR scheme for textiles",
      },
      {
        claim: "Repair and resale need infrastructure, not exhortation",
        because: "people discard clothes when mending is harder than replacing",
        example: "sewing workshops in libraries and repair vouchers",
      },
    ],
    vocabulary: [
      "fast fashion", "extended producer responsibility", "microplastics", "textile waste",
      "durability standard", "overproduction", "resale market", "supply chain transparency",
    ],
    model:
      "Cheap clothing has become so ordinary that its strangeness is easy to miss: a garment can now be manufactured, shipped across an ocean and sold for less than the cost of a meal, several times a year.\n\nThe causes are largely economic. Synthetic fibres, principally polyester, cost a fraction of natural alternatives and can be produced continuously to consistent specifications. Container shipping made distance almost irrelevant to unit cost. Retailers discovered that reducing price and increasing the number of collections raised revenue more reliably than improving quality, and social platforms compressed the trend cycle from seasons to weeks. The result is a system calibrated for volume: overproduction is not a failure of the model but its purpose.\n\nThe environmental consequences follow from that volume. Textile production is water-intensive, particularly for cotton; dyeing pollutes rivers in producing regions; and synthetic fabric sheds microplastics with every wash. Because garments are cheap, they are discarded before they wear out, and much of the waste is exported to countries with weaker disposal standards, where it is burned or buried.\n\nMoral persuasion has been tried and has not worked, which is unsurprising: the decision is made by a shopper with limited money and no information. The effective remedies are structural. Extended producer responsibility, under which manufacturers fund collection and recycling in proportion to what they place on the market, has begun to shift costs in France. Minimum durability standards would remove the cheapest, shortest-lived products from sale. Repair infrastructure — subsidised mending, accessible workshops — makes keeping a garment rational rather than virtuous. Resale platforms already demonstrate that a second market can be profitable.\n\nNone of these measures is exciting, and none depends on consumers becoming better people. That is precisely why they might work.",
    },
  {
    id: "t2-6",
    title: "University or vocational training",
    topic: "Education",
    kind: "Opinion",
    question:
      "Some people think too many young people go to university, and that vocational training would serve many of them better. To what extent do you agree or disagree?",
    outline: [
      "Introduction: agree that the balance is wrong, but the problem is prestige, not the number of degrees.",
      "Body 1: the case — graduate oversupply, debt, skills mismatch, trades shortages.",
      "Body 2: the counter — university is not only economic; civic and research benefits; graduates adapt better.",
      "Body 3: the real issue — parity of esteem and funding for technical routes.",
      "Conclusion: expand vocational routes and stop ranking them second.",
    ],
    ideas: [
      {
        claim: "Graduate supply has outrun graduate demand",
        because: "the wage premium has narrowed for many degrees",
        example: "graduates in some subjects earn less over a lifetime than qualified electricians",
      },
      {
        claim: "Vocational routes are stigmatised, not inferior",
        because: "funding and prestige follow the academic pathway",
        example: "apprenticeship applications are oversubscribed where quality is high",
      },
      {
        claim: "University has non-economic value",
        because: "it produces research, civic participation and adaptability",
        example: "the rapid shift to remote work was concentrated among graduates",
      },
      {
        claim: "Skills shortages are concentrated in technical occupations",
        because: "ageing workforces in trades are not being replaced",
        example: "construction and healthcare technicians",
      },
    ],
    vocabulary: [
      "graduate premium", "parity of esteem", "skills mismatch", "apprenticeship",
      "overqualification", "vocational pathway", "human capital", "labour market signalling",
    ],
    model:
      "The expansion of higher education was justified on the grounds that modern economies need more graduates. That was true in 1995 and is only partly true now. I agree that the balance has tipped, though not for the reason usually given.\n\nThe economic case is straightforward. A degree signals general ability, and when a third of the workforce holds one the signal becomes less informative and the premium narrows. Meanwhile the cost has transferred to the student, so that a young person may begin working life with substantial debt and a qualification that employers treat as a baseline rather than a distinction. At the same time, industries that require no degree report persistent shortages: construction, electrical work, nursing support, logistics. An economy that cannot find a plumber and cannot absorb another marketing graduate has misallocated its training budget.\n\nThe counter-argument deserves respect. Universities do more than produce labour. They generate research, sustain civic institutions, and develop a capacity for abstract reasoning that enables people to change occupation several times in a working life — an advantage that becomes more valuable as automation reshapes work. Some of the graduate underemployment observed today reflects the business cycle rather than a structural surplus.\n\nBut this is an argument for a strong university sector, not for sending half the population through it. The decisive issue is prestige. Vocational routes are underfunded and, more damagingly, ranked second in the minds of parents and teachers. Where apprenticeship quality has been raised, applications have been oversubscribed, which suggests the demand exists and the supply does not.\n\nI therefore agree that too many students choose university for the wrong reason, and too few are offered a genuinely attractive alternative. The solution is not to restrict places but to make the technical route as well resourced and as respected as the academic one.",
    },
  {
    id: "t2-7",
    title: "Ageing populations",
    topic: "Demography",
    kind: "Two-part",
    question:
      "In many countries the proportion of older people is increasing. What are the effects of this trend on society, and how can governments respond?",
    outline: [
      "Introduction: the effects are manageable but the fiscal ones are unavoidable.",
      "Body 1: effects — pension and health costs, labour shortages, changed family structures, market shifts.",
      "Body 2: responses — later retirement, immigration, productivity, preventative health, age-friendly cities.",
      "Body 3: the honest limit — no policy restores the demographic ratio; the aim is adaptation.",
      "Conclusion: ageing is a success that requires redesign, not a crisis to be reversed.",
    ],
    ideas: [
      {
        claim: "The dependency ratio creates fiscal pressure",
        because: "fewer workers fund the pensions and health costs of more retirees",
        example: "pay-as-you-go pension systems in Japan and Italy",
      },
      {
        claim: "Labour shortages appear in specific sectors",
        because: "care work expands while the working-age population contracts",
        example: "healthcare and social care vacancy rates",
      },
      {
        claim: "Older consumers reshape markets",
        because: "spending shifts toward health, leisure and accessible housing",
        example: "the growth of the 'silver economy'",
      },
      {
        claim: "Preventative health is the highest-return response",
        because: "healthy life expectancy, not lifespan, determines cost",
        example: "investment in physical activity and screening",
      },
    ],
    vocabulary: [
      "dependency ratio", "healthy life expectancy", "fiscal sustainability",
      "care workforce", "silver economy", "age-friendly design", "pension reform",
    ],
    model:
      "Population ageing is the predictable consequence of two successes — longer lives and lower infant mortality — and it now confronts a large number of countries at once. The effects are broad, and the policy responses available are better than the public debate suggests.\n\nThe most immediate effect is fiscal. Pension systems designed when retirement lasted a decade are now supporting people for three, and healthcare expenditure rises steeply with age. Because these costs are funded by current workers, a shrinking labour force must support a growing retired population, which raises either taxes, contributions or the retirement age. There are social effects too. Care responsibilities increasingly fall on middle-aged women, and labour shortages emerge in exactly the sectors that ageing expands: health, social care and personal services. Markets shift as spending moves towards health, leisure and accessible housing.\n\nGovernments have four main levers. The first is to extend working lives, which is more acceptable when it is gradual and when older workers are not excluded by age discrimination. The second is selective immigration, which raises the number of contributors quickly but cannot be the sole answer, since sending countries are ageing as well. The third is productivity: an economy that produces more per worker can support more dependants, which makes automation and skills investment a demographic policy. The fourth, and least discussed, is preventative health. What matters fiscally is healthy life expectancy rather than lifespan, and interventions that keep people well — activity, screening, age-friendly streets — reduce cost more reliably than anything else on the list.\n\nIt would be dishonest to suggest that any of this restores the demographic ratio of 1970. The realistic objective is adaptation: a society that treats a longer life as a resource to be used rather than a cost to be financed.",
    },
  {
    id: "t2-8",
    title: "Data and privacy",
    topic: "Technology and rights",
    kind: "Opinion",
    question:
      "Some people say that privacy is no longer a realistic expectation in the digital age. To what extent do you agree?",
    outline: [
      "Introduction: disagree — privacy has changed form, not disappeared, and it remains enforceable.",
      "Body 1: the case that privacy is lost — data collection is ambient, consent is fictional.",
      "Body 2: why the claim is wrong — privacy is a legal construct, and law has changed before.",
      "Body 3: what protection looks like — data minimisation, purpose limitation, enforcement with teeth.",
      "Conclusion: resignation is a choice, not an inevitability.",
    ],
    ideas: [
      {
        claim: "Consent has become meaningless through design",
        because: "nobody reads terms of service and refusal is impractical",
        example: "the choice between accepting tracking or losing access to a service",
      },
      {
        claim: "Privacy is a legal relationship, not a physical condition",
        because: "what counts as a violation is defined by statute",
        example: "the GDPR's requirement of a lawful basis for processing",
      },
      {
        claim: "Resignation is itself a risk",
        because: "surveillance chills behaviour before it is abused",
        example: "people avoiding legitimate searches or medical information",
      },
      {
        claim: "Technical defaults can protect without effort",
        because: "most exposure comes from default settings rather than deliberate sharing",
        example: "browser tracking prevention and on-device processing",
      },
    ],
    vocabulary: [
      "data minimisation", "informed consent", "purpose limitation", "surveillance",
      "chilling effect", "regulatory enforcement", "anonymisation", "default setting",
    ],
    model:
      "The claim that privacy is no longer realistic has a certain resigned plausibility, but it confuses a change in the conditions of privacy with its disappearance. I do not accept it.\n\nThe pessimist's case is not frivolous. Data collection is now ambient rather than deliberate: a phone records location, a television records viewing, a car records driving. Consent, the traditional justification, has been hollowed out by design, since nobody reads the terms and refusing them usually means losing the service. When the alternative to surveillance is exclusion from social life, agreement is not meaningful.\n\nYet privacy has always been a legal relationship rather than a physical fact. A letter was never secret because envelopes are opaque; it was secret because opening it was an offence. The same logic applies to data, and the law has begun to move. The General Data Protection Regulation established that processing requires a lawful basis, that purpose must be specified in advance, and that data should be minimised. These are not platitudes; they have produced substantial fines and, more importantly, changed engineering practice, because compliance is cheaper than litigation.\n\nThere is also a cost to resignation. Surveillance does not need to be abused to do harm: people who believe they are watched modify their behaviour, avoiding legitimate searches and sensitive reading. A society that accepts permanent observation loses the private space in which dissent and experimentation occur.\n\nWhat protection requires is unglamorous. Defaults that protect the many who will never change a setting. Enforcement with resources behind it. Prohibition of secondary use, so that data collected for one purpose cannot quietly be repurposed.\n\nPrivacy is not a casualty of technology; it is a decision that has to be made repeatedly. Treating it as already lost is the surest way to lose it.",
    },
];
