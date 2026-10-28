// =============================================================
// Modal.tsx
// Reusable popup built on the native <dialog> element, which gives
// keyboard focus trapping and Escape-to-close for free.
// Used by the case study popup and the price-offer form.
// =============================================================

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string; // id of the heading inside, for screen readers
  children: ReactNode;
  maxWidthClass?: string;
}

export function Modal({ isOpen, onClose, titleId, children, maxWidthClass = 'w-[min(760px,calc(100%-24px))]' }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open/close the native dialog whenever isOpen changes
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;
    if (isOpen && !dialogElement.open) dialogElement.showModal();
    if (!isOpen && dialogElement.open) dialogElement.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Clicking the dark backdrop (outside the panel) closes the dialog
      onClick={(event) => event.target === dialogRef.current && onClose()}
      aria-labelledby={titleId}
      className={`m-auto max-h-[90dvh] overflow-y-auto rounded-2xl border border-line-strong bg-surface p-0 text-text shadow-2xl ${maxWidthClass}`}
    >
      {isOpen && children}
    </dialog>
  );
}

/** The round "×" button used in every modal header. */
export function ModalCloseButton({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <button type="button" onClick={onClose} aria-label={label} className="grid size-11 shrink-0 place-items-center rounded-xl border border-line-strong hover:bg-fg/5">
      <X size={20} aria-hidden="true" />
    </button>
  );
}
