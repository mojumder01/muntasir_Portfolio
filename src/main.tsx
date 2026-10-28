// =============================================================
// main.tsx
// Starts the React app and installs the global safety nets.
// =============================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './index.css';

/* ---------- 1. Global error logging (developer console only) ---------- */
// Background failures are logged quietly — visitors never see raw errors.
window.addEventListener('error', (event) => console.error('[app] Uncaught error:', event.error ?? event.message));
window.addEventListener('unhandledrejection', (event) => console.error('[app] Unhandled promise rejection:', event.reason));

/* ---------- 2. Mount ---------- */
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('index.html is missing <div id="root"></div>.');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
