// =============================================================
// contact-channels.ts
// Checks which contact options are really configured, and builds
// safe links for them. Unconfigured options are simply hidden.
// =============================================================

import { CHAT, CONTACT, INTEGRATIONS, SOCIAL_LINKS } from '../config/site-config';

/* ---------- 1. Validation patterns ---------- */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_PATTERN = /^\d{8,15}$/; // international format, digits only
const FORMSPREE_ID_PATTERN = /^[a-zA-Z0-9]{6,16}$/;
const GOOGLE_SCRIPT_URL_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/; // Apps Script web app
const MESSENGER_USERNAME_PATTERN = /^[A-Za-z0-9.]{3,50}$/; // Facebook page/profile username
const TELEGRAM_USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{4,31}$/; // Telegram @username without the @

/* ---------- 2. Channel checks ---------- */

/** True when a real business email is set in site.json. */
export function hasEmail(): boolean {
  return EMAIL_PATTERN.test(CONTACT.email);
}

/** True when a valid WhatsApp number is set in site.json. */
export function hasWhatsapp(): boolean {
  return WHATSAPP_PATTERN.test(CONTACT.whatsappNumber);
}

/** Formspree form ID from the environment, or '' when not configured/invalid. */
export function getFormspreeId(): string {
  const formId = (import.meta.env.VITE_FORMSPREE_FORM_ID ?? '').trim();
  return FORMSPREE_ID_PATTERN.test(formId) ? formId : '';
}

/** Google Sheet (Apps Script) web app URL from site.json, or '' when not set/invalid. */
export function getGoogleSheetUrl(): string {
  const webAppUrl = INTEGRATIONS.googleSheetWebAppUrl.trim();
  return GOOGLE_SCRIPT_URL_PATTERN.test(webAppUrl) ? webAppUrl : '';
}

/** Chat links for the floating chat button — only the ones that are set and valid. */
export interface ChatLink {
  id: 'messenger' | 'whatsapp' | 'telegram' | 'email';
  label: string;
  url: string;
}

export function getChatLinks(): ChatLink[] {
  if (!CHAT.isEnabled) return [];
  const chatLinks: ChatLink[] = [];
  const messengerUsername = CHAT.messengerUsername.trim().replace(/^@/, '');
  const telegramUsername = CHAT.telegramUsername.trim().replace(/^@/, '');

  if (MESSENGER_USERNAME_PATTERN.test(messengerUsername)) {
    chatLinks.push({ id: 'messenger', label: 'Messenger', url: `https://m.me/${messengerUsername}` });
  }
  if (CHAT.showWhatsapp && hasWhatsapp()) {
    chatLinks.push({ id: 'whatsapp', label: 'WhatsApp', url: buildWhatsappUrl('Hi! I found you through your website.') });
  }
  if (TELEGRAM_USERNAME_PATTERN.test(telegramUsername)) {
    chatLinks.push({ id: 'telegram', label: 'Telegram', url: `https://t.me/${telegramUsername}` });
  }
  if (CHAT.showEmail && hasEmail()) {
    chatLinks.push({ id: 'email', label: 'Email', url: buildMailtoUrl('Hello from your website', '') });
  }
  return chatLinks;
}

/* ---------- 3. Safe link builders ---------- */

/** Only allow https links from config — blocks "javascript:" style links (XSS). */
export function toSafeExternalUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' ? parsedUrl.toString() : '';
  } catch {
    return ''; // empty or malformed → hidden
  }
}

/** mailto: link with subject and body safely encoded. */
export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** wa.me link that opens WhatsApp with the message prefilled. */
export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/* ---------- 4. Social links that are actually set ---------- */
export interface SocialLink {
  id: keyof typeof SOCIAL_LINKS;
  label: string;
  url: string;
}

const SOCIAL_LABELS: Record<keyof typeof SOCIAL_LINKS, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  fiverr: 'Fiverr',
  upwork: 'Upwork',
};

/** Returns only the social links that are filled in and valid. */
export function getActiveSocialLinks(): SocialLink[] {
  return (Object.keys(SOCIAL_LINKS) as Array<keyof typeof SOCIAL_LINKS>)
    .map((id) => ({ id, label: SOCIAL_LABELS[id], url: toSafeExternalUrl(SOCIAL_LINKS[id]) }))
    .filter((link) => link.url !== '');
}
