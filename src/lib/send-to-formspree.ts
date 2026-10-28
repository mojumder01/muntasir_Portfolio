// =============================================================
// send-to-formspree.ts
// Sends any form message (inquiry or price offer) to Formspree.
// Never throws: always returns a result the UI can show.
// =============================================================

import { getFormspreeId } from './contact-channels';

/* ---------- 1. Settings & types ---------- */
const SEND_TIMEOUT_MS = 12_000; // give up on a slow network after 12 seconds

export interface FormspreePayload {
  subject: string;
  replyTo: string; // the visitor's email, so you can just press "Reply"
  message: string;
  honeypot: string; // hidden spam-trap field; Formspree drops messages where it's filled
}

export type SendResult = { isSent: true } | { isSent: false; reason: 'not-configured' | 'timeout' | 'network' | 'rejected' };

/* ---------- 2. Send ---------- */
export async function sendToFormspree(payload: FormspreePayload): Promise<SendResult> {
  const formId = getFormspreeId();
  if (!formId) return { isSent: false, reason: 'not-configured' };

  // Abort the request if the network hangs, so the button never spins forever
  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => abortController.abort(), SEND_TIMEOUT_MS);

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: payload.subject, _replyto: payload.replyTo, _gotcha: payload.honeypot, message: payload.message }),
      signal: abortController.signal,
    });
    if (response.ok) return { isSent: true };

    console.error('[form] Formspree rejected the request', response.status);
    return { isSent: false, reason: 'rejected' };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    console.error('[form] Sending failed', error);
    return { isSent: false, reason: isTimeout ? 'timeout' : 'network' };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
