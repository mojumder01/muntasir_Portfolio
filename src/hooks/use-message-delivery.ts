// =============================================================
// use-message-delivery.ts
// Shared "how do we deliver this message?" logic for the inquiry
// form and the price-offer form. In order of preference:
//   1. direct     → Google Sheet and/or Formspree configured: saved/sent
//                   automatically (to every configured destination)
//   2. handoff    → opens the visitor's email app / WhatsApp, message ready
//   3. unavailable→ nothing configured: the visitor copies the message
// It never reports "sent" unless a destination confirmed it.
// =============================================================

import { useCallback, useState } from 'react';
import { CONTACT_METHODS, type ContactMethodId } from '../config/inquiry-options';
import { buildMailtoUrl, buildWhatsappUrl, getFormspreeId, getGoogleSheetUrl, hasEmail, hasWhatsapp } from '../lib/contact-channels';
import { sendToFormspree, type SendResult } from '../lib/send-to-formspree';
import { sendToGoogleSheet } from '../lib/send-to-google-sheet';

/* ---------- 1. Types ---------- */
export type SendMode = 'direct' | 'handoff' | 'unavailable';

export type DeliveryStatus =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'handed-off'; channel: ContactMethodId }
  | { kind: 'send-failed' }
  | { kind: 'copied' }
  | { kind: 'copy-failed' };

export interface OutgoingMessage {
  kind: 'inquiry' | 'offer'; // decides the Google Sheet tab
  subject: string;
  body: string; // readable text for email / WhatsApp / copy
  fields: Record<string, string>; // the same data as separate columns for Google Sheet
  replyTo: string;
  honeypot: string;
}

/** Sends to every automatic destination that is configured. True if at least one confirmed. */
async function sendToAutomaticDestinations(message: OutgoingMessage): Promise<boolean> {
  const sendJobs: Array<Promise<SendResult>> = [];
  if (getGoogleSheetUrl()) sendJobs.push(sendToGoogleSheet({ kind: message.kind, fields: message.fields, honeypot: message.honeypot }));
  if (getFormspreeId()) sendJobs.push(sendToFormspree({ subject: message.subject, replyTo: message.replyTo, message: message.body, honeypot: message.honeypot }));

  const results = await Promise.all(sendJobs);
  return results.some((result) => result.isSent);
}

/* ---------- 2. Hook ---------- */
export function useMessageDelivery() {
  const availableMethods = CONTACT_METHODS.filter((method) => (method.id === 'email' ? hasEmail() : hasWhatsapp()));
  const hasAutomaticDestination = Boolean(getGoogleSheetUrl() || getFormspreeId());
  const sendMode: SendMode = hasAutomaticDestination ? 'direct' : availableMethods.length > 0 ? 'handoff' : 'unavailable';
  const [status, setStatus] = useState<DeliveryStatus>({ kind: 'idle' });

  /** Copies the message text so the visitor can paste it anywhere. */
  const copyMessage = async (message: OutgoingMessage) => {
    try {
      await navigator.clipboard.writeText(message.body);
      setStatus({ kind: 'copied' });
    } catch (error) {
      console.error('[form] Clipboard not available', error);
      setStatus({ kind: 'copy-failed' });
    }
  };

  /** Opens WhatsApp (new tab) or the email app with the message ready to send. */
  const handOff = (message: OutgoingMessage, channel: ContactMethodId) => {
    if (channel === 'whatsapp') {
      window.open(buildWhatsappUrl(message.body), '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = buildMailtoUrl(message.subject, message.body);
    }
    setStatus({ kind: 'handed-off', channel });
  };

  /** Delivers a (already validated) message using the best available way. */
  const deliver = async (message: OutgoingMessage, preferredChannel: ContactMethodId) => {
    if (status.kind === 'sending') return; // block double submits
    if (sendMode === 'unavailable') return copyMessage(message);
    if (sendMode === 'handoff') return handOff(message, preferredChannel);

    setStatus({ kind: 'sending' });
    const isSent = await sendToAutomaticDestinations(message);
    setStatus(isSent ? { kind: 'sent' } : { kind: 'send-failed' });
  };

  // Stable function, so forms can safely use it inside effects
  const resetStatus = useCallback(() => setStatus({ kind: 'idle' }), []);

  return { sendMode, availableMethods, status, deliver, handOff, copyMessage, resetStatus };
}
