// =============================================================
// validate-content.mjs
// Checks every file in src/content/ and explains problems in plain
// words, e.g. "pricing.json → tiers → #2 (Professional) → startingPriceUsd:
// should be a number like 49, or empty".
//
// Run:    npm run check-content
// Also runs automatically on every `npm run dev` and `npm run build`,
// so a broken JSON file can never reach the live site.
// =============================================================

/* ---------- 1. Imports & settings ---------- */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = join(PROJECT_ROOT, 'src', 'content');
const RULES = JSON.parse(readFileSync(join(PROJECT_ROOT, 'src', 'config', 'content-rules.json'), 'utf8'));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_PATTERN = /^\d{8,15}$/;
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/; // e.g. "sales-kpi-dashboard"
const MAX_PRICE = 1_000_000;
const GOOGLE_SCRIPT_URL_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
const MESSENGER_USERNAME_PATTERN = /^@?[A-Za-z0-9.]{3,50}$/;
const TELEGRAM_USERNAME_PATTERN = /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/;

/* ---------- 2. Small checking helpers ---------- */

/** Collects problems with a readable location like "site.json → contact → email". */
function createChecker(fileName) {
  const problems = [];
  const at = (path) => [fileName, ...path].join(' → ');
  const add = (path, message) => problems.push(`${at(path)}: ${message}`);

  return {
    problems,
    add,
    text(value, path, { isRequired = true } = {}) {
      if (typeof value !== 'string') return add(path, 'should be text in "double quotes"');
      if (isRequired && value.trim() === '') add(path, 'is empty — please write something');
    },
    bool(value, path) {
      // Missing = false: the admin leaves out switches that are off
      if (value !== undefined && typeof value !== 'boolean') add(path, 'should be true or false (no quotes)');
    },
    textList(value, path, { minItems = 1 } = {}) {
      if (value === undefined && minItems === 0) return; // optional list the admin left out because it's empty
      if (!Array.isArray(value)) return add(path, 'should be a list like ["one", "two"]');
      if (value.length < minItems) add(path, `needs at least ${minItems} item(s)`);
      value.forEach((item, index) => {
        if (typeof item !== 'string' || item.trim() === '') add([...path, `#${index + 1}`], 'should be non-empty text');
      });
    },
    oneOf(value, allowed, path) {
      if (!allowed.includes(value)) add(path, `"${value}" is not allowed. Use one of: ${allowed.join(', ')}`);
    },
    httpsUrl(value, path) {
      if (value === undefined || value === null || value === '') return; // optional
      if (typeof value !== 'string' || !/^https:\/\/\S+\.\S+/.test(value)) add(path, 'should be a full link starting with https://, or empty');
    },
  };
}

/** Reads and parses one JSON file, turning syntax errors into a helpful hint. */
function readJson(fileName, problems) {
  const filePath = join(CONTENT_DIR, fileName);
  if (!existsSync(filePath)) {
    problems.push(`${fileName}: file is missing from src/content/`);
    return undefined;
  }
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    problems.push(
      `${fileName}: is not valid JSON (${error.message}). Common causes: a missing or extra comma, ` +
        'single quotes instead of "double quotes", or a // comment (JSON does not allow comments).',
    );
    return undefined;
  }
}

/** Label for list items so errors say "#2 (Professional)" instead of just "#2". */
function itemLabel(item, index) {
  const name = item && typeof item === 'object' ? item.name || item.title || item.id || item.clientName : '';
  return name ? `#${index + 1} (${name})` : `#${index + 1}`;
}

/** Flags duplicate ids inside a list. */
function checkUniqueIds(list, fileName, problems) {
  const seenIds = new Set();
  list.forEach((item, index) => {
    if (!item || typeof item.id !== 'string') return;
    if (seenIds.has(item.id)) problems.push(`${fileName} → ${itemLabel(item, index)} → id: "${item.id}" is used twice — every id must be unique`);
    seenIds.add(item.id);
  });
}

/* ---------- 3. One checker per file ---------- */

function checkSite(site, problems) {
  const check = createChecker('site.json');
  const identity = site.identity ?? {};
  ['brandName', 'fullName', 'initials', 'role', 'location', 'availabilityText', 'responseTime'].forEach((key) => check.text(identity[key], ['identity', key]));
  check.bool(identity.isAvailable, ['identity', 'isAvailable']);
  check.text(identity.photoUrl ?? '', ['identity', 'photoUrl'], { isRequired: false });

  const contact = site.contact ?? {};
  if (contact.email && !EMAIL_PATTERN.test(contact.email)) check.add(['contact', 'email'], 'is not a valid email address (or leave it empty to hide)');
  if (contact.whatsappNumber && !WHATSAPP_PATTERN.test(String(contact.whatsappNumber))) {
    check.add(['contact', 'whatsappNumber'], 'use digits only with country code, no + or spaces, e.g. 8801712345678');
  }

  Object.entries(site.social ?? {}).forEach(([key, url]) => check.httpsUrl(url, ['social', key]));

  const about = site.about ?? {};
  check.text(about.heading, ['about', 'heading']);
  check.textList(about.paragraphs, ['about', 'paragraphs']);
  check.textList(about.workingPrinciples, ['about', 'workingPrinciples'], { minItems: 0 });

  const chat = site.chat ?? {};
  check.bool(chat.isEnabled, ['chat', 'isEnabled']);
  check.bool(chat.showWhatsapp, ['chat', 'showWhatsapp']);
  ['title', 'greeting'].forEach((key) => check.text(chat[key], ['chat', key]));
  if (chat.messengerUsername && !MESSENGER_USERNAME_PATTERN.test(chat.messengerUsername)) {
    check.add(['chat', 'messengerUsername'], 'write only the username from your Facebook link, e.g. "muntasir.digital" from facebook.com/muntasir.digital');
  }
  if (chat.telegramUsername && !TELEGRAM_USERNAME_PATTERN.test(chat.telegramUsername)) {
    check.add(['chat', 'telegramUsername'], 'write your Telegram username without spaces, e.g. "muntasir_dev" (5–32 letters, numbers or _)');
  }

  const sheetUrl = String(site.integrations?.googleSheetWebAppUrl ?? '').trim();
  if (sheetUrl && !GOOGLE_SCRIPT_URL_PATTERN.test(sheetUrl)) {
    const isSpreadsheetLink = sheetUrl.includes('docs.google.com/spreadsheets');
    check.add(
      ['integrations', 'googleSheetWebAppUrl'],
      (isSpreadsheetLink ? 'this is the link of the sheet itself, which cannot receive messages. In the sheet open Extensions → Apps Script → Deploy and copy the "Web app" URL instead — ' : 'paste the Apps Script "Web app" URL — ') +
        'it starts with https://script.google.com/macros/s/ and ends with /exec (README section 3b)',
    );
  }

  if (!Array.isArray(site.skillGroups)) check.add(['skillGroups'], 'should be a list of groups');
  else site.skillGroups.forEach((group, index) => {
    check.text(group?.title, ['skillGroups', itemLabel(group, index), 'title']);
    check.textList(group?.skills, ['skillGroups', itemLabel(group, index), 'skills']);
  });
  problems.push(...check.problems);
}

function checkServices(services, problems) {
  const check = createChecker('services.json');
  if (!Array.isArray(services) || services.length === 0) return problems.push('services.json: should be a list with at least one service');

  services.forEach((service, index) => {
    const path = [itemLabel(service, index)];
    if (typeof service.id !== 'string' || !ID_PATTERN.test(service.id)) check.add([...path, 'id'], 'use lowercase letters, numbers and dashes, e.g. "excel-dashboard"');
    ['title', 'shortTitle', 'description', 'ctaLabel', 'nextStepTip'].forEach((key) => check.text(service[key], [...path, key]));
    check.textList(service.deliverables, [...path, 'deliverables']);
    check.oneOf(service.icon, RULES.icons, [...path, 'icon']);
    check.oneOf(service.accent, RULES.accents, [...path, 'accent']);
  });
  problems.push(...check.problems);
  checkUniqueIds(services, 'services.json', problems);
}

function checkProjects(projects, serviceIds, problems) {
  const check = createChecker('projects.json');
  if (!Array.isArray(projects)) return problems.push('projects.json: should be a list of projects ([] when empty)');

  projects.forEach((project, index) => {
    const path = [itemLabel(project, index)];
    if (typeof project.id !== 'string' || !ID_PATTERN.test(project.id)) check.add([...path, 'id'], 'use lowercase letters, numbers and dashes, e.g. "sales-dashboard"');
    ['title', 'summary'].forEach((key) => check.text(project[key], [...path, key]));
    if (!serviceIds.includes(project.serviceId)) check.add([...path, 'serviceId'], `"${project.serviceId}" doesn't match any service id. Use one of: ${serviceIds.join(', ')}`);
    check.textList(project.tools, [...path, 'tools']);
    check.oneOf(project.mockup, RULES.mockups, [...path, 'mockup']);
    check.bool(project.isSample, [...path, 'isSample']);
    check.httpsUrl(project.liveUrl, [...path, 'liveUrl']);
    check.httpsUrl(project.sourceUrl, [...path, 'sourceUrl']);

    (project.images ?? []).forEach((image, imageIndex) => {
      const imagePath = [...path, 'images', `#${imageIndex + 1}`];
      check.text(image?.src, [...imagePath, 'src']);
      check.text(image?.alt, [...imagePath, 'alt (short description for screen readers)']);
    });

    const caseStudy = project.caseStudy ?? {};
    ['overview', 'problem', 'solution'].forEach((key) => check.text(caseStudy[key], [...path, 'caseStudy', key]));
    check.textList(caseStudy.process, [...path, 'caseStudy', 'process']);
    check.text(caseStudy.outcome ?? '', [...path, 'caseStudy', 'outcome'], { isRequired: false });
  });
  problems.push(...check.problems);
  checkUniqueIds(projects, 'projects.json', problems);
}

function checkPricing(pricing, problems) {
  const check = createChecker('pricing.json');
  if (!Array.isArray(pricing.tiers) || pricing.tiers.length === 0) check.add(['tiers'], 'needs at least one pricing tier');

  (pricing.tiers ?? []).forEach((tier, index) => {
    const path = ['tiers', itemLabel(tier, index)];
    ['id', 'name', 'tagline', 'scope', 'ctaLabel'].forEach((key) => check.text(tier[key], [...path, key]));
    check.textList(tier.deliverables, [...path, 'deliverables']);
    check.bool(tier.isFeatured, [...path, 'isFeatured']);
    const price = tier.startingPriceUsd;
    const isEmptyPrice = price === null || price === undefined || price === '';
    if (!isEmptyPrice && (typeof price !== 'number' || price < 0 || price > MAX_PRICE)) {
      check.add([...path, 'startingPriceUsd'], 'should be a number like 49 (no $ sign, no quotes), or empty for "Request a quote"');
    }
  });

  const negotiation = pricing.negotiation;
  if (!negotiation) check.add(['negotiation'], 'is missing');
  else {
    check.bool(negotiation.isEnabled, ['negotiation', 'isEnabled']);
    ['title', 'tagline', 'description', 'ctaLabel', 'privacyNote'].forEach((key) => check.text(negotiation[key], ['negotiation', key]));
    check.textList(negotiation.highlights, ['negotiation', 'highlights'], { minItems: 0 });
    check.textList(negotiation.currencies, ['negotiation', 'currencies']);
  }
  problems.push(...check.problems);
  if (Array.isArray(pricing.tiers)) checkUniqueIds(pricing.tiers, 'pricing.json → tiers', problems);
}

function checkTestimonials(testimonials, problems) {
  const check = createChecker('testimonials.json');
  if (!Array.isArray(testimonials)) return problems.push('testimonials.json: should be a list ([] when you have none yet)');
  testimonials.forEach((testimonial, index) => {
    const path = [itemLabel(testimonial, index)];
    ['quote', 'clientName', 'clientRole'].forEach((key) => check.text(testimonial[key], [...path, key]));
    check.httpsUrl(testimonial.sourceUrl, [...path, 'sourceUrl']);
  });
  problems.push(...check.problems);
}

function checkFormOptions(formOptions, problems) {
  const check = createChecker('form-options.json');
  check.textList(formOptions.budgets, ['budgets']);
  check.textList(formOptions.timelines, ['timelines']);
  problems.push(...check.problems);
}

/* ---------- 4. Main: check everything ---------- */

/** Returns a list of readable problems. An empty list means all content is valid. */
export function validateContent() {
  const problems = [];
  const site = readJson('site.json', problems);
  const services = readJson('services.json', problems);
  const projects = readJson('projects.json', problems);
  const pricing = readJson('pricing.json', problems);
  const testimonials = readJson('testimonials.json', problems);
  const formOptions = readJson('form-options.json', problems);

  if (site) checkSite(site, problems);
  if (services) checkServices(services, problems);
  if (projects) checkProjects(projects, Array.isArray(services) ? services.map((service) => service.id) : [], problems);
  if (pricing) checkPricing(pricing, problems);
  if (testimonials) checkTestimonials(testimonials, problems);
  if (formOptions) checkFormOptions(formOptions, problems);
  return problems;
}

/** Human-friendly report used by the CLI and the build. */
export function formatProblems(problems) {
  return [`\n❌ Found ${problems.length} problem(s) in src/content/:\n`, ...problems.map((problem) => `  • ${problem}`), '\nFix these and save — see src/content/README.md for help.\n'].join('\n');
}

/* ---------- 5. Run directly: node scripts/validate-content.mjs ---------- */
const isRunDirectly = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isRunDirectly) {
  const problems = validateContent();
  if (problems.length === 0) {
    console.log('✅ All content files look good.');
  } else {
    console.error(formatProblems(problems));
    process.exitCode = 1;
  }
}
