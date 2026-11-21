import { Component, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

/**
 * If a screen crashes, show a calm message instead of a blank page. The
 * investigation is saved in the browser, so reloading brings it back.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className={styles.screen} role="alert">
        <div className={styles.note}>
          <h1>Something went wrong</h1>
          <p>Your investigation is saved. Reload the page and choose "Continue investigation".</p>
          <button className="btn" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </main>
    );
  }
}
