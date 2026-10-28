// =============================================================
// HeroVisual.tsx
// The animated illustration on the right of the hero:
// a browser mockup (websites), a floating spreadsheet + chart
// (Excel) and an AI workflow strip (automation).
// Pure CSS/SVG — no image files to load. Decorative only.
// =============================================================

/* ---------- 1. Imports ---------- */
import { motion } from 'motion/react';
import { Bot, FileSpreadsheet, Sheet, Sparkles } from 'lucide-react';

/* ---------- 2. Demo data for the drawings ---------- */
const CHART_BAR_HEIGHTS = [38, 56, 44, 70, 62, 84, 76]; // percent of chart height
const SPREADSHEET_ROWS = [
  ['Product', 'Qty', 'Status'],
  ['Earbuds', '128', 'Clean'],
  ['Watch', '64', 'Fixed'],
  ['Lamp', '212', 'Clean'],
];
const WORKFLOW_STEPS = [
  { label: 'Sheet', icon: Sheet },
  { label: 'AI step', icon: Sparkles },
  { label: 'Review', icon: Bot },
];

/* ---------- 3. Small reusable float animation ---------- */
function floatAnimation(distancePx: number, durationS: number, delayS = 0) {
  return {
    animate: { y: [0, -distancePx, 0] },
    transition: { duration: durationS, repeat: Infinity, ease: 'easeInOut' as const, delay: delayS },
  };
}

/* ---------- 4. Component ---------- */
export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[1/1.02] w-full max-w-[540px] select-none">
      {/* Browser window with a website wireframe */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="glass absolute inset-x-[8%] top-0 rounded-2xl p-3 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-1.5 px-1 pb-3">
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="ml-3 h-5 flex-1 rounded-md bg-fg/[0.05]" />
        </div>
        <div className="rounded-xl border border-line bg-ink/70 p-4">
          <div className="flex items-center justify-between">
            <span className="h-2.5 w-16 rounded bg-fg/20" />
            <span className="flex gap-2">
              <span className="h-2 w-8 rounded bg-fg/10" />
              <span className="h-2 w-8 rounded bg-fg/10" />
              <span className="h-5 w-14 rounded-md bg-gradient-to-r from-blue to-violet" />
            </span>
          </div>
          <div className="mt-6 h-3.5 w-3/4 rounded bg-fg/25" />
          <div className="mt-2 h-3.5 w-1/2 rounded bg-fg/25" />
          <div className="mt-3 h-2 w-2/3 rounded bg-fg/10" />
          {/* Mini KPI dashboard inside the site */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {['+18%', '2.4k', '96%'].map((kpiValue) => (
              <div key={kpiValue} className="rounded-lg border border-line bg-fg/[0.03] p-2">
                <span className="block h-1.5 w-8 rounded bg-fg/10" />
                <span className="mt-1.5 block font-mono text-[13px] font-semibold text-text">{kpiValue}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-24 items-end gap-1.5 rounded-lg border border-line bg-fg/[0.02] p-2.5">
            {CHART_BAR_HEIGHTS.map((barHeight, barIndex) => (
              <motion.span
                key={barIndex}
                className="flex-1 rounded-t bg-gradient-to-t from-blue/50 to-violet/80"
                initial={{ height: '8%' }}
                animate={{ height: [`${barHeight}%`, `${Math.max(barHeight - 14, 20)}%`, `${barHeight}%`] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 + barIndex * 0.12 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating spreadsheet card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="absolute top-[56%] left-0 w-[50%] max-w-[270px]"
      >
        <motion.div {...floatAnimation(10, 6)} className="glass rounded-2xl p-3 shadow-xl shadow-black/50">
          <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-cyan-text">
            <FileSpreadsheet size={15} /> sales_cleaned.xlsx
          </div>
          <div className="overflow-hidden rounded-lg border border-line font-mono text-[11px]">
            {SPREADSHEET_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className={`grid grid-cols-[1.3fr_0.7fr_0.9fr] ${rowIndex === 0 ? 'bg-fg/[0.06] text-muted' : 'border-t border-line text-text/90'}`}>
                {row.map((cellText, cellIndex) => (
                  <span key={cellIndex} className={`truncate px-2 py-1.5 ${cellIndex === 2 && rowIndex > 0 ? 'text-success' : ''}`}>
                    {cellText}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* AI workflow strip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.65 }}
        className="absolute right-0 bottom-0 w-[52%] max-w-[290px]"
      >
        <motion.div {...floatAnimation(8, 7, 1)} className="glass rounded-2xl p-3.5 shadow-xl shadow-black/50">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">AI workflow</p>
          <div className="relative flex items-center justify-between">
            {/* Animated dashed line flowing between the steps */}
            {/* SVGs don't stretch with left/right alone, so the width is set explicitly */}
            <svg className="absolute top-1/2 left-6 h-1 w-[calc(100%-3rem)] -translate-y-1/2" preserveAspectRatio="none" viewBox="0 0 100 2">
              <line x1="0" y1="1" x2="100" y2="1" stroke="var(--color-violet)" strokeWidth="2" strokeDasharray="6 6" className="animate-flow-dash" vectorEffect="non-scaling-stroke" />
            </svg>
            {WORKFLOW_STEPS.map(({ label, icon: StepIcon }) => (
              <div key={label} className="relative flex flex-col items-center gap-1.5">
                <span className="grid size-10 place-items-center rounded-xl border border-line-strong bg-surface-2 text-violet-text">
                  <StepIcon size={18} />
                </span>
                <span className="text-[11px] text-muted">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
