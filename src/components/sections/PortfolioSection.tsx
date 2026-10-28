// =============================================================
// PortfolioSection.tsx
// Filterable project grid + case study popup + "similar project" CTA.
// Projects live in config/projects.ts.
// =============================================================

/* ---------- 1. Imports ---------- */
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { PROJECTS } from '../../config/projects';
import { SERVICES, findServiceById } from '../../config/services';
import { useInquiry } from '../../context/inquiry-context';
import type { Project } from '../../types/content';
import { Button } from '../ui/Button';
import { CaseStudyModal } from '../ui/CaseStudyModal';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectMockup } from '../visuals/ProjectMockup';

/* ---------- 2. Settings ---------- */
const ALL_FILTER_ID = 'all';
const FILTERS = [{ id: ALL_FILTER_ID, label: 'All' }, ...SERVICES.map((service) => ({ id: service.id, label: service.shortTitle }))];

/* ---------- 3. One project card ---------- */
function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const serviceTitle = findServiceById(project.serviceId)?.shortTitle ?? '';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-line-strong">
      <div className="relative h-48 bg-surface-2 p-4">
        <div className="h-full transition-transform duration-500 group-hover:scale-[1.03]">
          {project.images?.[0] ? (
            <img src={project.images[0].src} alt={project.images[0].alt} loading="lazy" className="h-full w-full rounded-lg object-cover" />
          ) : (
            <ProjectMockup kind={project.mockup} />
          )}
        </div>
        {project.isSample && (
          <span className="absolute top-3 right-3 rounded-full border border-line-strong bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-text/90 backdrop-blur">
            Sample project
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-text">{serviceTitle}</p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tools used">
          {project.tools.map((tool) => (
            <li key={tool} className="rounded-md bg-fg/[0.05] px-2 py-1 text-[12px] text-text/80">
              {tool}
            </li>
          ))}
        </ul>
        <button type="button" onClick={onOpen} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-[15px] font-semibold text-text">
          View Case Study
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

/* ---------- 4. Section ---------- */
export function PortfolioSection() {
  const { startInquiry } = useInquiry();
  const [activeFilterId, setActiveFilterId] = useState(ALL_FILTER_ID);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const visibleProjects = activeFilterId === ALL_FILTER_ID ? PROJECTS : PROJECTS.filter((project) => project.serviceId === activeFilterId);

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="py-24 sm:py-28">
      <div className="page-container">
        <SectionHeading
          headingId="portfolio-title"
          eyebrow="Portfolio"
          title={
            <>
              Selected work & <span className="text-gradient">case studies</span>
            </>
          }
          description="Sample projects that show how I approach each kind of work. Real client case studies will be added here as they’re completed."
        />

        {/* Category filters */}
        <div role="group" aria-label="Filter projects by category" className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = filter.id === activeFilterId;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilterId(filter.id)}
                className={`min-h-11 rounded-full border px-4 text-[14px] font-medium transition-colors ${
                  isActive ? 'border-transparent bg-text text-ink' : 'border-line-strong text-muted hover:text-text'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Project grid */}
        <motion.ul layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} onOpen={() => setOpenProject(project)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Empty state for a category with no projects yet */}
        {visibleProjects.length === 0 && (
          <p className="mt-8 rounded-2xl border border-dashed border-line-strong p-8 text-center text-muted">
            No projects in this category yet — new work is added regularly. Have one in mind? Let’s talk below.
          </p>
        )}

        {/* "Have a similar project?" call to action */}
        <Reveal className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-gradient-to-r from-blue/10 via-violet/10 to-cyan/5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">Have a similar project?</h3>
            <p className="mt-1.5 text-muted">Tell me what you need — I’ll reply with a clear plan and next steps.</p>
          </div>
          <Button onClick={() => startInquiry({ serviceId: activeFilterId === ALL_FILTER_ID ? undefined : activeFilterId })}>
            Discuss your project <ArrowRight size={18} />
          </Button>
        </Reveal>
      </div>

      <CaseStudyModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}
