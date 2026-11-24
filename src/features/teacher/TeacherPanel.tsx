import { useRef, useState } from 'react';
import { BALANCE } from '../../content/balance';
import { evidence } from '../../content/evidence';
import { buildSessionSummary } from '../../state/summary';
import { PHASES, hasSave, useGame } from '../../state/store';
import { useFocusTrap } from '../../ui/useFocusTrap';
import { formatPlayTime } from '../clock/PlayClock';
import { ProfileScreen } from '../profile/ProfileScreen';
import styles from './TeacherPanel.module.css';

const PHASE_LABEL: Record<string, string> = {
  opening: 'Opening story',
  investigation: 'Investigation',
  report: 'Town meeting',
  profile: 'Investigator Profile',
  reveal: 'Historical reveal',
  reflection: 'Reflection',
};

const ERASE_WORD = 'ERASE';

/**
 * For the teacher, opened from the start screen. Shows how the game saved on
 * this device went, exports an anonymous summary, and clears the device for
 * the next class.
 */
export function TeacherPanel({ onClose }: { onClose: () => void }) {
  const save = useGame();
  const saved = hasSave(save);
  const [confirm, setConfirm] = useState('');
  const [exported, setExported] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);

  function exportSummary() {
    const summary = buildSessionSummary(save);
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Named with the local date and time, so files from one lesson sort together.
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    link.download = `dancing-cats-session-${stamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
  }

  const classCounts = save.questionLog.reduce<Record<string, number>>((acc, q) => {
    acc[q.class] = (acc[q.class] ?? 0) + 1;
    return acc;
  }, {});

  if (showProfile) {
    return (
      <div className={styles.profileOverlay} role="dialog" aria-modal="true" aria-label="Investigator Profile, teacher view">
        <ProfileScreen onClose={() => setShowProfile(false)} />
      </div>
    );
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        ref={ref}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Teacher panel"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      >
        <header className={styles.header}>
          <h2>Teacher panel</h2>
          <button className="btn btn--quiet" autoFocus onClick={onClose}>
            Close
          </button>
        </header>

        <section className={styles.about}>
          <h3>Quick guide</h3>
          <ul>
            <li>
              <strong>Setup.</strong> Open the link on a tablet or laptop. No install, no account. Students can play
              alone or in small teams, about 40 to 50 minutes. Progress saves on the device.
            </li>
            <li>
              <strong>Play.</strong> Students explore the map, interview people, pin clues on the Evidence Board and can
              talk things over with Whatson Urmind. They press <em>Solve the Mystery</em> whenever they feel ready, which
              opens a short town meeting (about 8 to 10 minutes).
            </li>
            <li>
              <strong>Competition (optional).</strong> The clock runs from entering the town to the last answer of the
              meeting. A solved case shows the time taken. Just ask: who was fastest?
            </li>
            <li>
              <strong>Afterwards.</strong> Investigator Profile, the real case that inspired the story, and discussion
              questions that can be printed.
            </li>
            <li>
              <strong>Shared devices.</strong> Use the erase button below between classes.
            </li>
          </ul>
        </section>

        {saved ? (
          <>
            <section>
              <h3>Game saved on this device</h3>
              <dl className={styles.facts}>
                <div>
                  <dt>Team</dt>
                  <dd>{save.teamName}</dd>
                </div>
                <div>
                  <dt>Reached</dt>
                  <dd>{PHASE_LABEL[save.phase] ?? save.phase}</dd>
                </div>
                <div>
                  <dt>Evidence</dt>
                  <dd>
                    {save.evidence.length} of {evidence.length}
                  </dd>
                </div>
                <div>
                  <dt>Places visited</dt>
                  <dd>{save.visitedLocations.length} of 9</dd>
                </div>
                <div>
                  <dt>Questions asked</dt>
                  <dd>{save.questionLog.length}</dd>
                </div>
                <div>
                  <dt>Player's clock</dt>
                  <dd>{formatPlayTime(save.timing.playMs)}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h3>Time with the game open, by phase</h3>
              <table className={styles.table}>
                <tbody>
                  {PHASES.filter((p) => p !== 'start').map((p) => (
                    <tr key={p}>
                      <th scope="row">{PHASE_LABEL[p]}</th>
                      <td>{formatPlayTime(save.timing.phaseMs[p] ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section>
              <h3>Kinds of question chosen</h3>
              {save.questionLog.length === 0 ? (
                <p>No questions asked yet.</p>
              ) : (
                <p className={styles.classes}>
                  {Object.entries(classCounts).map(([name, count]) => (
                    <span key={name}>
                      {name}: <strong>{count}</strong>
                    </span>
                  ))}
                </p>
              )}
              <p className={styles.small}>
                These labels are hidden from students. They are explained in the question matrix.
              </p>
            </section>

            <section>
              <h3>Investigator Profile</h3>
              <p className={styles.small}>
                The assessment sheet for this team: five dimensions with a level and comments. Students see it
                themselves after the town meeting. Before that, it opens here without the meeting answers.
              </p>
              <button className="btn" onClick={() => setShowProfile(true)}>
                See the Investigator Profile
              </button>
            </section>

            <section>
              <h3>Export</h3>
              <p className={styles.small}>
                Saves a small file with timings, the evidence and questions chosen, and the meeting results. It
                does not include the team name or anything the students typed.
              </p>
              <button className="btn" onClick={exportSummary}>
                Export session summary
              </button>
              {exported && (
                <span className={styles.done} role="status">
                  Saved to your downloads.
                </span>
              )}
            </section>

            <section className={styles.danger}>
              <h3>Clear this device for the next class</h3>
              <p className={styles.small}>
                This erases the saved game for <strong>{save.teamName}</strong>. It cannot be undone. Export the
                summary first if you want to keep it.
              </p>
              <label htmlFor="erase-word">Type {ERASE_WORD} to confirm</label>
              <div className={styles.eraseRow}>
                <input
                  id="erase-word"
                  className={styles.input}
                  value={confirm}
                  autoComplete="off"
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button
                  className="btn"
                  disabled={confirm.trim().toUpperCase() !== ERASE_WORD}
                  onClick={() => {
                    save.resetDevice();
                    setConfirm('');
                  }}
                >
                  Erase saved game
                </button>
              </div>
            </section>
          </>
        ) : (
          <section>
            <h3>No game is saved on this device</h3>
            <p>When a team has played here, this panel shows their timings and lets you export a summary.</p>
          </section>
        )}

        <section>
          <h3>Current settings</h3>
          <p className={styles.small}>
            Questions per character: {BALANCE.questions.maria} of 8 · Whatson talks at {BALANCE.meeting1Evidence}{' '}
            evidence · Tissue analysis when the team brings the dancing cat to the Science Center · Mud and
            water samples at {BALANCE.bayResults.evidenceCount} evidence and {BALANCE.bayResults.locationsVisited}{' '}
            places · Solve the Mystery:{' '}
            {BALANCE.readyToSolve.evidenceCount === 0
              ? 'open from the start'
              : `at ${BALANCE.readyToSolve.evidenceCount} evidence and ${BALANCE.readyToSolve.locationsVisited} places`}
            . These are set in the game's balance file.
          </p>
        </section>
      </div>
    </div>
  );
}
