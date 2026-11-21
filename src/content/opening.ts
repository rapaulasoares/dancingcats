/**
 * The opening story, as four pages of a mystery book (about 300 words).
 * Text between ** ** is shown in bold.
 * It must never mention rats, theories about the cause, or suspicion of Tucano.
 */
export interface OpeningPage {
  image: string;
  imageAlt: string;
  /** Shown above the text on the first page only. */
  heading?: string;
  subheading?: string;
  paragraphs: string[];
  /** A closing line set apart in larger type. */
  closing?: string;
}

export const opening: OpeningPage[] = [
  {
    image: 'opening-vila-do-sol.webp',
    imageAlt:
      'A small coastal town between an emerald-green sea and mountains covered in tropical forest, with cobblestone streets and colourful houses.',
    heading: 'The Mystery of the Dancing Cats',
    subheading: 'Vila do Sol, Brazil',
    paragraphs: [
      'Vila do Sol was the kind of place people called a **hidden paradise**.',
      "The small **coastal town** rested between an emerald-green sea and mountains covered in thick forest. Children played outside until sunset. Neighbors knew one another by name — and half of one another's secrets too.",
      'At its center was the bay. For generations, **fishing** had been a way of life there.',
    ],
  },
  {
    image: 'opening-harbor-boats.webp',
    imageAlt:
      'Small fishing boats painted blue, green, red and faded yellow returning to the harbor in the late afternoon, with gulls circling above the docks.',
    paragraphs: [
      'Before sunrise, small boats left the harbor. They returned in the late afternoon, their nets heavy, gulls fighting over the scraps.',
      '**The catch went everywhere**: to the market, to kitchens across town, and by truck to neighboring towns.',
      'But fishing was not the only work. Beyond the hills stood a **modern factory**, **Tucano Industrial**, and every morning **buses carried workers** there.',
      'It sponsored the **football team**, the carnival party, and at its yearly fair children went home with little **toy toucans**. **Almost every family knew someone who worked there.**',
      'It was simply **part of life** in Vila do Sol.',
    ],
    closing: 'Until something changed.',
  },
  {
    image: 'opening-dancing-cat.webp',
    imageAlt:
      'A cloudy afternoon at the fish market. A cat is caught mid-stumble on the cobblestones while a few children watch.',
    paragraphs: [
      'It was a **cloudy afternoon**, and the air smelled of rain and salt. The boats were coming home when someone noticed **a cat** near the **fish market**.',
      'It took a few unsteady steps. Then it stopped. Its body twisted. The cat **jumped sideways, stumbled, turned in a circle**, and jumped again.',
      'A few children stopped to watch. Someone laughed.',
      '"Look! The **cat is dancing**!"',
      "But the **laughter didn't last long**.",
    ],
    closing: "The cat wasn't playing.",
  },
  {
    image: 'opening-bay-night.webp',
    imageAlt: 'The bay at dusk with a few lit windows along the shore and still, dark water.',
    paragraphs: [
      'Over the next few days, **more cats** began to **stumble, spin, and leap** into the air. At night, their sharp, desperate cries echoed between the houses.',
      'Then fishermen began finding **fish floating** on the surface of the bay. **Birds fell from the sky.**',
      'And **people began getting sick**. Some had **trouble walking**. Some struggled to **speak clearly**. Some could no longer **see or hear** the way they once had. Others made **strange movements** they could not control.',
      'No one could explain why — or **whether these things were connected** at all.',
      'The **truth is buried** — but it is there.',
    ],
    closing: 'Find it.',
  },
];
