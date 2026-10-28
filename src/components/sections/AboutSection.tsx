// =============================================================
// AboutSection.tsx
// Personal introduction: photo (or initials), bio, working
// principles, grouped skill badges and profile links.
// All text lives in config/site-config.ts.
// =============================================================

import { ArrowUpRight, Check, MapPin } from 'lucide-react';
import { ABOUT, SITE, SKILL_GROUPS } from '../../config/site-config';
import { getActiveSocialLinks } from '../../lib/contact-channels';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { Reveal } from '../ui/Reveal';

/* ---------- 1. Helpers ---------- */

/** Icon for a social link; plain arrow for sites without a brand icon. */
function SocialIcon({ socialId }: { socialId: string }) {
  if (socialId === 'github') return <GithubIcon size={18} />;
  if (socialId === 'linkedin') return <LinkedinIcon size={18} />;
  return <ArrowUpRight size={18} aria-hidden="true" />;
}

/* ---------- 2. Section ---------- */
export function AboutSection() {
  const socialLinks = getActiveSocialLinks();

  return (
    <section id="about" aria-labelledby="about-title" className="py-24 sm:py-28">
      <div className="page-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Left: profile card */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
            <div aria-hidden="true" className="glow-orb -top-20 -left-16 size-56 bg-blue/25" />
            <div className="relative">
              {SITE.photoUrl ? (
                <img src={SITE.photoUrl} alt={`Portrait of ${SITE.fullName}`} className="size-28 rounded-2xl border border-line-strong object-cover" />
              ) : (
                <span className="grid size-28 place-items-center rounded-2xl bg-gradient-to-br from-blue to-violet text-4xl font-bold text-white" aria-hidden="true">
                  {SITE.initials}
                </span>
              )}
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{SITE.fullName}</h3>
              <p className="mt-1 text-muted">{SITE.role}</p>
              <p className="mt-3 flex items-center gap-2 text-[14px] text-muted">
                <MapPin size={16} aria-hidden="true" /> {SITE.location}
              </p>

              {socialLinks.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {socialLinks.map((socialLink) => (
                    <li key={socialLink.id}>
                      <a
                        href={socialLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-[14px] font-medium hover:bg-fg/5"
                      >
                        <SocialIcon socialId={socialLink.id} /> {socialLink.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>

        {/* Right: story, principles, skills */}
        <div>
          <Reveal>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-blue-text">About</p>
            <h2 id="about-title" className="mt-4 text-[clamp(2rem,4.2vw,3.1rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
              {ABOUT.heading}
            </h2>
            {ABOUT.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-5 text-[17px] leading-relaxed text-muted text-pretty">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {ABOUT.workingPrinciples.map((principle) => (
                <li key={principle} className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-[15px]">
                  <Check size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                  {principle}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <h3 className="mt-12 text-lg font-semibold">Skills & tools</h3>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {SKILL_GROUPS.map((skillGroup) => (
                <div key={skillGroup.title}>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{skillGroup.title}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {skillGroup.skills.map((skill) => (
                      <li key={skill} className="rounded-lg border border-line-strong bg-fg/[0.03] px-3 py-1.5 text-[13px] text-text/90">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
