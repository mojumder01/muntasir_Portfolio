// =============================================================
// ErrorBoundary.tsx
// Safety net: if any part of the page crashes, visitors see a calm
// message with a reload button instead of a blank screen.
// Technical details go to the browser console only.
// =============================================================

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { SOCIAL_LINKS } from '../../config/site-config';
import { toSafeExternalUrl } from '../../lib/contact-channels';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Developer-only detail; never shown on screen
    console.error('[app] A section crashed:', error, errorInfo.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    // Same https-only check as every other link; hidden when not set
    const githubUrl = toSafeExternalUrl(SOCIAL_LINKS.github);

    return (
      <main className="grid min-h-screen place-items-center bg-ink px-4 text-center text-text">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold">This page didn’t load properly.</h1>
          <p className="mt-3 text-muted">Please refresh the page.{githubUrl && ' If it keeps happening, you can still reach me on GitHub.'}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-xl bg-blue px-5 font-semibold text-white">
              Reload page
            </button>
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-line-strong px-5 font-semibold">
                Open GitHub
              </a>
            )}
          </div>
        </div>
      </main>
    );
  }
}
