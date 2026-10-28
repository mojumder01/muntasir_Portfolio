// =============================================================
// use-theme.ts
// Reads and switches the color theme ("light" = black & white,
// "dark"). The choice is remembered in this browser only.
// public/theme-init.js applies it before the page first paints.
// =============================================================

import { useCallback, useState } from 'react';

/* ---------- 1. Settings ---------- */
export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'portfolio-theme'; // must match public/theme-init.js
const BROWSER_BAR_COLORS: Record<Theme, string> = { light: '#ffffff', dark: '#07080c' }; // dark also in public/theme-init.js

/* ---------- 2. Helpers ---------- */
function readCurrentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Applies the theme to the page and the mobile browser bar, then saves it. */
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BROWSER_BAR_COLORS[theme]);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Storage blocked (private mode): theme still changes for this visit
    console.warn('[theme] Could not save theme preference', error);
  }
}

/* ---------- 3. Hook ---------- */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readCurrentTheme);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  return { theme, toggleTheme };
}
