// =============================================================
// PricingSection.tsx
// Pricing tiers + the "Negotiation" option (client makes an offer).
// Content: src/content/pricing.json. Tier buttons open the inquiry
// form with the plan filled in; "Make an Offer" opens the offer form.
// Online checkout can be added later via a secure backend / payment
// provider — never put payment keys in this frontend code.
// =============================================================

/* ---------- 1. Imports ---------- */
import { Check, HandCoins } from 'lucide-react';
import { useState } from 'react';
import { NEGOTIATION, PRICING_TIERS } from '../../config/pricing';
import { useInquiry } from '../../context/inquiry-context';
import type { PricingTier } from '../../types/content';
import { OfferModal, packageLabelForTier } from '../pricing/OfferModal';
import { Button } from '../ui/Button';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/* ---------- 2. Helpers ---------- */

/** "Starting at $49" when a price is set, otherwise "Request a quote". */
function PriceLabel({ tier }: { tier: PricingTier }) {
  if (tier.startingPriceUsd === null) {
    return <p className="mt-6 text-3xl font-semibold tracking-tight">Request a quote</p>;
  }
  return (
    <p className="mt-6">
      <span className="block text-[13px] text-muted">Starting at</span>
      <span className="text-4xl font-semibold tracking-tight">${tier.startingPriceUsd.toLocaleString('en-US')}</span>
    </p>
  );
}

/** Green-tick list used on every card. */
function DeliverableList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-6 text-[14px]">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ---------- 3. Tier card ---------- */
function PricingCard({ tier, onMakeOffer }: { tier: PricingTier; onMakeOffer: () => void }) {
  const { startInquiry } = useInquiry();
  const cardBorder = tier.isFeatured ? 'border-violet/50 bg-gradient-to-b from-violet/[0.10] to-surface' : 'border-line bg-surface';

  return (
    <article className={`relative flex h-full flex-col rounded-2xl border p-6 ${cardBorder}`}>
      {tier.isFeatured && (
        <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-blue to-violet px-3 py-1 text-[12px] font-semibold text-white">Most popular</span>
      )}
      <h3 className="text-xl font-semibold tracking-tight">{tier.name}</h3>
      <p className="mt-1 text-[15px] text-muted">{tier.tagline}</p>
      <PriceLabel tier={tier} />
      <p className="mt-4 text-[14px] leading-relaxed text-text/80">{tier.scope}</p>
      <DeliverableList items={tier.deliverables} />

      <div className="mt-auto flex flex-col gap-1 pt-8">
        <Button variant={tier.isFeatured ? 'primary' : 'secondary'} onClick={() => startInquiry({ plan: tier.name })} className="w-full">
          {tier.ctaLabel}
        </Button>
        {NEGOTIATION.isEnabled && (
          <button type="button" onClick={onMakeOffer} className="min-h-11 text-[14px] font-medium text-muted underline-offset-4 hover:text-text hover:underline">
            or make an offer
          </button>
        )}
      </div>
    </article>
  );
}

/* ---------- 4. Negotiation card ---------- */
function NegotiationCard({ onMakeOffer }: { onMakeOffer: () => void }) {
  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-dashed border-line-strong bg-surface p-6">
      <span className="grid size-11 place-items-center rounded-xl bg-fg/[0.06] text-blue-text">
        <HandCoins size={22} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-xl font-semibold tracking-tight">{NEGOTIATION.title}</h3>
      <p className="mt-1 text-[15px] text-muted">{NEGOTIATION.tagline}</p>
      <p className="mt-6 text-3xl font-semibold tracking-tight">Your price</p>
      <p className="mt-4 text-[14px] leading-relaxed text-text/80">{NEGOTIATION.description}</p>
      {NEGOTIATION.highlights.length > 0 && <DeliverableList items={NEGOTIATION.highlights} />}
      <div className="mt-auto pt-8">
        <Button variant="secondary" onClick={onMakeOffer} className="w-full">
          {NEGOTIATION.ctaLabel}
        </Button>
      </div>
    </article>
  );
}

/* ---------- 5. Section ---------- */
export function PricingSection() {
  // null = offer form closed; '' = open with nothing preselected
  const [offerPackage, setOfferPackage] = useState<string | null>(null);
  const cardCount = PRICING_TIERS.length + (NEGOTIATION.isEnabled ? 1 : 0);
  const desktopColumns = cardCount >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
  // Every tier and the offer card switched off → hide the whole section
  if (cardCount === 0) return null;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-24 sm:py-28">
      <div className="page-container">
        <SectionHeading
          headingId="pricing-title"
          eyebrow="Pricing"
          title="Simple packages, honest quotes"
          description="Every project is scoped first, so the final price matches exactly what you need. Have your own budget? Make an offer — I reply to every one."
          isCentered
        />
        <RevealGroup className={`mt-16 grid gap-6 md:grid-cols-2 ${desktopColumns}`}>
          {PRICING_TIERS.map((tier) => (
            <RevealItem key={tier.id} className="h-full">
              <PricingCard tier={tier} onMakeOffer={() => setOfferPackage(packageLabelForTier(tier.name))} />
            </RevealItem>
          ))}
          {NEGOTIATION.isEnabled && (
            <RevealItem className="h-full">
              <NegotiationCard onMakeOffer={() => setOfferPackage('')} />
            </RevealItem>
          )}
        </RevealGroup>
      </div>

      <OfferModal isOpen={offerPackage !== null} initialPackage={offerPackage ?? ''} onClose={() => setOfferPackage(null)} />
    </section>
  );
}
