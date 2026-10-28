// =============================================================
// use-active-section.ts
// Tells the navbar which section is currently on screen,
// so the matching link can be highlighted.
// =============================================================

import { useEffect, useState } from 'react';

/** Returns the id of the section currently in the middle of the screen. */
export function useActiveSection(sectionIds: string[]): string {
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    // Older browsers without IntersectionObserver: keep the default highlight
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSectionId(entry.target.id);
        });
      },
      // A thin band across the middle of the screen decides the "active" section
      { rootMargin: '-45% 0px -50% 0px' },
    );

    sectionIds.forEach((sectionId) => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) observer.observe(sectionElement);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSectionId;
}
