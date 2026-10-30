// =============================================================
// TrustSection.tsx
// Shows real testimonials when config/testimonials.ts has any.
// Until then, shows honest "how we'll work together" promises
// plus a link to public work on GitHub — never invented reviews.
// =============================================================

import { ArrowUpRight, Clock, FileText, MessagesSquare, Quote, ShieldCheck, Sparkles } from 'lucide-react';
import { PROMISES, SOCIAL_LINKS } from '../../config/site-config';
import { TESTIMONIALS } from '../../config/testimonials';
import { toSafeExternalUrl } from '../../lib/contact-channels';
import { GithubIcon } from '../ui/BrandIcons';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/* ---------- 1. Content ---------- */
// Text and on/off live in the admin (Site settings → Promises); icons follow each promise's place in that list
const PROMISE_ICONS = [MessagesSquare, FileText, ShieldCheck, Clock];
const FALLBACK_ICON = Sparkles;

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
      {PROMISES.map(({ title, description, position }) => {
        const PromiseIcon = PROMISE_ICONS[position] ?? FALLBACK_ICON;
        return (
          <RevealItem key={title + position} className="h-full">
            <div className="h-full rounded-2xl border border-line bg-surface p-6">
              <PromiseIcon size={22} className="text-cyan-text" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>
            </div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

/* ---------- 4. Section ---------- */
export function TrustSection() {
  const hasTestimonials = TESTIMONIALS.length > 0;
  const githubUrl = toSafeExternalUrl(SOCIAL_LINKS.github);
  // Nothing to show when every review and promise is switched off and there is no GitHub link
  if (!hasTestimonials && PROMISES.length === 0 && !githubUrl) return null;

  return (
    <section aria-labelledby="trust-title" className="py-24 sm:py-28">
      <div className="page-container">
        <SectionHeading
          headingId="trust-title"
          eyebrow={hasTestimonials ? 'Client feedback' : 'Working together'}
          title={hasTestimonials ? 'What clients say' : 'What you can expect from me'}
          description={hasTestimonials ? undefined : 'Every project runs on the same simple rules — so you always know where things stand.'}
        />

        {hasTestimonials ? <TestimonialList /> : PROMISES.length > 0 && <CollaborationPromises />}

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
