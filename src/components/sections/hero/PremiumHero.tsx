// =============================================================
// PremiumHero.tsx
// Hero style "premium": an editorial layout — a thin top line
// with name and location, a large light headline, a portrait in
// a slowly turning gradient ring with orbiting skill badges, and
// a gliding strip of tools along the bottom.
// =============================================================

import { motion } from 'motion/react';
import { SITE, SKILL_GROUPS } from '../../../config/site-config';
import { AvailabilityBadge, EASE_OUT, HERO_COPY, HeroActions, Portrait, fadeUp } from './hero-shared';

/* ---------- 1. Data from the admin content ---------- */
const TOOLS = SKILL_GROUPS.flatMap((group) => group.skills);
const ORBIT_BADGES = SKILL_GROUPS.map((group) => group.title).slice(0, 4);
// Badge positions around the ring (percent of the box), clockwise from top-right
const ORBIT_POSITIONS = [
  'top-[6%] right-[2%]',
  'bottom-[16%] right-[-4%]',
  'bottom-[2%] left-[8%]',
  'top-[18%] left-[-6%]',
];

/* ---------- 2. Component ---------- */
export function PremiumHero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden pt-8 pb-16 sm:pt-12 lg:pt-14">
      <div aria-hidden="true" className="glow-orb top-[10%] left-[35%] size-[520px] bg-blue/15" />

      <div className="page-container relative">
        {/* Thin editorial top line */}
        <motion.div {...fadeUp(0)} className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
          <span>{SITE.fullName}</span>
          <span className="hidden sm:inline">{SITE.role}</span>
          <span>{SITE.location.split('·')[0].trim()}</span>
        </motion.div>

        <div className="grid items-center gap-12 pt-12 lg:grid-cols-[1.25fr_1fr] lg:gap-8 lg:pt-16">
          <div className="min-w-0">
            <AvailabilityBadge delay={0.1} />
            <h1 id="hero-title" className="mt-7 text-[clamp(2.6rem,6.2vw,5.4rem)] font-light leading-[0.98] tracking-[-0.055em] text-balance">
              <motion.span {...fadeUp(0.15)} className="block">
                Smart digital
              </motion.span>
              <motion.span {...fadeUp(0.25)} className="block font-semibold">
                <span className="text-gradient">solutions</span>, built
              </motion.span>
              <motion.span {...fadeUp(0.35)} className="block">
                to move you forward.
              </motion.span>
            </h1>
            {/* Underline that draws itself under the headline */}
            <motion.span
              aria-hidden="true"
              className="mt-7 block h-px max-w-md origin-left bg-gradient-to-r from-blue via-violet to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT }}
            />
            <motion.p {...fadeUp(0.5)} className="mt-7 max-w-xl text-[clamp(1.05rem,1.5vw,1.15rem)] leading-relaxed text-muted text-pretty">
              {HERO_COPY.intro}
            </motion.p>
            <HeroActions delay={0.6} className="mt-9" />
          </div>

          {/* Portrait in a turning gradient ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
            className="relative mx-auto aspect-square w-full max-w-[420px]"
          >
            <div aria-hidden="true" className="animate-hero-spin absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--color-blue),var(--color-violet),var(--color-cyan),var(--color-blue))] opacity-80" />
            <div aria-hidden="true" className="animate-hero-spin-slow absolute -inset-5 rounded-full border border-dashed border-line-strong" />
            <div className="absolute inset-[6px] overflow-hidden rounded-full border-[6px] border-ink bg-surface-2">
              <Portrait className="size-full" textClassName="text-7xl" />
            </div>
            {ORBIT_BADGES.map((badge, index) => (
              <motion.span
                key={badge}
                className={`glass absolute rounded-full px-3.5 py-1.5 text-[13px] font-medium shadow-lg ${ORBIT_POSITIONS[index]}`}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.6 }}
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Gliding strip of tools */}
      {TOOLS.length > 0 && (
        <div aria-hidden="true" className="relative mt-16 overflow-hidden border-y border-line py-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="animate-hero-marquee flex w-max gap-10 whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.16em] text-muted">
            {[...TOOLS, ...TOOLS].map((tool, index) => (
              <span key={tool + index} className="flex items-center gap-10">
                {tool}
                <span className="size-1 rounded-full bg-line-strong" />
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
