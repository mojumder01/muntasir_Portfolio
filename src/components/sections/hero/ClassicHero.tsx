// =============================================================
// ClassicHero.tsx
// Hero style "classic" (the original): availability badge,
// headline with staggered word reveal, intro, two CTAs and the
// animated illustration.
// =============================================================

/* ---------- 1. Imports ---------- */
import { motion } from 'motion/react';
import { LAYOUT } from '../../../config/site-config';
import { HeroVisual } from '../../visuals/HeroVisual';
import { AvailabilityBadge, EASE_OUT, Greeting, HERO_COPY, HeroActions, fadeUp } from './hero-shared';

/* ---------- 2. Settings ---------- */
const WORD_STAGGER_S = 0.05; // short, so the full headline is visible in under a second

/* ---------- 3. Helpers ---------- */

/** Renders one line of the headline, each word sliding up in turn. */
function HeadlineWords({ words, startDelay }: { words: string[]; startDelay: number }) {
  return (
    <span className="block">
      {words.map((word, wordIndex) => (
        <motion.span
          key={word + wordIndex}
          className={`mr-[0.24em] inline-block ${HERO_COPY.gradientWords.has(word) ? 'text-gradient' : ''}`}
          initial={{ opacity: 0, y: '0.5em' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: startDelay + wordIndex * WORD_STAGGER_S, ease: EASE_OUT }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ---------- 4. Component ---------- */
export function ClassicHero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden pt-10 pb-20 sm:pt-16 lg:pt-20 lg:pb-28">
      {/* Background: faint grid + two soft light orbs */}
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="glow-orb -top-32 left-[8%] size-[420px] bg-blue/25" />
      <div aria-hidden="true" className="glow-orb top-[30%] right-[-10%] size-[380px] bg-violet/20" style={{ animationDelay: '-6s' }} />

      <div className="page-container relative grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* Left: text */}
        <div>
          <AvailabilityBadge />

          <h1 id="hero-title" className="mt-6 text-[clamp(2.3rem,4.6vw,3.9rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance">
            <HeadlineWords words={HERO_COPY.lineOne} startDelay={0.1} />
            <HeadlineWords words={HERO_COPY.lineTwo} startDelay={0.1 + HERO_COPY.lineOne.length * WORD_STAGGER_S} />
          </h1>

          <motion.p {...fadeUp(0.45)} className="mt-6 max-w-xl text-[clamp(1.05rem,1.6vw,1.2rem)] leading-relaxed text-muted text-pretty">
            {HERO_COPY.intro}
          </motion.p>

          <Greeting delay={0.55} className="mt-4" />
          <HeroActions delay={0.65} className="mt-8" />
        </div>

        {/* Right: illustration */}
        <HeroVisual />
      </div>

      {/* Scroll indicator (desktop only; hidden when the services section is switched off) */}
      {LAYOUT.isSectionOn('services') && (
        <a href="#services" aria-label="Scroll to services" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
          <span className="flex h-10 w-6 justify-center rounded-full border border-line-strong pt-2">
            <span className="animate-scroll-dot size-1.5 rounded-full bg-text/70" />
          </span>
        </a>
      )}
    </section>
  );
}
