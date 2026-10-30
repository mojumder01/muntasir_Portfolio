// =============================================================
// CaseStudyModal.tsx
// Case study popup for one portfolio project.
// =============================================================

/* ---------- 1. Imports ---------- */
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { findServiceById } from '../../config/services';
import { useInquiry } from '../../context/inquiry-context';
import { toSafeExternalUrl } from '../../lib/contact-channels';
import type { Project } from '../../types/content';
import { ProjectMockup } from '../visuals/ProjectMockup';
import { Button, ButtonLink } from './Button';
import { Modal, ModalCloseButton } from './Modal';

/* ---------- 2. Settings ---------- */
const SAMPLE_OUTCOME_TEXT = 'This is a sample project built to demonstrate the approach — no client results are claimed.';
const NO_OUTCOME_TEXT = 'Results will be added once they are measured and confirmed with the client.';

/* ---------- 3. Small helper ---------- */
function CaseStudyBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-blue-text">{title}</h3>
      <div className="mt-2 text-[15px] leading-relaxed text-text/85">{children}</div>
    </section>
  );
}

/* ---------- 4. Component ---------- */
interface CaseStudyModalProps {
  project: Project | null; // null = closed
  onClose: () => void;
}

export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const { startInquiry } = useInquiry();

  const handleDiscussSimilar = () => {
    if (!project) return;
    onClose();
    startInquiry({ serviceId: project.serviceId });
  };

  return (
    <Modal isOpen={project !== null} onClose={onClose} titleId="case-study-title">
      {project && (
        <article className="p-5 sm:p-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">
                {findServiceById(project.serviceId)?.title ?? ''}
                {project.isSample && <span className="ml-2 rounded-full border border-line-strong px-2 py-0.5 text-xs">Sample project</span>}
              </p>
              <h2 id="case-study-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {project.title}
              </h2>
            </div>
            <ModalCloseButton onClose={onClose} label="Close case study" />
          </header>

          {/* Screenshots if provided, otherwise the built-in illustration */}
          <div className="mt-6 grid gap-3">
            {project.images.length > 0 ? (
              project.images.map((image) => <img key={image.src} src={image.src} alt={image.alt} loading="lazy" className="w-full rounded-xl border border-line" />)
            ) : (
              <div className="h-56 rounded-xl border border-line bg-surface-2 p-4 sm:h-64">
                <ProjectMockup kind={project.mockup} />
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-6">
            <CaseStudyBlock title="Overview">{project.caseStudy.overview}</CaseStudyBlock>
            <CaseStudyBlock title="Business problem">{project.caseStudy.problem}</CaseStudyBlock>
            <CaseStudyBlock title="Solution">{project.caseStudy.solution}</CaseStudyBlock>
            <CaseStudyBlock title="Implementation">
              <ol className="flex list-decimal flex-col gap-1.5 pl-5 marker:text-muted">
                {project.caseStudy.process.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </CaseStudyBlock>
            <CaseStudyBlock title="Outcome">
              {/* Only real, verified results are shown; samples say so honestly */}
              {project.caseStudy.outcome || (project.isSample ? SAMPLE_OUTCOME_TEXT : NO_OUTCOME_TEXT)}
            </CaseStudyBlock>
            <CaseStudyBlock title="Tools">
              <ul className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <li key={tool} className="rounded-full border border-line-strong px-3 py-1 text-[13px]">
                    {tool}
                  </li>
                ))}
              </ul>
            </CaseStudyBlock>
          </div>

          <footer className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            <Button onClick={handleDiscussSimilar}>Have a similar project?</Button>
            {toSafeExternalUrl(project.liveUrl) && (
              <ButtonLink href={toSafeExternalUrl(project.liveUrl)} isExternal variant="secondary">
                {/\.xlsx$/i.test(project.liveUrl) ? 'Download Excel file' : 'View live demo'} <ArrowUpRight size={17} />
              </ButtonLink>
            )}
            {toSafeExternalUrl(project.sourceUrl) && (
              <ButtonLink href={toSafeExternalUrl(project.sourceUrl)} isExternal variant="secondary">
                View source <ArrowUpRight size={17} />
              </ButtonLink>
            )}
          </footer>
        </article>
      )}
    </Modal>
  );
}
