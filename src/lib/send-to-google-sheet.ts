// =============================================================
// send-to-google-sheet.ts
// Saves an inquiry or offer as a new row in your Google Sheet,
// through the Apps Script web app in google-apps-script/.
// Never throws: always returns a result the UI can show.
// =============================================================

import { getGoogleSheetUrl } from './contact-channels';
import type { SendResult } from './send-to-formspree';

/* ---------- 1. Settings & types ---------- */
const SEND_TIMEOUT_MS = 15_000; // Apps Script can take a few seconds on a cold start

export interface SheetPayload {
  kind: 'inquiry' | 'offer'; // decides which tab the row goes to
  fields: Record<string, string>;
  honeypot: string;
}

/* ---------- 2. Send ---------- */
export async function sendToGoogleSheet(payload: SheetPayload): Promise<SendResult> {
  const webAppUrl = getGoogleSheetUrl();
  if (!webAppUrl) return { isSent: false, reason: 'not-configured' };

  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => abortController.abort(), SEND_TIMEOUT_MS);

  try {
    // text/plain body = a "simple" request, so the browser doesn't need a CORS pre-check
    // that Apps Script can't answer. The script reads it as JSON.
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    });
    const result: unknown = await response.json().catch(() => null);
    const isOk = typeof result === 'object' && result !== null && (result as { ok?: unknown }).ok === true;
    if (response.ok && isOk) return { isSent: true };

    console.error('[form] Google Sheet did not accept the message', response.status, result);
    return { isSent: false, reason: 'rejected' };
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    console.error('[form] Saving to Google Sheet failed', error);
    return { isSent: false, reason: isTimeout ? 'timeout' : 'network' };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
