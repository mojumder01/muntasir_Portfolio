// =============================================================
// Reveal.tsx
// Fades + slides content in when it scrolls into view.
// Motion automatically skips this for "reduce motion" users
// (see <MotionConfig reducedMotion="user"> in App.tsx).
// =============================================================

import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

/* ---------- 1. Settings ---------- */
const REVEAL_DISTANCE_PX = 24;
const REVEAL_DURATION_S = 0.6;
const STAGGER_STEP_S = 0.08; // delay between items in a <RevealGroup>
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- 2. Shared animation variants ---------- */
export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE_PX },
  visible: { opacity: 1, y: 0, transition: { duration: REVEAL_DURATION_S, ease: EASE_OUT } },
};

const revealGroupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_STEP_S } },
};

/* ---------- 3. Components ---------- */

/** Reveals one block when ~20% of it is visible. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={revealItemVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Reveals its <RevealItem> children one after another (staggered cards). */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={revealGroupVariants}>
      {children}
    </motion.div>
  );
}

/** One staggered item inside a <RevealGroup>. */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={revealItemVariants}>
      {children}
    </motion.div>
  );
}
