// =============================================================
// visibility.ts
// On/Off switches from the admin. Every section and list item has
// a "status" of "on" or "off"; a missing status counts as "on", so
// older content and newly added items always show.
// =============================================================

export type Status = 'on' | 'off';

/** True unless the admin switched this item off. */
export function isOn(item: { status?: string | null } | null | undefined): boolean {
  return item?.status !== 'off';
}

/** Keeps only the items that are switched on. */
export function onlyOn<T extends { status?: string | null }>(items: T[]): T[] {
  return items.filter(isOn);
}
