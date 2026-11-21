# The Mystery of the Dancing Cats — Development Plan

Companion documents:

- [02-evidence-matrix.md](02-evidence-matrix.md) — all 64 evidence items, the five competing hypotheses, and the elimination map (internal relevance labels)
- [03-question-matrix.md](03-question-matrix.md) — all 76 interview questions with exact responses
- [04-final-report-and-logic-audit.md](04-final-report-and-logic-audit.md) — 8 final report questions, scoring, logic audit
- [05-image-assets.md](05-image-assets.md) — image list
- [06-classroom-reflection.md](06-classroom-reflection.md) — 21 discussion questions in four themes, shown after the reveal

No application code has been written. Sections 1–7 below cover architecture, data model, stages, risks, timing, core vs. enhancement, and the decisions that need your approval.

---

## 1. Recommended architecture

| Concern | Choice | Why |
|---|---|---|
| Build / language | **Vite + React + TypeScript** | Fast, static output, typed content catches broken references at build time |
| State | **Zustand** with the `persist` middleware | Small, and gives localStorage save/restore almost for free |
| Screen flow | A **phase state machine in the store** (no URL router) | The game has one-way gates (no return after Final Report); URLs and a browser Back button would break them |
| Content | Typed data modules in `src/content/` (one file per character, location, evidence group) | Content separated from UI; you can edit wording without touching components |
| Content checks | **Vitest** integrity tests | Every `unlocks` ID exists, every final answer cites existing evidence, forbidden words (Minamata, mercury, Japan, Chisso…) never appear in pre-reveal content |
| Styling | CSS Modules + CSS custom properties (theme tokens) | Hand-crafted paper/cork/wood look; no dashboard-style component library |
| Board dragging | Custom **Pointer Events** hook (mouse, touch, pen in one API) | Free-form positioning needs no sortable-list library; fewer touch bugs |
| Board strings | One **SVG overlay** layer | Lines follow items by reading their stored coordinates |
| Tables, charts, diagrams | Rendered in **HTML/SVG from data**, not images | Accessible, editable, sharp at any size |
| Animation | CSS transitions; Framer Motion only if needed | Keep the bundle light for school devices |
| Fonts | Self-hosted (serif for narrative, a handwriting face for notes, typewriter for documents) | School networks often block font CDNs |
| Hosting | Any static host; no backend, accounts, or APIs | Per spec |

Folder outline:

```
public/images/            replaceable art (see 05-image-assets.md)
src/content/              characters, locations, evidence, interviews, finalReport, meetings, tips, reveal, reflection
src/state/                store, selectors, persistence, scoring
src/features/opening|map|location|interview|evidence|board|meeting|report|profile|reveal
src/ui/                   shared pieces: Placeholder image, Paper, Polaroid, Stamp, Button
tests/                    content integrity + scoring tests
```

How the systems interact:

```
content (static) ──► interview / location screens ──► store.collectEvidence()
                                   │                         │
                                   ▼                         ▼
                        store.questionLog            store.board (items, notes, links)
                                   │                         │
                                   └────► scoring ◄──────────┘ ◄── store.finalAnswers
                                              │
                                              ▼
                                     Investigator Profile ► Reveal ► Reflection
store ◄──► localStorage (versioned, debounced)
```

---

## 2. Game data model

Content types (static, never saved):

```ts
type HypothesisId = 'contagious' | 'rats' | 'supernatural' | 'natural' | 'contamination';
type QuestionClass = 'strong' | 'useful' | 'medium' | 'vague' | 'irrelevant'
                   | 'leading' | 'assumption' | 'opinion' | 'humorous';
type EvidenceFormat = 'polaroid' | 'statement' | 'clipping' | 'labReport' | 'medicalNote'
                    | 'companyDoc' | 'letter' | 'map' | 'table' | 'chart' | 'diagram' | 'notice';

interface Evidence {
  id: string;                    // e.g. 'CLI-03'
  title: string;
  format: EvidenceFormat;
  locationId: string;
  source: string;                // shown to the player: who said or produced it
  body: EvidenceBody;            // text | image+caption | table rows | chart series | diagram id
  internal: {                    // NEVER rendered
    relevance: 'high' | 'medium' | 'low' | 'redHerring';
    supports: HypothesisId[];
    weakens: HypothesisId[];
  };
}

interface Question {
  id: string; text: string; response: string;
  class: QuestionClass;          // hidden
  unlocks?: string[];            // evidence IDs
  unlocksLocation?: string;
  tipId?: string;
  availableWhen?: Condition;     // follow-ups and knowledge-gated questions; hidden until met
}
interface Interview { id: string; characterId: string; locationId: string;
                      maxQuestions: number; questions: Question[];
                      availableWhen?: Condition; }

interface Hotspot { id: string; label: string; x: number; y: number;   // % of scene image
                    unlocks: string[]; availableWhen?: Condition; }
interface Location { id: string; name: string; image: string; mapPos: {x:number;y:number};
                     intro: string; interviews: string[]; hotspots: Hotspot[];
                     availableWhen?: Condition; }

interface FinalQuestion { id: string; prompt: string; options: {id:string;text:string}[];
                          correct: string; dimension: Dimension; evidenceRefs: string[]; }
type Condition = { evidenceCount?: number; locationsVisited?: number;
                   hasEvidence?: string[]; anyEvidence?: string[];
                   askedQuestion?: string[]; visitedAny?: string[] };
```

`opinion` is a ninth hidden class added to the eight in the spec: the Investigator Profile needs to say "you asked witnesses to guess the cause", which requires telling those questions apart from merely vague ones.

Saved state (the only thing written to localStorage):

```ts
interface SaveGame {
  version: number;
  teamName: string;
  phase: 'opening' | 'investigation' | 'report' | 'profile' | 'reveal' | 'reflection';
  openingPage: number;
  visitedLocations: string[];
  asked: Record<string /*interviewId*/, string[] /*questionIds in order*/>;
  questionLog: { questionId: string; class: QuestionClass; at: number }[];
  tipsShown: string[];
  evidence: string[];                                  // collected IDs, in order
  board: {
    items: Record<string, { x: number; y: number; z: number;
                            tag?: 'important' | 'unsure' | 'notRelevant' }>;
    notes: { id: string; text: string; x: number; y: number; z: number; color: string }[];
    links: { id: string; from: string; to: string }[];
  };
  meetings: Record<string, Record<string, string>>;    // meetingId → promptId → typed answer
  final: { index: number; answers: Record<string, string> };   // locked as written
  timing: { startedAt: number; phaseStartedAt: Record<string, number> };
}
```

Board coordinates are stored in a fixed logical space (2400 × 1600 units), not screen pixels, so a saved board looks the same on any device. The size was reduced from the planned 3000 × 2000 during Stage 7 so that card titles stay readable when the whole wall is shown on a 1024-pixel tablet.

---

## 3. Development stages

Each stage ends with something playable. A stage is not started until the previous one passes its tests.

### Stage 0 — Project architecture
1. **Built:** Vite/React/TS scaffold, theme tokens, fonts, `Placeholder` image component (shows a tinted paper panel with the filename when an image is missing), phase switcher.
2. **Components:** `App`, `PhaseRouter`, `Placeholder`, base buttons/paper styles.
3. **Data/state:** empty store with `phase`.
4. **Dependencies:** none.
5. **Test before moving on:** builds and runs offline; a missing image never breaks layout; lint and typecheck pass.
6. **Images:** none.

### Stage 1 — Game data model and content entry
1. **Built:** all types above; every row of the Evidence, Question and Final matrices entered as data.
2. **Components:** none (a plain debug page listing all content is enough).
3. **Data/state:** `src/content/*`.
4. **Dependencies:** Stage 0; your approval of the matrices.
5. **Test:** integrity tests pass — all referenced IDs exist; each interview has the right question count; forbidden-word scan passes; every final question's `evidenceRefs` are obtainable; no evidence text contains its own conclusion (manual review checklist).
6. **Images:** none.

### Stage 2 — Game state and persistence
1. **Built:** full store, actions (`visit`, `ask`, `collect`, `moveItem`…), versioned localStorage save, restore prompt.
2. **Components:** start screen with team name, **Continue investigation / Start a new investigation** (the second asks for confirmation).
3. **Data/state:** `SaveGame`; debounced writes (about 300 ms); migration function keyed on `version`.
4. **Dependencies:** Stage 1.
5. **Test:** refresh at any moment restores the exact state; closing and reopening the browser restores; corrupt or old-version saves fall back safely with a message; private-mode/storage-blocked browsers show a warning instead of crashing.
6. **Images:** `title-background.webp`.

### Stage 3 — Opening story
1. **Built:** the opening as 4 illustrated "book pages" (about 300 words in total, shortened from the original 600 at the author's request), Next/Back, progress dots, resumable. It ends with "The truth is buried — but it is there. Find it."
2. **Components:** `OpeningBook`, `StoryPage`.
3. **Data/state:** `content/opening.ts`, `openingPage`.
4. **Dependencies:** Stage 2.
5. **Test:** two students in the age range read it in 3–4 minutes; no mention of rats, theories, or suspicion of Tucano; text is readable at tablet size.
6. **Images:** `opening-vila-do-sol`, `opening-harbor-boats`, `opening-tucano-fair`, `opening-dancing-cat`, `opening-bay-night`.

### Stage 4 — Vila do Sol map
1. **Built:** illustrated map with 8 location pins plus one hidden pin (North Point Channel); visited markers; persistent top bar (Evidence Board button with count, Team Meeting, Solve the Mystery).
2. **Components:** `MapScreen`, `MapPin`, `TopBar`.
3. **Data/state:** `locations`, `visitedLocations`, unlock conditions.
4. **Dependencies:** Stage 2.
5. **Test:** all pins reachable by touch and keyboard; hidden pin appears only after HAR-07 or TUC-03; pins stay on their landmarks at every supported screen size.
6. **Images:** `map-vila-do-sol`.

### Stage 5 — Location scenes and evidence collection
1. **Built:** each location scene with character(s) and tappable hotspots; evidence viewer in every visual format; "Added to your Evidence Board" moment.
2. **Components:** `LocationScene`, `Hotspot`, `EvidenceView` with one renderer per format (`Polaroid`, `Statement`, `Clipping`, `LabReport`, `MedicalNote`, `CompanyDoc`, `Letter`, `MapDoc`, `TableDoc`, `ChartDoc`, `Diagram`, `Notice`).
3. **Data/state:** `hotspots`, `evidence[]`.
4. **Dependencies:** Stages 1, 4.
5. **Test:** all 27 non-interview evidence items collectable; nothing collected twice; each format is visually distinct; hotspots are findable without pixel-hunting (subtle shimmer; a "look around" hint after 20 s).
6. **Images:** 9 scene images, 6 evidence photographs.

### Stage 6 — Interview system (limits, tracking, tips)
1. **Built:** question-choice interviews; remaining-questions counter; answer display; evidence unlocks only where the data says so; hidden class logged; Investigator Tips; Interview Record (re-read answers already received).
2. **Components:** `InterviewScreen`, `QuestionList`, `AnswerPanel`, `QuestionsLeft`, `InvestigatorTip`, `InterviewRecord`.
3. **Data/state:** `interviews`, `asked`, `questionLog`, `tipsShown`.
4. **Dependencies:** Stage 5.
5. **Test:** cannot exceed `maxQuestions`, even after refresh; follow-up and knowledge-gated questions stay hidden until their condition is met and appear immediately afterwards; classes never appear in the DOM; an answer with no `unlocks` adds nothing to the board; tips follow the rules in the Question Matrix (never more than one per interview, about five per game); Professor Roberto's second interview appears only after lab results arrive.
6. **Images:** 8 character portraits.

### Stage 7 — Evidence Board: layout and drag-and-drop
1. **Built:** corkboard with pan (and pinch/buttons zoom); collected evidence appears as distinct paper objects; free dragging; tap to open full view; positions saved.
2. **Components:** `BoardScreen`, `BoardCanvas`, `BoardItem`, `useDrag`.
3. **Data/state:** `board.items`.
4. **Dependencies:** Stages 2, 5.
5. **Test:** 35 items drag smoothly on a school tablet and a Chromebook; new evidence lands in a visible "inbox" strip, never on top of other items; positions survive refresh; dragging never scrolls the page.
6. **Images:** `texture-corkboard`, `texture-paper-aged`.

### Stage 8 — Board: classification, notes, connections
1. **Built:** Important / Unsure / Not Relevant markers (coloured pin + small stamp, changeable, never judged); draggable editable post-its; string connections. The five competing hypotheses are **never listed for the player**: an earlier version pinned five hypothesis cards to the board, and the author removed them because naming the options makes the mystery too easy. Players form and discard their own explanations, using notes and strings.
2. **Components:** `ItemMenu`, `PostIt`, `ConnectionLayer`, board toolbar (Add note, Connect, Tidy up).
3. **Data/state:** `tag`, `board.notes`, `board.links`.
4. **Dependencies:** Stage 7.
5. **Test:** tag, note, and link survive refresh; Connect mode works by tapping item A then item B; deleting a note removes its strings; strings follow items while dragging; nothing on the board hints at correctness.
6. **Images:** none (pins, clips, stamps are drawn in SVG/CSS).

### Stage 9 — Investigation Team Meetings and pacing gates
1. **Built:** optional meetings (First talk at 5 evidence, second talk at 10 evidence or when the lab results arrive); prompts with free-text answers saved as a "meeting minutes" sheet the team can pin to the board; the "Message from the Science Center" event (lab results) at 12 evidence + 5 locations visited; Solve gate at 12 evidence + 6 locations.
2. **Components:** `MeetingScreen`, `MapMessage`, `ReadyGate`.
3. **Data/state:** `meetings`, conditions.
4. **Dependencies:** Stages 6, 8.
5. **Test:** meetings never block progress and never reveal answers; lab results reach every player regardless of question quality; the gate warns (but does not block) when the Science Center message is unread.
6. **Images:** `meeting-table`.

### Stage 10 — Final Investigation Report and scoring
1. **Built:** "I'm ready to solve the mystery" confirmation (Review Evidence / Begin Final Report); 8 explanation questions, one per screen, each placing the correct explanation among competing hypotheses; submit locks; no back; no feedback; read-only board peek allowed. Scoring module.
2. **Components:** `ReportIntro`, `ReportQuestion`, `ReadOnlyBoard`.
3. **Data/state:** `final`, `content/finalReport.ts`, `state/scoring.ts`.
4. **Dependencies:** Stage 9.
5. **Test:** after Begin, the map is unreachable by any route including refresh; a refresh mid-report resumes on the same question with earlier answers locked; scoring unit tests cover perfect, poor, and mixed runs.
6. **Images:** `report-folder`.

### Stage 11 — Investigator Profile
1. **Built:** five dimensions shown as case-file stamps with a level and 1–2 personalised sentences each, chosen by rule from the question log, final answers, and board use; then the answer review (each question, the team's answer, the best-supported answer, and which evidence supports it).
2. **Components:** `ProfileScreen`, `DimensionCard`, `AnswerReview`.
3. **Data/state:** scoring output, `content/profileFeedback.ts`.
4. **Dependencies:** Stage 10.
5. **Test:** scripted playthroughs (all strong questions; all weak; weak-then-strong; perfect report with poor questions) each produce different, accurate feedback; no run gets automatic praise.
6. **Images:** `profile-badge` (optional).

### Stage 12 — Historical reveal and reflection
1. **Built:** "The case is closed. But it has happened before" sequence; Minamata pages; a clear two-column **Historical facts / Adapted for this game** page; reflection as four themed sets of discussion cards (your investigation, evidence, ecosystems, the real story) with optional hints; printable summary (profile + questions).
2. **Components:** `RevealSequence`, `FactVsFiction`, `ReflectionScreen`.
3. **Data/state:** `content/reveal.ts`, `content/reflection.ts`.
4. **Dependencies:** Stage 11.
5. **Test:** forbidden words appear nowhere before this phase (automated scan of content plus a DOM scan in an end-to-end run); historical statements checked against two reliable sources before release; reading time about 3 minutes.
6. **Images:** `reveal-minamata-bay`, `reveal-map-japan`, `reveal-food-chain`.

### Stage 13 — Responsive design, accessibility, visual polish
1. **Built:** layouts for tablet landscape (primary), laptop/Chromebook, tablet portrait; keyboard operation for everything including the board; screen-reader labels; contrast and text-size checks; reduced-motion mode; final art pass (textures, stamps, transitions, sound off by default).
2. **Components:** all.
3. **Data/state:** alt text for every image and a text description for every chart/diagram.
4. **Dependencies:** all earlier stages.
5. **Test:** WCAG AA contrast; all controls at least 44 px; full game completable by keyboard alone; board usable with arrow keys (select, move, tag); tested on iPad Safari, Android Chrome, ChromeOS, Windows Chrome/Edge.
6. **Images:** final versions of all Essential images.

### Stage 14 — Classroom playtesting and 40-minute balancing
1. **Built:** a hidden teacher panel (reset device, see timing per phase, export an anonymous session summary as a file); tuning of question limits, thresholds, and evidence count.
2. **Components:** `TeacherPanel`.
3. **Data/state:** `timing`.
4. **Dependencies:** complete game.
5. **Test:** at least two sessions with real 11–14-year-olds (solo and group of three). Targets: median completion 38–45 min; at least 70% of teams collect CLI-03 or two of its substitute testimonies; nobody is stuck for more than 2 minutes; final-question accuracy between 40% and 85% on each item (lower means missing evidence, higher means a giveaway).
6. **Images:** none.

---

## 4. Technical risks and fallbacks

| Feature | Ideal implementation | Simpler fallback |
|---|---|---|
| Free-form Evidence Board | Fixed logical canvas (3000×2000) inside a pan/zoom viewport using CSS transforms; items absolutely positioned | No zoom: a board twice the screen size that scrolls with two-finger drag or scrollbars |
| Drag-and-drop | Custom Pointer Events hook with pointer capture, `touch-action: none` on items, a 6 px movement threshold so taps still open items | Tap an item to pick it up, tap the board to drop it there |
| Evidence positioning | New items arrive in an "inbox" strip at the board edge; optional **Tidy up** button arranges by location | Auto-grid placement, player drags from there |
| Player-created notes | Post-its edited in place (contenteditable with a 140-character limit) | Note text typed in a small dialog, then rendered as a post-it |
| Classification | Three coloured pins in the item menu; shown as pin colour plus a small stamp so it does not rely on colour alone | Same control inside the full-view dialog only |
| Connections (strings) | SVG lines between item centres; Connect mode = tap A, tap B; tap a string to remove it | A "Linked to…" chip list on each item instead of drawn lines |
| Responsive behaviour | Design for 1024×768 landscape first; scale the logical board to fit; portrait gets a stacked layout | Ask the player to rotate the device below 900 px width; phones not supported |
| Local persistence | Zustand `persist`, versioned, debounced, wrapped in try/catch; save size is a few kilobytes | Manual "Save progress" button plus save on every phase change |
| Restoring a session | Start screen detects a save and shows team name, evidence count, and last-played time | Always resume silently; "Start over" in the teacher panel |
| Shared school devices | Saves keyed by team name; teacher panel can clear them | One save per device with a confirm-before-overwrite |
| Touch devices | Pointer Events only (no hover-dependent UI), pinch zoom on the board only, tested early in Stage 7 on a real tablet | Zoom buttons instead of pinch |
| Reading load | Short paragraphs, 18 px minimum body text, optional read-aloud through the browser's built-in speech (no external service) | Teacher reads the opening aloud to the class |

---

## 5. 40-minute gameplay model

| Segment | Minutes | Notes |
|---|---:|---|
| Opening story | 2 | About 300 words in 4 illustrated pages; slower readers can use read-aloud |
| Map and scene exploration | 7 | 9 scenes, 27 hotspot items; nobody needs to find all of them |
| Interviews | 15 | 34 questions maximum at roughly 25–30 s each |
| Evidence Board organising | 5 | Usually two visits: once mid-game, once before the report |
| Team meetings (optional) | 0–3 | Groups use them more than solo players |
| Final Investigation Report | 6 | 8 questions at about 45 s |
| Investigator Profile | 1–2 | |
| Historical reveal | 3 | |
| **Total in-game** | **39–43** | |
| Classroom reflection | 5–10, teacher-led | Recommended outside the 40 minutes, or as the start of the next lesson |

A typical team will hold 32–40 evidence items at the end, out of 60. The misleading clues are short (a photo, a notice, a clipping), but they add about two minutes and push the total slightly over 40. If playtests run long, the levers in order are: cut João, Dona Rosa and Mr. Santos to 3 questions each; shorten the opening by one page; remove the three purely irrelevant items (MKT-06, SQ-04, TUC-07). The misleading clues for hypotheses A, B, C and E should be the last thing cut.

---

## 6. Core vs. enhancement

**Core game**

- Opening story, map, 9 scenes with hotspots
- Interview system with question choice, limits, hidden classification, tips
- Evidence in distinct visual formats; information that is not evidence
- Evidence Board with drag, classification, post-it notes, string connections
- Five competing hypotheses built into the evidence (misleading clues and eliminating clues for each), never listed for the player before the Final Report
- Team meetings and the lab-results pacing event
- Final Investigation Report (one question per screen, locked, no feedback until the end)
- Scoring, Investigator Profile, answer review
- Historical reveal with facts vs. adaptation, reflection prompts
- Local persistence and session restore
- Tablet and laptop layouts, keyboard and screen-reader basics
- Placeholder images until art arrives

**Enhancements (after the full game works)**

- Board zoom and Tidy up
- Read-aloud narration
- Interview Record (recommended; see decision 7)
- Meeting minutes as a pinnable board item
- Printable investigation summary
- Teacher panel with timing export
- Ambient sound, page-turn and pin animations
- Portuguese-language version (content is already separated from UI)
- Installable offline version
- Household cards that show blank fields for questions the team did not ask

---

## 7. Decisions that need your approval

Everything not listed here I will treat as settled by your specification or by this plan.

1. **Question budget.** 8 questions offered, 4 allowed, for every character; Professor Roberto gets a short second interview (4 offered, 2 allowed) after lab results. This fits the 15-minute interview budget. Approve, or choose 5 allowed (adds about 4 minutes).
2. **What the lab finds, and where.** The heavy metal is found in **fish and cat tissue, in bay mud and in water** collected by the Science Center, with the most inside the channel and at its mouth. The water was sampled from the public channel, outside the factory grounds, so Tucano's permission was not needed. The game ends with the case closed: the treated wastewater still carried the heavy metal.
3. **Baby Bia.** Mrs. Silva's 18-month-old was born with movement difficulties and has never eaten fish. It is the congenital element, left unexplained until the reveal. Confirm this is acceptable for your students, or I remove RES-05.
4. **Names.** The healthy low-seafood household in the clinic table is renamed **Almeida**, so it is not confused with Mr. Santos. João becomes João Ferreira; Maria's family is Barros; João's sick colleague is Marcos Costa.
5. **Additions made to close logic gaps** (details in the audit): Luana Silva, who lives in a sick household and avoids fish; Dona Rosa's healthy garden cat; two sick families in Porto Azul who buy Vila do Sol fish; a town water notice; a January "red water" red herring with a bay monitoring record; a boat-repair yard as a second possible pollution source; a sediment map. Tell me if any of these should go.
6. **Device target.** Tablets and laptops in landscape, 1024×768 and up. Phones are not supported.
7. **Interview Record.** Players can re-read answers they already received (not as evidence, and not on the board). I recommend it for this age group; it does not weaken the "information is not evidence" principle.
8. **Art style for "photographs".** I assume one painted-illustration style for scenes and portraits, with evidence photos in the same style inside Polaroid frames. If you prefer photo-realistic evidence images, say so before you generate them.
9. **Reveal imagery.** I assume newly illustrated images of Minamata Bay rather than historical photographs, which need licences and some of which are distressing.
10. **Reflection timing.** Reflection prompts appear in-game but are meant for teacher-led discussion after the 40 minutes.
