# The Mystery of the Dancing Cats

An educational investigation game for students aged 11–14. Design documents are in [docs/](docs/); start with [docs/01-development-plan.md](docs/01-development-plan.md).

## Run

```bash
npm install
```

```bash
npm run dev
```

Opens on http://localhost:5199.

## Check

```bash
npm run build
```

```bash
npm test
```

## Images

Put art in `public/images/` using the file names in [docs/05-image-assets.md](docs/05-image-assets.md). Until a file exists, the game shows a paper placeholder with the file name.

## Progress

- [x] Stage 0 — project architecture, theme, fonts, image placeholder, phase switcher
- [x] Stage 1 — game content as data (`src/content/`), with integrity tests
- [x] Stage 2 — game state and saving (`src/state/`), start screen with continue / start new
- [x] Stage 3 — opening story as a four-page book, resumable
- [x] Stage 4 — map of Vila do Sol with location pins and the top bar
- [x] Stage 5 — location scenes with tappable objects; evidence shown in 13 visual formats
- [x] Stage 6 — interviews: question choice, limits, follow-ups, Investigator Tips, answers kept on screen
- [x] Stage 7 — Evidence Board: corkboard with pan and zoom, draggable evidence, saved positions
- [x] Stage 8 — board tools: Important / Unsure / Not relevant marks, post-it notes, strings
- [x] Stage 9 — optional team meetings, the Science Center message with the lab results, ready-to-solve confirmation
- [x] Stage 10 — Final Investigation Report (eight locked questions) and the scoring rules
- [x] Play clock — counts from entering Vila do Sol until the last report answer; only while the game is open
- [x] Stage 11 — Investigator Profile: five dimensions with personal feedback, time taken, answer review with evidence
- [x] Stage 12 — historical reveal (seven pages, facts vs. fiction) and classroom reflection cards with a printable sheet
- [x] Stage 13 — accessibility and polish: focus kept inside dialogs, keyboard use of the board, darker small text, screen transitions, error screen, small-screen notice, page icon
- [x] Player navigation — "Story" button to re-read the opening at any time; free movement between Profile, The real story and Reflection once the report is finished; "Solve the Mystery" open from the start
- Images in use: the map, the four opening pages, the nine location scenes, eight character portraits, the nine evidence photographs, the cork texture and the Minamata reveal image (converted to webp; the generator's originals are kept in `art-originals/`, outside the game). Still missing: portraits of Marcos Costa and the investigation partner, and the title background.
- [x] Stage 14 (software part) — teacher panel (timings, export, clear device), central balance settings, playtest guide
- [ ] Stage 14 (classroom part) — play with real students and tune `src/content/balance.ts`; see [docs/08-playtest-guide.md](docs/08-playtest-guide.md)

Not yet tested on real tablets, with a real screen reader, or with a contrast checker.

Before classroom use, the historical statements in `src/content/reveal.ts` must be checked against reliable sources.

Developer shortcuts (jump to any phase, add test evidence, see all 60 pieces of evidence on one page) are hidden. While running `npm run dev`, open http://localhost:5199/?dev to show them. They are never included in the published game.
