# The town meeting (the ending)

Replaces the written explanation and the 8-question report. Content lives in `src/content/townMeeting.ts`; trust, streak and the ending are computed from the answers in `src/state/meeting.ts`.

## Rounds (8 answers, 6 rounds)

| Round | Speaker | Piece | Reasoning id | Right answer |
|---|---|---|---|---|
| 1 | Dr. Ana | tap 1 of 5 cards | R1 | heavy metal contamination |
| 2 | Maria | tap 1 of 5 cards | R2 | the fish on our plates |
| 3 | Carlos | tap a place on the town map (the same map the player walks on) | R3 | the channel at the north point |
| 4 | Mrs. Silva | put 3 cards in order | R4 | cats sick, fewer cats, more rats |
| 5 | Mr. Santos | put a paper on the heavier side of a balance | R6 | independent analyses by the Science Center |
| 6a | Prof. Roberto | show your proof: tap up to 3 clues from your own Evidence Board | P1 | at least 2 of the 3 clues are key ones (tissue analysis, bay samples, Tucano's waste, chemicals in production, substances that build up, food chain, and what the sick and the healthy families eat: Silva, Maria, João, Costa, fish sent to Porto Azul) |
| 6b | Prof. Roberto | what does each clue tell you? A thought bubble with 4 thoughts for each clue shown as proof (one supported, three that go wrong) | P2 | at least half of the thoughts are the supported ones (skipped silently when none of the clues shown has thoughts) |
| 6c | Prof. Roberto | build the sentence with a word bank | R7 | heavy metal, Tucano's wastewater, fish they ate |
| 7 | Marcos Costa | tap the three things that should happen to Tucano (7 cards) | M1 | hold Tucano responsible; make it compensate the families; require it to treat and monitor its effluent, with weekly proof, or the factory can be shut down (embargoed). The wrong ones: close the factory for good, ban fishing forever, tell families to eat less fish, wait for more studies |

Every answer is locked with the big Answer button, then the crowd reacts (applause or murmur). No retry, no right answer shown. Trust starts at 50, +10 for a right answer (+3 per extra answer in a row, up to +9), -10 for a wrong one. The streak shows as x2, x3 and so on.

## Opening and wording

The meeting opens on its own screen (the town square, the residents who will ask questions, "Face the town"). There is no separate meeting clock: the play clock keeps running from the moment the player entered the map. Each round is a real question from the character ("My family is sick. How is this poison reaching us?"), with a small instruction under it ("Tap one card.").

## Whatson in the corner

Whatson Urmind sits in the bottom corner of every question screen. After each answer he comments (text in `whatson` of each step in `townMeeting.ts`): a right answer gets a short explanation of why it holds; a wrong one gets a hint that never says the right answer (for the rats round: correlation is not causation, the cats got sick before the rats multiplied). Some wrong answers have their own hint (`wrongBy`).

## Endings

- **Solved**: round 1 right, the map right, and at least 70% of all answers right. A case folder closes, a CASE SOLVED stamp lands on it, the time is shown big with "Were you the fastest in the class?", then, if the player chose the right measures for Tucano, a short paragraph that confirms them (held responsible, compensates the families, keeps operating but must treat and monitor its effluent with weekly proof, or can be shut down); if not, a paragraph saying the town is still arguing about what to do.
- **Not solved**: says only that the mystery is not solved yet. No time shown.

No result codes, no ranking, no album. The clock runs from entering Vila do Sol to the last answer.

## Also in this change

- Thinking partner renamed **Whatson Urmind** (button "Talk to Whatson").
- Map: medals for catching the dancing cat and delivering it to the Science Center.
- Optional sounds made by code (off by default).
- Teacher panel: a short quick guide.
- Profile: no "x of 8"; shows "The case: Solved / Not solved yet".

Card illustrations: [10-prompts-cartas-reuniao.md](10-prompts-cartas-reuniao.md).

## Showing how they reasoned

- **Show your proof (P1)**: before the final sentence, the player picks up to three clues from their own wall. A player with no clues can show nothing.
- **What do the clues tell you? (P2)**: the thoughts for each clue are in `src/content/inferences.ts` (18 clues so far). A clue without thoughts is simply skipped; if none of the clues shown has any, the whole step is skipped and counts for nothing, right or wrong. Whatson explains a wrong thought with its own `why`.
- **How you got here** (profile): how many clues the player marked, how many red threads they tied, and their conclusion cards with the evidence behind each. The teacher export counts conclusions tied to evidence (no text).
- **Teacher guide**: ask each team to explain aloud, in 30 seconds, how they reached the answer.
