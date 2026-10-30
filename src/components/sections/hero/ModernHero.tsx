// =============================================================
// ModernHero.tsx
// Hero style "modern": text on the left with three live numbers,
// and a bento grid on the right — portrait, two real project
// screenshots and a services card.
// =============================================================

import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { LAYOUT, SITE } from '../../../config/site-config';
import { PROJECTS } from '../../../config/projects';
import { SERVICES } from '../../../config/services';
import { AvailabilityBadge, EASE_OUT, Greeting, HERO_COPY, HeroActions, Portrait, fadeUp } from './hero-shared';

/* ---------- 1. Data from the admin content ---------- */
const SHOWCASE = PROJECTS.filter((project) => project.images.length > 0).slice(0, 2);
const STATS = [
  { value: String(PROJECTS.length), label: 'Projects to explore' },
  { value: String(SERVICES.length), label: 'Services' },
  // "within 24 hours" → "24h" so it fits the small tile
  { value: SITE.responseTime.replace(/^within\s+/i, '').replace(/\s*hours?$/i, 'h'), label: 'Reply time' },
];

/** Bento tile that pops in. */
const tile = (delay: number) => ({
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.7, delay, ease: EASE_OUT },
});

/* ---------- 2. Component ---------- */
export function ModernHero() {
  const projectsHref = LAYOUT.isSectionOn('portfolio') ? '#portfolio' : undefined;

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden pt-10 pb-20 sm:pt-14 lg:pt-16 lg:pb-24">
      <div aria-hidden="true" className="glow-orb -top-40 right-[10%] size-[460px] bg-violet/20" />
      <div aria-hidden="true" className="glow-orb bottom-[-20%] left-[-8%] size-[380px] bg-cyan/15" style={{ animationDelay: '-8s' }} />

      <div className="page-container relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* Left: text and numbers */}
        <div className="min-w-0">
          <AvailabilityBadge />
          <motion.h1
            id="hero-title"
            {...fadeUp(0.1)}
            className="mt-6 text-[clamp(2.2rem,4.2vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-balance"
          >
            Websites, dashboards &amp; <span className="text-gradient">automation</span> that move your business forward.
          </motion.h1>
          <motion.p {...fadeUp(0.25)} className="mt-6 max-w-xl text-[clamp(1.05rem,1.5vw,1.15rem)] leading-relaxed text-muted text-pretty">
            {HERO_COPY.intro}
          </motion.p>
          <Greeting delay={0.35} className="mt-4" />
          <HeroActions delay={0.45} className="mt-8" />

          <motion.dl {...fadeUp(0.6)} className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-line bg-surface px-4 py-3.5">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-xl font-semibold tracking-tight whitespace-nowrap sm:text-2xl">{stat.value}</dd>
                <dd className="mt-0.5 text-[12px] leading-snug text-muted">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right: bento grid */}
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
          <motion.div {...tile(0.2)} className="relative row-span-2 overflow-hidden rounded-3xl border border-line bg-surface-2">
            <Portrait className="h-full min-h-[260px] w-full" textClassName="text-6xl" />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-ink/80 px-4 py-3 backdrop-blur-md">
              <p className="text-[15px] font-semibold">{SITE.fullName}</p>
              <p className="text-[12px] text-muted">{SITE.role}</p>
            </div>
          </motion.div>

          {SHOWCASE.map((project, index) => (
            <motion.a
              key={project.id}
              {...tile(0.35 + index * 0.12)}
              href={projectsHref}
              className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface-2"
            >
              <img src={project.images[0].src} alt={project.images[0].alt} className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-white">
                <span className="line-clamp-1 text-[13px] font-semibold">{project.title}</span>
                <ArrowUpRight size={16} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </motion.a>
          ))}

          <motion.div {...tile(0.6)} className="col-span-2 rounded-3xl border border-line bg-gradient-to-br from-blue/10 via-violet/10 to-cyan/10 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">What I build</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SERVICES.map((service) => {
                const ServiceIcon = service.icon;
                return (
                  <li key={service.id} className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-ink/70 px-3 py-1.5 text-[13px]">
                    <ServiceIcon size={14} className="text-blue-text" aria-hidden="true" />
                    {service.shortTitle}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
