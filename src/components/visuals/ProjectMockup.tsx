// =============================================================
// ProjectMockup.tsx
// Small CSS illustrations used as project thumbnails until real
// screenshots are added (see "images" in config/projects.ts).
// One drawing per MockupKind. Decorative only.
// =============================================================

import { Bot, Check, FileSpreadsheet, Sparkles, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import type { MockupKind } from '../../types/content';

/* ---------- 1. Shared pieces ---------- */
function Line({ width, isStrong = false }: { width: string; isStrong?: boolean }) {
  return <span className={`block h-2 rounded ${isStrong ? 'bg-fg/30' : 'bg-fg/10'}`} style={{ width }} />;
}

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-full rounded-lg border border-line bg-ink/80 p-2.5">
      <div className="mb-2.5 flex gap-1">
        <span className="size-1.5 rounded-full bg-fg/20" />
        <span className="size-1.5 rounded-full bg-fg/20" />
        <span className="size-1.5 rounded-full bg-fg/20" />
      </div>
      {children}
    </div>
  );
}

/* ---------- 2. One drawing per kind ---------- */
const MOCKUPS: Record<MockupKind, () => ReactNode> = {
  landing: () => (
    <BrowserFrame>
      <div className="grid grid-cols-[1.2fr_1fr] gap-3">
        <div className="flex flex-col gap-1.5 pt-1">
          <Line width="90%" isStrong />
          <Line width="70%" isStrong />
          <Line width="80%" />
          <span className="mt-2 block h-4 w-14 rounded bg-[#ff6a1f]" />
        </div>
        <div className="size-16 justify-self-center rounded-full border border-line bg-fg/10" />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((cardIndex) => (
          <span key={cardIndex} className="h-7 rounded border border-line bg-fg/[0.05]" />
        ))}
      </div>
    </BrowserFrame>
  ),
  website: () => (
    <BrowserFrame>
      <div className="flex items-center justify-between">
        <Line width="28%" isStrong />
        <span className="h-3 w-10 rounded bg-blue/70" />
      </div>
      <div className="mt-3 h-10 rounded bg-gradient-to-r from-blue/30 to-violet/30" />
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((cardIndex) => (
          <span key={cardIndex} className="flex h-10 flex-col gap-1 rounded border border-line p-1.5">
            <Line width="60%" isStrong />
            <Line width="85%" />
          </span>
        ))}
      </div>
    </BrowserFrame>
  ),
  dashboard: () => (
    <div className="flex h-full flex-col gap-2 rounded-lg border border-line bg-ink/80 p-2.5">
      <div className="grid grid-cols-3 gap-1.5">
        {['42k', '+12%', '318'].map((kpiValue) => (
          <span key={kpiValue} className="rounded border border-line bg-fg/[0.04] px-1.5 py-1 font-mono text-[10px] text-text">
            {kpiValue}
          </span>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-1 rounded border border-line p-1.5">
        {[40, 62, 48, 75, 58, 88, 70, 92].map((barHeight, barIndex) => (
          <span key={barIndex} className="flex-1 rounded-t bg-gradient-to-t from-cyan/40 to-cyan/80" style={{ height: `${barHeight}%` }} />
        ))}
      </div>
    </div>
  ),
  automation: () => (
    <div className="flex h-full items-center justify-center gap-2 rounded-lg border border-line bg-ink/80 p-3">
      {[FileSpreadsheet, FileSpreadsheet, Zap, Check].map((StepIcon, stepIndex) => (
        <div key={stepIndex} className="flex items-center gap-2">
          <span className={`grid size-9 place-items-center rounded-lg border border-line-strong ${stepIndex === 2 ? 'bg-blue/20 text-blue-text' : 'bg-fg/[0.04] text-muted'} ${stepIndex === 3 ? 'text-success' : ''}`}>
            <StepIcon size={16} />
          </span>
          {stepIndex < 3 && <span className="h-px w-3 bg-line-strong" />}
        </div>
      ))}
    </div>
  ),
  cleaning: () => (
    <div className="grid h-full grid-cols-2 gap-2 rounded-lg border border-line bg-ink/80 p-2.5 font-mono text-[9px]">
      {[
        { title: 'Before', rows: ['500 GM', '0.5kg', '—', '500g'], isClean: false },
        { title: 'After', rows: ['500 g', '500 g', 'Needs review', '500 g'], isClean: true },
      ].map((column) => (
        <div key={column.title} className="rounded border border-line">
          <p className="border-b border-line px-1.5 py-1 text-muted">{column.title}</p>
          {column.rows.map((cellText, rowIndex) => (
            <p key={rowIndex} className={`truncate px-1.5 py-0.5 ${column.isClean ? 'text-success' : 'text-danger/90'}`}>
              {cellText}
            </p>
          ))}
        </div>
      ))}
    </div>
  ),
  ai: () => (
    <div className="flex h-full flex-col justify-center gap-2 rounded-lg border border-line bg-ink/80 p-3">
      <div className="flex items-center gap-2 rounded border border-line p-1.5">
        <FileSpreadsheet size={14} className="text-cyan" />
        <Line width="60%" />
      </div>
      <div className="flex items-center gap-2 self-center rounded-full border border-violet/40 bg-violet/15 px-2.5 py-1 text-[10px] text-violet-text">
        <Sparkles size={12} /> drafting…
      </div>
      <div className="flex items-center gap-2 rounded border border-line p-1.5">
        <Bot size={14} className="text-success" />
        <Line width="75%" isStrong />
      </div>
    </div>
  ),
};

/* ---------- 3. Component ---------- */
export function ProjectMockup({ kind }: { kind: MockupKind }) {
  const renderMockup = MOCKUPS[kind];
  return (
    <div aria-hidden="true" className="h-full w-full">
      {renderMockup()}
    </div>
  );
}
