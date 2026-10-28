// =============================================================
// ThemeToggle.tsx
// Sun / moon button that switches between the black & white
// (default) theme and the dark theme.
// =============================================================

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/use-theme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to black and white theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      title={isDark ? 'Black & white theme' : 'Dark theme'}
      className={`grid size-11 place-items-center rounded-xl border border-line-strong transition-colors hover:bg-fg/5 ${className}`}
    >
      {isDark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
    </button>
  );
}
