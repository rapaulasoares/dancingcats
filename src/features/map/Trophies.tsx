import { useRef } from 'react';
import { useGame } from '../../state/store';
import styles from './Trophies.module.css';

/**
 * Two milestones of the cat chase, shown at the side of the map: the cat is caught, then delivered
 * to the Science Center. A milestone pops when it is earned while the map is on screen.
 */
export function Trophies() {
  const caught = useGame((s) => s.catCaught || s.catDelivered);
  const delivered = useGame((s) => s.catDelivered);
  // Anything already earned when the map opens is simply shown; only new ones celebrate.
  const earnedAtOpen = useRef({ caught, delivered });

  const items = [
    { id: 'caught', done: caught, fresh: caught && !earnedAtOpen.current.caught, label: 'Caught the dancing cat', todo: 'Catch the dancing cat' },
    {
      id: 'delivered',
      done: delivered,
      fresh: delivered && !earnedAtOpen.current.delivered,
      label: 'Delivered it to the Science Center',
      todo: 'Take it to the Science Center',
    },
  ];

  return (
    <aside className={styles.trophies} aria-label="Cat chase" onPointerDown={(e) => e.stopPropagation()}>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.done ? (item.fresh ? styles.freshItem : styles.doneItem) : styles.todoItem}>
            <span className={styles.medal} aria-hidden="true">
              {item.done ? '★' : ''}
            </span>
            <span className={styles.text}>
              {item.done ? item.label : item.todo}
              <span className={styles.srOnly}>{item.done ? ' (done)' : ' (not yet)'}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
