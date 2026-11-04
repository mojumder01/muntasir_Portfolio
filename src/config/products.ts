// =============================================================
// products.ts
// Loads the ready-made products for sale from src/content/products.json
// (admin: "Products for sale"). Order: "priority" (1 first), then file order.
// =============================================================

import productsJson from '../content/products.json';
import { toPublicPath } from '../lib/public-path';
import { onlyOn } from '../lib/visibility';
import type { ProjectImage } from '../types/content';

export interface ProductForSale {
  id: string;
  name: string;
  badge: string;
  category: string;
  tagline: string;
  description: string;
  liveUrl: string;
  /** null = "Price on request" */
  startingPriceUsd: number | null;
  priceNote: string;
  highlights: string[];
  shopFeatures: string[];
  adminFeatures: string[];
  included: string[];
  tools: string[];
  sourceNote: string;
  images: ProjectImage[];
}

/** Raw shape in the JSON file: the admin leaves out empty fields. */
type RawProduct = Partial<Omit<ProductForSale, 'images' | 'startingPriceUsd'>> & {
  id: string;
  name: string;
  status?: string;
  priority?: number | string | null;
  startingPriceUsd?: number | string | null;
  images?: Array<{ src?: string; alt?: string }>;
};

function priorityOf(product: RawProduct): number {
  const priority = Number(product.priority);
  return product.priority === null || product.priority === undefined || product.priority === '' || !Number.isFinite(priority) ? Infinity : priority;
}

const list = (value: string[] | undefined) => (value ?? []).filter((item) => typeof item === 'string' && item.trim() !== '');

export const PRODUCTS_FOR_SALE: ProductForSale[] = onlyOn(productsJson as unknown as RawProduct[])
  .sort((a, b) => priorityOf(a) - priorityOf(b))
  .map((product) => {
    const price = Number(product.startingPriceUsd);
    return {
      id: product.id,
      name: product.name,
      badge: product.badge ?? '',
      category: product.category ?? '',
      tagline: product.tagline ?? '',
      description: product.description ?? '',
      liveUrl: product.liveUrl ?? '',
      startingPriceUsd: product.startingPriceUsd === null || product.startingPriceUsd === undefined || product.startingPriceUsd === '' || !Number.isFinite(price) ? null : price,
      priceNote: product.priceNote ?? '',
      highlights: list(product.highlights),
      shopFeatures: list(product.shopFeatures),
      adminFeatures: list(product.adminFeatures),
      included: list(product.included),
      tools: list(product.tools),
      sourceNote: product.sourceNote ?? '',
      images: (product.images ?? [])
        .filter((image) => image.src && image.src.trim() !== '')
        .map((image) => ({ src: toPublicPath(image.src), alt: image.alt ?? '' })),
    };
  });
