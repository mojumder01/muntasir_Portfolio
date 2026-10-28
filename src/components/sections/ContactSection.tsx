// =============================================================
// ContactSection.tsx
// "Start a Project": heading, direct contact options and the
// inquiry form. Unconfigured contact options are hidden.
// =============================================================

import { Mail, MessageCircle } from 'lucide-react';
import { CONTACT } from '../../config/site-config';
import { getActiveSocialLinks, hasEmail, hasWhatsapp } from '../../lib/contact-channels';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { InquiryForm } from '../inquiry/InquiryForm';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/* ---------- 1. Direct contact chips ---------- */
function DirectContactLinks() {
  const socialLinks = getActiveSocialLinks().filter((link) => link.id === 'github' || link.id === 'linkedin');
  const linkClasses = 'inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-[14px] font-medium hover:bg-fg/5';

  return (
    <ul className="mt-8 flex flex-wrap gap-2">
      {hasEmail() && (
        <li>
          <a href={`mailto:${CONTACT.email}`} className={linkClasses}>
            <Mail size={17} aria-hidden="true" /> {CONTACT.email}
          </a>
        </li>
      )}
      {hasWhatsapp() && (
        <li>
          <a href={`https://wa.me/${CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={linkClasses}>
            <MessageCircle size={17} aria-hidden="true" /> WhatsApp
          </a>
        </li>
      )}
      {socialLinks.map((socialLink) => (
        <li key={socialLink.id}>
          <a href={socialLink.url} target="_blank" rel="noopener noreferrer" className={linkClasses}>
            {socialLink.id === 'github' ? <GithubIcon size={17} /> : <LinkedinIcon size={17} />} {socialLink.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ---------- 2. Section ---------- */
export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-24 sm:py-28">
      <div aria-hidden="true" className="glow-orb top-10 left-1/2 size-[420px] -translate-x-1/2 bg-violet/15" />
      <div className="page-container relative">
        <SectionHeading
          headingId="contact-title"
          eyebrow="Start a project"
          title={
            <>
              Let’s build something <span className="text-gradient">useful</span>
            </>
          }
          description="Answer a few quick questions. You’ll get a clear reply with next steps — and a custom quote once the scope is clear."
        />
        <Reveal>
          <DirectContactLinks />
        </Reveal>
        <Reveal className="mt-10">
          <InquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
