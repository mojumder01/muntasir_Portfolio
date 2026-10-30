// =============================================================
// SimpleHero.tsx
// Hero style "simple": one calm, centered column — badge,
// headline, intro, two buttons and a quiet line of services.
// =============================================================

import { motion } from 'motion/react';
import { SERVICES } from '../../../config/services';
import { AvailabilityBadge, Greeting, HERO_COPY, HeroActions, fadeUp } from './hero-shared';

export function SimpleHero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden pt-16 pb-24 sm:pt-24 lg:pt-28 lg:pb-32">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-70" />

      <div className="page-container relative flex flex-col items-center text-center">
        <AvailabilityBadge />

        <motion.h1
          id="hero-title"
          {...fadeUp(0.1)}
          className="mt-7 max-w-4xl text-[clamp(2.4rem,5.6vw,4.6rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-balance"
        >
          Smart digital <span className="text-gradient">solutions</span>, built to move your business <span className="text-gradient">forward.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.25)} className="mt-6 max-w-2xl text-[clamp(1.05rem,1.6vw,1.2rem)] leading-relaxed text-muted text-pretty">
          {HERO_COPY.intro}
        </motion.p>

        <Greeting delay={0.35} className="mt-4" />
        <HeroActions delay={0.45} className="mt-9 justify-center" />

        {SERVICES.length > 0 && (
          <motion.ul {...fadeUp(0.6)} aria-label="Services" className="mt-14 flex max-w-3xl flex-wrap justify-center gap-2 text-[13px] text-muted">
            {SERVICES.map((service) => (
              <li key={service.id} className="rounded-full border border-line px-3 py-1">
                {service.shortTitle}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
