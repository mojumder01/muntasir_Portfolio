// =============================================================
// site-config.ts
// Loads YOUR details from src/content/site.json.
// Edit the JSON file (or use the Pages CMS admin) — not this file.
// Empty values ('') hide that item on the site (no broken links).
// =============================================================

import siteJson from '../content/site.json';
import type { SkillGroup } from '../types/content';
import { toPublicPath } from '../lib/public-path';
import { isOn, onlyOn } from '../lib/visibility';
import contentRules from './content-rules.json';

/* ---------- 0. File shape ---------- */
type SocialId = 'github' | 'linkedin' | 'fiverr' | 'upwork';

/** Sections that can be switched on/off in the admin (Site settings → Layout). */
export type SectionKey = 'services' | 'portfolio' | 'process' | 'about' | 'trust' | 'pricing' | 'contact';
export type HeroStyle = 'classic' | 'simple' | 'modern' | 'premium' | 'unique';

interface RawListItem {
  title: string;
  description: string;
  status?: string;
}

/**
 * Raw site.json. The admin leaves out fields that are saved empty or switched off,
 * so those are optional here and filled in below — the rest of the code always gets
 * complete values. The content itself is checked by scripts/validate-content.mjs
 * before every build, so the JSON's own (changing) shape isn't used as the type.
 */
interface RawSite {
  identity: {
    brandName: string;
    fullName: string;
    initials: string;
    role: string;
    location: string;
    isAvailable?: boolean;
    availabilityText: string;
    photoUrl?: string | null;
    responseTime: string;
  };
  contact?: { email?: string | null; whatsappNumber?: string | number | null };
  social?: Partial<Record<SocialId, string | null>>;
  about: { heading: string; paragraphs: string[]; workingPrinciples?: string[] };
  layout?: { heroStyle?: string; sections?: Partial<Record<SectionKey, string>> };
  skillGroups: Array<SkillGroup & { status?: string }>;
  process?: { steps?: RawListItem[] };
  promises?: RawListItem[];
  chat: {
    isEnabled?: boolean;
    title: string;
    greeting: string;
    messengerUsername?: string | null;
    telegramUsername?: string | null;
    showWhatsapp?: boolean;
    showEmail?: boolean;
  };
  integrations?: { googleSheetWebAppUrl?: string | null };
}

const site = siteJson as unknown as RawSite;

/* ---------- 1. Identity ---------- */
export const SITE = {
  ...site.identity,
  isAvailable: site.identity.isAvailable ?? false,
  photoUrl: toPublicPath(site.identity.photoUrl),
};

/* ---------- 2. Contact ---------- */
export const CONTACT = {
  email: (site.contact?.email ?? '').trim(),
  whatsappNumber: String(site.contact?.whatsappNumber ?? '').trim(),
};

/* ---------- 3. Social / profile links ---------- */
export const SOCIAL_LINKS: Record<SocialId, string> = {
  github: site.social?.github ?? '',
  linkedin: site.social?.linkedin ?? '',
  fiverr: site.social?.fiverr ?? '',
  upwork: site.social?.upwork ?? '',
};

/* ---------- 4. About text ---------- */
export const ABOUT = { ...site.about, workingPrinciples: site.about.workingPrinciples ?? [] };

/* ---------- 5. Skills (grouped badges, no fake % meters) ---------- */
export const SKILL_GROUPS: SkillGroup[] = onlyOn(site.skillGroups).map(({ title, skills }) => ({ title, skills }));

/* ---------- 6. Floating chat button (Messenger / WhatsApp / Telegram / Email) ---------- */
export const CHAT = {
  ...site.chat,
  isEnabled: site.chat.isEnabled ?? false,
  messengerUsername: site.chat.messengerUsername ?? '',
  telegramUsername: site.chat.telegramUsername ?? '',
  showWhatsapp: site.chat.showWhatsapp ?? false,
  // On unless switched off: an admin page opened before this setting existed saves without it
  showEmail: site.chat.showEmail ?? true,
};

/* ---------- 7. Integrations ---------- */
// Google Sheet: Apps Script web app URL (see google-apps-script/). Public by design — not a secret.
export const INTEGRATIONS = { googleSheetWebAppUrl: site.integrations?.googleSheetWebAppUrl ?? '' };

/* ---------- 8. Layout: hero style and section on/off ---------- */
const HERO_STYLES = contentRules.heroStyles as HeroStyle[];
const heroStyle = site.layout?.heroStyle as HeroStyle | undefined;

export const LAYOUT = {
  // Unknown or missing style → the original "classic" hero
  heroStyle: heroStyle && HERO_STYLES.includes(heroStyle) ? heroStyle : 'classic',
  /** A section shows unless the admin switched it "off". */
  isSectionOn: (section: SectionKey) => site.layout?.sections?.[section] !== 'off',
};

/* ---------- 9. Process steps and "What you can expect" promises ---------- */
// Only titles and descriptions are editable. `position` is the item's place in the admin list,
// so each item keeps its own icon and number even when an earlier one is switched off.
function visibleListItems(items: RawListItem[] = []) {
  return items.map(({ title, description, status }, position) => ({ title, description, status, position })).filter(isOn);
}
export const PROCESS_STEPS = visibleListItems(site.process?.steps);
export const PROMISES = visibleListItems(site.promises);
