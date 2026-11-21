import { useEffect, useRef, useState } from 'react';
import { characters } from '../../content/characters';
import { evidenceById } from '../../content/evidence';
import { interviewById } from '../../content/interviews';
import { questionsLeft, useGame, visibleQuestions } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import { Typewriter } from '../../ui/Typewriter';
import { EvidenceDialog } from '../evidence/EvidenceDialog';
import styles from './InterviewScreen.module.css';

/**
 * The player chooses which questions to ask. Only some can be asked, and the
 * quality of a question is never shown: the player judges it by the answer.
 */
export function InterviewScreen({ interviewId }: { interviewId: string }) {
  const interview = interviewById[interviewId];
  const who = characters.find((c) => c.id === interview.characterId)!;
  const save = useGame();
  const { ask, goTo } = save;

  const askedIds = save.asked[interviewId] ?? [];
  const left = questionsLeft(save, interviewId);
  const choices = visibleQuestions(save, interviewId).filter((q) => !askedIds.includes(q.id));

  // What the latest answer brought with it. Kept only while this screen is open.
  const [latest, setLatest] = useState<{
    questionId: string;
    tip?: string;
    fresh: string[];
    /** The question is typed first, then the answer. Everything else waits until both are done. */
    phase: 'question' | 'answer' | 'done';
  } | null>(null);
  const [open, setOpen] = useState<{ id: string; isNew: boolean } | null>(null);
  const [seenFresh, setSeenFresh] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [askedIds.length]);

  function choose(questionId: string) {
    const result = ask(interviewId, questionId);
    if (result.ok) setLatest({ questionId, tip: result.tip, fresh: result.newEvidence, phase: 'question' });
  }

  const setPhase = (phase: 'question' | 'answer' | 'done') =>
    setLatest((l) => (l ? { ...l, phase } : l));
  const keepInView = () => endRef.current?.scrollIntoView({ block: 'end' });

  function view(evidenceId: string) {
    const isNew = !!latest?.fresh.includes(evidenceId) && !seenFresh.includes(evidenceId);
    if (isNew) setSeenFresh((ids) => [...ids, evidenceId]);
    setOpen({ id: evidenceId, isNew });
  }

  const transcript = askedIds
    .map((id) => interview.questions.find((q) => q.id === id))
    .filter((q) => q !== undefined);

  return (
    <section className={styles.screen} aria-label={`Interview with ${who.name}`}>
      <aside className={styles.who}>
        <GameImage file={who.portrait} alt={`${who.name}, ${who.role.toLowerCase()}`} ratio="3 / 4" className={styles.portrait} />
        <h1 className={styles.name}>{who.name}</h1>
        <p className={styles.role}>{who.role}</p>

        <div className={styles.left} aria-label={`${left} of ${interview.maxQuestions} questions left`}>
          <span className={styles.leftLabel}>Questions left</span>
          <span className={styles.dots} aria-hidden="true">
            {Array.from({ length: interview.maxQuestions }, (_, i) => (
              <span key={i} className={i < left ? styles.dot : styles.dotUsed} />
            ))}
          </span>
        </div>
      </aside>

      <div className={styles.talk}>
        <div className={styles.transcript} aria-live="polite">
          {transcript.length === 0 && (
            <p className={styles.opener}>
              You can ask {who.name} only {interview.maxQuestions} questions. Choose carefully.
            </p>
          )}

          {transcript.map((q) => {
            const found = (q.unlocks ?? []).filter((id) => save.evidence.includes(id));
            const isLatest = latest?.questionId === q.id;
            const phase = isLatest ? latest.phase : 'done';
            return (
              <div key={q.id} className={styles.exchange}>
                <p className={styles.asked}>
                  <span className={styles.speaker}>You</span>
                  {phase === 'question' ? (
                    <Typewriter text={q.text} msPerChar={14} onTick={keepInView} onDone={() => setPhase('answer')} />
                  ) : (
                    q.text
                  )}
                </p>
                {phase !== 'question' && (
                  <p className={styles.answer}>
                    <span className={styles.speaker}>{who.name}</span>
                    {phase === 'answer' ? (
                      <Typewriter
                        text={q.response}
                        msPerChar={16}
                        startDelay={700}
                        onTick={keepInView}
                        onDone={() => setPhase('done')}
                      />
                    ) : (
                      q.response
                    )}
                  </p>
                )}

                {phase !== 'done' && (
                  <button className={styles.skip} onClick={() => setPhase('done')}>
                    Skip
                  </button>
                )}

                {phase === 'done' && found.map((id) => (
                  <button key={id} className={styles.evidenceChip} onClick={() => view(id)}>
                    <span aria-hidden="true">📎</span>
                    {isLatest && latest.fresh.includes(id) && !seenFresh.includes(id) ? 'New evidence: ' : 'Evidence: '}
                    <strong>{evidenceById[id].title}</strong>
                  </button>
                ))}

                {phase === 'done' && isLatest && latest.tip && (
                  <p className={styles.tip} role="note">
                    <strong>Investigator Tip</strong>
                    {latest.tip}
                  </p>
                )}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <div className={styles.choices}>
          {left > 0 ? (
            <>
              <h2 className={styles.choicesTitle}>What do you want to ask?</h2>
              <ul className={styles.list}>
                {choices.map((q) => (
                  <li key={q.id}>
                    <button className={styles.question} onClick={() => choose(q.id)}>
                      {q.text}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className={styles.done}>
              <p>You have used all your questions with {who.name}.</p>
              <button
                className="btn"
                onClick={() => goTo({ screen: 'location', locationId: interview.locationId })}
              >
                Say goodbye
              </button>
            </div>
          )}
        </div>
      </div>

      {open && <EvidenceDialog evidenceId={open.id} isNew={open.isNew} onClose={() => setOpen(null)} />}
    </section>
  );
}
