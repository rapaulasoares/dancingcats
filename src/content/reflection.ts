/**
 * Classroom reflection. Nothing here is scored.
 * Source of truth for wording: docs/06-classroom-reflection.md
 */
export interface ReflectionCard {
  id: string;
  question: string;
  /** Opened only if the discussion stalls. */
  hint: string;
  /** Good starting points for a teacher with only five minutes. */
  startHere?: boolean;
}

export interface ReflectionTheme {
  id: string;
  title: string;
  cards: ReflectionCard[];
}

export const reflection: ReflectionTheme[] = [
  {
    id: 'investigation',
    title: 'Your investigation: questions and answers',
    cards: [
      {
        id: '1.1',
        question: 'Which question gave you the most useful answer? Which gave you the least useful?',
        hint: 'What was different about the way the two questions were asked?',
      },
      {
        id: '1.2',
        question:
          'You could not ask everything. How did you decide which questions were worth asking? Was it difficult?',
        hint: 'Did you choose differently at the end of the game than at the beginning?',
      },
      {
        id: '1.3',
        question:
          'Did you ask a question that suggested its own answer, such as "The rats are spreading the disease, right?" What kind of answer did you get?',
        hint: 'Would the person have said the same thing if you had asked "What have you seen?"',
      },
      {
        id: '1.4',
        question:
          'Some people gave you their opinion and some told you what they had seen. Which helped you more? Why?',
        hint: "Dona Rosa's explanation and Dona Rosa's observations.",
      },
      {
        id: '1.5',
        question:
          'When you ask a person, a search engine, or an AI for information, how does the way you ask change what you get back?',
        hint: 'A vague question, a question that assumes something, a specific and neutral question.',
        startHere: true,
      },
    ],
  },
  {
    id: 'evidence',
    title: 'Evidence and changing your mind',
    cards: [
      {
        id: '2.1',
        question: 'Which explanation did you believe at the start? What evidence changed your mind?',
        hint: 'Was it one piece of evidence, or several together?',
      },
      {
        id: '2.2',
        question:
          'Some clues were true but pointed the wrong way: more rats, an anonymous warning that the sickness is catching, algae in January. Why were they misleading?',
        hint: 'Two things happening at the same time does not prove that one caused the other.',
      },
      {
        id: '2.3',
        question:
          "Tucano's own report said the wastewater was within limits. Was the report false? How much should it count?",
        hint: 'Who collected the sample? Who tested it? Could someone else check?',
      },
      {
        id: '2.4',
        question: 'What makes a source trustworthy?',
        hint: 'Mr. Santos, Dr. Ana, the anonymous flyer, the Science Center.',
      },
      {
        id: '2.5',
        question:
          'In the game, the case was solved with water and mud samples, tissue tests and what the factory uses to make its products. In real life, how much evidence is enough before you act on a decision that affects people\'s jobs and health? Who decides?',
        hint: 'What could go wrong if you decide too early? What could go wrong if you wait too long?',
        startHere: true,
      },
    ],
  },
  {
    id: 'ecosystems',
    title: 'Ecosystems: everything is connected',
    cards: [
      {
        id: '3.1',
        question:
          'The rats did not cause the illness, but the illness changed the number of rats. Explain how.',
        hint: 'Follow the chain: fish, cats, rats.',
      },
      {
        id: '3.2',
        question:
          'When a human action affects one population of animals, what can happen to other species in the same region?',
        hint: 'Who eats that animal? What does that animal eat? What happens to each of them?',
      },
      {
        id: '3.3',
        question:
          'Can you think of another example where removing or adding one species changed many others?',
        hint: 'Predators removed from a forest; a new species brought to an island; bees disappearing.',
      },
      {
        id: '3.4',
        question:
          'The level of the metal was low in small fish and much higher in large fish and in the cats. Why?',
        hint: 'Bioaccumulation and biomagnification: what happens each time one animal eats many others.',
      },
      {
        id: '3.5',
        question:
          'The cats showed symptoms before most people did. What does that tell us about watching animals and nature, and not only human health?',
        hint: 'What other "early warnings" might an ecosystem give?',
      },
      {
        id: '3.6',
        question:
          'Why do we need laws that limit what a company may release into the environment, and inspections to check them? Why might a factory still release more heavy metal than it is allowed to?',
        hint: 'The bay belongs to everyone. Who checks the company\'s own report? Think about the cost of treating wastewater, the pressure to produce more (Tucano opened a second production line), and nobody checking.',
      },
    ],
  },
  {
    id: 'minamata',
    title: 'Minamata and social issues',
    cards: [
      {
        id: '4.1',
        question:
          'Who is responsible? The company in Minamata had signs that its wastewater was causing harm years before it stopped releasing it. What should a company do when it discovers its work may be hurting people?',
        hint: 'What would have been honest? What would have been difficult about it?',
      },
      {
        id: '4.2',
        question:
          'Why did it take so long? People were sick and evidence existed, but the pollution continued for years. What can stop a town, a company or a government from acting on evidence?',
        hint: 'Jobs, money, fear, doubt, who has power, who is listened to. Remember how the people of Vila do Sol felt about Tucano.',
      },
      {
        id: '4.3',
        question:
          'Who was hurt most? The people harmed most were those who ate the most fish: fishing families with little money and few other choices. Why does environmental harm often fall hardest on people with fewer choices?',
        hint: "Could João's family and Mrs. Silva's family choose what to eat in the same way?",
      },
      {
        id: '4.4',
        question:
          'Some children in Minamata were affected before they were born, like baby Bia in the game. How does this change the way you think about who can be harmed by pollution?',
        hint: 'People who never made any choice at all.',
      },
      {
        id: '4.5',
        question:
          'Could this happen today? Pollution from mining and industry still reaches rivers and seas around the world. Find one present-day case of water pollution. What was the evidence? Who acted, and how quickly? Compare it with Minamata.',
        hint: 'A research task. Look for who collected the evidence and whether it was independent. In Brazil, you could look at mercury from gold mining in Amazon rivers.',
      },
    ],
  },
];
