// =============================================================
// vite.config.ts
// Build settings for the portfolio (React + Tailwind CSS).
// Run:    npm run dev     → local preview at http://localhost:5173
//         npm run build   → production files in dist/
// =============================================================

/* ---------- 1. Imports ---------- */
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { formatProblems, validateContent } from './scripts/validate-content.mjs';

/* ---------- 2. Settings ---------- */

// Relative base path: the same build works on
//   https://<username>.github.io/              (user site repo)
//   https://<username>.github.io/<repo-name>/  (project repo)
//   Vercel / Netlify (root domain)
const BASE_PATH = './';

// Content-Security-Policy for the production build.
// GitHub Pages can't send security headers, so we add it as a <meta> tag.
// It blocks scripts from any other website (protects against injected scripts / XSS).
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  // Forms may send to Formspree and to your Google Sheet (Apps Script)
  "connect-src 'self' https://formspree.io https://script.google.com https://script.googleusercontent.com",
  "form-action 'self' https://formspree.io",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

/* ---------- 3. Helper plugin ---------- */

/** Adds the security <meta> tags only to the production build (dev server needs inline scripts). */
function securityMetaTags(): Plugin {
  return {
    name: 'security-meta-tags',
    apply: 'build',
    transformIndexHtml() {
      return [
        { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY }, injectTo: 'head-prepend' },
        { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
      ];
    },
  };
}

/**
 * Checks src/content/*.json before every build and on every save in dev.
 * Build: stops with a clear list of problems, so broken content never goes live.
 * Dev:   prints the problems in the terminal and shows them in the browser overlay.
 */
function contentChecker(): Plugin {
  return {
    name: 'content-checker',
    buildStart() {
      const problems = validateContent();
      if (problems.length > 0) this.error(formatProblems(problems));
    },
    handleHotUpdate({ file, server }) {
      if (!file.includes('/src/content/')) return;
      const problems = validateContent();
      if (problems.length === 0) return;
      server.config.logger.error(formatProblems(problems));
      server.ws.send({ type: 'error', err: { message: formatProblems(problems), stack: '' } });
      return []; // skip the reload until the content is fixed
    },
  };
}

/* ---------- 4. Export config ---------- */
export default defineConfig({
  base: BASE_PATH,
  plugins: [contentChecker(), react(), tailwindcss(), securityMetaTags()],
});
