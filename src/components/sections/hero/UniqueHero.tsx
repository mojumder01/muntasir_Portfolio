// =============================================================
// UniqueHero.tsx
// Hero style "unique": a headline whose last words change every
// few seconds (one per service), a soft spotlight that follows
// the pointer, and a "build log" card that ticks through the
// steps of a project.
// =============================================================

import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { PROCESS_STEPS } from '../../../config/site-config';
import { SERVICES } from '../../../config/services';
import { AvailabilityBadge, EASE_OUT, Greeting, HERO_COPY, HeroActions, fadeUp } from './hero-shared';

/* ---------- 1. Settings ---------- */
const WORD_CHANGE_MS = 2600;
const STEP_CHANGE_MS = 1400;
const ROTATING_WORDS = SERVICES.length > 0 ? SERVICES.map((service) => service.shortTitle) : ['digital solutions'];
const BUILD_STEPS = PROCESS_STEPS.length > 0 ? PROCESS_STEPS.map((step) => step.title) : ['Discover', 'Plan', 'Build', 'Deliver'];

/** Index that counts up on a timer and wraps around; stays at 0 for visitors who prefer less motion. */
function useTicker(length: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % length), intervalMs);
    return () => window.clearInterval(timer);
  }, [length, intervalMs]);
  return index;
}

/* ---------- 2. Component ---------- */
export function UniqueHero() {
  const wordIndex = useTicker(ROTATING_WORDS.length, WORD_CHANGE_MS);
  const stepIndex = useTicker(BUILD_STEPS.length + 1, STEP_CHANGE_MS); // +1: a moment with every step done
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Spotlight follows the pointer (written straight to CSS variables, no re-render)
  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    spotlightRef.current?.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
    spotlightRef.current?.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
  };

  return (
    <section id="home" aria-labelledby="hero-title" onPointerMove={moveSpotlight} className="relative overflow-hidden pt-10 pb-20 sm:pt-16 lg:pt-20 lg:pb-28">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [--spot-x:70%] [--spot-y:30%]"
        style={{ background: 'radial-gradient(420px circle at var(--spot-x) var(--spot-y), color-mix(in oklab, var(--color-violet) 16%, transparent), transparent 70%)' }}
      />

      <div className="page-container relative grid items-center gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
        <div className="min-w-0">
          <AvailabilityBadge />
          <h1 id="hero-title" className="mt-6 text-[clamp(2.3rem,5vw,4.2rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
            <motion.span {...fadeUp(0.1)} className="block">
              I build
            </motion.span>
            {/* Changing words: the box keeps one line of height so the page doesn't jump */}
            <span className="relative block h-[1.12em] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={ROTATING_WORDS[wordIndex]}
                  className="text-gradient absolute inset-x-0 top-0 block truncate pb-[0.08em]"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE_OUT }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <motion.span {...fadeUp(0.2)} className="block">
              that move you forward.
            </motion.span>
            <span className="sr-only">Services: {ROTATING_WORDS.join(', ')}.</span>
          </h1>
          <motion.p {...fadeUp(0.3)} className="mt-6 max-w-xl text-[clamp(1.05rem,1.5vw,1.15rem)] leading-relaxed text-muted text-pretty">
            {HERO_COPY.intro}
          </motion.p>
          <Greeting delay={0.4} className="mt-4" />
          <HeroActions delay={0.5} className="mt-8" />
        </div>

        {/* "Build log" card */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 30, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT }}
          className="relative mx-auto w-full max-w-[460px]"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-blue/25 via-violet/20 to-cyan/20 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-line-strong bg-surface shadow-2xl">
            <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
              <span className="size-3 rounded-full bg-danger/70" />
              <span className="size-3 rounded-full bg-cyan/70" />
              <span className="size-3 rounded-full bg-success/70" />
              <span className="ml-3 font-mono text-[12px] text-muted">new-project.log</span>
            </div>
            <div className="p-5 font-mono text-[13px] sm:p-6">
              <p className="text-muted">
                <span className="text-blue-text">$</span> start project --for <span className="text-text">your-business</span>
              </p>
              <ul className="mt-4 space-y-3">
                {BUILD_STEPS.map((step, index) => {
                  const isDone = index < stepIndex;
                  const isRunning = index === stepIndex;
                  return (
                    <li key={step + index} className={`flex items-center gap-3 transition-colors duration-300 ${isDone || isRunning ? 'text-text' : 'text-muted/60'}`}>
                      <span className={`grid size-6 place-items-center rounded-md border ${isDone ? 'border-success/40 bg-success/15 text-success' : 'border-line-strong'}`}>
                        {isDone ? <Check size={14} /> : isRunning ? <Loader2 size={14} className="animate-spin text-violet-text" /> : null}
                      </span>
                      {step}
                      {isDone && <span className="ml-auto text-[12px] text-success">done</span>}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-fg/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue via-violet to-cyan"
                  animate={{ width: `${Math.round((Math.min(stepIndex, BUILD_STEPS.length) / BUILD_STEPS.length) * 100)}%` }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                />
              </div>
              <p className="mt-4 text-[12px] text-muted">{stepIndex >= BUILD_STEPS.length ? '✓ Delivered — with a handover guide' : 'Working on it…'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
