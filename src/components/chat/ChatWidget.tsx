// =============================================================
// ChatWidget.tsx
// Floating chat button (bottom-right). Opens a small panel with
// links to Messenger, WhatsApp and Telegram. Only apps that are set
// in Site settings → Floating chat button are shown; with none set,
// the whole button stays hidden.
// Keyboard: Escape closes; clicking outside closes.
// =============================================================

/* ---------- 1. Imports ---------- */
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Mail, MessageCircle, X } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { CHAT, CONTACT } from '../../config/site-config';
import { getChatLinks, type ChatLink } from '../../lib/contact-channels';
import { MessengerIcon, TelegramIcon, WhatsappIcon } from '../ui/BrandIcons';

/* ---------- 2. Brand look for each app ---------- */
const CHAT_APP_STYLES: Record<ChatLink['id'], { icon: ComponentType<{ size?: number }>; circleClass: string; hint: string }> = {
  messenger: { icon: MessengerIcon, circleClass: 'bg-gradient-to-br from-[#0a7cff] to-[#a033ff]', hint: 'Opens Facebook Messenger' },
  whatsapp: { icon: WhatsappIcon, circleClass: 'bg-[#25d366]', hint: 'Opens WhatsApp' },
  telegram: { icon: TelegramIcon, circleClass: 'bg-[#229ed9]', hint: 'Opens Telegram' },
  // The address itself as hint: still usable on devices without an email app
  email: { icon: Mail, circleClass: 'bg-gradient-to-br from-blue to-violet', hint: CONTACT.email },
};

const PANEL_ID = 'chat-panel';

/* ---------- 3. Component ---------- */
export function ChatWidget() {
  const chatLinks = getChatLinks();
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // While open: Escape closes (focus back on the button), clicking outside closes
  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      toggleButtonRef.current?.focus();
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) setIsOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [isOpen]);

  // Nothing configured → no button at all (no empty or broken links)
  if (chatLinks.length === 0) return null;

  return (
    <div ref={widgetRef} className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={PANEL_ID}
            role="dialog"
            aria-label={CHAT.title}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-[min(320px,calc(100vw-32px))] origin-bottom-right rounded-2xl border border-line-strong bg-surface p-4 shadow-2xl shadow-black/25"
          >
            <p className="font-semibold">{CHAT.title}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">{CHAT.greeting}</p>

            <ul className="mt-4 flex flex-col gap-2">
              {chatLinks.map((chatLink) => {
                const { icon: AppIcon, circleClass, hint } = CHAT_APP_STYLES[chatLink.id];
                // Web links open in a new tab; mailto: opens the email app (a new tab would stay blank)
                const newTabProps = chatLink.url.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {};
                return (
                  <li key={chatLink.id}>
                    <a
                      href={chatLink.url}
                      {...newTabProps}
                      onClick={() => setIsOpen(false)}
                      className="group flex min-h-14 items-center gap-3 rounded-xl border border-line px-3 py-2 transition-colors hover:border-line-strong hover:bg-fg/[0.04]"
                    >
                      <span className={`grid size-10 shrink-0 place-items-center rounded-full text-white ${circleClass}`}>
                        <AppIcon size={20} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-[15px] font-semibold">{chatLink.label}</span>
                        <span className="block text-[12px] break-all text-muted">{hint}</span>
                      </span>
                      <ArrowUpRight size={17} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The round floating button */}
      <motion.button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        aria-label={isOpen ? 'Close chat options' : 'Open chat options'}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="grid size-14 place-items-center rounded-full bg-text text-ink shadow-xl shadow-black/30"
      >
        {isOpen ? <X size={24} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
      </motion.button>
    </div>
  );
}
