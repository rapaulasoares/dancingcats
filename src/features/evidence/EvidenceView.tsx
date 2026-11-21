import type { Evidence, EvidenceFormat } from '../../content/types';
import { GameImage } from '../../ui/GameImage';
import { Diagram } from './diagrams';
import styles from './EvidenceView.module.css';

/** What kind of object this is, in the player's words. */
export const FORMAT_LABEL: Record<EvidenceFormat, string> = {
  polaroid: 'Photograph',
  statement: 'Witness statement',
  clipping: 'Newspaper clipping',
  labReport: 'Laboratory report',
  medicalNote: 'Medical note',
  companyDoc: 'Company document',
  letter: 'Correspondence',
  map: 'Map',
  table: 'Record',
  chart: 'Chart',
  diagram: 'Scientific diagram',
  notice: 'Notice',
  handwritten: 'Handwritten note',
};

/**
 * One piece of evidence, drawn as the physical object it is: a Polaroid, a
 * clipping, a lab report... The internal relevance data is never read here.
 */
export function EvidenceView({ evidence }: { evidence: Evidence }) {
  const { body, format } = evidence;
  const paragraphs = body.text?.split('\n\n') ?? [];

  if (format === 'polaroid') {
    return (
      <article className={`${styles.doc} ${styles.polaroid}`}>
        <GameImage file={body.image ?? ''} alt={body.imageAlt ?? ''} ratio="1 / 1" />
        <h2 className={styles.polaroidTitle}>{evidence.title}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className={styles.caption}>
            {p}
          </p>
        ))}
        <p className={styles.source}>{evidence.source}</p>
      </article>
    );
  }

  return (
    <article className={`${styles.doc} ${styles[format]}`}>
      <header className={styles.header}>
        <span className={styles.kind}>{FORMAT_LABEL[format]}</span>
        <h2 className={styles.title}>{evidence.title}</h2>
        <p className={styles.source}>{evidence.source}</p>
      </header>

      {body.diagram && <Diagram body={body} />}

      {paragraphs.map((p, i) => (
        <p key={i} className={styles.text}>
          {p}
        </p>
      ))}

      {body.lines && (
        <dl className={styles.lines}>
          {body.lines.map((line) => (
            <div key={line.label}>
              <dt>{line.label}</dt>
              <dd>{line.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {body.table && (
        <div className={styles.tableWrap}>
          <table className={styles.grid}>
            <thead>
              <tr>
                {body.table.columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.table.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={i}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {body.footer && <p className={styles.footer}>{body.footer}</p>}
    </article>
  );
}
