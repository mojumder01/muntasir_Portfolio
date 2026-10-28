// =============================================================
// Footer.tsx
// Brand line, quick links, profile links and copyright year.
// =============================================================

import { SITE } from '../../config/site-config';
import { getActiveSocialLinks } from '../../lib/contact-channels';

const FOOTER_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

export function Footer() {
  const socialLinks = getActiveSocialLinks();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-12">
      <div className="page-container flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="flex items-center gap-2.5 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-blue to-violet text-xs font-bold text-white">{SITE.initials}</span>
            {SITE.brandName}
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">Websites, landing pages, Excel dashboards, Excel automation, data cleaning and AI workflows.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="inline-flex min-h-11 items-center text-muted hover:text-text">
              {link.label}
            </a>
          ))}
          {socialLinks.map((socialLink) => (
            <a key={socialLink.id} href={socialLink.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-muted hover:text-text">
              {socialLink.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="page-container mt-8 text-[13px] text-muted">
        © {currentYear} {SITE.fullName}. All rights reserved.
      </p>
    </footer>
  );
}
