import { useMemo, useState } from 'react';
import { evidenceById } from '../../content/evidence';
import { finalReport } from '../../content/finalReport';
import { LEVELS, buildProfile } from '../../state/scoring';
import { useGame } from '../../state/store';
import { formatPlayTime } from '../clock/PlayClock';
import { EvidenceDialog } from '../evidence/EvidenceDialog';
import styles from './ProfileScreen.module.css';

/**
 * Shown only after the whole report is locked. First how the team worked
 * (five dimensions, never a bare score), then each answer beside the
 * best-supported one and the evidence behind it.
 */
interface Props {
  /**
   * Opened from the teacher panel, over whatever the game is showing. While
   * the report is unfinished, the answers are left out so that nothing is
   * given away to a team that is still investigating.
   */
  onClose?: () => void;
}

export function ProfileScreen({ onClose }: Props = {}) {
  const save = useGame();
  const profile = useMemo(() => buildProfile(save), [save]);
  const [openEvidence, setOpenEvidence] = useState<string | null>(null);
  const preview = !!onClose;
  const finished = Object.keys(save.final.answers).length >= finalReport.length;
  const showAnswers = finished;

  // The conclusions the player pinned to the board, with the evidence tied to each.
  const conclusions = save.board.notes
    .filter((n) => n.kind === 'conclusion' && n.text.trim())
    .map((n) => ({
      id: n.id,
      text: n.text,
      basedOn: save.board.links
        .map((l) => (l.from === n.id ? l.to : l.to === n.id ? l.from : ""))
        .map((id) => evidenceById[id]?.title)
        .filter((title): title is string => !!title),
    }));
  const questionCount = Object.keys(save.asked).reduce((n, id) => n + save.asked[id].length, 0);

  return (
    <main className={styles.screen}>
      <div className={styles.file}>
        {preview && (
          <div className={styles.previewBar}>
            <span>
              {finished
                ? 'Teacher view of the finished profile.'
                : 'Teacher view. This team has not finished the report, so the profile is incomplete and the answers are hidden.'}
            </span>
            <button className="btn" autoFocus onClick={onClose}>
              Close
            </button>
          </div>
        )}

        <header className={styles.header}>
          <p className={styles.kicker}>{finished ? 'Case closed' : 'Case open'}</p>
          <h1 className={styles.title}>Investigator Profile</h1>
          <p className={styles.team}>{save.teamName}</p>

          <dl className={styles.facts}>
            <div>
              <dt>Investigation time</dt>
              <dd>{formatPlayTime(save.timing.playMs)}</dd>
            </div>
            <div>
              <dt>Evidence collected</dt>
              <dd>{save.evidence.length}</dd>
            </div>
            <div>
              <dt>Questions asked</dt>
              <dd>{questionCount}</dd>
            </div>
            <div>
              <dt>Best-supported answers</dt>
              <dd>
                {profile.correctCount} of {finalReport.length}
              </dd>
            </div>
          </dl>
        </header>

        {save.final.explanation && (
          <section aria-labelledby="own-words">
            <h2 id="own-words" className={styles.sectionTitle}>
              In your own words
            </h2>
            <p className={styles.sectionLead}>What do you think is happening in Vila do Sol, and why?</p>
            <blockquote className={styles.explanation}>{save.final.explanation}</blockquote>
          </section>
        )}

        <section aria-labelledby="how-you-worked">
          <h2 id="how-you-worked" className={styles.sectionTitle}>
            How you investigated
          </h2>
          <ul className={styles.dimensions}>
            {profile.dimensions.map((d) => {
              const step = LEVELS.indexOf(d.level);
              return (
                <li key={d.id} className={styles.dimension}>
                  <div className={styles.dimensionHead}>
                    <h3 className={styles.dimensionName}>{d.label}</h3>
                    <span className={styles.level}>{d.level}</span>
                  </div>
                  <div className={styles.meter} aria-hidden="true">
                    {LEVELS.map((_, i) => (
                      <span key={i} className={i <= step ? styles.meterOn : styles.meterOff} />
                    ))}
                  </div>
                  {d.feedback.map((line) => (
                    <p key={line} className={styles.feedback}>
                      {line}
                    </p>
                  ))}
                </li>
              );
            })}
          </ul>
        </section>

        {finished && (
          <section aria-labelledby="your-marks">
            <h2 id="your-marks" className={styles.sectionTitle}>
              How you sorted the evidence
            </h2>
            {profile.marks.judged === 0 && profile.marks.unsure === 0 ? (
              <p className={styles.sectionLead}>
                You did not mark any evidence on your board. Marking pieces as Important, Unsure or Not relevant
                is how an investigator shows what the evidence is worth.
              </p>
            ) : (
              <>
                <p className={styles.sectionLead}>
                  These are the marks you put on your Evidence Board, compared with what each piece turned out to
                  be worth. Tap any piece to read it again.
                </p>
                <MarkList
                  good
                  title="Marked Important, and it was key evidence"
                  ids={profile.marks.keyMarkedImportant}
                  onOpen={setOpenEvidence}
                />
                <MarkList
                  good
                  title="Marked Not relevant, and it did lead nowhere"
                  ids={profile.marks.distractionsMarkedNotRelevant}
                  onOpen={setOpenEvidence}
                />
                <MarkList
                  title="Marked Important, but it led nowhere"
                  ids={profile.marks.distractionsMarkedImportant}
                  onOpen={setOpenEvidence}
                />
                <MarkList
                  title="Marked Not relevant, but it was key evidence"
                  ids={profile.marks.keyMarkedNotRelevant}
                  onOpen={setOpenEvidence}
                />
                {profile.marks.unsure > 0 && (
                  <p className={styles.markNote}>
                    You marked {profile.marks.unsure} {profile.marks.unsure === 1 ? 'piece' : 'pieces'} as Unsure.
                    Being unsure is never counted against you.
                  </p>
                )}
              </>
            )}
          </section>
        )}

        {conclusions.length > 0 && (
          <section aria-labelledby="your-conclusions">
            <h2 id="your-conclusions" className={styles.sectionTitle}>
              Your conclusions
            </h2>
            <ul className={styles.conclusions}>
              {conclusions.map((c) => (
                <li key={c.id}>
                  <p className={styles.conclusionText}>{c.text}</p>
                  <p className={styles.markNote}>
                    {c.basedOn.length > 0
                      ? `Based on: ${c.basedOn.join(' · ')}`
                      : 'Not tied to any evidence on the board.'}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {showAnswers && (
        <section aria-labelledby="your-report">
          <h2 id="your-report" className={styles.sectionTitle}>
            Your report, answer by answer
          </h2>
          <p className={styles.sectionLead}>
            For each question: what you answered, the answer the evidence supports best, and the evidence behind
            it. Tap any piece to read it.
          </p>

          <ol className={styles.answers}>
            {finalReport.map((q, i) => {
              const result = profile.answers[i];
              const yours = q.options.find((o) => o.id === result.chosen);
              const best = q.options.find((o) => o.id === q.correct)!;
              return (
                <li key={q.id} className={styles.answer}>
                  <h3 className={styles.question}>{q.prompt}</h3>

                  <p className={result.isCorrect ? styles.yoursRight : styles.yoursWrong}>
                    <span className={styles.tag}>{result.isCorrect ? '✓ Your answer' : '✗ Your answer'}</span>
                    {yours?.text ?? 'No answer'}
                  </p>
                  {!result.isCorrect && (
                    <p className={styles.best}>
                      <span className={styles.tag}>Best supported by the evidence</span>
                      {best.text}
                    </p>
                  )}

                  <details className={styles.evidence}>
                    <summary>Evidence for this answer</summary>
                    <ul className={styles.chips}>
                      {q.evidenceRefs.map((id) => {
                        const found = save.evidence.includes(id);
                        return (
                          <li key={id}>
                            <button
                              className={found ? styles.chip : styles.chipMissed}
                              onClick={() => setOpenEvidence(id)}
                            >
                              {evidenceById[id].title}
                              {!found && <span className={styles.missed}> · you did not find this</span>}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ol>
        </section>
        )}

        {!preview && (
          <footer className={styles.footer}>
            <p className={styles.tease}>The case is closed. But it has happened before.</p>
            <button className="btn" onClick={() => save.continueAfter('profile')}>
              Continue
            </button>
          </footer>
        )}
      </div>

      {openEvidence && (
        <EvidenceDialog
          evidenceId={openEvidence}
          isNew={false}
          showStatus={false}
          onClose={() => setOpenEvidence(null)}
        />
      )}
    </main>
  );
}

/** One group of marked evidence in the "How you sorted the evidence" section. */
function MarkList({
  title,
  ids,
  good = false,
  onOpen,
}: {
  title: string;
  ids: string[];
  good?: boolean;
  onOpen: (id: string) => void;
}) {
  if (ids.length === 0) return null;
  return (
    <div className={good ? styles.markGroupGood : styles.markGroup}>
      <h3 className={styles.markTitle}>
        {good ? '✓ ' : '✗ '}
        {title} ({ids.length})
      </h3>
      <ul className={styles.chips}>
        {ids.map((id) => (
          <li key={id}>
            <button className={styles.chip} onClick={() => onOpen(id)}>
              {evidenceById[id].title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
