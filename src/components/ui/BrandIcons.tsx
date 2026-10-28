// =============================================================
// BrandIcons.tsx
// Brand icons (Lucide no longer ships brand logos): GitHub, LinkedIn,
// and the chat apps Messenger, WhatsApp, Telegram.
// Same stroke style as the Lucide icons used elsewhere.
// =============================================================

interface IconProps {
  size?: number;
  className?: string;
}

export function GithubIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function LinkedinIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

/* ---------- Chat app icons (filled, used on brand-colored circles) ---------- */

export function MessengerIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 2C6.5 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.2S17.5 2 12 2z" />
      <path fill="#0a7cff" d="m6.5 14.2 3.2-4.8 3 2.4 3.9-2.3-3.2 4.8-3-2.4z" />
    </svg>
  );
}

export function WhatsappIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M12 2.8a9.2 9.2 0 0 0-7.9 13.9L3 21l4.4-1.1A9.2 9.2 0 1 0 12 2.8z" />
      <path fill="currentColor" d="M8.6 7.6c.2-.5.5-.5.8-.5h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.2.2-.2.4 0 .7.7 1.2 1.7 2.1 2.9 2.7.3.1.5.1.6-.1l.7-.8c.2-.2.4-.3.6-.2l1.9.9c.2.1.4.2.4.4 0 .5-.1 1.2-.6 1.6-.5.5-1.3.8-2.2.7-1.4-.2-3.3-1-4.9-2.6S8 10.6 7.9 9.3c-.1-.8.3-1.4.7-1.7z" />
    </svg>
  );
}

export function TelegramIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M21.4 4.3 3 11.4c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.6-1.4zM8.7 14.1l9.5-6c.5-.3.9-.1.5.2l-8.1 7.3-.3 3.4z" />
    </svg>
  );
}
