import type { Evidence } from './types';

/**
 * All evidence. The `internal` block is never shown to players.
 * Evidence presents information only; the player draws the conclusions.
 * Source of truth for wording: docs/02-evidence-matrix.md
 */
export const evidence: Evidence[] = [
  // ───────────── Harbor ─────────────
  {
    id: 'HAR-01',
    title: 'Fish floating in the bay',
    format: 'polaroid',
    locationId: 'harbor',
    source: 'Your photograph',
    body: {
      image: 'floating-fish.webp',
      imageAlt: 'Several fish floating at the surface of the water beside a moored boat.',
      text: 'Fish floating at the surface beside a moored boat.',
    },
    internal: { relevance: 'medium', supports: ['contamination', 'natural'], weakens: [] },
  },
  {
    id: 'HAR-02',
    title: 'How the fish behave',
    format: 'statement',
    locationId: 'harbor',
    source: 'Maria, fisherwoman',
    body: {
      text: 'Some fish swim in slow circles right at the surface and can be scooped up by hand. Others just float. Maria saw the first odd ones about a year ago. In thirty years on the bay she has never seen this before.',
    },
    internal: { relevance: 'high', supports: ['contamination', 'natural'], weakens: [] },
  },
  {
    id: 'HAR-03',
    title: "Maria's family meals",
    format: 'statement',
    locationId: 'harbor',
    source: 'Maria, fisherwoman',
    body: {
      text: 'Whatever Maria does not sell, her family eats: fish, crab and mussels from the bay, nearly every day. Rice and beans come from the shop.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'HAR-04',
    title: "Maria's family health",
    format: 'statement',
    locationId: 'harbor',
    source: 'Maria, fisherwoman',
    body: {
      text: "Maria's husband's hands shake so badly he can no longer mend the nets. Maria's lips and fingertips go numb. Her brother's family also fishes, and two of them have the same problems.",
    },
    internal: { relevance: 'high', supports: ['contagious', 'contamination'], weakens: [] },
  },
  {
    id: 'HAR-05',
    title: 'Where the strange fish are',
    format: 'statement',
    locationId: 'harbor',
    source: 'Maria, fisherwoman',
    body: {
      text: 'Maria finds more floating fish up by the north point, past the rocks, than anywhere else in the bay. It used to be her best fishing spot.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: ['natural'] },
  },
  {
    id: 'HAR-06',
    title: 'Seabird on the beach',
    format: 'polaroid',
    locationId: 'harbor',
    source: 'Your photograph',
    body: {
      image: 'fallen-bird.webp',
      imageAlt: 'A gull lying on the sand with its wings half open.',
      text: 'A gull on the sand. It is alive but cannot stand.',
    },
    internal: { relevance: 'medium', supports: ['contamination', 'natural'], weakens: [] },
  },
  {
    id: 'HAR-07',
    title: 'Harbor chart of the bay',
    format: 'map',
    locationId: 'harbor',
    source: 'Harbor office',
    body: {
      diagram: 'harborChart',
      text: 'The bay and its fishing grounds. Marked: the north point, where a drainage channel arrives from the hills, from the direction of the industrial area; the river mouth; the south beach and the boat-repair yard. The town reservoir is up in the mountains.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'HAR-08',
    title: "Harbor master's log",
    format: 'handwritten',
    locationId: 'harbor',
    source: 'Harbor master',
    body: {
      lines: [
        { label: 'December', value: 'Storm. Two boats damaged.' },
        {
          label: 'January',
          value:
            'One unusually warm week. Reddish-brown patch on the open sea, well outside the bay, for two days. Looks like algae — the tiny plants that live in seawater. In warm weather they can multiply until they colour the water. Old fishermen call it a red tide and say it can kill fish.',
        },
        { label: 'February – June', value: 'Ordinary tides and weather.' },
      ],
    },
    internal: { relevance: 'redHerring', supports: ['natural'], weakens: [] },
  },
  {
    id: 'HAR-09',
    title: 'The harbor shrine',
    format: 'polaroid',
    locationId: 'harbor',
    source: "Your photograph, with a fisherman's words",
    body: {
      image: 'harbor-shrine.webp',
      imageAlt: "A small dockside shrine with candles and fresh flowers. The saint's statue is cracked in two.",
      text: '"It fell in the December storm. The trouble started after that."',
    },
    internal: { relevance: 'redHerring', supports: ['supernatural'], weakens: [] },
  },

  // ───────────── Fish Market ─────────────
  {
    id: 'MKT-01',
    title: 'The "dancing" cat',
    format: 'polaroid',
    locationId: 'market',
    source: 'Your photograph',
    body: {
      image: 'dancing-cat.webp',
      imageAlt: 'A cat stumbling on wet cobblestones beside the fish stalls, legs splayed.',
      text: 'A cat beside the fish stalls, mid-stumble.',
    },
    internal: { relevance: 'medium', supports: [], weakens: [] },
  },
  {
    id: 'MKT-02',
    title: 'What the market cats eat',
    format: 'statement',
    locationId: 'market',
    source: 'Carlos, fish market vendor',
    body: {
      text: "The market cats belong to no one. They eat what the vendors drop: fish heads, guts, shellfish scraps, whatever is left from the day's catch. It has been that way since Carlos's father ran the stall.",
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'MKT-03',
    title: 'The sick cats',
    format: 'statement',
    locationId: 'market',
    source: 'Carlos, fish market vendor',
    body: {
      text: 'First the cats walk as if on a rocking boat. Then the jerking starts: legs kicking, spinning in circles. One ran straight off the dock. There were twenty-odd cats at New Year. Carlos now counts three.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'MKT-04',
    title: 'Fish sent to Porto Azul',
    format: 'statement',
    locationId: 'market',
    source: 'Carlos, fish market vendor',
    body: {
      text: 'Half the catch goes by truck to Porto Azul, an hour down the coast. A buyer there told Carlos that two families have the same shaking sickness. As far as Carlos knows, they have never been to Vila do Sol.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: ['contagious', 'rats', 'supernatural'] },
  },
  {
    id: 'MKT-05',
    title: 'When the rats appeared',
    format: 'statement',
    locationId: 'market',
    source: 'Carlos, fish market vendor',
    body: {
      text: 'Carlos first noticed more rats after Easter, in April. By then half the market cats were already gone. Now rats walk past his stall in daylight.',
    },
    internal: { relevance: 'high', supports: [], weakens: ['rats'] },
  },
  {
    id: 'MKT-06',
    title: 'Market price board',
    format: 'notice',
    locationId: 'market',
    source: 'Fish market',
    body: { text: "Today's prices, written in chalk. Each one has been crossed out and lowered twice." },
    internal: { relevance: 'low', supports: [], weakens: [] },
  },

  // ───────────── Health Clinic ─────────────
  {
    id: 'CLI-01',
    title: 'Patient symptom notes',
    format: 'medicalNote',
    locationId: 'clinic',
    source: 'Dr. Ana',
    body: {
      lines: [
        { label: 'First signs', value: 'Numb hands and lips.' },
        { label: 'Later', value: 'Trembling. Slurred speech. Trouble walking in a straight line: stumbling, falls at home.' },
        { label: 'Some patients', value: 'Narrowed vision, "like looking through a tube". Muffled hearing.' },
        { label: 'Not seen', value: 'No fever. No cough. No rash.' },
      ],
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: ['contagious', 'rats'] },
  },
  {
    id: 'CLI-02',
    title: 'Clinic staff health',
    format: 'medicalNote',
    locationId: 'clinic',
    source: 'Dr. Ana',
    body: {
      text: 'Six clinic staff — nurses, the cleaner and Dr. Ana — have worked closely with these patients for months. None has a single symptom. In some homes, one person is very sick while the person nursing them stays well.',
    },
    internal: { relevance: 'high', supports: [], weakens: ['contagious'] },
  },
  {
    id: 'CLI-03',
    title: 'Household survey (unfinished)',
    format: 'table',
    locationId: 'clinic',
    source: 'Clinic nurse',
    body: {
      table: {
        columns: ['Household', 'Main work', 'Drinking water', 'Local seafood', 'Symptoms'],
        rows: [
          ['Barros', 'Fishing', 'Town supply', 'Almost daily', 'Yes'],
          ['Silva', 'Fishing', 'Town supply', 'Almost daily', 'Yes'],
          ['Costa', 'Factory; fishes at weekends', 'Town supply', 'Almost daily', 'Yes'],
          ['Oliveira', 'Grocery shop', 'Town supply', 'Often', 'Yes'],
          ['Lima', 'School teacher', 'Town supply', 'About once a week', 'Unclear: one person reports tingling fingers'],
          ['Almeida', 'Factory', 'Town supply', 'Rarely', 'No'],
          ['Ferreira', 'Factory', 'Town supply', 'Rarely', 'No'],
        ],
      },
      footer: 'Home visits by the clinic nurse. Survey not finished.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: ['contagious'] },
  },
  {
    id: 'CLI-04',
    title: 'New patients per month',
    format: 'chart',
    locationId: 'clinic',
    source: 'Health clinic',
    body: {
      diagram: 'casesChart',
      table: {
        columns: ['Month', 'New patients'],
        rows: [
          ['January', '1'],
          ['February', '2'],
          ['March', '4'],
          ['April', '7'],
          ['May', '9'],
          ['June', '12'],
        ],
      },
    },
    internal: { relevance: 'redHerring', supports: ['contagious'], weakens: [] },
  },
  {
    id: 'CLI-05',
    title: 'Town water notice',
    format: 'notice',
    locationId: 'clinic',
    source: 'Municipality of Vila do Sol',
    body: {
      text: 'All neighbourhoods of Vila do Sol receive their water from the Serra reservoir in the mountains. The water is tested every month.',
    },
    internal: { relevance: 'medium', supports: [], weakens: [] },
  },
  {
    id: 'CLI-06',
    title: 'Where patients live',
    format: 'medicalNote',
    locationId: 'clinic',
    source: 'Dr. Ana',
    body: {
      text: 'Most patients live in the streets near the harbor. A few live elsewhere in town. Hardly any come from the hillside houses nearest the factory.',
    },
    internal: { relevance: 'medium', supports: ['contagious'], weakens: [] },
  },

  // ───────────── Residential / Fishing Community ─────────────
  {
    id: 'RES-01',
    title: "The Silva family's meals",
    format: 'statement',
    locationId: 'community',
    source: 'Mrs. Silva',
    body: {
      text: 'The Silvas eat local fish almost every day. Mr. Silva brings home what does not sell: fish stew, fried sardines, crab on Sundays.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'RES-02',
    title: 'Who is sick in the Silva home',
    format: 'statement',
    locationId: 'community',
    source: 'Mrs. Silva',
    body: {
      text: "Mr. Silva can hardly walk: he stumbles and falls, even in the kitchen. The oldest son drops things and his words come out tangled. Their daughter Luana, 14, is perfectly fine. She has not eaten fish for two years; she says the smell turns her stomach.",
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: ['contagious', 'rats'] },
  },
  {
    id: 'RES-03',
    title: 'The Silva cats',
    format: 'statement',
    locationId: 'community',
    source: 'Mrs. Silva',
    body: {
      text: "The Silvas had two cats, Mimi and Sardinha. They ate the heads and bones from the family's fish. Sardinha started spinning in March. Both cats are gone now.",
    },
    internal: { relevance: 'medium', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'RES-04',
    title: 'Rats on the street',
    format: 'statement',
    locationId: 'community',
    source: 'Mrs. Silva',
    body: {
      text: 'By the time Mrs. Silva saw rats in her kitchen, there was not a cat left on her street. There used to be one on every doorstep.',
    },
    internal: { relevance: 'high', supports: [], weakens: ['rats'] },
  },
  {
    id: 'RES-05',
    title: 'Baby Bia',
    format: 'statement',
    locationId: 'community',
    source: 'Mrs. Silva',
    body: {
      text: 'Bia is eighteen months old. She cannot sit up or hold a spoon the way her brothers did at her age. She was born this way. She has only ever had milk and has never eaten fish. Dr. Ana has no explanation.',
    },
    internal: { relevance: 'medium', supports: [], weakens: [] },
  },
  {
    id: 'RES-06',
    title: 'Rat in the alley',
    format: 'polaroid',
    locationId: 'community',
    source: 'Your photograph',
    body: {
      image: 'rat-sighting.webp',
      imageAlt: 'A large rat sitting on a doorstep in daylight.',
      text: 'A rat on a doorstep, in the middle of the day.',
    },
    internal: { relevance: 'redHerring', supports: ['rats'], weakens: [] },
  },
  {
    id: 'RES-07',
    title: 'Anonymous flyer',
    format: 'handwritten',
    locationId: 'community',
    source: 'Unknown',
    body: {
      text: 'THE SICKNESS IS CATCHING! Keep your children indoors!',
      footer: 'No name. No date.',
    },
    internal: { relevance: 'redHerring', supports: ['contagious'], weakens: [] },
  },
  {
    id: 'RES-08',
    title: 'Gnawed rice sack',
    format: 'polaroid',
    locationId: 'community',
    source: 'Your photograph',
    body: {
      image: 'gnawed-rice-sack.webp',
      imageAlt: 'A sack of rice on a kitchen floor with a chewed corner and spilled grains.',
      text: 'A sack of rice in the Silva kitchen. One corner has been chewed open.',
    },
    internal: { relevance: 'redHerring', supports: ['rats'], weakens: [] },
  },

  // ───────────── Town Square ─────────────
  {
    id: 'SQ-01',
    title: 'Municipal animal observations',
    format: 'table',
    locationId: 'square',
    source: 'Municipality of Vila do Sol',
    body: {
      table: {
        columns: ['Month', 'Cats observed', 'Rats reported'],
        rows: [
          ['February', '49', '8'],
          ['March', '47', '8'],
          ['April', '38', '15'],
          ['May', '21', '34'],
          ['June', '9', '67'],
        ],
      },
    },
    internal: { relevance: 'high', supports: ['rats'], weakens: ['rats'] },
  },
  {
    id: 'SQ-02',
    title: '"Tucano opens new production line"',
    format: 'clipping',
    locationId: 'square',
    source: 'Local newspaper, last year',
    body: {
      text: 'Tucano Industrial opened a second production line this week, creating 120 new jobs. The mayor called it "the best news for Vila do Sol in a decade."',
    },
    internal: { relevance: 'medium', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'SQ-03',
    title: '"Residents demand action on rats"',
    format: 'clipping',
    locationId: 'square',
    source: 'Local newspaper, this month',
    body: {
      text: 'Residents have asked the town hall for rat control. Fishermen complain that rats are gnawing holes in their nets. "The sickness came with the rats," one resident told this newspaper. "Anyone can see it."',
    },
    internal: { relevance: 'redHerring', supports: ['rats'], weakens: [] },
  },
  {
    id: 'SQ-04',
    title: 'Vila do Sol FC poster',
    format: 'notice',
    locationId: 'square',
    source: 'Vila do Sol Football Club',
    body: { text: 'Sunday, 4 p.m. — Vila do Sol FC at home. Shirts sponsored by Tucano Industrial.' },
    internal: { relevance: 'low', supports: [], weakens: [] },
  },
  {
    id: 'SQ-05',
    title: "João's household health",
    format: 'statement',
    locationId: 'square',
    source: 'João, Tucano Industrial employee',
    body: { text: 'João, his wife and their two children are all healthy. "Not so much as a shaky hand."' },
    internal: { relevance: 'high', supports: [], weakens: [] },
  },
  {
    id: 'SQ-06',
    title: "João's family meals",
    format: 'statement',
    locationId: 'square',
    source: 'João, Tucano Industrial employee',
    body: {
      text: "João's wife does not like seafood. The family mostly eats rice, beans, chicken and vegetables. They eat fish perhaps once a year.",
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'SQ-07',
    title: 'The Costa family',
    format: 'statement',
    locationId: 'square',
    source: 'João, Tucano Industrial employee',
    body: {
      text: "Marcos Costa works on João's shift. His wife and his father are both badly affected. Marcos fishes off the rocks every weekend and says his family has not paid for a fish in years.",
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'SQ-08',
    title: 'Rat reports by neighbourhood',
    format: 'table',
    locationId: 'square',
    source: 'Municipality of Vila do Sol',
    body: {
      table: {
        columns: ['Neighbourhood', 'Rat reports in June'],
        rows: [
          ['Harbor streets', '26'],
          ['Town centre', '21'],
          ['Hillside', '20'],
        ],
      },
    },
    internal: { relevance: 'high', supports: [], weakens: ['rats'] },
  },
  {
    id: 'SQ-09',
    title: '"From our archive: the red tide"',
    format: 'clipping',
    locationId: 'square',
    source: 'Local newspaper, reprint',
    body: {
      text: 'Twenty years ago a "red tide" hit this coast. Algae, the tiny plants that live in seawater, multiplied so fast in warm water that the sea turned reddish-brown. Some algae produce natural poisons, and thousands of fish died. Swimmers reported itchy skin and sore eyes. It was over within two weeks.',
    },
    internal: { relevance: 'redHerring', supports: ['natural'], weakens: ['natural'] },
  },

  // ───────────── Dona Rosa's House ─────────────
  {
    id: 'ROS-01',
    title: "Dona Rosa's explanation",
    format: 'statement',
    locationId: 'rosa',
    source: 'Dona Rosa, traditional healer',
    body: {
      text: 'Dona Rosa believes something has turned its face from the town. She feels "a shadow over the bay". She says she cannot show it to anyone; she can only say that she feels it.',
    },
    internal: { relevance: 'low', supports: ['supernatural'], weakens: [] },
  },
  {
    id: 'ROS-02',
    title: 'Pretinha',
    format: 'polaroid',
    locationId: 'rosa',
    source: 'Dona Rosa / your photograph',
    body: {
      image: 'pretinha.webp',
      imageAlt: 'An old black cat asleep among garden herbs.',
      text: "Dona Rosa's cat. She is old, never leaves the garden, and eats what Dona Rosa eats: rice, a little chicken, pumpkin. She is healthy.",
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: ['contagious', 'supernatural'] },
  },
  {
    id: 'ROS-03',
    title: 'What Dona Rosa has seen',
    format: 'statement',
    locationId: 'rosa',
    source: 'Dona Rosa, traditional healer',
    body: {
      text: 'The cats by the docks fell ill first, spinning and falling. Then the gulls: she saw one drop onto the sand with its wings open. Her hens are well, and the small birds in her garden still sing.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'ROS-04',
    title: 'Thank-you note',
    format: 'handwritten',
    locationId: 'rosa',
    source: 'Mr. Lima',
    body: {
      text: 'After your blessing, the tingling in my fingers went away. God bless you, Dona Rosa.',
      footer: '— Lima',
    },
    internal: { relevance: 'redHerring', supports: ['supernatural'], weakens: [] },
  },


  // ───────────── Jobs and the town ─────────────
  {
    id: 'ECO-01',
    title: 'Factory employment records',
    format: 'companyDoc',
    locationId: 'tucano',
    source: 'Tucano Industrial',
    body: {
      text: 'Tucano Industrial is the largest employer in Vila do Sol. Hundreds of local families depend directly or indirectly on it for their income.',
    },
    internal: { relevance: 'medium', supports: [], weakens: [] },
  },
  {
    id: 'ECO-02',
    title: 'The Costa family and the factory',
    format: 'statement',
    locationId: 'square',
    source: 'Marcos Costa, Tucano Industrial employee',
    body: {
      text: 'Marcos Costa says his father worked at Tucano, he works there, and his brother works there. "Half this town depends on those jobs. If the factory closes, what happens to us?"',
    },
    internal: { relevance: 'medium', supports: [], weakens: [] },
  },
  {
    id: 'ECO-03',
    title: "Marcos Costa's household health",
    format: 'statement',
    locationId: 'square',
    source: 'Marcos Costa, Tucano Industrial employee',
    body: {
      text: "Marcos's wife began to feel numbness in her hands in March. Now she drops cups. His father has the same problem. Marcos himself has felt nothing so far.",
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: ['contagious'] },
  },
  {
    id: 'ECO-04',
    title: "Marcos Costa's family meals",
    format: 'statement',
    locationId: 'square',
    source: 'Marcos Costa, Tucano Industrial employee',
    body: {
      text: 'The Costas eat fish nearly every day, mostly what Marcos catches off the rocks at weekends. His wife grills it. They have never bought fish in a market.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'ECO-05',
    title: 'Protective equipment at the plant',
    format: 'statement',
    locationId: 'square',
    source: 'Marcos Costa, Tucano Industrial employee',
    body: {
      text: 'Everyone who works inside the plant wears gloves, a mask, safety glasses and boots, and the equipment is checked every morning before the shift.',
    },
    internal: { relevance: 'medium', supports: [], weakens: [] },
  },
  // ───────────── Tucano Industrial and North Point Channel ─────────────
  {
    id: 'TUC-01',
    title: 'Company statement',
    format: 'companyDoc',
    locationId: 'tucano',
    source: 'Tucano Industrial',
    body: {
      text: 'Tucano Industrial operates according to current safety and environmental requirements.\n\nWe are deeply concerned about the families of Vila do Sol affected by these unexplained health problems, including families of our own employees.\n\nWe remain committed to the community and will continue cooperating with the appropriate authorities.',
    },
    internal: { relevance: 'low', supports: [], weakens: [] },
  },
  {
    id: 'TUC-02',
    title: 'Internal wastewater report',
    format: 'labReport',
    locationId: 'tucano',
    source: 'Tucano Industrial',
    body: {
      lines: [
        { label: 'Sample', value: 'Treated wastewater at point of release' },
        { label: 'Result', value: 'All measured values within permitted limits' },
        { label: 'Sample collected by', value: 'Tucano Environmental Department' },
        { label: 'Analysed by', value: 'Tucano Quality Laboratory' },
      ],
    },
    internal: { relevance: 'medium', supports: [], weakens: ['contamination'] },
  },
  {
    id: 'TUC-03',
    title: 'Waste and wastewater',
    format: 'statement',
    locationId: 'tucano',
    source: 'Mr. Santos, Tucano Industrial',
    body: {
      text: 'Solid waste goes by truck to the regional landfill. Wastewater is treated on site and then released through a channel to the bay.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'TUC-04',
    title: 'Request to visit and take samples',
    format: 'statement',
    locationId: 'tucano',
    source: 'Mr. Santos, Tucano Industrial',
    body: {
      text: 'Tucano says it is glad to cooperate. Visitors cannot enter a working plant without safety training, protective equipment and an escort. The earliest a visit can be arranged is within two weeks.',
    },
    internal: { relevance: 'medium', supports: [], weakens: [] },
  },
  {
    id: 'TUC-05',
    title: 'Employee health figures',
    format: 'companyDoc',
    locationId: 'tucano',
    source: 'Mr. Santos, from the company\'s own count',
    body: {
      text: 'Nine families affected, out of roughly six hundred employees. Most of the workforce is in good health.',
    },
    internal: { relevance: 'medium', supports: [], weakens: [] },
  },
  {
    id: 'TUC-06',
    title: 'The outflow channel',
    format: 'polaroid',
    locationId: 'channel',
    source: 'Your photograph',
    body: {
      image: 'industrial-outflow.webp',
      imageAlt: 'A plain concrete channel carrying clear water over rocks into the bay.',
      text: "The channel at the north point. It comes down from the Tucano plant on the hill: this is where the factory's treated wastewater is released into the bay. The water looks clear.",
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'TUC-07',
    title: 'Toy toucan',
    format: 'polaroid',
    locationId: 'tucano',
    source: 'Tucano community fair',
    body: {
      image: 'toy-toucan.webp',
      imageAlt: 'A small colourful plastic toucan on a shelf.',
      text: "A plastic toucan from this year's fair. Four hundred were given to children.",
    },
    internal: { relevance: 'redHerring', supports: [], weakens: [] },
  },
  {
    id: 'TUC-08',
    title: 'Chemicals in production',
    format: 'statement',
    locationId: 'tucano',
    source: 'Mr. Santos, Tucano Industrial',
    body: {
      text: 'Tucano makes plastic materials for pipes, packaging and toys. Several industrial chemicals are needed to produce them, and some of the catalysts and additives contain heavy metals. The exact recipe is confidential. The company says it follows every rule, and that every employee wears protective equipment: gloves, masks and safety glasses.',
    },
    internal: { relevance: 'medium', supports: ['contamination'], weakens: [] },
  },

  // ───────────── Regional Science Center ─────────────
  {
    id: 'SCI-01',
    title: 'Food chain of the bay',
    format: 'diagram',
    locationId: 'science',
    source: 'Regional Science Center',
    body: {
      diagram: 'foodChain',
      text: 'Plankton → small fish and shellfish → larger fish → seabirds, cats, people.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'SCI-02',
    title: 'Predators and prey',
    format: 'statement',
    locationId: 'science',
    source: 'Professor Roberto',
    body: {
      text: 'Predators help control the populations of the animals they eat. Remove the predator, and the prey often multiplies — sometimes very quickly.',
    },
    internal: { relevance: 'high', supports: [], weakens: ['rats'] },
  },
  {
    id: 'SCI-03',
    title: 'Inspection request',
    format: 'letter',
    locationId: 'science',
    source: 'Regional Environmental Laboratory and Tucano Industrial',
    body: {
      lines: [
        {
          label: 'Monday, June 4 — Regional Environmental Laboratory',
          value: 'We request access to the facility and permission to collect independent wastewater samples.',
        },
        {
          label: 'Reply — Tucano Industrial',
          value:
            'We will be happy to cooperate. Due to operational requirements, access can be provided within two weeks.',
        },
      ],
    },
    internal: { relevance: 'medium', supports: [], weakens: [] },
  },
  {
    id: 'SCI-04',
    title: 'Substances that build up',
    format: 'statement',
    locationId: 'science',
    source: 'Professor Roberto',
    body: {
      text: 'Some substances can build up inside living organisms over time, because the body takes them in faster than it can get rid of them. When one animal repeatedly eats contaminated organisms, some contaminants become more concentrated higher in the food chain.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: [] },
  },
  {
    id: 'SCI-05',
    title: 'The nervous system',
    format: 'statement',
    locationId: 'science',
    source: 'Professor Roberto',
    body: {
      text: "Moving, speaking, seeing and hearing are jobs of the nervous system — the brain and the nerves. Several things can harm it: certain infections, natural toxins produced by algae, some pesticides, and certain heavy metals associated with industrial production and gold mining.",
    },
    internal: { relevance: 'medium', supports: ['contagious', 'contamination', 'natural'], weakens: [] },
  },
  {
    id: 'SCI-06',
    title: 'Bay monitoring record',
    format: 'chart',
    locationId: 'science',
    source: 'Regional Science Center',
    body: {
      diagram: 'bayMonitoring',
      text: 'Weekly measurements of the bay. Water temperature: one warm week in January, otherwise within the normal range all year. Algae: rose for a few days in January, then returned to normal.',
    },
    internal: { relevance: 'high', supports: [], weakens: ['natural'] },
  },
  {
    id: 'SCI-07',
    title: 'Laboratory note',
    format: 'labReport',
    locationId: 'science',
    source: 'Regional Environmental Laboratory',
    body: {
      text: 'Tucano Industrial provided its internal wastewater report. During the initial visit, the independent laboratory team was not permitted to collect its own wastewater sample.',
    },
    internal: { relevance: 'high', supports: [], weakens: [] },
  },
  {
    id: 'SCI-09',
    title: 'Tissue analysis',
    format: 'labReport',
    locationId: 'science',
    source: 'Regional Science Center',
    body: {
      lines: [
        { label: 'Samples collected by', value: 'Regional Science Center' },
        { label: 'Harmful bacteria', value: 'Not detected' },
        { label: 'Algae toxins', value: 'Not detected' },
        { label: 'Detergent', value: 'Not detected' },
        { label: 'Acidity', value: 'Normal' },
        { label: 'Heavy metal', value: 'DETECTED (methylmercury)' },
      ],
      table: {
        columns: ['Sample', 'Heavy metal (relative level)'],
        rows: [
          ['Open-sea reference fish', 'under 1'],
          ['Sardine (small fish)', '3'],
          ['Mullet (medium fish)', '9'],
          ['Grouper (large fish that eats other fish)', '31'],
          ['Mussels, north point rocks', '22'],
          ['Market cat', '40'],
        ],
      },
      footer: 'Methylmercury was found at high concentrations in the blood, tissues and nerves of the affected fish and of the cat.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: ['contagious', 'rats', 'natural'] },
  },
  {
    id: 'SCI-10',
    title: 'Bay mud and water samples',
    format: 'map',
    locationId: 'science',
    source: 'Regional Science Center',
    body: {
      diagram: 'sedimentMap',
      table: {
        columns: ['Site', 'Where', 'Heavy metal in mud (relative level)', 'Heavy metal in water (relative level)'],
        rows: [
          ['A', 'North point, mouth of the channel', '48', '31'],
          ['B', 'Middle of the bay', '17', '6'],
          ['C', 'South beach, by the boat-repair yard', '4', '1'],
          ['D', 'River mouth', '2', '1'],
          ['E', 'Inside the channel, just before it reaches the bay', 'concrete bed, no mud', '58'],
        ],
      },
      footer: 'Samples collected and tested by the Regional Science Center. The channel water was sampled from the public channel, outside the factory grounds.',
    },
    internal: { relevance: 'high', supports: ['contamination'], weakens: ['natural'] },
  },
];

export const evidenceById: Record<string, Evidence> = Object.fromEntries(
  evidence.map((e) => [e.id, e]),
);
