// =============================================================
// InquiryForm.tsx
// The project inquiry form ("estimator") in the Contact section.
// Delivery (Formspree / Email / WhatsApp / copy) is handled by
// hooks/use-message-delivery.ts — it never fakes a "sent" message.
// =============================================================

/* ---------- 1. Imports ---------- */
import { CheckCircle2, Copy, LoaderCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BUDGET_OPTIONS, FIELD_LIMITS, TIMELINE_OPTIONS, type ContactMethodId } from '../../config/inquiry-options';
import { SERVICES } from '../../config/services';
import { SITE } from '../../config/site-config';
import { useInquiry } from '../../context/inquiry-context';
import { useMessageDelivery } from '../../hooks/use-message-delivery';
import { buildInquiryMessage, validateInquiry, type InquiryData, type InquiryErrors } from '../../lib/inquiry';
import { Button } from '../ui/Button';
import { DeliveryStatusMessage } from './DeliveryStatusMessage';
import { ChoiceChips, TextAreaField, TextField } from './FormFields';
import { HoneypotField } from './HoneypotField';
import { NextStepPanel } from './NextStepPanel';

/* ---------- 2. Settings ---------- */
const SERVICE_OPTIONS = SERVICES.map((service) => ({ value: service.id, label: service.shortTitle }));
const toOptions = (labels: readonly string[]) => labels.map((label) => ({ value: label, label }));

// Which element to focus for each field when validation fails (in form order)
const FIELD_FOCUS_SELECTORS: Array<[keyof InquiryData, string]> = [
  ['serviceId', 'input[name="service"]'],
  ['details', '#inquiry-details'],
  ['budget', 'input[name="budget"]'],
  ['timeline', 'input[name="timeline"]'],
  ['name', '#inquiry-name'],
  ['email', '#inquiry-email'],
  ['company', '#inquiry-company'],
];

function createEmptyInquiry(defaultMethod: ContactMethodId): InquiryData {
  return { serviceId: '', details: '', budget: '', timeline: '', name: '', email: '', company: '', contactMethod: defaultMethod, plan: '', honeypot: '' };
}

/* ---------- 3. Component ---------- */
export function InquiryForm() {
  const { prefill } = useInquiry();
  const formRef = useRef<HTMLFormElement>(null);
  const delivery = useMessageDelivery();

  const [inquiry, setInquiry] = useState<InquiryData>(() => createEmptyInquiry(delivery.availableMethods[0]?.id ?? 'email'));
  const [errors, setErrors] = useState<InquiryErrors>({});

  // Apply the service/plan picked from a CTA anywhere on the page
  const { resetStatus } = delivery;
  useEffect(() => {
    if (prefill.requestId === 0) return;
    setInquiry((current) => ({ ...current, serviceId: prefill.serviceId || current.serviceId, plan: prefill.plan }));
    setErrors((current) => ({ ...current, serviceId: undefined }));
    resetStatus();
  }, [prefill, resetStatus]);

  /** Update one field and clear its error as soon as the visitor fixes it. */
  const updateField = <FieldName extends keyof InquiryData>(fieldName: FieldName, value: InquiryData[FieldName]) => {
    setInquiry((current) => ({ ...current, [fieldName]: value }));
    if (errors[fieldName]) setErrors((current) => ({ ...current, [fieldName]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const foundErrors = validateInquiry(inquiry);
    setErrors(foundErrors);

    // Move keyboard focus to the first field with a problem
    const firstInvalid = FIELD_FOCUS_SELECTORS.find(([fieldName]) => foundErrors[fieldName]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(firstInvalid[1])?.focus();
      return;
    }
    void delivery.deliver(buildInquiryMessage(inquiry), inquiry.contactMethod);
  };

  /** Fresh form for a new inquiry (so the sent one isn't resubmitted by accident); keeps the contact details. */
  const startAnotherInquiry = () => {
    setInquiry((current) => ({ ...createEmptyInquiry(current.contactMethod), name: current.name, email: current.email, company: current.company }));
    setErrors({});
    delivery.resetStatus();
  };

  /* ---------- Success screen (only after a confirmed send) ---------- */
  if (delivery.status.kind === 'sent') {
    return (
      <div role="status" className="rounded-2xl border border-success/30 bg-success/[0.06] p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto text-success" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold">Inquiry sent — thank you!</h3>
        <p className="mt-2 text-muted">
          I’ll reply to {inquiry.email} {SITE.responseTime}.
        </p>
        <Button variant="secondary" className="mt-6" onClick={startAnotherInquiry}>
          Send another inquiry
        </Button>
      </div>
    );
  }

  const isSending = delivery.status.kind === 'sending';
  const isCopyMode = delivery.sendMode === 'unavailable';

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-8 rounded-2xl border border-line bg-surface p-5 sm:p-8">
        {/* Step 1 — service */}
        <ChoiceChips name="service" legend="1. What do you need?" options={SERVICE_OPTIONS} selectedValue={inquiry.serviceId} onSelect={(value) => updateField('serviceId', value)} error={errors.serviceId} />

        {/* Step 2 — project details */}
        <div className="flex flex-col gap-6">
          <TextAreaField
            id="inquiry-details"
            label="2. Tell me about the project"
            placeholder="What should it do, who is it for, and what does “done” look like?"
            value={inquiry.details}
            maxLength={FIELD_LIMITS.detailsMax}
            onChange={(event) => updateField('details', event.target.value)}
            error={errors.details}
            footer={<span className="mt-1.5 shrink-0 font-mono text-[12px] text-muted">{inquiry.details.length}/{FIELD_LIMITS.detailsMax}</span>}
          />
          <ChoiceChips name="budget" legend="Budget range" options={toOptions(BUDGET_OPTIONS)} selectedValue={inquiry.budget} onSelect={(value) => updateField('budget', value)} error={errors.budget} />
          <ChoiceChips name="timeline" legend="Expected timeline" options={toOptions(TIMELINE_OPTIONS)} selectedValue={inquiry.timeline} onSelect={(value) => updateField('timeline', value)} error={errors.timeline} />
        </div>

        {/* Step 3 — contact details */}
        <div className="flex flex-col gap-5">
          <p className="text-[14px] font-medium">3. Your details</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="inquiry-name" label="Name" autoComplete="name" maxLength={FIELD_LIMITS.nameMax} value={inquiry.name} onChange={(event) => updateField('name', event.target.value)} error={errors.name} />
            <TextField id="inquiry-email" label="Email" type="email" autoComplete="email" inputMode="email" maxLength={FIELD_LIMITS.emailMax} value={inquiry.email} onChange={(event) => updateField('email', event.target.value)} error={errors.email} />
          </div>
          <TextField id="inquiry-company" label="Company or business" hint="(optional)" autoComplete="organization" maxLength={FIELD_LIMITS.companyMax} value={inquiry.company} onChange={(event) => updateField('company', event.target.value)} error={errors.company} />

          {/* How to send: only when there's more than one way and no direct sending */}
          {delivery.sendMode === 'handoff' && delivery.availableMethods.length > 1 && (
            <ChoiceChips
              name="contactMethod"
              legend="Preferred contact method"
              options={delivery.availableMethods.map((method) => ({ value: method.id, label: method.label }))}
              selectedValue={inquiry.contactMethod}
              onSelect={(value) => {
                updateField('contactMethod', value as ContactMethodId);
                delivery.resetStatus(); // an earlier "WhatsApp/email app should now be open" no longer matches
              }}
            />
          )}
        </div>

        <HoneypotField id="inquiry-website" value={inquiry.honeypot} onChange={(value) => updateField('honeypot', value)} />

        {/* Submit + honest status messages */}
        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={isSending} className="w-full sm:w-auto sm:self-start">
            {isSending ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : isCopyMode ? <Copy size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
            {isSending ? 'Sending…' : isCopyMode ? 'Copy Project Inquiry' : 'Send Project Inquiry'}
          </Button>
          <DeliveryStatusMessage
            status={delivery.status}
            sendMode={delivery.sendMode}
            availableChannels={delivery.availableMethods.map((method) => method.id)}
            onHandOff={(channel) => delivery.handOff(buildInquiryMessage(inquiry), channel)}
            onCopy={() => void delivery.copyMessage(buildInquiryMessage(inquiry))}
          />
        </div>
      </form>

      <div className="lg:sticky lg:top-28">
        <NextStepPanel serviceId={inquiry.serviceId} budget={inquiry.budget} timeline={inquiry.timeline} plan={inquiry.plan} />
      </div>
    </div>
  );
}
