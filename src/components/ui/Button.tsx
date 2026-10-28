// =============================================================
// Button.tsx
// The two button styles used across the site, as a <button>
// (actions) or an <a> link (navigation). Same look for both.
// =============================================================

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

/* ---------- 1. Styles ---------- */
type ButtonVariant = 'primary' | 'secondary';

const BASE_CLASSES =
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold ' +
  'transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Gradient button with a soft glow — the main call to action
  primary:
    // Glow color follows the theme (blue in dark mode, soft grey in black & white mode)
    'bg-gradient-to-r from-blue to-violet text-white shadow-[0_8px_30px_-8px_var(--color-button-glow)] ' +
    'hover:shadow-[0_10px_40px_-6px_var(--color-button-glow)] hover:brightness-110',
  // Quiet outlined button for secondary actions
  secondary: 'border border-line-strong bg-fg/[0.03] text-text hover:border-fg/30 hover:bg-fg/[0.07]',
};

function buttonClasses(variant: ButtonVariant, extraClasses = ''): string {
  return `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${extraClasses}`;
}

/* ---------- 2. Components ---------- */
interface SharedProps {
  variant?: ButtonVariant;
  children: ReactNode;
}

/** A real <button> for actions (submit, open, select). */
export function Button({ variant = 'primary', className, children, ...buttonProps }: SharedProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={buttonClasses(variant, className)} {...buttonProps}>
      {children}
    </button>
  );
}

/** An <a> styled as a button, for navigation. External links open safely in a new tab. */
export function ButtonLink({
  variant = 'primary',
  className,
  children,
  isExternal = false,
  ...linkProps
}: SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & { isExternal?: boolean }) {
  // noopener/noreferrer: the new tab can't control or read this page
  const externalProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a className={buttonClasses(variant, className)} {...externalProps} {...linkProps}>
      {children}
    </a>
  );
}
