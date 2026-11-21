import { useGame, visibleLocations } from '../../state/store';
import { GameImage } from '../../ui/GameImage';
import styles from './MapScreen.module.css';

export function MapScreen() {
  // Select stable values; derive the list here so the component re-renders only when needed.
  const save = useGame();
  const places = visibleLocations(save);
  const visited = save.visitedLocations;
  const goTo = save.goTo;

  return (
    <section className={styles.screen} aria-label="Map of Vila do Sol">
      <div className={styles.map}>
        <GameImage
          file="map-vila-do-sol.webp"
          alt="Illustrated map of Vila do Sol: the bay and harbor, the town, the hills, and the industrial area beyond them."
          ratio="1312 / 776"
        />

        <ul className={styles.pins}>
          {places.map((place) => {
            const seen = visited.includes(place.id);
            return (
              <li
                key={place.id}
                className={styles.pinSpot}
                style={{ left: `${place.mapPos.x}%`, top: `${place.mapPos.y}%` }}
              >
                <button
                  className={seen ? styles.pinVisited : styles.pin}
                  onClick={() => goTo({ screen: 'location', locationId: place.id })}
                >
                  <span className={styles.head} aria-hidden="true">
                    {seen && <span className={styles.check}>✓</span>}
                  </span>
                  <span className={styles.name}>{place.name}</span>
                  <span className={styles.srOnly}>{seen ? ' (visited)' : ' (not visited yet)'}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className={styles.hint}>Choose a place to visit.</p>
    </section>
  );
}
