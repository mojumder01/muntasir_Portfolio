// =============================================================
// pricing.ts
// Loads pricing tiers and the "Negotiation" option from
// src/content/pricing.json. An empty price shows "Request a quote".
// =============================================================

import pricingJson from '../content/pricing.json';
import type { NegotiationSettings, PricingTier } from '../types/content';

/** Raw tier: the admin may save an empty price as null, "" or leave it out. */
type RawTier = Omit<PricingTier, 'startingPriceUsd'> & { startingPriceUsd?: number | string | null };

/** Turns any "empty" price into null so the card shows "Request a quote". */
function normalizePrice(price: RawTier['startingPriceUsd']): number | null {
  if (price === null || price === undefined || price === '') return null;
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) && numericPrice >= 0 ? numericPrice : null;
}

export const PRICING_TIERS: PricingTier[] = (pricingJson.tiers as RawTier[]).map((tier) => ({
  ...tier,
  startingPriceUsd: normalizePrice(tier.startingPriceUsd),
}));

export const NEGOTIATION: NegotiationSettings = pricingJson.negotiation;
