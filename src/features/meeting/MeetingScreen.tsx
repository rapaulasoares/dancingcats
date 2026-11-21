import { useState } from 'react';
import { meets } from '../../content/conditions';
import { BALANCE } from '../../content/balance';
import { meetings, partner } from '../../content/meetings';
import { progressOf, useGame } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import styles from './MeetingScreen.module.css';

/**
 * A talk with the investigation partner. The partner asks the questions and
 * the player answers in writing. Nothing here is graded and nothing is
 * revealed. Both talks are always listed, so the player can see what exists
 * and which one is ready.
 */
export function MeetingScreen() {
  const save = useGame();
  const { goTo, saveMeetingAnswer } = save;
  const [openId, setOpenId] = useState<string | null>(null);
  const progress = progressOf(save);
  const open = meetings.find((m) => m.id === openId);

  return (
    <section className={styles.screen} aria-label="Talk to your investigation partner">
      <div className={styles.layout}>
        <aside className={styles.partner}>
          <GameImage file={partner.portrait} alt="Your investigation partner" ratio="3 / 4" className={styles.portrait} />
          <p className={styles.partnerName}>{partner.name}</p>
        </aside>

        <div className={styles.talk}>
          <p className={styles.bubble}>{open ? open.partnerSays : partner.greeting}</p>

          {!open ? (
            <>
              <h1 className={styles.title}>Talk it over</h1>
              <ul className={styles.list}>
                {meetings.map((m) => {
                  const ready = meets(m.availableWhen, progress);
                  const written = Object.values(save.meetings[m.id] ?? {}).filter((t) => t.trim()).length;
                  const needed = m.id === 'meeting1' ? BALANCE.meeting1Evidence : BALANCE.meeting2Evidence;
                  return (
                    <li key={m.id} className={ready ? styles.card : styles.cardLocked}>
                      <div>
                        <h2 className={styles.cardTitle}>{m.title}</h2>
                        <p className={styles.cardInfo}>
                          {ready
                            ? written > 0
                              ? `You have written ${written} of ${m.prompts.length} answers.`
                              : `${m.prompts.length} questions to think about.`
                            : `Not yet. Collect ${Math.max(needed - save.evidence.length, 1)} more ${
                                needed - save.evidence.length === 1 ? 'piece' : 'pieces'
                              } of evidence${m.id === 'meeting2' ? ', or wait for the laboratory results' : ''}.`}
                        </p>
                      </div>
                      <button className="btn" disabled={!ready} onClick={() => setOpenId(m.id)}>
                        {written > 0 ? 'Continue' : 'Start'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <h1 className={styles.title}>{open.title}</h1>
              <p className={styles.lead}>
                Write what you think, or just talk it over together. There are no right or wrong answers here.
              </p>
              <ol className={styles.prompts}>
                {open.prompts.map((prompt) => (
                  <li key={prompt.id}>
                    <label className={styles.prompt} htmlFor={prompt.id}>
                      {prompt.text}
                    </label>
                    <textarea
                      id={prompt.id}
                      className={styles.answer}
                      rows={2}
                      maxLength={500}
                      placeholder="Your thoughts…"
                      value={save.meetings[open.id]?.[prompt.id] ?? ''}
                      onChange={(e) => saveMeetingAnswer(open.id, prompt.id, e.target.value)}
                    />
                  </li>
                ))}
              </ol>
            </>
          )}

          <footer className={styles.footer}>
            {open ? (
              <button className="btn btn--quiet" onClick={() => setOpenId(null)}>
                Back to the talks
              </button>
            ) : (
              <button className="btn btn--quiet" onClick={() => goTo({ screen: 'board' })}>
                Look at the Evidence Board
              </button>
            )}
            <button className="btn" onClick={() => goTo({ screen: 'map' })}>
              Back to the investigation
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}
