import { BALANCE } from './balance';
import type { GameEvent, Location } from './types';

/**
 * Locations and their tappable objects. Positions are percentages of the
 * image and will be tuned when the art arrives.
 */
export const locations: Location[] = [
  {
    id: 'harbor',
    name: 'Vila do Sol Harbor',
    image: 'harbor.webp',
    imageAlt: 'The dock with moored fishing boats, drying nets, the harbor office and a strip of beach.',
    mapPos: { x: 43, y: 77 },
    intro: 'Boats knock gently against the dock. The air smells of salt and wet rope. A fisherwoman is mending her nets, where something has chewed holes in them.',
    interviews: ['maria'],
    hotspots: [
      { id: 'harbor-water', label: 'Something in the water', x: 16, y: 86, unlocks: ['HAR-01'] },
      { id: 'harbor-beach', label: 'Something on the beach', x: 93, y: 57, unlocks: ['HAR-06'] },
      { id: 'harbor-chart', label: 'Chart on the office wall', x: 65, y: 35, unlocks: ['HAR-07'] },
      { id: 'harbor-log', label: 'Logbook', x: 54, y: 60, unlocks: ['HAR-08'] },
      { id: 'harbor-shrine', label: 'Small shrine', x: 10, y: 35, unlocks: ['HAR-09'] },
    ],
  },
  {
    id: 'market',
    name: 'Fish Market',
    image: 'fish-market.webp',
    imageAlt: 'Covered fish stalls with baskets of fish on wet cobblestones. A cat stands near a stall.',
    mapPos: { x: 47, y: 49 },
    intro: 'The stalls are full, but the customers are few. A cat sways near a basket of fish. A rat darts under a table and nobody even turns to look.',
    interviews: ['carlos'],
    hotspots: [
      { id: 'market-cat', label: 'The cat', x: 72, y: 74, unlocks: ['MKT-01'] },
      { id: 'market-prices', label: 'Price board', x: 29, y: 17, unlocks: ['MKT-06'] },
    ],
  },
  {
    id: 'clinic',
    name: 'Health Clinic',
    image: 'clinic.webp',
    imageAlt: 'A small tidy waiting room with wooden benches, notices on the wall and an open consulting-room door.',
    mapPos: { x: 45, y: 29 },
    intro: 'The waiting room is quiet and full. People sit close together, speaking in low voices.',
    interviews: ['ana'],
    hotspots: [
      { id: 'clinic-chart', label: 'Chart on the wall', x: 32, y: 29, unlocks: ['CLI-04'] },
      { id: 'clinic-water', label: 'Notice on the wall', x: 54, y: 30, unlocks: ['CLI-05'] },
    ],
  },
  {
    id: 'community',
    name: 'Fishing Community',
    image: 'fishing-community.webp',
    imageAlt: 'A street of small colourful houses with laundry lines, nets on a fence, an alley and a lamp post.',
    mapPos: { x: 19, y: 51 },
    intro: 'Small bright houses, nets drying on fences. The doorsteps are empty. Something grey slips along the wall and into an alley — a rat, in broad daylight.',
    interviews: ['silva'],
    hotspots: [
      { id: 'community-alley', label: 'The alley', x: 24, y: 72, unlocks: ['RES-06'] },
      { id: 'community-lamppost', label: 'Paper on the lamp post', x: 48, y: 41, unlocks: ['RES-07'] },
      { id: 'community-kitchen', label: 'Kitchen window', x: 89, y: 45, unlocks: ['RES-08'] },
    ],
  },
  {
    id: 'square',
    name: 'Town Square',
    image: 'town-square.webp',
    imageAlt: 'A small square with a big tree, a bus stop, a municipal notice board, a newspaper stand and a football poster.',
    mapPos: { x: 65, y: 43 },
    intro: 'The afternoon bus from the industrial area has just arrived. Workers step down, tired and talking. One of them waves.',
    interviews: ['joao', 'marcos'],
    hotspots: [
      { id: 'square-board-animals', label: 'Notice board: animal observations', x: 10, y: 45, unlocks: ['SQ-01'] },
      { id: 'square-board-rats', label: 'Notice board: reports by neighbourhood', x: 18, y: 45, unlocks: ['SQ-08'] },
      { id: 'square-news-tucano', label: 'Newspaper: last year', x: 86, y: 73, unlocks: ['SQ-02'] },
      { id: 'square-news-rats', label: 'Newspaper: this month', x: 90, y: 75, unlocks: ['SQ-03'] },
      { id: 'square-news-archive', label: 'Newspaper: from the archive', x: 95, y: 74, unlocks: ['SQ-09'] },
      { id: 'square-poster', label: 'Poster on the wall', x: 41, y: 28, unlocks: ['SQ-04'] },
    ],
  },
  {
    id: 'rosa',
    name: "Dona Rosa's House",
    image: 'dona-rosa-house.webp',
    imageAlt: 'A simple house with a veranda and a garden full of herbs. Hens scratch in the yard.',
    mapPos: { x: 22, y: 16 },
    intro: 'The path climbs to a small house wrapped in herbs and flowers. Hens scratch in the yard. An old woman watches you arrive from her veranda.',
    interviews: ['rosa'],
    hotspots: [{ id: 'rosa-shelf', label: 'Shelf on the veranda', x: 80, y: 23, unlocks: ['ROS-04'] }],
  },
  {
    id: 'tucano',
    name: 'Tucano Industrial',
    image: 'tucano-industrial.webp',
    imageAlt: 'A clean modern lobby with white walls and large blue windows. A display stand and a shelf stand by the wall.',
    mapPos: { x: 63, y: 10 },
    intro: 'White walls, blue windows, a polished floor. A man in a neat shirt comes forward to greet you.',
    interviews: ['santos'],
    hotspots: [
      { id: 'tucano-display', label: 'Display stand', x: 15, y: 50, unlocks: ['TUC-01'] },
      { id: 'tucano-shelf', label: 'Shelf', x: 77, y: 31, unlocks: ['TUC-07'] },
      { id: 'tucano-records', label: 'Staff records on the desk', x: 62, y: 59, unlocks: ['ECO-01'] },
    ],
  },
  {
    id: 'channel',
    name: 'North Point Channel',
    image: 'north-point-channel.webp',
    imageAlt: 'A plain concrete channel carrying clear water over rocks into the bay, with green hills behind.',
    mapPos: { x: 75, y: 19 },
    intro: "Past the rocks at the north point, a concrete channel comes down from the hills. Look uphill and you can see where it starts: the white Tucano plant, with its blue windows above the trees. The factory's treated wastewater is released into the bay there. Today the water runs clear.",
    interviews: [],
    hotspots: [{ id: 'channel-water', label: 'The channel', x: 60, y: 60, unlocks: ['TUC-06'] }],
    availableWhen: { anyEvidence: ['HAR-07', 'TUC-03'] },
  },
  {
    id: 'science',
    name: 'Regional Science Center',
    image: 'science-center.webp',
    imageAlt: 'A modest laboratory office with a microscope, sample jars, a wall poster and a desk covered in papers.',
    mapPos: { x: 81, y: 60 },
    intro: 'Sample jars line the shelves. A microscope hums on the bench. A man with rolled-up sleeves looks up from his notes.',
    interviews: ['roberto', 'roberto2'],
    hotspots: [
      { id: 'science-poster', label: 'Poster on the wall', x: 18, y: 28, unlocks: ['SCI-01'] },
      { id: 'science-desk', label: 'Letters on the desk', x: 73, y: 88, unlocks: ['SCI-03'] },
    ],
  },
];

export const locationById = Object.fromEntries(locations.map((l) => [l.id, l]));

/** Progress events. The lab results reach every player, whatever they asked. */
export const events: GameEvent[] = [
  {
    id: 'labResults',
    when: { ...BALANCE.labResults },
    title: 'Message from the Regional Science Center',
    message:
      'Professor Roberto\'s team has finished testing the fish, the bay mud and the water they collected last week, including water taken from the channel at the north point. They have sent you the results. Professor Roberto can answer questions about them at the Science Center.',
    unlocks: ['SCI-09', 'SCI-10'],
  },
];

/** The Final Investigation Report can begin once this holds. */
export const readyToSolve = { ...BALANCE.readyToSolve };
