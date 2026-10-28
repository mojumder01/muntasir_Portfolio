// =============================================================
// HeroSection.tsx
// First screen: availability badge, headline with staggered word
// reveal, intro, two CTAs and the animated illustration.
// =============================================================

/* ---------- 1. Imports ---------- */
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SITE } from '../../config/site-config';
import { useInquiry } from '../../context/inquiry-context';
import { Button, ButtonLink } from '../ui/Button';
import { HeroVisual } from '../visuals/HeroVisual';

/* ---------- 2. Copy & settings ---------- */
const HEADLINE_LINE_ONE = ['Smart', 'Digital', 'Solutions.'];
const HEADLINE_LINE_TWO = ['Built', 'to', 'Move', 'Your', 'Business', 'Forward.'];
const GRADIENT_WORDS = new Set(['Solutions.', 'Forward.']);
const WORD_STAGGER_S = 0.05; // short, so the full headline is visible in under a second

/* ---------- 3. Helpers ---------- */

/** Renders one line of the headline, each word sliding up in turn. */
function HeadlineWords({ words, startDelay }: { words: string[]; startDelay: number }) {
  return (
    <span className="block">
      {words.map((word, wordIndex) => (
        <motion.span
          key={word + wordIndex}
          className={`mr-[0.24em] inline-block ${GRADIENT_WORDS.has(word) ? 'text-gradient' : ''}`}
          initial={{ opacity: 0, y: '0.5em' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: startDelay + wordIndex * WORD_STAGGER_S, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/** Fade-up for the smaller hero elements, in order. */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

/* ---------- 4. Component ---------- */
export function HeroSection() {
  const { startInquiry } = useInquiry();

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden pt-10 pb-20 sm:pt-16 lg:pt-20 lg:pb-28">
      {/* Background: faint grid + two soft light orbs */}
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="glow-orb -top-32 left-[8%] size-[420px] bg-blue/25" />
      <div aria-hidden="true" className="glow-orb top-[30%] right-[-10%] size-[380px] bg-violet/20" style={{ animationDelay: '-6s' }} />

      <div className="page-container relative grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* Left: text */}
        <div>
          {SITE.isAvailable && (
            <motion.p {...fadeUp(0)} className="glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm text-text/90">
              <span className="relative flex size-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-success/70" />
                <span className="relative size-2.5 rounded-full bg-success" />
              </span>
              {SITE.availabilityText}
            </motion.p>
          )}

          <h1 id="hero-title" className="mt-6 text-[clamp(2.3rem,4.6vw,3.9rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance">
            <HeadlineWords words={HEADLINE_LINE_ONE} startDelay={0.1} />
            <HeadlineWords words={HEADLINE_LINE_TWO} startDelay={0.1 + HEADLINE_LINE_ONE.length * WORD_STAGGER_S} />
          </h1>

          <motion.p {...fadeUp(0.45)} className="mt-6 max-w-xl text-[clamp(1.05rem,1.6vw,1.2rem)] leading-relaxed text-muted text-pretty">
            From high-converting websites and landing pages to intelligent Excel dashboards and AI automation, I help businesses work smarter, save time, and
            grow faster.
          </motion.p>

          <motion.p {...fadeUp(0.55)} className="mt-4 text-[15px] text-text/80">
            Hi, I’m <span className="font-semibold text-text">{SITE.fullName}</span> — {SITE.role.toLowerCase()}.
          </motion.p>

          <motion.div {...fadeUp(0.65)} className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => startInquiry()}>
              Start a Project <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Button>
            <ButtonLink href="#portfolio" variant="secondary">
              Explore My Work
            </ButtonLink>
          </motion.div>
        </div>

        {/* Right: illustration */}
        <HeroVisual />
      </div>

      {/* Scroll indicator (desktop only) */}
      <a href="#services" aria-label="Scroll to services" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
        <span className="flex h-10 w-6 justify-center rounded-full border border-line-strong pt-2">
          <span className="animate-scroll-dot size-1.5 rounded-full bg-text/70" />
        </span>
      </a>
    </section>
  );
}
