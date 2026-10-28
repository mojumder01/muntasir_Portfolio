// =============================================================
// inquiry-options.ts
// Choices and limits for the inquiry and offer forms.
// Budget and timeline choices come from src/content/form-options.json.
// =============================================================

import formOptionsJson from '../content/form-options.json';

export const BUDGET_OPTIONS: string[] = formOptionsJson.budgets;
export const TIMELINE_OPTIONS: string[] = formOptionsJson.timelines;

/** How the visitor wants to send their message. Only configured channels are shown. */
export const CONTACT_METHODS = [
  { id: 'email', label: 'Email' },
  { id: 'whatsapp', label: 'WhatsApp' },
] as const;

export type ContactMethodId = (typeof CONTACT_METHODS)[number]['id'];

/* ---------- Form limits (also protect against oversized input) ---------- */
export const FIELD_LIMITS = {
  nameMax: 80,
  emailMax: 120,
  companyMax: 120,
  phoneMax: 20,
  addressMin: 5,
  addressMax: 300,
  detailsMin: 20,
  detailsMax: 2000,
  maxBidAmount: 10_000_000,
} as const;
