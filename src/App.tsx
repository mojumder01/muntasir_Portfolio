// =============================================================
// App.tsx
// Page layout: navbar, all sections in order, footer.
// Sections can be switched on/off in the admin (Site settings → Layout).
// To reorder them, move their lines below.
// =============================================================

import { MotionConfig } from 'motion/react';
import { ChatWidget } from './components/chat/ChatWidget';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import { HeroSection } from './components/sections/HeroSection';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { PricingSection } from './components/sections/PricingSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { TrustSection } from './components/sections/TrustSection';
import { InquiryProvider } from './context/inquiry-context';
import { LAYOUT } from './config/site-config';

export default function App() {
  return (
    // reducedMotion="user": animations are turned off for visitors who ask their device for less motion
    <MotionConfig reducedMotion="user">
      <InquiryProvider>
        <a href="#main" className="sr-only z-[100] rounded-lg bg-text px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <HeroSection />
          {LAYOUT.isSectionOn('services') && <ServicesSection />}
          {LAYOUT.isSectionOn('portfolio') && <PortfolioSection />}
          {LAYOUT.isSectionOn('process') && <ProcessSection />}
          {LAYOUT.isSectionOn('about') && <AboutSection />}
          {LAYOUT.isSectionOn('trust') && <TrustSection />}
          {LAYOUT.isSectionOn('pricing') && <PricingSection />}
          {LAYOUT.isSectionOn('contact') && <ContactSection />}
        </main>
        <Footer />
        <ChatWidget />
      </InquiryProvider>
    </MotionConfig>
  );
}
