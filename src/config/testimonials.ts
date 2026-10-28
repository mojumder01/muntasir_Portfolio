// =============================================================
// testimonials.ts
// Loads REAL client feedback from src/content/testimonials.json.
// While the list is empty, the site shows "What you can expect"
// instead of reviews — never invented testimonials.
// =============================================================

import testimonialsJson from '../content/testimonials.json';
import type { Testimonial } from '../types/content';

type RawTestimonial = Omit<Testimonial, 'sourceUrl'> & { sourceUrl?: string };

// The JSON's own shape changes with admin edits, so it isn't used as the type (checked by scripts/validate-content.mjs)
export const TESTIMONIALS: Testimonial[] = (testimonialsJson as unknown as RawTestimonial[]).map((testimonial) => ({
  ...testimonial,
  sourceUrl: testimonial.sourceUrl ?? '',
}));
