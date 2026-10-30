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
import { isOn } from '../lib/visibility';

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
type RawService = Omit<Service, 'icon' | 'accent'> & { icon: string; accent: string; status?: string };

/** Every service, including ones switched off — projects still need their names. */
const ALL_SERVICES: Service[] = (servicesJson as RawService[]).map(({ status: _status, ...service }) => ({
  ...service,
  icon: SERVICE_ICONS[service.icon] ?? FALLBACK_ICON,
  accent: service.accent as AccentColor, // checked by scripts/validate-content.mjs
}));

const SWITCHED_OFF_IDS = new Set((servicesJson as RawService[]).filter((service) => !isOn(service)).map((service) => service.id));

/** Services switched on in the admin: shown in the services section, filters and forms. */
export const SERVICES: Service[] = ALL_SERVICES.filter((service) => !SWITCHED_OFF_IDS.has(service.id));

/** Find a service by id (switched-off ones too). Returns undefined for unknown ids instead of crashing. */
export function findServiceById(serviceId: string): Service | undefined {
  return ALL_SERVICES.find((service) => service.id === serviceId);
}
