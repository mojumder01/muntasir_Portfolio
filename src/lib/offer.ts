// =============================================================
// offer.ts
// The "Negotiation" price offer: data shape, validation and the
// message text. A client names the price they'd like to pay.
// =============================================================

import { FIELD_LIMITS, type ContactMethodId } from '../config/inquiry-options';
import type { OutgoingMessage } from '../hooks/use-message-delivery';
import { isValidEmail, isValidPhone, parseAmount } from './field-validators';

/* ---------- 1. Data shape ---------- */
export interface OfferData {
  name: string;
  phone: string;
  email: string;
  address: string;
  bidAmount: string; // kept as typed text; parsed when validating
  currency: string;
  packageName: string; // which package / service the offer is for
  note: string; // optional extra details
  contactMethod: ContactMethodId;
  honeypot: string; // hidden spam trap
}

export type OfferErrors = Partial<Record<keyof OfferData, string>>;

const NOTE_MAX_LENGTH = 1000;

/* ---------- 2. Validation ---------- */

/** Returns friendly, field-specific messages. Empty object = valid. */
export function validateOffer(data: OfferData): OfferErrors {
  const errors: OfferErrors = {};

  const trimmedName = data.name.trim();
  if (trimmedName.length < 2) errors.name = 'Enter your name.';
  else if (trimmedName.length > FIELD_LIMITS.nameMax) errors.name = 'That name is too long.';

  if (!isValidPhone(data.phone) || data.phone.length > FIELD_LIMITS.phoneMax) errors.phone = 'Enter a valid phone number, e.g. +880 1712 345678';
  if (!isValidEmail(data.email) || data.email.length > FIELD_LIMITS.emailMax) errors.email = 'Enter a valid email, e.g. name@company.com';

  const addressLength = data.address.trim().length;
  if (addressLength < FIELD_LIMITS.addressMin) errors.address = 'Enter your address (city and country at least).';
  else if (addressLength > FIELD_LIMITS.addressMax) errors.address = `Please keep it under ${FIELD_LIMITS.addressMax} characters.`;

  const bidAmount = parseAmount(data.bidAmount);
  if (!Number.isFinite(bidAmount) || bidAmount <= 0) errors.bidAmount = 'Enter your offer as a number, e.g. 150';
  else if (bidAmount > FIELD_LIMITS.maxBidAmount) errors.bidAmount = 'That amount looks too large — please check it.';

  if (!data.packageName) errors.packageName = 'Choose what your offer is for.';
  if (data.note.length > NOTE_MAX_LENGTH) errors.note = `Please keep it under ${NOTE_MAX_LENGTH} characters.`;

  return errors;
}

/* ---------- 3. Message ---------- */

/** Formats the amount with thousands separators, e.g. "1,500 BDT". */
function formatBid(data: OfferData): string {
  const amount = parseAmount(data.bidAmount);
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${data.currency}`;
}

/** Builds the subject + plain-text body used for Formspree, email, WhatsApp and copy. */
export function buildOfferMessage(data: OfferData): OutgoingMessage {
  const bidText = formatBid(data);
  const lines: Array<string | null> = [
    `Hi, I'd like to make a price offer.`,
    '',
    `For: ${data.packageName}`,
    `My offer: ${bidText}`,
    data.note.trim() ? `\nDetails:\n${data.note.trim()}` : null,
    '',
    `Name: ${data.name.trim()}`,
    `Phone: ${data.phone.trim()}`,
    `Email: ${data.email.trim()}`,
    `Address: ${data.address.trim()}`,
  ];

  return {
    kind: 'offer',
    subject: `Price offer: ${data.packageName} — ${bidText}`,
    body: lines.filter((line) => line !== null).join('\n'),
    // Column names must match google-apps-script/inquiry-to-sheet.gs
    fields: {
      offerFor: data.packageName,
      bidAmount: String(parseAmount(data.bidAmount)),
      currency: data.currency,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      address: data.address.trim(),
      note: data.note.trim(),
    },
    replyTo: data.email.trim(),
    honeypot: data.honeypot,
  };
}
