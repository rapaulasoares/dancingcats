import { BALANCE } from './balance';
import type { Condition, Interview } from './types';

/**
 * All interviews. `class` is hidden from players.
 * Source of truth for wording: docs/03-question-matrix.md
 *
 * Rule: no question may assume knowledge the player does not have yet.
 * Follow-ups and knowledge-gated questions use `availableWhen`.
 */

/** The player has seen or read about the rats. */
const knowsAboutRats: Condition = {
  anyOf: [
    { visitedAny: ['market', 'community'] },
    { anyEvidence: ['RES-06', 'RES-08', 'SQ-01', 'SQ-03'] },
  ],
};

/** The player has read about the algae. */
const knowsAboutAlgae: Condition = { anyEvidence: ['HAR-08', 'SQ-09'] };

export const interviews: Interview[] = [
  {
    id: 'maria',
    characterId: 'maria',
    locationId: 'harbor',
    maxQuestions: BALANCE.questions.maria,
    questions: [
      {
        id: 'M1',
        text: 'What exactly have you seen the fish doing?',
        response:
          "Some swim in slow circles right at the surface, like they've forgotten how to dive. You can scoop them up with your hands. Others just float. The first odd ones showed up about a year ago. Thirty years on this bay and I've never seen it.",
        class: 'strong',
        unlocks: ['HAR-02'],
      },
      {
        id: 'M2',
        text: "Tell me what's happening.",
        response:
          "Everything has been strange lately. People are worried, animals are acting strangely, and nobody really knows what's happening.",
        class: 'vague',
      },
      {
        id: 'M3',
        text: 'What foods does your family eat most often, and where do they come from?',
        response:
          "Fish, of course. Whatever I don't sell, we eat — fish, crab, mussels off the rocks, nearly every day. Rice and beans from the shop. I don't have the money to be choosy about what I eat, and meat costs more than I earn in a week. This sea is my living. I was born here, and my whole life is in this town. Where would I go?",
        class: 'strong',
        unlocks: ['HAR-03'],
      },
      {
        id: 'M4',
        text: 'Do you think Tucano Industrial is responsible?',
        response: "I don't know. My nephew works there. A lot of people here depend on those jobs.",
        class: 'opinion',
      },
      {
        id: 'M5',
        text: 'Has anyone in your household experienced similar symptoms?',
        response:
          "My husband's hands shake so badly he can't mend the nets anymore. My lips and fingertips go numb. My brother's family fishes too, and two of them are the same.",
        class: 'strong',
        unlocks: ['HAR-04'],
      },
      {
        id: 'M6',
        text: 'The algae in January made the fish sick, right?',
        response:
          "The red tide? Could be. My grandfather used to say it kills fish. There was a patch out at sea for a day or two. Maybe that's it.",
        class: 'leading',
        availableWhen: knowsAboutAlgae,
      },
      {
        id: 'M7',
        text: 'Is there any part of the bay where you find more of the strange fish?',
        response:
          'Up by the north point, past the rocks. That used to be my best spot. Now I pull up more floaters there than anywhere.',
        class: 'strong',
        unlocks: ['HAR-05'],
      },
      {
        id: 'M8',
        text: "What's the biggest fish you ever caught?",
        response:
          "Ha! A grouper as long as my boat is wide. Took two of us to lift it. ...But that's not why you're here, is it?",
        class: 'irrelevant',
      },
    ],
  },
  {
    id: 'carlos',
    characterId: 'carlos',
    locationId: 'market',
    maxQuestions: BALANCE.questions.carlos,
    questions: [
      {
        id: 'C1',
        text: 'Do the cats around here belong to anyone? What do they usually eat?',
        response:
          "They're market cats — they belong to everyone and no one. They eat what we drop: fish heads, guts, shellfish scraps, whatever's left from the day's catch. Been that way since my father ran this stall.",
        class: 'strong',
        unlocks: ['MKT-02'],
      },
      {
        id: 'C2',
        text: 'Do you eat cats?',
        response: 'What?! No! Of course not.',
        class: 'humorous',
      },
      {
        id: 'C3',
        text: 'What exactly did you observe when the cats got sick?',
        response:
          "First they walk like they're on a rocking boat. Then the jerking starts — legs kicking, spinning in circles. One ran straight off the dock into the water. There were twenty-odd cats here at New Year. Now I count three.",
        class: 'strong',
        unlocks: ['MKT-03'],
      },
      {
        id: 'C4',
        text: 'The rats are spreading the disease, right?',
        response: 'Maybe. There certainly are more rats now.',
        class: 'leading',
        availableWhen: knowsAboutRats,
      },
      {
        id: 'C5',
        text: 'Where does the fish you sell end up?',
        response:
          "Half goes home with people from town. The rest goes on the truck to Porto Azul, an hour down the coast. A buyer there told me two families have this same shaking sickness. Far as I know, they've never set foot in Vila do Sol.",
        class: 'useful',
        unlocks: ['MKT-04'],
      },
      {
        id: 'C6',
        text: 'Can you explain what is causing this problem?',
        response:
          "I wish I knew. That's what everyone is trying to understand. I sell fish, friend — I don't solve mysteries.",
        class: 'opinion',
      },
      {
        id: 'C7',
        text: 'When did you first notice the increase in rats?',
        response:
          "After Easter, I'd say — April. By then half the market cats were already gone. Now the rats walk past my stall in daylight like they're paying rent.",
        class: 'strong',
        unlocks: ['MKT-05'],
        availableWhen: knowsAboutRats,
      },
      {
        id: 'C8',
        text: 'Is business good?',
        response:
          "It was. Now people look at my fish, then at each other, and walk on. I've dropped my prices twice. But what else can I do? The families who fish can't stop fishing, and I can't stop selling. We have nowhere else to turn.",
        class: 'medium',
      },
    ],
  },
  {
    id: 'ana',
    characterId: 'ana',
    locationId: 'clinic',
    maxQuestions: BALANCE.questions.ana,
    questions: [
      {
        id: 'A1',
        text: 'Is it contagious?',
        response:
          "I can't say for certain. It doesn't behave like the infections I know. But 'I haven't seen it before' isn't the same as 'it's impossible.'",
        class: 'medium',
      },
      {
        id: 'A2',
        text: 'What exactly have you observed in your patients?',
        response:
          "Numb hands and lips first. Then trembling, slurred speech, and trouble walking in a straight line — several patients stumble and have fallen at home. Some say their vision has narrowed, like looking through a tube, or that sounds are muffled. What I don't see is just as strange: no fever, no cough, no rash. Remember, your nervous system helps your brain control movement, balance, vision, hearing and touch — and those are exactly the things my patients are losing.",
        class: 'strong',
        unlocks: ['CLI-01'],
      },
      {
        id: 'A3',
        text: 'How scared should people be?',
        response: "People are frightened, and I understand. But fear doesn't tell us anything. Facts might.",
        class: 'vague',
      },
      {
        id: 'A4',
        text: 'Have people caring for the sick developed similar symptoms?',
        response:
          'No. Six of us have worked closely with these patients for months — nurses, the cleaner, me. None of us has a single symptom. And in some homes, one person is very sick while the person nursing them stays well.',
        class: 'strong',
        unlocks: ['CLI-02'],
      },
      {
        id: 'A5',
        text: "Rats brought this illness, didn't they?",
        response:
          "Rats can carry illnesses, and leptospirosis is one I know well. So it's possible. But 'possible' isn't 'proven'. My patients have no fever, and I haven't found anything directly linking my patients to rats, only the fact that both are increasing at the same time.",
        class: 'leading',
        availableWhen: knowsAboutRats,
      },
      {
        id: 'A6',
        text: 'What do the affected families appear to have in common?',
        response:
          "I've wondered that myself, so our nurse began visiting households and writing down how they live — their work, their food, where they get their water. It's unfinished, but here. See what you make of it.",
        class: 'strong',
        unlocks: ['CLI-03'],
      },
      {
        id: 'A7',
        text: 'What medicine cures it?',
        response: "None that I've found. I can ease the pain and help families cope. That's all, for now.",
        class: 'irrelevant',
      },
      {
        id: 'A8',
        text: 'Where do your patients live?',
        response:
          'Mostly the streets near the harbor. A few elsewhere in town. Hardly any from the hillside houses near the factory, come to think of it. What do you think that could mean?',
        class: 'useful',
        unlocks: ['CLI-06'],
      },
    ],
  },
  {
    id: 'silva',
    characterId: 'silva',
    locationId: 'community',
    maxQuestions: BALANCE.questions.silva,
    questions: [
      {
        id: 'S1',
        text: 'It must be terrible, right?',
        response: 'Yes. It is.',
        class: 'vague',
      },
      {
        id: 'S2',
        text: 'How often does your family eat locally caught seafood?',
        response:
          "Every day, almost. My husband brings home what doesn't sell. Fish stew, fried sardines, crab on Sundays. It's what we've always eaten — and what we can afford. Some weeks the fish is the only thing on the table. We have nowhere else to go, and nothing else to eat.",
        class: 'strong',
        unlocks: ['RES-01'],
      },
      {
        id: 'S3',
        text: 'Who in your household is sick, and who is not?',
        response:
          "My husband can hardly walk — he stumbles and falls, even in our own kitchen. My oldest boy drops things, and his words come out tangled. But Luana, my daughter, is perfectly fine. She's fourteen and stubborn — hasn't touched fish in two years. Says the smell turns her stomach.",
        class: 'strong',
        unlocks: ['RES-02'],
      },
      {
        id: 'S4',
        text: 'Did your family catch it from the neighbors?',
        response: "Catch it? I... don't know that it's something you catch. Do you?",
        class: 'assumption',
      },
      {
        id: 'S5',
        text: 'Do you have cats? What do they usually eat?',
        response:
          'We had two. Mimi and Sardinha. They ate what we ate — the heads and bones from our fish. Sardinha started spinning in March. Both are gone now. They fell ill before any of us did. Why do you think that was?',
        class: 'strong',
        unlocks: ['RES-03'],
      },
      {
        id: 'S6',
        text: 'Why do you think this is happening to your family?',
        response:
          "I ask God that every night. My neighbor says it's the rats. My mother says it's bad luck. I only know what I see.",
        class: 'opinion',
      },
      {
        id: 'S7',
        text: 'What changed around the time the rats began increasing?',
        response:
          "Let me think... The cats. By the time I saw rats in my kitchen, there wasn't a cat left on this street. We used to have one on every doorstep.",
        class: 'strong',
        unlocks: ['RES-04'],
        availableWhen: knowsAboutRats,
      },
      {
        id: 'S8',
        text: "Is there anything about your family's health that you can't explain?",
        response:
          "Bia, my baby. She's eighteen months old and can't sit up or hold a spoon the way her brothers did. She was born this way. She's only ever had milk — never a bite of fish. Dr. Ana has no answer for me.",
        class: 'useful',
        unlocks: ['RES-05'],
      },
    ],
  },
  {
    id: 'joao',
    characterId: 'joao',
    locationId: 'square',
    maxQuestions: BALANCE.questions.joao,
    questions: [
      {
        id: 'J1',
        text: 'Tell me about your job.',
        response:
          "I love working there. Tucano gave me a steady job when there weren't many opportunities here. I've been there eleven years — it's the best job I've ever had. It's how I support my family.",
        class: 'medium',
      },
      {
        id: 'J2',
        text: 'Has anyone in your household experienced similar symptoms?',
        response: 'No, thank God. My wife, my two kids, me — all healthy. Not so much as a shaky hand.',
        class: 'strong',
        unlocks: ['SQ-05'],
      },
      {
        id: 'J3',
        text: "Tucano is hiding something, isn't it?",
        response:
          "Hiding? I clock in, I do my work, I go home. If something's hidden, nobody showed it to me.",
        class: 'leading',
      },
      {
        id: 'J4',
        text: 'What foods does your family eat most often?',
        response:
          "My wife doesn't really like seafood. We mostly eat rice, beans, chicken, and vegetables. Fish maybe at Christmas, if my mother-in-law insists.",
        class: 'strong',
        unlocks: ['SQ-06'],
      },
      {
        id: 'J5',
        text: "What's your favourite football team?",
        response: 'Vila do Sol FC, of course! Tucano bought our shirts this year. We still lost 4–0.',
        class: 'humorous',
      },
      {
        id: 'J6',
        text: 'Do you know anyone personally who has become sick?',
        response:
          "Marcos Costa, from my shift. His wife and his father both have it bad. Marcos fishes off the rocks every weekend — proud of it, too. Says his family hasn't paid for a fish in years.",
        class: 'useful',
        unlocks: ['SQ-07'],
      },
      {
        id: 'J7',
        text: 'Have you personally observed anything unusual at the factory?',
        response:
          'Honestly? No. Same machines, same smell of warm plastic, same lunch. The only new thing is the second production line they opened last year. More shifts, more overtime.',
        class: 'useful',
      },
      {
        id: 'J8',
        text: 'Are the factory workers getting sick?',
        response:
          "A few families, like Marcos's. Most of us are fine — and we're in that building eight hours a day. Funny, isn't it? Same building, same hours. Why do you think some families get sick and not others?",
        class: 'useful',
      },
    ],
  },
  {
    id: 'santos',
    characterId: 'santos',
    locationId: 'tucano',
    maxQuestions: BALANCE.questions.santos,
    questions: [
      {
        id: 'T1',
        text: 'What is it like to work at Tucano? What is the work environment like?',
        response:
          "I'm proud of it. We employ about six hundred people. There is safety training, a canteen, and a bus from town every morning. Many of our staff have been with us for more than ten years.",
        class: 'medium',
      },
      {
        id: 'T2',
        text: 'Do you use chemical products in production? If so, what is in them?',
        response:
          'Yes, like any plastics manufacturer. We make materials for pipes, packaging and toys, and several industrial chemicals are needed to produce them. Some of our catalysts and additives contain heavy metals. The exact recipe is confidential — our competitors would love to have it — but we follow every rule, and every employee wears protective equipment: gloves, masks, safety glasses.',
        class: 'strong',
        unlocks: ['TUC-08'],
      },
      {
        id: 'T3',
        text: 'Why is Tucano Industrial poisoning the town?',
        response:
          "You're assuming the company is responsible before you've proved that. I'd expect an investigator to begin with evidence.",
        class: 'assumption',
      },
      {
        id: 'T4',
        text: "What happens to the factory's waste and wastewater?",
        response:
          'Solid waste goes by truck to the regional landfill. Wastewater is treated on site and then released through a channel to the bay.',
        class: 'strong',
        unlocks: ['TUC-03'],
      },
      {
        id: 'T5',
        text: 'Do the children eat the plastic toy toucans?',
        response: '(He blinks.) I... certainly hope not. They are toys.',
        class: 'humorous',
      },
      {
        id: 'T6',
        text: 'Can we inspect the site and collect some samples for the laboratory now?',
        response:
          'We would be glad to cooperate. But visitors cannot enter a working plant without preparation — safety training, protective equipment, an escort. The earliest we could arrange it is within two weeks.',
        class: 'strong',
        unlocks: ['TUC-04'],
      },
      {
        id: 'T7',
        text: "How many Tucano employees' families are affected?",
        response:
          "By our count, nine families out of roughly six hundred employees. Every one of them matters to us. But most of our workforce is in good health. Nine out of six hundred. I'd say that speaks for itself, wouldn't you?",
        class: 'useful',
        unlocks: ['TUC-05'],
      },
      {
        id: 'T8',
        text: 'Is Tucano responsible for the illness?',
        response:
          'Tucano Industrial operates according to current safety and environmental requirements. We are deeply concerned about the families affected by this mysterious illness, including families of our own employees.',
        class: 'medium',
      },
      {
        id: 'T9',
        text: 'Can we have a copy of the wastewater lab reports? Which laboratory does the analysis?',
        response:
          "Of course. Here is our latest report. The samples are collected by our environmental technicians and analysed in Tucano's own laboratory. An outside laboratory has not tested our wastewater so far.",
        class: 'strong',
        unlocks: ['TUC-02'],
        availableWhen: { askedQuestion: ['T4'] },
      },
    ],
  },
  {
    id: 'rosa',
    characterId: 'rosa',
    locationId: 'rosa',
    maxQuestions: BALANCE.questions.rosa,
    questions: [
      {
        id: 'R1',
        text: 'What do you believe is happening to Vila do Sol?',
        response:
          'Something has turned its face from us. The old people spoke of times when the sea asks for what it is owed. I feel a shadow over the bay. I cannot show it to you. I can only tell you that I feel it.',
        class: 'opinion',
        unlocks: ['ROS-01'],
      },
      {
        id: 'R2',
        text: 'Are you a witch?',
        response:
          '(She laughs.) I am an old woman who knows plants. Sit down. Ask me something worth the walk up here.',
        class: 'humorous',
      },
      {
        id: 'R3',
        text: 'What exactly have you seen with your own eyes?',
        response:
          'The cats by the docks went first — spinning, falling. Then the gulls. I saw one drop onto the sand with its wings open, as if it forgot how to fly. But my hens are well. The little birds in my garden still sing.',
        class: 'strong',
        unlocks: ['ROS-03'],
      },
      {
        id: 'R4',
        text: "The spirits are punishing the town, aren't they?",
        response: 'You say it, not I. But yes — perhaps.',
        class: 'leading',
      },
      {
        id: 'R5',
        text: 'Do you have cats? What do they usually eat?',
        response:
          'One. Pretinha. She is old and lazy and never leaves my garden. She eats what I eat — rice, a little chicken, pumpkin. She is as healthy as the day she came to me.',
        class: 'strong',
        unlocks: ['ROS-02'],
      },
      {
        id: 'R6',
        text: 'Can your remedies cure the sickness?',
        response:
          'My teas calm the heart and help people sleep. They do not stop the shaking. I would not lie to you about that.',
        class: 'irrelevant',
      },
      {
        id: 'R7',
        text: 'Who comes to you for help?',
        response:
          "Fishing people, mostly. The Silvas. Maria's husband. Families from the harbor streets. From the hill houses, almost no one.",
        class: 'useful',
      },
      {
        id: 'R8',
        text: 'When did you first notice something unusual?',
        response:
          'Before the cats. Last winter the crabs on the north rocks were slow, easy to catch. I remember thinking: a gift. Now I think it was a warning.',
        class: 'useful',
      },
    ],
  },
  {
    id: 'marcos',
    characterId: 'marcos',
    locationId: 'square',
    maxQuestions: BALANCE.questions.marcos,
    questions: [
      {
        id: 'K1',
        text: 'How long has your family worked at Tucano?',
        response:
          "My father worked there. I work there. My brother works there. Half this town depends on those jobs. If the factory closes, what happens to us?",
        class: 'useful',
        unlocks: ['ECO-02'],
      },
      {
        id: 'K2',
        text: 'Has anyone in your household experienced similar symptoms?',
        response:
          "My wife. It began in March, with numbness in her hands. Now she drops cups, and some days she can't button her blouse. My father too. Me, nothing so far. Nothing.",
        class: 'strong',
        unlocks: ['ECO-03'],
      },
      {
        id: 'K3',
        text: 'What foods does your family eat most often, and where do they come from?',
        response:
          "Fish, nearly every day. I catch it off the rocks on weekends, and my wife grills it. We haven't bought fish at a market in years. I'm proud of that. With a factory wage you don't go shopping for fancier food — the sea is free, and it's what we have.",
        class: 'strong',
        unlocks: ['ECO-04'],
      },
      {
        id: 'K4',
        text: 'Do you think Tucano Industrial is responsible?',
        response:
          "Those fishermen keep blaming the factory. Do they know how many families would lose their jobs if it closed? ...And then my wife drops a cup, and I don't know what to think anymore.",
        class: 'opinion',
      },
      {
        id: 'K5',
        text: 'Do you wear any protective equipment at work?',
        response:
          'Always. Gloves, a mask, safety glasses, boots. Nobody goes inside without them, and they check us every morning. They take safety seriously.',
        class: 'useful',
        unlocks: ['ECO-05'],
      },
      {
        id: 'K6',
        text: 'What time does your shift start?',
        response: 'Six in the morning. The bus leaves this square at half past five.',
        class: 'irrelevant',
      },
      {
        id: 'K7',
        text: 'Why is Tucano Industrial poisoning your wife?',
        response: "(He stares at you.) I came here to talk, not to be accused. Ask me what you want to know.",
        class: 'assumption',
      },
    ],
  },
  {
    id: 'roberto',
    characterId: 'roberto',
    locationId: 'science',
    maxQuestions: BALANCE.questions.roberto,
    questions: [
      {
        id: 'P1',
        text: 'What is causing the illness?',
        response:
          "If I answered that now, I would be guessing — and a scientist's guess is still a guess. Bring me evidence and I'll help you understand it.",
        class: 'opinion',
      },
      {
        id: 'P2',
        text: 'What happens to a population of animals when its predators disappear?',
        response:
          'Predators help control the populations of the animals they eat. Remove the predator, and the prey often multiplies — sometimes very quickly.',
        class: 'strong',
        unlocks: ['SCI-02'],
      },
      {
        id: 'P3',
        text: 'Is science always right?',
        response: "No. Science is a way of finding out where we're wrong. That's rather the point.",
        class: 'vague',
      },
      {
        id: 'P4',
        text: 'Can something harmful in water end up inside animals?',
        response:
          'Yes. Some substances can build up inside living organisms over time, because the body takes them in faster than it can get rid of them. And when one animal repeatedly eats contaminated organisms, some contaminants become more concentrated higher in the food chain.',
        class: 'strong',
        unlocks: ['SCI-04'],
      },
      {
        id: 'P5',
        text: 'What kinds of things can damage how a body moves, speaks, and sees?',
        response:
          "Those are jobs of the nervous system — the brain and the nerves. Several things can harm it: certain infections, natural toxins produced by algae, some pesticides, and certain heavy metals associated with industrial production and gold mining.",
        class: 'useful',
        unlocks: ['SCI-05'],
      },
      {
        id: 'P6',
        text: 'Has anything unusual happened in the ocean this year?',
        response:
          'We measure the bay every week. Apart from one warm week in January, the water temperature has stayed in its normal range. That same week the algae — the tiny plants that live in seawater — multiplied for a few days, then went back to normal. Here is the record.',
        class: 'useful',
        unlocks: ['SCI-06'],
      },
      {
        id: 'P7',
        text: 'Has your laboratory been able to collect samples at the factory?',
        response:
          "We asked Tucano Industrial. On our first visit we were given the company's own wastewater report, but we were not permitted to collect our own sample. Here is the note from that day.",
        class: 'strong',
        unlocks: ['SCI-07'],
      },
      {
        id: 'P8',
        text: 'How do scientists decide whether a test result can be trusted?',
        response:
          "We ask: Who collected the sample? Who tested it? Could someone else repeat it and get the same result? A result isn't false just because of who produced it — but the more independent the checking, the more weight it can carry.",
        class: 'useful',
      },
    ],
  },
  {
    id: 'roberto2',
    characterId: 'roberto',
    locationId: 'science',
    maxQuestions: BALANCE.questions.roberto2,
    availableWhen: { hasEvidence: ['SCI-09'] },
    questions: [
      {
        id: 'P9',
        text: 'So Tucano did it?',
        response: "Not so fast. You said that, not the data. Look at where the levels are highest, and ask what could explain that pattern.",
        class: 'leading',
      },
      {
        id: 'P10',
        text: 'Where can heavy metals in a bay come from?',
        response:
          'Some occur naturally in certain rocks and soils and wash down in rivers. Some are used in mining and in manufacturing. There is no mining in this region. That is why we sampled the river mouth as well as other parts of the bay.',
        class: 'strong',
      },
      {
        id: 'P11',
        text: 'Which heavy metal is it?',
        response:
          'Methylmercury. The analysis shows what is in the bay and how much of it. The pattern of the samples shows where it comes in.',
        class: 'useful',
      },
      {
        id: 'P12',
        text: 'Does this result show how the metal got into the bay?',
        response:
          "Not on its own. But look at the pattern: the water inside the channel carries the most, the mouth of the channel less, the middle of the bay far less. The farther from the channel, the weaker it gets. That points to whatever flows down that channel.",
        class: 'strong',
        // It talks about the mud and water samples, so it waits until the player has them.
        availableWhen: { hasEvidence: ['SCI-10'] },
      },
    ],
  },
];

export const interviewById = Object.fromEntries(interviews.map((i) => [i.id, i]));

/** Hidden points per question class, for the Question Quality dimension. */
export const classPoints: Record<string, number> = {
  strong: 3,
  useful: 2,
  medium: 1,
  vague: 0,
  irrelevant: 0,
  humorous: 0,
  opinion: 0,
  leading: -1,
  assumption: -1,
};
