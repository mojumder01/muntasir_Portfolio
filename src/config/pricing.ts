// =============================================================
// pricing.ts
// Loads pricing tiers and the "Negotiation" option from
// src/content/pricing.json. An empty price shows "Request a quote".
// =============================================================

import pricingJson from '../content/pricing.json';
import type { NegotiationSettings, PricingTier } from '../types/content';
import { onlyOn } from '../lib/visibility';

/** Raw tier: the admin may save an empty price as null, "" or leave it out (same for switches that are off). */
type RawTier = Omit<PricingTier, 'startingPriceUsd' | 'isFeatured'> & { startingPriceUsd?: number | string | null; isFeatured?: boolean; status?: string };
type RawNegotiation = Omit<NegotiationSettings, 'isEnabled' | 'highlights'> & { isEnabled?: boolean; highlights?: string[] };

// The JSON's own shape changes with admin edits, so it isn't used as the type (checked by scripts/validate-content.mjs)
const pricing = pricingJson as unknown as { tiers: RawTier[]; negotiation: RawNegotiation };

/** Turns any "empty" price into null so the card shows "Request a quote". */
function normalizePrice(price: RawTier['startingPriceUsd']): number | null {
  if (price === null || price === undefined || price === '') return null;
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) && numericPrice >= 0 ? numericPrice : null;
}

// Tiers switched off in the admin are left out
export const PRICING_TIERS: PricingTier[] = onlyOn(pricing.tiers).map(({ status: _status, ...tier }) => ({
  ...tier,
  startingPriceUsd: normalizePrice(tier.startingPriceUsd),
  isFeatured: tier.isFeatured ?? false,
}));

export const NEGOTIATION: NegotiationSettings = {
  ...pricing.negotiation,
  isEnabled: pricing.negotiation.isEnabled ?? false,
  highlights: pricing.negotiation.highlights ?? [],
};
