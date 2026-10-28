// =============================================================
// inquiry.ts
// Everything about a project inquiry that is NOT UI:
// the data shape, validation and the message text.
// (Sending is handled by hooks/use-message-delivery.ts.)
// =============================================================

import { FIELD_LIMITS, type ContactMethodId } from '../config/inquiry-options';
import { findServiceById } from '../config/services';
import type { OutgoingMessage } from '../hooks/use-message-delivery';
import { isValidEmail } from './field-validators';

/* ---------- 1. Data shape ---------- */
export interface InquiryData {
  serviceId: string;
  details: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  contactMethod: ContactMethodId;
  plan: string; // pricing tier chosen from the Pricing section (optional)
  honeypot: string; // hidden field: real people leave it empty, spam bots fill it
}

export type InquiryErrors = Partial<Record<keyof InquiryData, string>>;

/* ---------- 2. Validation ---------- */

/** Checks every field and returns friendly, field-specific messages. Empty object = valid. */
export function validateInquiry(data: InquiryData): InquiryErrors {
  const errors: InquiryErrors = {};
  const detailsLength = data.details.trim().length;

  if (!findServiceById(data.serviceId)) errors.serviceId = 'Choose the service you need.';

  if (detailsLength < FIELD_LIMITS.detailsMin) {
    errors.details = `Add a little more detail (at least ${FIELD_LIMITS.detailsMin} characters).`;
  } else if (detailsLength > FIELD_LIMITS.detailsMax) {
    errors.details = `Please keep it under ${FIELD_LIMITS.detailsMax} characters.`;
  }

  if (!data.budget) errors.budget = 'Pick a budget range — “Not sure yet” is fine.';
  if (!data.timeline) errors.timeline = 'Pick a timeline.';

  const trimmedName = data.name.trim();
  if (trimmedName.length < 2) errors.name = 'Enter your name.';
  else if (trimmedName.length > FIELD_LIMITS.nameMax) errors.name = 'That name is too long.';

  if (!isValidEmail(data.email) || data.email.length > FIELD_LIMITS.emailMax) errors.email = 'Enter a valid email, e.g. name@company.com';
  if (data.company.length > FIELD_LIMITS.companyMax) errors.company = 'That name is too long.';

  return errors;
}

/* ---------- 3. Message ---------- */

/** Builds the subject + plain-text body used for Formspree, email, WhatsApp and copy. */
export function buildInquiryMessage(data: InquiryData): OutgoingMessage {
  const serviceTitle = findServiceById(data.serviceId)?.title ?? 'Not selected';

  // null = optional line that was left empty; '' = intentional blank separator line
  const lines: Array<string | null> = [
    `Hi, I'd like to discuss a project.`,
    '',
    `Service: ${serviceTitle}`,
    data.plan ? `Plan: ${data.plan}` : null,
    `Budget: ${data.budget}`,
    `Timeline: ${data.timeline}`,
    '',
    'Project details:',
    data.details.trim(),
    '',
    `Name: ${data.name.trim()}`,
    `Email: ${data.email.trim()}`,
    data.company.trim() ? `Company: ${data.company.trim()}` : null,
  ];

  return {
    kind: 'inquiry',
    subject: `Project inquiry: ${serviceTitle}`,
    body: lines.filter((line) => line !== null).join('\n'),
    // Column names must match google-apps-script/inquiry-to-sheet.gs
    fields: {
      service: serviceTitle,
      plan: data.plan,
      budget: data.budget,
      timeline: data.timeline,
      details: data.details.trim(),
      name: data.name.trim(),
      email: data.email.trim(),
      company: data.company.trim(),
    },
    replyTo: data.email.trim(),
    honeypot: data.honeypot,
  };
}
