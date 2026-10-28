// =============================================================
// NextStepPanel.tsx
// The "estimator" side panel: updates live as the visitor picks a
// service, budget and timeline, and explains what happens next.
// It never promises an automatic price.
// =============================================================

import { Lightbulb } from 'lucide-react';
import { SITE } from '../../config/site-config';
import { findServiceById } from '../../config/services';

/* ---------- 1. Rules for the extra tips ---------- */
const RUSH_TIMELINE = 'Within 1 week';
const UNSURE_BUDGET = 'Not sure yet';

/** Builds the list of helpful tips from the current choices. */
function buildTips(serviceId: string, budget: string, timeline: string): string[] {
  const tips: string[] = [];
  const service = findServiceById(serviceId);

  if (service) tips.push(service.nextStepTip);
  if (budget === UNSURE_BUDGET) tips.push('Not sure about budget? I’ll suggest a few options at different price points.');
  if (timeline === RUSH_TIMELINE) tips.push('Short deadlines are possible for smaller scopes — mention your exact date in the details.');
  return tips;
}

/* ---------- 2. Component ---------- */
interface NextStepPanelProps {
  serviceId: string;
  budget: string;
  timeline: string;
  plan: string;
}

export function NextStepPanel({ serviceId, budget, timeline, plan }: NextStepPanelProps) {
  const service = findServiceById(serviceId);
  const tips = buildTips(serviceId, budget, timeline);

  return (
    <aside aria-live="polite" className="glass rounded-2xl p-6">
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-cyan-text">
        <Lightbulb size={15} aria-hidden="true" /> Your next step
      </p>

      {/* Summary of the choices so far */}
      <dl className="mt-5 grid gap-3 text-[14px]">
        {[
          { term: 'Service', value: service?.title ?? 'Not chosen yet' },
          { term: 'Plan', value: plan || '—' },
          { term: 'Budget', value: budget || 'Not chosen yet' },
          { term: 'Timeline', value: timeline || 'Not chosen yet' },
        ].map(({ term, value }) => (
          <div key={term} className="flex justify-between gap-4 border-b border-line pb-3">
            <dt className="text-muted">{term}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      {tips.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-3 text-[14px] leading-relaxed text-text/85">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-[14px] text-muted">Pick a service to see what to prepare.</p>
      )}

      <p className="mt-6 rounded-xl bg-fg/[0.04] p-4 text-[13px] leading-relaxed text-muted">
        After your inquiry I reply {SITE.responseTime} with questions or a scoped plan and a custom quote — no automatic pricing, no obligation.
      </p>
    </aside>
  );
}
