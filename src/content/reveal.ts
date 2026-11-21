/**
 * The historical reveal. Shown only after the Final Investigation Report.
 * This is the one place where the real names appear.
 * Text between ** ** is shown in bold.
 *
 * Every statement here is listed, with its source, in
 * docs/09-fontes-historicas.md. Change the two together.
 */
export interface RevealPage {
  kicker?: string;
  title: string;
  paragraphs: string[];
  image?: { file: string; alt: string };
}

export const revealPages: RevealPage[] = [
  {
    title: "The case is closed. But it has happened before.",
    image: {
      file: "reveal-minamata-bay.webp",
      alt: "A quiet fishing bay in southern Japan in the 1950s, with small wooden boats, houses along the shore, and a chemical factory in the distance.",
    },
    paragraphs: [
      "Vila do Sol is fictional. But the story is based on a real case of **industrial poisoning**.",
      "In **Minamata**, Japan, a chemical factory of the **Chisso Corporation** released wastewater containing **methylmercury** into the bay for years. Fish and shellfish took it in, and the people who ate them became seriously ill. Thousands were affected.",
      "It happened in the 1950s. The illness is called **Minamata disease**.",
    ],
  },
  {
    kicker: "The real story",
    title: "The cats were real. So were the rats.",
    image: {
      file: "reveal-cats-minamata.webp",
      alt: "A cat stumbling on the dock of a Japanese fishing village in the 1950s, with a fisherman reading a newspaper nearby and small boats in the bay.",
    },
    paragraphs: [
      "In the early 1950s, fish began to float in Minamata Bay. Then the cats started stumbling, shaking and falling into the sea. People called it \"cat dancing disease\".",
      "In one fishing village, around a hundred cats died in 1954. With the cats gone, the rats multiplied and gnawed the fishing nets. A newspaper reported it on August 1, 1954: the first story about Minamata disease, and it was about rats.",
    ],
  },
  {
    kicker: "The real story",
    title: "The first explanation was wrong",
    image: {
      file: "reveal-hospital-minamata.webp",
      alt: "A quiet ward in a Japanese hospital in the 1950s, with a doctor and a nurse speaking gently to a patient resting in bed.",
    },
    paragraphs: [
      "On May 1, 1956, a doctor reported patients with an illness of the brain and nerves: numb hands and feet, trouble walking and speaking, narrowed vision.",
      "At first it was treated as contagious. Six months later, researchers said it was **not contagious** and suspected a heavy metal in the fish and shellfish people ate.",
      "You met the same wrong turn in Vila do Sol.",
    ],
  },
  {
    kicker: "The real story",
    title: "From the factory to the dinner table",
    image: {
      file: "reveal-fish-family.webp",
      alt: "A Japanese fishing family sharing a meal of grilled fish at a low table, with the bay and the distant factory visible through the open sliding door.",
    },
    paragraphs: [
      "The cause was **mercury**. The factory's process produced **methylmercury**, a very toxic form of mercury, which left in its wastewater and flowed into the bay.",
      "Tiny organisms took it in, small fish ate them, and larger fish ate those. At each step more built up: **bioaccumulation** in one animal, **biomagnification** up the food chain. The people and cats who ate the most local seafood received the largest doses.",
      "Some babies were born with the disease without ever eating fish. It passed from their mothers before birth, like baby Bia.",
    ],
  },
  {
    kicker: "The real story",
    title: "Why did it take so long?",
    image: {
      file: "reveal-newspaper.webp",
      alt: "A Japanese newspaper from the 1950s and 60s lying on a desk beside a cup of tea, its front page showing only a blurred photograph of a bay and illegible columns of text.",
    },
    paragraphs: [
      "In 1959, university researchers said organic mercury was the likely cause. That year, a company doctor fed the factory's wastewater to cats, and a cat developed the disease. The company told him to stop, and the result was kept secret.",
      "The factory went on making the chemical until 1968, when the Japanese government officially named its methylmercury as the cause. More than two thousand people were certified as patients, and tens of thousands more were later made eligible for payments or care.",
      "In 2013, countries signed the **Minamata Convention** to protect people and the environment from mercury. It came into force in 2017.",
    ],
  },
  {
    kicker: "Closer to home",
    title: "And in Brazil, today?",
    image: {
      file: "reveal-amazon-today.webp",
      alt: "An Indigenous family on the bank of a wide Amazon river at sunset, with a canoe, a basket of freshly caught fish, and the rainforest behind them.",
    },
    paragraphs: [
      "Factory wastewater in Brazil can carry toxic substances, such as heavy metals. Brazilian laws require companies to treat and monitor it, to avoid contaminating rivers and seas.",
      "In the Amazon, illegal gold mining, called **garimpo**, uses mercury to separate gold from river mud. It ends up in the water, builds up in fish and reaches the people who eat them.",
      "In 2019, researchers from Fiocruz studied three villages of the **Munduruku** people on the Tapajós River. They found mercury in every fish species tested, and about six in ten people had more mercury than is considered safe.",
      "The source is different, the path is the same: water, fish, people. The problem is not solved.",
    ],
  },
];

/** The final reveal page: what is history and what was written for the game. */
export const factVsFiction = {
  title: 'What was real, and what was written for the game',
  facts: {
    heading: 'Historical facts',
    items: [
      'Minamata is a real city in Japan, and Minamata disease is a real illness.',
      'The Chisso factory released wastewater with methylmercury into Minamata Bay, from 1932 to 1968.',
      'Fish and cats were affected before most people understood what was happening.',
      'As the cats died, rats multiplied and gnawed the fishing nets.',
      'The illness was first treated as contagious. Researchers then showed it was not.',
      'People became ill by eating fish and shellfish from the bay. The illness damages the nervous system.',
      'Some children were affected before they were born.',
      'Mercury builds up in living things and becomes more concentrated up the food chain.',
      "A company doctor's experiment in 1959 pointed to the wastewater, and the result was not made public. The government stated the cause in 1968.",
      'In the Amazon today, mercury from gold mining reaches people through fish.',
    ],
  },
  adapted: {
    heading: 'Adapted or invented for this game',
    items: [
      'Vila do Sol, Tucano Industrial and everything its representative says.',
      'Every character: Maria, Carlos, Dr. Ana, Mrs. Silva, João, Mr. Santos, Dona Rosa and Professor Roberto.',
      'Every document, table, letter, date and number you collected, including the laboratory results.',
      'The monthly counts of cats and rats, the newspaper article and the chewed rice sack. The rise in rats itself was real.',
      'The red tide, the broken statue and the families in Porto Azul.',
      'The timescale: months in the game, many years in Minamata.',
    ],
  },
};
