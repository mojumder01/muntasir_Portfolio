// =============================================================
// Navbar.tsx
// Sticky top navigation with active-section highlight and an
// accessible mobile menu (Escape closes it, focus moves into it).
// =============================================================

/* ---------- 1. Imports ---------- */
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SITE } from '../../config/site-config';
import { useInquiry } from '../../context/inquiry-context';
import { useActiveSection } from '../../hooks/use-active-section';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

/* ---------- 2. Settings ---------- */
const NAV_LINKS = [
  { sectionId: 'home', label: 'Home' },
  { sectionId: 'services', label: 'Services' },
  { sectionId: 'portfolio', label: 'Portfolio' },
  { sectionId: 'process', label: 'Process' },
  { sectionId: 'about', label: 'About' },
  { sectionId: 'contact', label: 'Contact' },
];
const SECTION_IDS = NAV_LINKS.map((link) => link.sectionId);
const SCROLLED_THRESHOLD_PX = 12; // add the navbar background after this much scroll

/* ---------- 3. Component ---------- */
export function Navbar() {
  const { startInquiry } = useInquiry();
  const activeSectionId = useActiveSection(SECTION_IDS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Solid background once the page is scrolled
  useEffect(() => {
    const updateScrolled = () => setHasScrolled(window.scrollY > SCROLLED_THRESHOLD_PX);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  // Mobile menu keyboard support: focus the first link, Escape closes and returns focus
  useEffect(() => {
    if (!isMenuOpen) return;
    mobileMenuRef.current?.querySelector('a')?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  const handleStartProject = () => {
    setIsMenuOpen(false);
    startInquiry();
  };

  const headerBackground = hasScrolled || isMenuOpen ? 'border-line bg-ink/80 backdrop-blur-xl' : 'border-transparent bg-transparent';

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${headerBackground}`}>
      <nav aria-label="Main" className="page-container flex h-[72px] items-center gap-3">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue to-violet text-sm font-bold text-white">
            {SITE.initials}
          </span>
          <span className="text-[17px] whitespace-nowrap">{SITE.brandName}</span>
        </a>

        {/* Desktop links */}
        <ul className="ml-auto mr-2 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSectionId === link.sectionId;
            return (
              <li key={link.sectionId}>
                <a
                  href={`#${link.sectionId}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative rounded-lg px-3 py-2 text-[15px] transition-colors ${isActive ? 'text-text' : 'text-muted hover:text-text'}`}
                >
                  {link.label}
                  {isActive && <motion.span layoutId="nav-active-pill" className="absolute inset-0 -z-10 rounded-lg bg-fg/[0.06]" />}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Wrapper controls visibility (the button's own inline-flex would override "hidden") */}
        <ThemeToggle className="ml-auto lg:ml-0" />
        <div className="hidden sm:block">
          <Button onClick={handleStartProject}>Start a Project</Button>
        </div>

        {/* Mobile menu button */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="grid size-11 place-items-center rounded-xl border border-line-strong lg:hidden"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="page-container flex flex-col py-3">
              {NAV_LINKS.map((link) => (
                <li key={link.sectionId}>
                  <a
                    href={`#${link.sectionId}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex min-h-12 items-center border-b border-line text-[17px] ${activeSectionId === link.sectionId ? 'text-text' : 'text-muted'}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-4 pb-2">
                <Button onClick={handleStartProject} className="w-full">
                  Start a Project
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
