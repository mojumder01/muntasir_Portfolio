// =============================================================
// DeliveryStatusMessage.tsx
// Honest status text under a form's submit button, plus fallback
// buttons (Email / WhatsApp / Copy) when something didn't work.
// Shared by the inquiry form and the price-offer form.
// =============================================================

import { CircleAlert, Copy } from 'lucide-react';
import type { ContactMethodId } from '../../config/inquiry-options';
import type { DeliveryStatus, SendMode } from '../../hooks/use-message-delivery';
import { Button } from '../ui/Button';

interface DeliveryStatusMessageProps {
  status: DeliveryStatus;
  sendMode: SendMode;
  availableChannels: ContactMethodId[];
  onHandOff: (channel: ContactMethodId) => void;
  onCopy: () => void;
}

const CHANNEL_LABELS: Record<ContactMethodId, string> = { email: 'Email', whatsapp: 'WhatsApp' };

export function DeliveryStatusMessage({ status, sendMode, availableChannels, onHandOff, onCopy }: DeliveryStatusMessageProps) {
  // Other ways to send, offered whenever the first attempt may not have worked
  const fallbackButtons = (
    <span className="mt-3 flex flex-wrap gap-2">
      {availableChannels.map((channel) => (
        <Button key={channel} variant="secondary" onClick={() => onHandOff(channel)}>
          Send via {CHANNEL_LABELS[channel]}
        </Button>
      ))}
      <Button variant="secondary" onClick={onCopy}>
        <Copy size={16} aria-hidden="true" /> Copy message
      </Button>
    </span>
  );

  if (status.kind === 'handed-off') {
    const appName = status.channel === 'email' ? 'email app' : 'WhatsApp';
    return (
      <div role="status" className="text-[14px] text-muted">
        Your {appName} should now be open with the message ready — <strong className="text-text">press Send there</strong> to deliver it. Nothing opened?
        {fallbackButtons}
      </div>
    );
  }

  if (status.kind === 'send-failed') {
    return (
      <div role="alert" className="flex gap-2.5 text-[14px] text-text/90">
        <CircleAlert size={18} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
        <div>
          Couldn’t send right now — please check your connection and try again{availableChannels.length > 0 ? ', or use one of these:' : ', or copy the message:'}
          {fallbackButtons}
        </div>
      </div>
    );
  }

  if (status.kind === 'copied') {
    return (
      <p role="status" className="text-[14px] text-success">
        Copied! Paste it into a message to me through one of my profile links.
      </p>
    );
  }

  if (status.kind === 'copy-failed') {
    return (
      <p role="alert" className="text-[14px] text-muted">
        Your browser blocked copying. Please select your text and copy it manually.
      </p>
    );
  }

  if (sendMode === 'unavailable') {
    return <p className="text-[14px] text-muted">Direct messaging is being set up. Copy your message and send it to me through one of my profile links.</p>;
  }

  return null;
}
