// =============================================================
// testimonials.ts
// Loads REAL client feedback from src/content/testimonials.json.
// While the list is empty, the site shows "What you can expect"
// instead of reviews — never invented testimonials.
// =============================================================

import testimonialsJson from '../content/testimonials.json';
import type { Testimonial } from '../types/content';

type RawTestimonial = Omit<Testimonial, 'sourceUrl'> & { sourceUrl?: string };

export const TESTIMONIALS: Testimonial[] = (testimonialsJson as RawTestimonial[]).map((testimonial) => ({
  ...testimonial,
  sourceUrl: testimonial.sourceUrl ?? '',
}));
