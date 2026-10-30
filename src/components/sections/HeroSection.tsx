// =============================================================
// HeroSection.tsx
// Shows the hero style picked in the admin
// (Site settings → Layout → Hero style). Each style lives in
// components/sections/hero/; switch any time, nothing is lost.
// =============================================================

import type { ComponentType } from 'react';
import { LAYOUT, type HeroStyle } from '../../config/site-config';
import { ClassicHero } from './hero/ClassicHero';
import { ModernHero } from './hero/ModernHero';
import { PremiumHero } from './hero/PremiumHero';
import { SimpleHero } from './hero/SimpleHero';
import { UniqueHero } from './hero/UniqueHero';

const HERO_STYLES: Record<HeroStyle, ComponentType> = {
  classic: ClassicHero,
  simple: SimpleHero,
  modern: ModernHero,
  premium: PremiumHero,
  unique: UniqueHero,
};

export function HeroSection() {
  const Hero = HERO_STYLES[LAYOUT.heroStyle];
  return <Hero />;
}
