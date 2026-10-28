// =============================================================
// services.ts
// Loads services from src/content/services.json and attaches the
// icon for each one. Allowed icon names: src/config/content-rules.json.
// =============================================================

import {
  Bot,
  ChartColumnBig,
  Code2,
  Database,
  Eraser,
  Globe,
  Mail,
  MonitorSmartphone,
  PanelsTopLeft,
  ShoppingBag,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import servicesJson from '../content/services.json';
import type { AccentColor, Service } from '../types/content';

/* ---------- 1. Icon names usable in services.json ---------- */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  website: MonitorSmartphone,
  'landing-page': PanelsTopLeft,
  chart: ChartColumnBig,
  automation: Zap,
  cleaning: Eraser,
  ai: Sparkles,
  code: Code2,
  shopping: ShoppingBag,
  database: Database,
  bot: Bot,
  mail: Mail,
  globe: Globe,
};
const FALLBACK_ICON = Sparkles; // used if an unknown icon name slips through

/* ---------- 2. Services ---------- */
export const SERVICES: Service[] = servicesJson.map((service) => ({
  ...service,
  icon: SERVICE_ICONS[service.icon] ?? FALLBACK_ICON,
  accent: service.accent as AccentColor, // checked by scripts/validate-content.mjs
}));

/** Find a service by id. Returns undefined for unknown ids instead of crashing. */
export function findServiceById(serviceId: string): Service | undefined {
  return SERVICES.find((service) => service.id === serviceId);
}
