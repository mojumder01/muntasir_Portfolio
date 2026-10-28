// =============================================================
// TrustSection.tsx
// Shows real testimonials when config/testimonials.ts has any.
// Until then, shows honest "how we'll work together" promises
// plus a link to public work on GitHub — never invented reviews.
// =============================================================

import { ArrowUpRight, Clock, FileText, MessagesSquare, Quote, ShieldCheck } from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/site-config';
import { TESTIMONIALS } from '../../config/testimonials';
import { toSafeExternalUrl } from '../../lib/contact-channels';
import { GithubIcon } from '../ui/BrandIcons';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/* ---------- 1. Content ---------- */
const COLLABORATION_PROMISES = [
  { title: 'Clear communication', description: 'Replies in plain language, regular progress updates and no disappearing mid-project.', icon: MessagesSquare },
  { title: 'Defined deliverables', description: 'You get a written list of exactly what will be delivered before any work starts.', icon: FileText },
  { title: 'Transparent scoping', description: 'Price and timeline are agreed upfront. Changes are discussed before they cost you anything.', icon: ShieldCheck },
  { title: 'Reliable delivery', description: 'Realistic deadlines, tested work and a handover guide so you can use it with confidence.', icon: Clock },
];

/* ---------- 2. Real testimonials (only rendered when present) ---------- */
function TestimonialList() {
  return (
    <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2">
      {TESTIMONIALS.map((testimonial) => {
        const sourceUrl = testimonial.sourceUrl ? toSafeExternalUrl(testimonial.sourceUrl) : '';
        return (
          <RevealItem key={testimonial.clientName + testimonial.quote}>
            <figure className="h-full rounded-2xl border border-line bg-surface p-6">
              <Quote size={22} className="text-violet-text" aria-hidden="true" />
              <blockquote className="mt-4 text-[17px] leading-relaxed">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-5 text-[14px] text-muted">
                <span className="font-semibold text-text">{testimonial.clientName}</span> · {testimonial.clientRole}
                {sourceUrl && (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 underline underline-offset-4">
                    View source
                  </a>
                )}
              </figcaption>
            </figure>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

/* ---------- 3. Collaboration promises (default) ---------- */
function CollaborationPromises() {
  return (
    <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {COLLABORATION_PROMISES.map(({ title, description, icon: PromiseIcon }) => (
        <RevealItem key={title} className="h-full">
          <div className="h-full rounded-2xl border border-line bg-surface p-6">
            <PromiseIcon size={22} className="text-cyan-text" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/* ---------- 4. Section ---------- */
export function TrustSection() {
  const hasTestimonials = TESTIMONIALS.length > 0;
  const githubUrl = toSafeExternalUrl(SOCIAL_LINKS.github);

  return (
    <section aria-labelledby="trust-title" className="py-24 sm:py-28">
      <div className="page-container">
        <SectionHeading
          headingId="trust-title"
          eyebrow={hasTestimonials ? 'Client feedback' : 'Working together'}
          title={hasTestimonials ? 'What clients say' : 'What you can expect from me'}
          description={hasTestimonials ? undefined : 'Every project runs on the same simple rules — so you always know where things stand.'}
        />

        {hasTestimonials ? <TestimonialList /> : <CollaborationPromises />}

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong sm:p-6"
          >
            <span className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-fg/[0.06]">
                <GithubIcon size={22} />
              </span>
              <span>
                <span className="block font-semibold">See my code on GitHub</span>
                <span className="block text-[14px] text-muted">Public repositories, demos and tools I’ve built</span>
              </span>
            </span>
            <ArrowUpRight size={20} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  );
}
