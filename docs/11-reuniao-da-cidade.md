# The town meeting (the ending)

Replaces the written explanation and the 8-question report. Content lives in `src/content/townMeeting.ts`; trust, streak and the ending are computed from the answers in `src/state/meeting.ts`.

## Rounds (6 answers, 6 rounds)

| Round | Speaker | Piece | Reasoning id | Right answer |
|---|---|---|---|---|
| 1 | Dr. Ana | tap 1 of 5 cards | R1 | heavy metal contamination |
| 2 | Maria | tap 1 of 5 cards | R2 | the fish on our plates |
| 3 | Carlos | tap a place on the bay map | R3 | the channel at the north point |
| 4 | Mrs. Silva | put 3 cards in order | R4 | cats sick, fewer cats, more rats |
| 5 | Mr. Santos | put a paper on the heavier side of a balance | R6 | independent analyses by the Science Center |
| 6 | Prof. Roberto | build the sentence with a word bank | R7 | heavy metal, Tucano's wastewater, fish they ate |

Every answer is locked with the big Answer button, then the crowd reacts (applause or murmur). No retry, no right answer shown. Trust starts at 50, +10 for a right answer (+3 per extra answer in a row, up to +9), -10 for a wrong one. The streak shows as x2, x3 and so on.

## Opening and wording

The meeting opens on its own screen (the town square, the residents who will ask questions, "Face the town"). There is no separate meeting clock: the play clock keeps running from the moment the player entered the map. Each round is a real question from the character ("My family is sick. How is this poison reaching us?"), with a small instruction under it ("Tap one card.").

## Whatson in the corner

Whatson Urmind sits in the bottom corner of every question screen. After each answer he comments (text in `whatson` of each step in `townMeeting.ts`): a right answer gets a short explanation of why it holds; a wrong one gets a hint that never says the right answer (for the rats round: correlation is not causation, the cats got sick before the rats multiplied). Some wrong answers have their own hint (`wrongBy`).

## Endings

- **Solved**: round 1 right, the map right, and at least 70% of all answers right. A case folder closes, a CASE SOLVED stamp lands on it, the time is shown big with "Were you the fastest in the class?", then a short paragraph about Tucano (held responsible and compensates the affected families; keeps operating, must improve its wastewater treatment and have its effluent tested by an outside laboratory).
- **Not solved**: says only that the mystery is not solved yet. No time shown.

No result codes, no ranking, no album. The clock runs from entering Vila do Sol to the last answer.

## Also in this change

- Thinking partner renamed **Whatson Urmind** (button "Talk to Whatson").
- Map: medals for catching the dancing cat and delivering it to the Science Center.
- Optional sounds made by code (off by default).
- Teacher panel: a short quick guide.
- Profile: no "x of 8"; shows "The case: Solved / Not solved yet".

Card illustrations: [10-prompts-cartas-reuniao.md](10-prompts-cartas-reuniao.md).
