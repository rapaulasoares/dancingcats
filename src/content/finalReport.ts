import type { FinalQuestion } from './types';

/**
 * Final Investigation Report: eight explanation questions, asked in this
 * order, one per screen, locked on submit. Options are shuffled at play time.
 * Source of truth for wording: docs/04-final-report-and-logic-audit.md
 */
export const finalReport: FinalQuestion[] = [
  {
    id: 'R1',
    heading: "What happened",
    prompt:
      "What best explains the symptoms seen in the residents of Vila do Sol — and why were the \"dancing cats\" an early warning?",
    options: [
      {
        id: 'a',
        text: "A contagious illness is passing between people and animals that live close together; the cats on the docks caught it first, and neighbours are catching it from them.",
      },
      {
        id: 'b',
        text: "The growing number of rats brought a disease into town; the cats that hunt rats caught it first, and rat bites and droppings then spread it to people.",
      },
      {
        id: 'c',
        text: "A heavy metal is damaging the nervous system of those who take it in; the cats ate contaminated fish scraps and showed the effects before people did.",
      },
      {
        id: 'd',
        text: "Algae multiplied in the warm water in January and released natural poisons; the fish were harmed first, then the cats, birds and people near the bay.",
      },
      {
        id: 'e',
        text: "A misfortune fell on the town after the fishermen's statue broke in December; it struck the animals first, as the old stories warn, and then the people.",
      },
    ],
    correct: 'c',
    dimension: 'evidenceAnalysis',
    evidenceRefs: ['SCI-09', 'CLI-01', 'MKT-02', 'MKT-03', 'RES-03', 'SCI-05', 'CLI-02', 'RES-02', 'MKT-04', 'HAR-02', 'SCI-06', 'ROS-02'],
  },
  {
    id: 'R2',
    heading: "How it reaches people",
    prompt:
      "How does the harmful substance reach the people of Vila do Sol?",
    options: [
      {
        id: 'a',
        text: "Through the town's drinking water, which comes from the Serra reservoir in the mountains and is piped to every neighbourhood, so everyone who drinks it is exposed.",
      },
      {
        id: 'b',
        text: "Through the skin, when people swim in the bay, wade in the shallows or handle wet nets, and absorb the substance while they work.",
      },
      {
        id: 'c',
        text: "Through the rats, which have multiplied and are now all over town: they bite people and leave urine and droppings on food and surfaces.",
      },
      {
        id: 'd',
        text: "Through food: it builds up in the fish and shellfish of the bay, and then in the people who eat them often, as the families who eat local seafood daily show.",
      },
    ],
    correct: 'd',
    dimension: 'evidenceAnalysis',
    evidenceRefs: ['CLI-03', 'RES-01', 'RES-02', 'HAR-03', 'SQ-06', 'SQ-07', 'MKT-04', 'SCI-01', 'SCI-04', 'SCI-09', 'CLI-05', 'CLI-06', 'TUC-05', 'SQ-05'],
  },
  {
    id: 'R3',
    heading: "Where it comes from",
    prompt:
      "What is the source of the contamination in the bay?",
    options: [
      {
        id: 'a',
        text: "A natural change in the bay itself: the warm week in January heated the water and made the algae multiply, and their toxins stayed in the bay afterwards.",
      },
      {
        id: 'b',
        text: "Rat urine: the rats that now run through the streets are washed by the rain into the drains and the river, which carry it into the bay.",
      },
      {
        id: 'c',
        text: "Wastewater released by Tucano Industrial through the channel at the north point, where the factory's treated water flows into the bay.",
      },
      {
        id: 'd',
        text: "Paint and fuel from the boat-repair yard at the south beach, which have been leaking into the water for years.",
      },
    ],
    correct: 'c',
    dimension: 'systemsThinking',
    evidenceRefs: ['SCI-10', 'TUC-03', 'TUC-06', 'HAR-07', 'HAR-05', 'TUC-08', 'SQ-02', 'SCI-06', 'SCI-09'],
  },
  {
    id: 'R4',
    heading: "The rats",
    prompt:
      "Why did Vila do Sol suddenly have so many rats?",
    options: [
      {
        id: 'a',
        text: "The rats brought the illness with them, and they multiplied as it spread through the town, feeding on the waste and scraps that sick households left behind.",
      },
      {
        id: 'b',
        text: "More food for rats appeared in the streets and around the market, from fish scraps and uncollected rubbish, so the rats had more to eat and bred faster.",
      },
      {
        id: 'c',
        text: "A rat infestation at Tucano Industrial spread into the town, as the rats left the factory looking for food and moved into the houses near the harbor.",
      },
      {
        id: 'd',
        text: "Many cats became sick or died, so there were far fewer predators hunting the rats, which were free to multiply across the town.",
      },
    ],
    correct: 'd',
    dimension: 'systemsThinking',
    evidenceRefs: ['SQ-01', 'SCI-02', 'MKT-03', 'MKT-05', 'RES-04', 'SQ-08'],
  },
  {
    id: 'R5',
    heading: "João",
    prompt:
      "João works at Tucano Industrial every day, yet he and his family are healthy. What does this suggest?",
    options: [
      {
        id: 'a',
        text: "Tucano cannot have anything to do with the problem, because a factory that harmed people would first harm the workers who spend eight hours a day inside it.",
      },
      {
        id: 'b',
        text: "Working at the factory does not, by itself, explain who becomes sick, since some factory families are ill and others are not.",
      },
      {
        id: 'c',
        text: "João is not telling the truth about his family: he is hiding that someone at home is sick because he is afraid of losing his job.",
      },
      {
        id: 'd',
        text: "Factory workers are protected from the illness by their gloves, masks and safety glasses, which is why João's family stays healthy.",
      },
    ],
    correct: 'b',
    dimension: 'logicalReasoning',
    evidenceRefs: ['SQ-05', 'SQ-06', 'SQ-07', 'ECO-03', 'ECO-04', 'TUC-05', 'CLI-03'],
  },
  {
    id: 'R6',
    heading: "The company's report",
    prompt:
      "Which statement best describes Tucano's internal wastewater report?",
    options: [
      {
        id: 'a',
        text: "It is definitely false, because the company has a reason to hide problems and companies under investigation rarely report the truth.",
      },
      {
        id: 'b',
        text: "It proves the wastewater is safe, because it comes from a real laboratory with trained technicians and every measured value is within the permitted limits.",
      },
      {
        id: 'c',
        text: "It may be accurate, but it was collected and tested by the company being investigated, so on its own it carries less weight as evidence.",
      },
      {
        id: 'd',
        text: "It does not matter, because wastewater is treated before release and treated water has nothing to do with what happens in the bay.",
      },
    ],
    correct: 'c',
    dimension: 'sourceEvaluation',
    evidenceRefs: ['TUC-02', 'SCI-07', 'TUC-01'],
  },
  {
    id: 'R7',
    heading: "The conclusion",
    prompt:
      "Which conclusion is best supported by all the evidence?",
    options: [
      {
        id: 'a',
        text: "Algae multiplied in the warm water in January and released natural poisons. The poisons built up in crustaceans and fish, and the cats, gulls and people that ate them developed neurological symptoms.",
      },
      {
        id: 'b',
        text: "The rats multiplied and spread a disease through their bites. It affected the cats, the gulls and the people of the town, which is why everything began at the same time as the rise in rats.",
      },
      {
        id: 'c',
        text: "Metal from the factory's production process left in its wastewater at the north point and built up in crustaceans and fish. The cats, people and gulls that ate them developed neurological symptoms.",
      },
      {
        id: 'd',
        text: "A respected resident explained that the sea is angry since the statue broke. Its anger struck the animals of the bay first, the cats and the gulls, and then the people, so the town should make peace with the sea.",
      },
    ],
    correct: 'c',
    dimension: 'logicalReasoning',
    evidenceRefs: ['TUC-03', 'SCI-10', 'SCI-09', 'SCI-01', 'SCI-04', 'CLI-03', 'CLI-01', 'SCI-07'],
  },
  {
    id: 'R8',
    heading: "Supporting the conclusion",
    prompt:
      "The investigation shows that heavy metal in the factory's wastewater made the animals and people sick. Which group of clues best supports this conclusion?",
    options: [
      {
        id: 'a',
        text: "The factory's own report says every measured value is within the permitted limits, João and his family work there and are healthy, the company says it follows every safety rule, and the water in the channel looks clear.",
      },
      {
        id: 'b',
        text: "The rats increased from 8 to 67 between February and June, rats were seen on doorsteps and chewing sacks in the kitchens, fishermen complain that they gnaw holes in the nets, and residents say \"the sickness came with the rats\".",
      },
      {
        id: 'c',
        text: "Most patients live in the streets near the harbor and almost none in the hillside houses near the factory, the Silvas and Marcos's family eat local fish nearly every day, and two families in Porto Azul, who buy fish from the Vila do Sol market, are also sick.",
      },
      {
        id: 'd',
        text: "Samples show the most heavy metal in the channel and at its mouth, the animals' blood and tissue tests found methylmercury, the factory uses chemicals with heavy metals, and the affected people eat fish daily.",
      },
    ],
    correct: 'd',
    dimension: 'sourceEvaluation',
    evidenceRefs: ['SCI-10', 'SCI-09', 'TUC-08', 'CLI-03', 'RES-01', 'SQ-06', 'SQ-07', 'TUC-02', 'SQ-05', 'SQ-01', 'RES-06', 'RES-08', 'SQ-03', 'CLI-06', 'MKT-04'],
  },
];
