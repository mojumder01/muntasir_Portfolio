// =============================================================
// field-validators.ts
// Small, reusable checks for form fields (shared by both forms).
// =============================================================

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_CHARACTERS = /^\+?[\d\s()-]+$/; // digits, spaces, (), -, optional leading +
const PHONE_MIN_DIGITS = 7;
const PHONE_MAX_DIGITS = 15; // international maximum (E.164)
const PLAIN_AMOUNT_PATTERN = /^(\d+(\.\d*)?|\.\d+)$/; // "1500", "1500.50", ".5" — not "0x10" or "1e3"

/** True for a normal-looking email like name@company.com. */
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/** True for phone numbers like "+880 1712-345678" or "01712345678". */
export function isValidPhone(phone: string): boolean {
  const trimmedPhone = phone.trim();
  if (!PHONE_ALLOWED_CHARACTERS.test(trimmedPhone)) return false;
  const digitCount = trimmedPhone.replace(/\D/g, '').length;
  return digitCount >= PHONE_MIN_DIGITS && digitCount <= PHONE_MAX_DIGITS;
}

/** Parses a typed amount like "1,500" or "1500.50"; returns NaN when it isn't a number. */
export function parseAmount(rawAmount: string): number {
  const cleanedAmount = rawAmount.replace(/,/g, '').trim();
  // Number() alone would read "0x10" as 16 and "1e3" as 1000 — a different price than the visitor typed
  return PLAIN_AMOUNT_PATTERN.test(cleanedAmount) ? Number(cleanedAmount) : Number.NaN;
}
