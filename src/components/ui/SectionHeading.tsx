// =============================================================
// SectionHeading.tsx
// Small label + big title + intro text at the top of each section.
// =============================================================

import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  isCentered?: boolean;
  headingId?: string; // lets the <section> point to this title with aria-labelledby
}

export function SectionHeading({ eyebrow, title, description, isCentered = false, headingId }: SectionHeadingProps) {
  const alignmentClasses = isCentered ? 'mx-auto text-center items-center' : 'items-start';

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignmentClasses}`}>
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-blue-text">{eyebrow}</p>
      <h2 id={headingId} className="text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
        {title}
      </h2>
      {description && <p className="text-[17px] leading-relaxed text-muted text-pretty">{description}</p>}
    </Reveal>
  );
}
