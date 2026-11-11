import type { ReadingTest } from "@/lib/types";

export const readingTest2: ReadingTest = {
  id: "mock-2",
  title: "Academic Reading · Mock Test 2",
  blurb: "Vertical farming, the attention economy and the right to repair. 60 minutes, 40 questions.",
  topics: ["Food & climate", "Media", "Consumer law"],
  passages: [
    {
      id: "p1",
      title: "Farming Under Glass",
      subtitle: "Passage 1 · 20 minutes · 13 questions",
      topic: "Food security",
      difficulty: "Foundation",
      timeMinutes: 20,
      paragraphs: [
        {
          label: "A",
          text: "A warehouse on the edge of a northern European city produces thirty harvests of lettuce a year. The plants grow in shallow trays of water, stacked twelve high, lit by pink light-emitting diodes and fed by a nutrient solution that is monitored by a computer. No soil is involved, no pesticide is sprayed, and the whole operation employs eleven people. The company that runs it describes its product as the future of food, and its investors appear to agree.",
        },
        {
          label: "B",
          text: "The idea of growing crops without soil is not new. Gardeners have used water culture for centuries, and the term hydroponics was popularised in the 1930s. What has changed is the cost of light. Artificial lighting once consumed so much electricity that indoor farming was confined to a few high-value crops, such as cannabis and orchids. The price of LEDs fell by more than 80 per cent between 2010 and 2020 while their efficiency doubled, which altered the economics of every other crop that can be grown in a tray.",
        },
        {
          label: "C",
          text: "The environmental case is more complicated than the marketing suggests. Indoor farms use roughly 95 per cent less water than field agriculture, because the solution is recirculated rather than lost to drainage, and they require no pesticides at all. But they consume substantial electricity, and if that electricity comes from coal, the carbon footprint of a lettuce can be higher than one grown in a Spanish field and driven across Europe. Studies of vertical farms in several countries have reached this conclusion independently, which is awkward for an industry that markets itself as sustainable.",
        },
        {
          label: "D",
          text: "There is also the question of what can realistically be grown. Leafy greens, herbs and soft fruit work well because the edible portion is small relative to the plant and the crop cycle is short. Wheat does not. A hectare of vertical wheat would produce grain at several times the cost of a field, and although the grain itself would be identical, no consumer would pay the difference. Analysts estimate that vertical farming could supply perhaps five per cent of the world's vegetables and a negligible fraction of its calories. It is a supplement, not a substitute.",
        },
        {
          label: "E",
          text: "Where the technology has proved most valuable is in places that lack land or reliable transport. Singapore, which imports more than 90 per cent of its food, has funded rooftop and high-rise farms as a matter of national security as well as commerce. In desert states, the water saving is decisive. A farm in a Gulf city can produce salad without irrigation and sell it within hours of harvest, which matters when the alternative has spent a week in a refrigerated container. Distance, not land, is often the true scarcity.",
        },
        {
          label: "F",
          text: "For the industry to grow beyond salad, two things must happen. The first is that the price of renewable electricity must keep falling, since energy is the largest single cost. The second is more subtle: growers must stop overclaiming. Investors who have been told that indoor farming will feed the world are beginning to ask why it does not, and the credibility of a useful technology is being spent on a promise it cannot keep. The lettuce in the tray is genuinely impressive. It is the marketing that needs to be pruned.",
        },
      ],
      groups: [
        {
          id: "g1",
          instruction: "Questions 1–6: Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.",
          kind: "tfng",
          questions: [
            { id: "q1", number: 1, text: "The warehouse described in paragraph A uses a very small workforce.", answer: "TRUE", explanation: "Eleven people run the entire operation." },
            { id: "q2", number: 2, text: "Growing plants without soil was invented in the 1930s.", answer: "FALSE", explanation: "Water culture is centuries old; only the term hydroponics was popularised in the 1930s." },
            { id: "q3", number: 3, text: "LED prices fell sharply in the decade to 2020 while performance improved.", answer: "TRUE", explanation: "Paragraph B gives an 80% fall and a doubling of efficiency." },
            { id: "q4", number: 4, text: "Indoor farms always produce lower carbon emissions than field farming.", answer: "FALSE", explanation: "Paragraph C shows emissions depend on how the electricity is generated." },
            { id: "q5", number: 5, text: "Vertical farms can produce wheat at a competitive price.", answer: "FALSE", explanation: "Paragraph D: vertical wheat would cost several times the field price." },
            { id: "q6", number: 6, text: "Singapore funds indoor farming partly for reasons of national security.", answer: "TRUE", explanation: "Paragraph E: 'as a matter of national security as well as commerce'." },
          ],
        },
        {
          id: "g2",
          instruction: "Questions 7–10: Complete each sentence with NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage.",
          kind: "gap",
          questions: [
            { id: "q7", number: 7, text: "Indoor farms use about 95 per cent less ______ than field agriculture.", answer: "water", explanation: "Paragraph C, first sentence." },
            { id: "q8", number: 8, text: "Energy is the largest single ______ for indoor growers.", answer: "cost", explanation: "Paragraph F: 'energy is the largest single cost'." },
            { id: "q9", number: 9, text: "Vertical farming might supply about five per cent of the world's ______.", answer: "vegetables", explanation: "Paragraph D: 'five per cent of the world's vegetables'." },
            { id: "q10", number: 10, text: "In some regions the real scarcity is ______ rather than land.", answer: "distance", explanation: "Paragraph E ends: 'Distance, not land, is often the true scarcity.'" },
          ],
        },
        {
          id: "g3",
          instruction: "Questions 11–13: Choose the correct letter, A, B, C or D.",
          kind: "mcq",
          questions: [
            {
              id: "q11",
              number: 11,
              text: "What made indoor farming viable for more crops?",
              options: ["Cheaper and better lighting", "New soil substitutes", "Government subsidies", "Declining land prices"],
              answer: "Cheaper and better lighting",
              explanation: "Paragraph B identifies the cost of light as the change.",
            },
            {
              id: "q12",
              number: 12,
              text: "Why are leafy greens suited to vertical farms?",
              options: ["They need no nutrients", "They grow quickly and most of the plant is edible", "They can be grown in soil", "They are expensive to transport"],
              answer: "They grow quickly and most of the plant is edible",
              explanation: "Paragraph D: short crop cycle and a high edible proportion.",
            },
            {
              id: "q13",
              number: 13,
              text: "What is the writer's main criticism of the industry?",
              options: ["Its technology does not work", "It exaggerates what it can achieve", "It wastes water", "It is too expensive for investors"],
              answer: "It exaggerates what it can achieve",
              explanation: "Paragraph F argues that overclaiming damages credibility.",
            },
          ],
        },
      ],
    },
    {
      id: "p2",
      title: "The Attention Economy",
      subtitle: "Passage 2 · 20 minutes · 13 questions",
      topic: "Media and misinformation",
      difficulty: "Standard",
      timeMinutes: 20,
      paragraphs: [
        {
          label: "A",
          text: "When a service is free, the product is usually the user's attention. This observation is old, but the industry built on it is young and extraordinarily precise. A modern feed does not merely show content; it predicts, for each person and each moment, which item is most likely to hold them for another few seconds, and it learns from every hesitation. The result is a machine optimised for engagement, a word that sounds neutral and is not.",
        },
        {
          label: "B",
          text: "Engagement is measured, and what is measured becomes the target. Because outrage travels further than nuance, content that provokes a reaction is rewarded with reach, whatever its accuracy. This is not a conspiracy; it is an emergent property of ranking systems that treat a click as evidence of value. A study of several million posts found that false stories were substantially more likely to be shared than true ones, and that the difference lay in novelty: misinformation was simply more surprising, and surprise drives sharing.",
        },
        {
          label: "C",
          text: "Correction is difficult because of how beliefs form. Once a claim has been accepted, contradicting evidence is not merely rejected; it can strengthen the original belief, a pattern psychologists call the backfire effect, although later work suggests it is rarer and more conditional than the original studies claimed. What is well established is that people evaluate information by its source and by its fit with what they already think. A correction from a trusted source, arriving early, and repeating the truth rather than the falsehood, works. A correction that repeats the myth in order to deny it often does not.",
        },
        {
          label: "D",
          text: "Regulators have responded slowly, partly because the harms are diffuse. A single misleading post harms nobody measurably; a million of them change what a society believes about vaccination or elections. The European Union's Digital Services Act requires very large platforms to assess systemic risk and submit to independent audit, which is a genuine departure: it regulates the design of the system rather than individual pieces of speech. Early assessments suggest that compliance is uneven and that auditors face the same information asymmetry as everyone else.",
        },
        {
          label: "E",
          text: "Individual remedies are weaker than they are advertised. Media literacy helps, but its effects fade and it places the burden on the reader rather than the designer. Fact-checking is valuable and cannot scale to the volume of content. The intervention with the strongest evidence is dull: reduce the speed at which content is shared, and label its origin. A delay of a few seconds before reposting reduces sharing of unverified material; a visible source label changes how readers weigh a claim. Neither is satisfying, and both work.",
        },
        {
          label: "F",
          text: "It is worth being precise about what is at stake. The problem is not that people are stupid, or that technology is evil. It is that attention has become a commodity, that the market for it rewards provocation, and that the costs of that reward are paid by everyone who is not selling it. Markets can be regulated, incentives can be changed, and defaults can be redesigned. None of that requires optimism about human nature; only a clear view of where the incentives point.",
        },
      ],
      groups: [
        {
          id: "g1",
          instruction: "Questions 14–19: Choose the correct heading for each paragraph from the list of headings below.",
          kind: "heading",
          sharedOptions: [
            "i. Why falsehoods spread",
            "ii. The difficulty of changing minds",
            "iii. A commercial model built on prediction",
            "iv. How television changed politics",
            "v. Regulating systems rather than statements",
            "vi. Small, unglamorous interventions",
            "vii. What the problem actually is",
            "viii. The economics of advertising revenue",
          ],
          questions: [
            { id: "q14", number: 14, text: "Paragraph A", answer: "iii. A commercial model built on prediction", explanation: "The feed predicts what holds attention for each person." },
            { id: "q15", number: 15, text: "Paragraph B", answer: "i. Why falsehoods spread", explanation: "Novelty drives sharing, so false stories travel further." },
            { id: "q16", number: 16, text: "Paragraph C", answer: "ii. The difficulty of changing minds", explanation: "Belief formation and the conditions in which corrections work." },
            { id: "q17", number: 17, text: "Paragraph D", answer: "v. Regulating systems rather than statements", explanation: "The DSA regulates platform design and risk, not individual speech." },
            { id: "q18", number: 18, text: "Paragraph E", answer: "vi. Small, unglamorous interventions", explanation: "Delays and source labels are described as dull but effective." },
            { id: "q19", number: 19, text: "Paragraph F", answer: "vii. What the problem actually is", explanation: "The final paragraph restates the problem precisely." },
          ],
        },
        {
          id: "g2",
          instruction: "Questions 20–23: Do the following statements agree with the claims in the passage? Write YES, NO or NOT GIVEN.",
          kind: "ynng",
          questions: [
            { id: "q20", number: 20, text: "Ranking systems reward provocative content because a click is treated as a sign of value.", answer: "YES", explanation: "Paragraph B describes exactly this emergent property." },
            { id: "q21", number: 21, text: "The backfire effect is stronger than the earliest studies suggested.", answer: "NO", explanation: "Later work suggests it is 'rarer and more conditional'." },
            { id: "q22", number: 22, text: "Repeating a false claim in order to deny it is an effective correction.", answer: "NO", explanation: "Paragraph C says such corrections 'often do not' work." },
            { id: "q23", number: 23, text: "Media literacy programmes are more effective than platform design changes.", answer: "NO", explanation: "The passage calls individual remedies weaker and design interventions better evidenced." },
          ],
        },
        {
          id: "g3",
          instruction: "Questions 24–26: Complete the summary with NO MORE THAN TWO WORDS from the passage.",
          kind: "gap",
          questions: [
            { id: "q24", number: 24, text: "False stories spread partly because they are more ______ than true ones.", answer: "surprising", explanation: "Paragraph B: 'misinformation was simply more surprising'." },
            { id: "q25", number: 25, text: "The Digital Services Act requires platforms to undergo independent ______.", answer: "audit", explanation: "Paragraph D: 'submit to independent audit'." },
            { id: "q26", number: 26, text: "Adding a few seconds of ______ before reposting reduces the sharing of unverified material.", answer: "delay", explanation: "Paragraph E: 'A delay of a few seconds before reposting'." },
          ],
        },
      ],
    },
    {
      id: "p3",
      title: "The Case for Repair",
      subtitle: "Passage 3 · 20 minutes · 14 questions",
      topic: "Consumer rights and the circular economy",
      difficulty: "Advanced",
      timeMinutes: 20,
      paragraphs: [
        {
          label: "A",
          text: "A washing machine built in 1985 typically lasted eighteen years. Its successor, built in 2015, is expected to last seven. The improvement in efficiency has been real — the newer machine uses less than half the electricity — but the improvement has been purchased with a shorter life, and the two trends are not unrelated. Thinner drums, sealed bearings and control boards that cannot be replaced individually all reduce manufacturing cost and, incidentally, repairability.",
        },
        {
          label: "B",
          text: "For a long time the economics appeared to justify this. A replacement part might cost forty per cent of a new appliance, and a repair visit added labour on top. Consumers, presented with the choice, often bought new. But the calculation changes if the part is unavailable at any price. Manufacturers have been found gluing components that were previously screwed, refusing to supply spare parts to independent workshops, and designing batteries that cannot be removed without destroying the casing. The effect is to remove the choice rather than to inform it.",
        },
        {
          label: "C",
          text: "The environmental arithmetic is less obvious than campaigners sometimes claim. Old appliances are often inefficient, and keeping a power-hungry fridge alive for a decade can outweigh the savings from manufacturing a new one. But for products where efficiency has plateaued — laptops, washing machines, bicycles — repair almost always wins, because the emissions embodied in manufacture dominate the lifetime total. A laptop's production accounts for around three-quarters of its lifetime carbon, so extending its life from four years to six cuts the annual footprint by roughly a third.",
        },
        {
          label: "D",
          text: "Legislation has begun to shift the balance. European rules now require manufacturers of certain appliances to supply spare parts for up to ten years and to make them available to professional repairers. The rules are narrower than headlines suggest: they cover a listed set of products, they do not cap the price of parts, and access for individual consumers is limited. Design requirements, such as the ability to replace a part with commonly available tools, apply to a smaller list still.",
        },
        {
          label: "E",
          text: "The more interesting development may be social rather than legal. Repair cafés, where volunteers help people mend their own possessions, have multiplied across Europe, and their waiting lists are long. Their function is only partly practical. A person who has repaired a lamp understands it differently, and the volunteers report that the most common outcome is not a fixed object but a changed attitude towards buying. Manufacturers, attentive to this, have begun advertising durability — a claim that would have been unnecessary a generation ago.",
        },
        {
          label: "F",
          text: "Sceptics make a fair point: regulation raises prices, and a durable appliance costs more to buy. The counter-argument is that the true cost was always being paid, just not by the purchaser and not at the point of sale. Whether voters accept that reframing is a political question rather than a technical one, and it is the question on which the whole agenda turns. The engineering of repairable products is largely solved. The accounting is what remains contested.",
        },
      ],
      groups: [
        {
          id: "g1",
          instruction: "Questions 27–31: Do the following statements agree with the writer's claims? Write YES, NO or NOT GIVEN.",
          kind: "ynng",
          questions: [
            { id: "q27", number: 27, text: "Modern washing machines are more energy-efficient but do not last as long.", answer: "YES", explanation: "Paragraph A: efficiency improved while lifespan fell from eighteen to seven years." },
            { id: "q28", number: 28, text: "Consumers usually choose a new appliance because repair is impossible.", answer: "NO", explanation: "Paragraph B says consumers often bought new because of cost, and that design removes the choice — it does not claim impossibility is the usual reason." },
            { id: "q29", number: 29, text: "Repairing an old appliance is always better for the environment than replacing it.", answer: "NO", explanation: "Paragraph C says a power-hungry fridge may be worth replacing; repair 'almost always' wins where efficiency has plateaued." },
            { id: "q30", number: 30, text: "European rules set a maximum price for spare parts.", answer: "NO", explanation: "Paragraph D: 'they do not cap the price of parts'." },
            { id: "q31", number: 31, text: "Repair cafés have become more common in Europe.", answer: "YES", explanation: "Paragraph E: they 'have multiplied across Europe, and their waiting lists are long'." },
          ],
        },
        {
          id: "g2",
          instruction: "Questions 32–35: Choose the correct letter, A, B, C or D.",
          kind: "mcq",
          questions: [
            {
              id: "q32",
              number: 32,
              text: "Why are modern appliances harder to repair?",
              options: ["They contain more complex electronics", "Design choices reduce manufacturing cost", "Repairers lack training", "Parts are made abroad"],
              answer: "Design choices reduce manufacturing cost",
              explanation: "Paragraph A links thinner drums and sealed bearings to lower manufacturing cost.",
            },
            {
              id: "q33",
              number: 33,
              text: "What does the writer mean by 'the effect is to remove the choice rather than to inform it'?",
              options: ["Consumers are given misleading advice", "The option of repair disappears entirely", "Prices are deliberately hidden", "Shops refuse to sell parts"],
              answer: "The option of repair disappears entirely",
              explanation: "Parts may be unavailable at any price, so no real choice exists.",
            },
            {
              id: "q34",
              number: 34,
              text: "For which product is repair most clearly beneficial?",
              options: ["An old, inefficient fridge", "A laptop whose production dominates its footprint", "An appliance still under warranty", "A device with a sealed battery"],
              answer: "A laptop whose production dominates its footprint",
              explanation: "Paragraph C: where manufacture dominates lifetime emissions, repair wins.",
            },
            {
              id: "q35",
              number: 35,
              text: "What does the writer identify as the unresolved issue?",
              options: ["The engineering of repairable products", "Whether consumers can afford higher prices", "How the true costs are accounted for", "Whether repair cafés can expand"],
              answer: "How the true costs are accounted for",
              explanation: "Paragraph F: 'The engineering ... is largely solved. The accounting is what remains contested.'",
            },
          ],
        },
        {
          id: "g3",
          instruction: "Questions 36–40: Complete the summary with NO MORE THAN TWO WORDS from the passage.",
          kind: "gap",
          questions: [
            { id: "q36", number: 36, text: "Manufacturers have been found ______ components that used to be screwed in place.", answer: "gluing", explanation: "Paragraph B: 'gluing components that were previously screwed'." },
            { id: "q37", number: 37, text: "For a laptop, manufacture accounts for about three-quarters of its lifetime ______.", answer: "carbon", explanation: "Paragraph C mentions 'lifetime carbon'." },
            { id: "q38", number: 38, text: "New rules require spare parts to be available to professional ______.", answer: "repairers", explanation: "Paragraph D." },
            { id: "q39", number: 39, text: "Volunteers at repair events report a change in attitude towards ______.", answer: "buying", explanation: "Paragraph E: 'a changed attitude towards buying'." },
            { id: "q40", number: 40, text: "Sceptics argue that regulation makes products more ______.", answer: "expensive", explanation: "Paragraph F: 'regulation raises prices'." },
          ],
        },
      ],
    },
  ],
};
