// =============================================================
// hero-shared.tsx
// Copy, animations and small parts used by every hero style,
// so all five styles say the same thing and stay in sync.
// =============================================================

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { LAYOUT, SITE } from '../../../config/site-config';
import { useInquiry } from '../../../context/inquiry-context';
import { Button, ButtonLink } from '../../ui/Button';

/* ---------- 1. Copy ---------- */
export const HERO_COPY = {
  lineOne: ['Smart', 'Digital', 'Solutions.'],
  lineTwo: ['Built', 'to', 'Move', 'Your', 'Business', 'Forward.'],
  gradientWords: new Set(['Solutions.', 'Forward.']),
  intro:
    'From high-converting websites and landing pages to intelligent Excel dashboards and AI automation, I help businesses work smarter, save time, and grow faster.',
};

/* ---------- 2. Animations ---------- */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fade-up for hero elements, in order. */
export const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE_OUT },
});

/* ---------- 3. Small parts ---------- */

/** Green "Available for new projects" pill (hidden when switched off in the admin). */
export function AvailabilityBadge({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  if (!SITE.isAvailable) return null;
  return (
    <motion.p {...fadeUp(delay)} className={`glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm text-text/90 ${className}`}>
      <span className="relative flex size-2.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-success/70" />
        <span className="relative size-2.5 rounded-full bg-success" />
      </span>
      {SITE.availabilityText}
    </motion.p>
  );
}

/** Where "Explore my work" points: the portfolio, or services when the portfolio is switched off. */
function secondaryTarget() {
  if (LAYOUT.isSectionOn('portfolio')) return { href: '#portfolio', label: 'Explore My Work' };
  if (LAYOUT.isSectionOn('services')) return { href: '#services', label: 'See My Services' };
  return null;
}

/** "Start a Project" + "Explore My Work". */
export function HeroActions({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  const { startInquiry } = useInquiry();
  const secondary = secondaryTarget();
  return (
    <motion.div {...fadeUp(delay)} className={`flex flex-wrap gap-3 ${className}`}>
      <Button onClick={() => startInquiry()}>
        Start a Project <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
      </Button>
      {secondary && (
        <ButtonLink href={secondary.href} variant="secondary">
          {secondary.label}
        </ButtonLink>
      )}
    </motion.div>
  );
}

/** Profile photo, or the initials when there is no photo. */
export function Portrait({ className = '', textClassName = 'text-5xl' }: { className?: string; textClassName?: string }) {
  if (SITE.photoUrl) return <img src={SITE.photoUrl} alt={`Portrait of ${SITE.fullName}`} className={`object-cover ${className}`} />;
  return (
    <span aria-hidden="true" className={`grid place-items-center bg-gradient-to-br from-blue to-violet font-bold text-white ${textClassName} ${className}`}>
      {SITE.initials}
    </span>
  );
}

/** "Hi, I'm …" line. */
export function Greeting({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  return (
    <motion.p {...fadeUp(delay)} className={`text-[15px] text-text/80 ${className}`}>
      Hi, I’m <span className="font-semibold text-text">{SITE.fullName}</span> — {SITE.role.toLowerCase()}.
    </motion.p>
  );
}
