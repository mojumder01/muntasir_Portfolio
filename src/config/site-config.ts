// =============================================================
// site-config.ts
// Loads YOUR details from src/content/site.json.
// Edit the JSON file (or use the Pages CMS admin) — not this file.
// Empty values ('') hide that item on the site (no broken links).
// =============================================================

import siteJson from '../content/site.json';
import type { SkillGroup } from '../types/content';
import { toPublicPath } from '../lib/public-path';

/* ---------- 1. Identity ---------- */
export const SITE = {
  ...siteJson.identity,
  photoUrl: toPublicPath(siteJson.identity.photoUrl),
};

/* ---------- 2. Contact ---------- */
export const CONTACT = {
  email: (siteJson.contact.email ?? '').trim(),
  whatsappNumber: String(siteJson.contact.whatsappNumber ?? '').trim(),
};

/* ---------- 3. Social / profile links ---------- */
export const SOCIAL_LINKS = siteJson.social;

/* ---------- 4. About text ---------- */
export const ABOUT = siteJson.about;

/* ---------- 5. Skills (grouped badges, no fake % meters) ---------- */
export const SKILL_GROUPS: SkillGroup[] = siteJson.skillGroups;

/* ---------- 6. Floating chat button (Messenger / WhatsApp / Telegram) ---------- */
export const CHAT = siteJson.chat;

/* ---------- 7. Integrations ---------- */
// Google Sheet: Apps Script web app URL (see google-apps-script/). Public by design — not a secret.
export const INTEGRATIONS = siteJson.integrations;
