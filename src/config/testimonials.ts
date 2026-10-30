// =============================================================
// testimonials.ts
// Loads REAL client feedback from src/content/testimonials.json.
// While the list is empty, the site shows "What you can expect"
// instead of reviews — never invented testimonials.
// =============================================================

import testimonialsJson from '../content/testimonials.json';
import type { Testimonial } from '../types/content';
import { onlyOn } from '../lib/visibility';

type RawTestimonial = Omit<Testimonial, 'sourceUrl'> & { sourceUrl?: string; status?: string };

// The JSON's own shape changes with admin edits, so it isn't used as the type (checked by scripts/validate-content.mjs)
// Reviews switched off in the admin are left out
export const TESTIMONIALS: Testimonial[] = onlyOn(testimonialsJson as unknown as RawTestimonial[]).map(({ status: _status, ...testimonial }) => ({
  ...testimonial,
  sourceUrl: testimonial.sourceUrl ?? '',
}));
