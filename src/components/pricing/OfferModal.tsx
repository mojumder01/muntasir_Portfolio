// =============================================================
// OfferModal.tsx
// "Negotiation" popup: the client names the price they'd like to
// pay and leaves name, phone, email and address. Delivery uses the
// same honest logic as the inquiry form (never fakes "sent").
// =============================================================

/* ---------- 1. Imports ---------- */
import { CheckCircle2, Copy, LoaderCircle, Send } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { FIELD_LIMITS, type ContactMethodId } from '../../config/inquiry-options';
import { NEGOTIATION, PRICING_TIERS } from '../../config/pricing';
import { SERVICES } from '../../config/services';
import { SITE } from '../../config/site-config';
import { useMessageDelivery } from '../../hooks/use-message-delivery';
import { buildOfferMessage, validateOffer, type OfferData, type OfferErrors } from '../../lib/offer';
import { DeliveryStatusMessage } from '../inquiry/DeliveryStatusMessage';
import { ChoiceChips, SelectField, TextAreaField, TextField } from '../inquiry/FormFields';
import { HoneypotField } from '../inquiry/HoneypotField';
import { Button } from '../ui/Button';
import { Modal, ModalCloseButton } from '../ui/Modal';

/* ---------- 2. Settings ---------- */

// What the offer can be for: each pricing package, then each service
const PACKAGE_OPTIONS = [...PRICING_TIERS.map((tier) => packageLabelForTier(tier.name)), ...SERVICES.map((service) => service.title), 'Something else'];

// Which field to focus first when validation fails (in form order)
const FIELD_FOCUS_ORDER: Array<keyof OfferData> = ['name', 'phone', 'email', 'address', 'bidAmount', 'packageName', 'note'];
const FIELD_IDS: Partial<Record<keyof OfferData, string>> = {
  name: 'offer-name',
  phone: 'offer-phone',
  email: 'offer-email',
  address: 'offer-address',
  bidAmount: 'offer-amount',
  packageName: 'offer-package',
  note: 'offer-note',
};

function createEmptyOffer(packageName: string, defaultMethod: ContactMethodId): OfferData {
  return { name: '', phone: '', email: '', address: '', bidAmount: '', currency: NEGOTIATION.currencies[0] ?? 'USD', packageName, note: '', contactMethod: defaultMethod, honeypot: '' };
}

/* ---------- 3. The form (mounted fresh each time the popup opens) ---------- */
function OfferForm({ initialPackage, onClose }: { initialPackage: string; onClose: () => void }) {
  const delivery = useMessageDelivery();
  const formRef = useRef<HTMLFormElement>(null);
  const [offer, setOffer] = useState<OfferData>(() => createEmptyOffer(initialPackage, delivery.availableMethods[0]?.id ?? 'email'));
  const [errors, setErrors] = useState<OfferErrors>({});

  /** Update one field and clear its error as soon as it's fixed. */
  const updateField = <FieldName extends keyof OfferData>(fieldName: FieldName, value: OfferData[FieldName]) => {
    setOffer((current) => ({ ...current, [fieldName]: value }));
    if (errors[fieldName]) setErrors((current) => ({ ...current, [fieldName]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const foundErrors = validateOffer(offer);
    setErrors(foundErrors);

    const firstInvalidField = FIELD_FOCUS_ORDER.find((fieldName) => foundErrors[fieldName]);
    if (firstInvalidField) {
      formRef.current?.querySelector<HTMLElement>(`#${FIELD_IDS[firstInvalidField]}`)?.focus();
      return;
    }
    void delivery.deliver(buildOfferMessage(offer), offer.contactMethod);
  };

  /* ---------- Success (only after a confirmed send) ---------- */
  if (delivery.status.kind === 'sent') {
    return (
      <div role="status" className="py-6 text-center">
        <CheckCircle2 size={40} className="mx-auto text-success" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold">Offer sent — thank you!</h3>
        <p className="mt-2 text-muted">
          I’ll review it and reply to {offer.email} {SITE.responseTime}.
        </p>
        <Button variant="secondary" className="mt-6" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  const isSending = delivery.status.kind === 'sending';
  const isCopyMode = delivery.sendMode === 'unavailable';

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative mt-6 flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="offer-name" label="Name" autoComplete="name" maxLength={FIELD_LIMITS.nameMax} value={offer.name} onChange={(event) => updateField('name', event.target.value)} error={errors.name} />
        <TextField id="offer-phone" label="Phone number" type="tel" autoComplete="tel" inputMode="tel" placeholder="+880 1712 345678" maxLength={FIELD_LIMITS.phoneMax} value={offer.phone} onChange={(event) => updateField('phone', event.target.value)} error={errors.phone} />
      </div>
      <TextField id="offer-email" label="Email" type="email" autoComplete="email" inputMode="email" maxLength={FIELD_LIMITS.emailMax} value={offer.email} onChange={(event) => updateField('email', event.target.value)} error={errors.email} />
      <TextAreaField id="offer-address" label="Address" rows={2} autoComplete="street-address" placeholder="Street, city, country" maxLength={FIELD_LIMITS.addressMax} value={offer.address} onChange={(event) => updateField('address', event.target.value)} error={errors.address} className="min-h-20" />

      {/* The offer itself */}
      <div className="grid gap-5 rounded-xl border border-line-strong bg-fg/[0.02] p-4 sm:grid-cols-[1fr_auto] sm:p-5">
        <TextField id="offer-amount" label="Your price offer (bid)" inputMode="decimal" placeholder="e.g. 150" value={offer.bidAmount} onChange={(event) => updateField('bidAmount', event.target.value)} error={errors.bidAmount} />
        <SelectField id="offer-currency" label="Currency" options={NEGOTIATION.currencies} value={offer.currency} onChange={(event) => updateField('currency', event.target.value)} />
        <div className="sm:col-span-2">
          <SelectField id="offer-package" label="Offer for" placeholder="Choose a package or service…" options={PACKAGE_OPTIONS} value={offer.packageName} onChange={(event) => updateField('packageName', event.target.value)} error={errors.packageName} />
        </div>
      </div>

      <TextAreaField id="offer-note" label="Anything else? (optional)" rows={3} placeholder="Scope, deadline or questions" maxLength={1000} value={offer.note} onChange={(event) => updateField('note', event.target.value)} error={errors.note} className="min-h-24" />

      {delivery.sendMode === 'handoff' && delivery.availableMethods.length > 1 && (
        <ChoiceChips
          name="offerContactMethod"
          legend="Send my offer by"
          options={delivery.availableMethods.map((method) => ({ value: method.id, label: method.label }))}
          selectedValue={offer.contactMethod}
          onSelect={(value) => updateField('contactMethod', value as ContactMethodId)}
        />
      )}

      <HoneypotField id="offer-website" value={offer.honeypot} onChange={(value) => updateField('honeypot', value)} />

      <div className="flex flex-col gap-3 border-t border-line pt-5">
        <Button type="submit" disabled={isSending} className="w-full sm:w-auto sm:self-start">
          {isSending ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : isCopyMode ? <Copy size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
          {isSending ? 'Sending…' : isCopyMode ? 'Copy My Offer' : 'Send My Offer'}
        </Button>
        <DeliveryStatusMessage
          status={delivery.status}
          sendMode={delivery.sendMode}
          availableChannels={delivery.availableMethods.map((method) => method.id)}
          onHandOff={(channel) => delivery.handOff(buildOfferMessage(offer), channel)}
          onCopy={() => void delivery.copyMessage(buildOfferMessage(offer))}
        />
        <p className="text-[13px] text-muted">{NEGOTIATION.privacyNote}</p>
      </div>
    </form>
  );
}

/* ---------- 4. Popup wrapper ---------- */
interface OfferModalProps {
  isOpen: boolean;
  initialPackage: string; // preselected "Offer for" value ('' = none)
  onClose: () => void;
}

export function OfferModal({ isOpen, initialPackage, onClose }: OfferModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId="offer-title" maxWidthClass="w-[min(640px,calc(100%-24px))]">
      <div className="p-5 sm:p-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-blue-text">{NEGOTIATION.title}</p>
            <h2 id="offer-title" className="mt-2 text-2xl font-semibold tracking-tight">
              {NEGOTIATION.tagline}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{NEGOTIATION.description}</p>
          </div>
          <ModalCloseButton onClose={onClose} label="Close offer form" />
        </header>
        <OfferForm initialPackage={initialPackage} onClose={onClose} />
      </div>
    </Modal>
  );
}

/** Text used in the "Offer for" dropdown for a pricing tier. */
export function packageLabelForTier(tierName: string): string {
  return `${tierName} package`;
}
