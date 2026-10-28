// =============================================================
// ProcessSection.tsx
// The four-step way of working, shown as numbered cards joined
// by a line that "draws" itself on scroll.
// =============================================================

import { motion } from 'motion/react';
import { Compass, Hammer, ListChecks, PackageCheck } from 'lucide-react';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/* ---------- 1. Content ---------- */
const PROCESS_STEPS = [
  { number: '01', title: 'Discover', description: 'Understand the business, project requirements and desired outcomes.', icon: Compass },
  { number: '02', title: 'Plan', description: 'Define scope, deliverables, tools and timeline — in writing.', icon: ListChecks },
  { number: '03', title: 'Build', description: 'Develop, test and refine the solution, with regular updates.', icon: Hammer },
  { number: '04', title: 'Deliver', description: 'Hand over the finished work, instructions and agreed support.', icon: PackageCheck },
];

/* ---------- 2. Section ---------- */
export function ProcessSection() {
  return (
    <section id="process" aria-labelledby="process-title" className="py-24 sm:py-28">
      <div className="page-container">
        <SectionHeading
          headingId="process-title"
          eyebrow="Process"
          title="A simple, transparent way of working"
          description="No surprises: you know what is being built, when it arrives and what happens after delivery."
          isCentered
        />

        <div className="relative mt-16">
          {/* Connecting line behind the cards (desktop) that grows on scroll */}
          <motion.div
            aria-hidden="true"
            className="absolute top-7 right-[12%] left-[12%] hidden h-px origin-left bg-gradient-to-r from-blue via-violet to-cyan lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map(({ number, title, description, icon: StepIcon }) => (
              <RevealItem key={number}>
                <div className="relative flex h-full flex-col items-start rounded-2xl border border-line bg-surface p-6 lg:items-center lg:text-center">
                  <span className="relative grid size-14 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-blue-text">
                    <StepIcon size={22} />
                  </span>
                  <p className="mt-5 font-mono text-sm text-muted">{number}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
