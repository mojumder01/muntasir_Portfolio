// =============================================================
// projects.ts
// Loads portfolio projects from src/content/projects.json.
// Projects with "isSample": true are labeled "Sample project".
// Only write real, verified results in "outcome".
// =============================================================

import projectsJson from '../content/projects.json';
import { toPublicPath } from '../lib/public-path';
import { onlyOn } from '../lib/visibility';
import type { MockupKind, Project } from '../types/content';

/** Raw shape in the JSON file; optional fields may be missing after admin edits (empty or switched off). */
type RawProject = Omit<Project, 'images' | 'liveUrl' | 'sourceUrl' | 'mockup' | 'caseStudy' | 'isSample'> & {
  mockup: string;
  isSample?: boolean;
  status?: string;
  liveUrl?: string;
  sourceUrl?: string;
  images?: Array<{ src?: string; alt?: string }>;
  caseStudy: Omit<Project['caseStudy'], 'outcome'> & { outcome?: string };
};

// The JSON's own shape changes with admin edits, so it isn't used as the type (checked by scripts/validate-content.mjs)
// Projects switched off in the admin are left out
export const PROJECTS: Project[] = onlyOn(projectsJson as unknown as RawProject[]).map(({ status: _status, ...project }) => ({
  ...project,
  mockup: project.mockup as MockupKind, // checked by scripts/validate-content.mjs
  isSample: project.isSample ?? false,
  liveUrl: project.liveUrl ?? '',
  sourceUrl: project.sourceUrl ?? '',
  // Keep only images that really have a file, and make their paths work on any hosting
  images: (project.images ?? [])
    .filter((image) => image.src && image.src.trim() !== '')
    .map((image) => ({ src: toPublicPath(image.src), alt: image.alt ?? '' })),
  caseStudy: { ...project.caseStudy, outcome: (project.caseStudy.outcome ?? '').trim() },
}));
