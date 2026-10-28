// =============================================================
// accent-styles.ts
// Maps each accent color to ready-made Tailwind classes.
// Full class names are written out so Tailwind can find them.
// =============================================================

import type { AccentColor } from '../types/content';

interface AccentClasses {
  iconBox: string; // icon background + color
  text: string;
  hoverBorder: string;
  glow: string; // soft glow shown on hover
}

export const ACCENT_STYLES: Record<AccentColor, AccentClasses> = {
  blue: {
    iconBox: 'bg-blue/12 text-blue-text ring-1 ring-blue/25',
    text: 'text-blue-text',
    hoverBorder: 'hover:border-blue/40',
    glow: 'bg-blue/20',
  },
  violet: {
    iconBox: 'bg-violet/12 text-violet-text ring-1 ring-violet/25',
    text: 'text-violet-text',
    hoverBorder: 'hover:border-violet/40',
    glow: 'bg-violet/20',
  },
  cyan: {
    iconBox: 'bg-cyan/10 text-cyan-text ring-1 ring-cyan/25',
    text: 'text-cyan-text',
    hoverBorder: 'hover:border-cyan/40',
    glow: 'bg-cyan/15',
  },
};
