// =============================================================
// projects.ts
// Loads portfolio projects from src/content/projects.json.
// Projects with "isSample": true are labeled "Sample project".
// Only write real, verified results in "outcome".
// =============================================================

import projectsJson from '../content/projects.json';
import { toPublicPath } from '../lib/public-path';
import type { MockupKind, Project } from '../types/content';

/** Raw shape in the JSON file; optional fields may be missing after admin edits. */
type RawProject = Omit<Project, 'images' | 'liveUrl' | 'sourceUrl' | 'mockup' | 'caseStudy'> & {
  mockup: string;
  liveUrl?: string;
  sourceUrl?: string;
  images?: Array<{ src?: string; alt?: string }>;
  caseStudy: Omit<Project['caseStudy'], 'outcome'> & { outcome?: string };
};

export const PROJECTS: Project[] = (projectsJson as RawProject[]).map((project) => ({
  ...project,
  mockup: project.mockup as MockupKind, // checked by scripts/validate-content.mjs
  liveUrl: project.liveUrl ?? '',
  sourceUrl: project.sourceUrl ?? '',
  // Keep only images that really have a file, and make their paths work on any hosting
  images: (project.images ?? [])
    .filter((image) => image.src && image.src.trim() !== '')
    .map((image) => ({ src: toPublicPath(image.src), alt: image.alt ?? '' })),
  caseStudy: { ...project.caseStudy, outcome: (project.caseStudy.outcome ?? '').trim() },
}));
