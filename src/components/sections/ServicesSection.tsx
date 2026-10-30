// =============================================================
// ServicesSection.tsx
// Six service cards. Each CTA opens the inquiry form with that
// service already selected. Content lives in config/services.ts.
// =============================================================

import { ArrowRight, Check } from 'lucide-react';
import { SERVICES } from '../../config/services';
import { useInquiry } from '../../context/inquiry-context';
import { ACCENT_STYLES } from '../../lib/accent-styles';
import type { Service } from '../../types/content';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/* ---------- 1. One card ---------- */
function ServiceCard({ service }: { service: Service }) {
  const { startInquiry } = useInquiry();
  const accent = ACCENT_STYLES[service.accent];
  const ServiceIcon = service.icon;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 ${accent.hoverBorder}`}
    >
      {/* Soft glow that appears on hover */}
      <div aria-hidden="true" className={`pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${accent.glow}`} />

      <span className={`grid size-12 place-items-center rounded-xl ${accent.iconBox}`}>
        <ServiceIcon size={22} strokeWidth={1.8} />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">{service.title}</h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{service.description}</p>

      <ul className="mt-5 flex flex-col gap-2 text-[14px] text-text/85">
        {service.deliverables.map((deliverable) => (
          <li key={deliverable} className="flex gap-2.5">
            <Check size={16} className={`mt-0.5 shrink-0 ${accent.text}`} aria-hidden="true" />
            {deliverable}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => startInquiry({ serviceId: service.id })}
        className={`mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-[15px] font-semibold ${accent.text}`}
      >
        {service.ctaLabel}
        <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </button>
    </article>
  );
}

/* ---------- 2. Section ---------- */
export function ServicesSection() {
  if (SERVICES.length === 0) return null; // every service switched off

  return (
    <section id="services" aria-labelledby="services-title" className="py-24 sm:py-28">
      <div className="page-container">
        <SectionHeading
          headingId="services-title"
          eyebrow="Services"
          title={
            <>
              Everything you need to <span className="text-gradient">work smarter</span>
            </>
          }
          description="Websites that win trust, Excel systems that save hours, and automation that handles the repetitive work — all built around your real business goals."
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <RevealItem key={service.id} className="h-full">
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
