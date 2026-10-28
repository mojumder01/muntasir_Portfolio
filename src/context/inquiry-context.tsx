// =============================================================
// inquiry-context.tsx
// Shares "which service / plan did the visitor pick" across the page,
// so any CTA (service card, pricing card, project) can open the
// inquiry form with that choice already filled in.
// =============================================================

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/* ---------- 1. Types ---------- */
interface InquiryPrefill {
  serviceId: string;
  plan: string;
  requestId: number; // changes on every CTA click, so the form re-applies the prefill
}

interface InquiryContextValue {
  prefill: InquiryPrefill;
  startInquiry: (options?: { serviceId?: string; plan?: string }) => void;
}

/* ---------- 2. Context ---------- */
const InquiryContext = createContext<InquiryContextValue | null>(null);

const CONTACT_SECTION_ID = 'contact';

/** Wrap the app with this so components can call startInquiry(). */
export function InquiryProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<InquiryPrefill>({ serviceId: '', plan: '', requestId: 0 });

  const startInquiry = useCallback((options: { serviceId?: string; plan?: string } = {}) => {
    setPrefill((previous) => ({
      serviceId: options.serviceId ?? previous.serviceId,
      plan: options.plan ?? '',
      requestId: previous.requestId + 1,
    }));
    // Bring the form into view; smooth unless the user prefers reduced motion
    document.getElementById(CONTACT_SECTION_ID)?.scrollIntoView({ block: 'start' });
  }, []);

  const contextValue = useMemo(() => ({ prefill, startInquiry }), [prefill, startInquiry]);

  return <InquiryContext.Provider value={contextValue}>{children}</InquiryContext.Provider>;
}

/** Read the inquiry context. Throws a clear developer error if the provider is missing. */
export function useInquiry(): InquiryContextValue {
  const contextValue = useContext(InquiryContext);
  if (!contextValue) throw new Error('useInquiry() must be used inside <InquiryProvider>.');
  return contextValue;
}
