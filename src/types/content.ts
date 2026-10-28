// =============================================================
// content.ts
// Shared TypeScript types for the site content.
// The content itself lives in src/content/*.json (editable in the
// Pages CMS admin); src/config/*.ts turns it into these types.
// =============================================================

import type { LucideIcon } from 'lucide-react';

/* ---------- Services ---------- */

/** Service ids link services, projects and the inquiry form, e.g. "excel-dashboard". */
export type ServiceId = string;

/** One of the three accent color slots (greys in the black & white theme). */
export type AccentColor = 'blue' | 'violet' | 'cyan';

export interface Service {
  id: ServiceId;
  title: string;
  shortTitle: string; // used in filters and form choices
  description: string;
  deliverables: string[];
  ctaLabel: string;
  nextStepTip: string; // shown in the inquiry form after this service is picked
  icon: LucideIcon;
  accent: AccentColor;
}

/* ---------- Portfolio ---------- */

/** Which built-in illustration to draw for a project card (no image file needed). */
export type MockupKind = 'landing' | 'website' | 'dashboard' | 'automation' | 'cleaning' | 'ai';

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface CaseStudy {
  overview: string;
  problem: string;
  solution: string;
  process: string[];
  outcome: string; // '' = no verified result yet
}

export interface Project {
  id: string;
  title: string;
  serviceId: ServiceId;
  summary: string;
  tools: string[];
  mockup: MockupKind;
  isSample: boolean; // true = demo/sample work, clearly labeled on the site
  liveUrl: string;
  sourceUrl: string;
  images: ProjectImage[];
  caseStudy: CaseStudy;
}

/* ---------- Pricing ---------- */

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  startingPriceUsd: number | null; // null → shows "Request a quote"
  scope: string;
  deliverables: string[];
  ctaLabel: string;
  isFeatured: boolean;
}

export interface NegotiationSettings {
  isEnabled: boolean;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  currencies: string[];
  privacyNote: string;
}

/* ---------- Testimonials & skills ---------- */

export interface Testimonial {
  quote: string;
  clientName: string;
  clientRole: string;
  sourceUrl: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}
