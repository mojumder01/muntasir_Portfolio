// =============================================================
// ProductsSection.tsx
// "Ready-made products": finished systems a client can buy and get
// set up under their own brand (e.g. the Meow Bazar online shop).
// Content: src/content/products.json (admin: Products for sale).
// =============================================================

/* ---------- 1. Imports ---------- */
import { ArrowRight, ArrowUpRight, Check, Lock } from 'lucide-react';
import { useState } from 'react';
import { PRODUCTS_FOR_SALE, type ProductForSale } from '../../config/products';
import { useInquiry } from '../../context/inquiry-context';
import { toSafeExternalUrl } from '../../lib/contact-channels';
import { Button, ButtonLink } from '../ui/Button';
import { Modal, ModalCloseButton } from '../ui/Modal';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/* ---------- 2. Helpers ---------- */
const SERVICE_FOR_INQUIRY = 'website';

function priceText(product: ProductForSale): string {
  return product.startingPriceUsd === null ? 'Price on request' : `From $${product.startingPriceUsd.toLocaleString('en-US')}`;
}

function CheckList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`grid gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[14px] leading-relaxed text-text/85">
          <Check size={17} className="mt-0.5 shrink-0 text-cyan-text" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Big screenshot with a row of thumbnails to switch. */
function Gallery({ product }: { product: ProductForSale }) {
  const [current, setCurrent] = useState(0);
  const image = product.images[current];
  if (!image) return null;
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-line bg-surface-2">
        <img src={image.src} alt={image.alt} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
      </div>
      {product.images.length > 1 && (
        <div role="group" aria-label={`${product.name} screenshots`} className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {product.images.map((thumb, index) => (
            <button
              key={thumb.src}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Screenshot ${index + 1}: ${thumb.alt}`}
              aria-pressed={index === current}
              className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${index === current ? 'border-blue' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={thumb.src} alt="" loading="lazy" className="h-14 w-[90px] object-cover object-top sm:h-16 sm:w-[102px]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- 3. One product ---------- */
function ProductCard({ product, onDetails }: { product: ProductForSale; onDetails: () => void }) {
  const { startInquiry } = useInquiry();
  const live = toSafeExternalUrl(product.liveUrl);
  return (
    <article className="grid gap-8 rounded-2xl border border-line bg-surface p-4 sm:p-6 lg:grid-cols-[1.15fr_1fr] lg:p-8">
      <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <Gallery product={product} />
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          {product.badge && <span className="rounded-full bg-gradient-to-r from-blue to-violet px-3 py-1 text-xs font-semibold text-white">{product.badge}</span>}
          {product.category && <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-text">{product.category}</span>}
        </div>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-[28px]">{product.name}</h3>
        {product.tagline && <p className="mt-2 text-[15px] leading-relaxed text-muted">{product.tagline}</p>}
        {product.highlights.length > 0 && <CheckList items={product.highlights} className="mt-5" />}
        {product.tools.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Built with">
            {product.tools.map((tool) => (
              <li key={tool} className="rounded-md bg-fg/[0.05] px-2 py-1 text-[12px] text-text/80">{tool}</li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-5">
          <span className="text-xl font-semibold">{priceText(product)}</span>
          {product.priceNote && <span className="text-[13px] text-muted">{product.priceNote}</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => startInquiry({ serviceId: SERVICE_FOR_INQUIRY, plan: product.name })}>
            Get this for my business <ArrowRight size={18} />
          </Button>
          {live && (
            <ButtonLink href={live} isExternal variant="secondary">
              Open live shop <ArrowUpRight size={17} />
            </ButtonLink>
          )}
        </div>
        <button type="button" onClick={onDetails} className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 text-[15px] font-semibold text-text">
          See all features <ArrowRight size={17} aria-hidden="true" />
        </button>
        {product.sourceNote && (
          <p className="mt-2 flex gap-2 text-[13px] text-muted">
            <Lock size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {product.sourceNote}
          </p>
        )}
      </div>
    </article>
  );
}

/* ---------- 4. Details popup ---------- */
function DetailsBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-blue-text">{title}</h3>
      <CheckList items={items} className="mt-3" />
    </section>
  );
}

function ProductDetails({ product, onClose }: { product: ProductForSale | null; onClose: () => void }) {
  const { startInquiry } = useInquiry();
  const live = product ? toSafeExternalUrl(product.liveUrl) : '';
  return (
    <Modal isOpen={product !== null} onClose={onClose} titleId="product-details-title" maxWidthClass="w-[min(900px,calc(100%-24px))]">
      {product && (
        <article className="p-5 sm:p-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">{product.category}</p>
              <h2 id="product-details-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h2>
            </div>
            <ModalCloseButton onClose={onClose} label="Close product details" />
          </header>
          {product.description && <p className="mt-4 text-[15px] leading-relaxed text-text/85">{product.description}</p>}
          <div className="mt-6"><Gallery product={product} /></div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <DetailsBlock title="For your customers" items={product.shopFeatures} />
            <DetailsBlock title="For you (admin panel)" items={product.adminFeatures} />
            <DetailsBlock title="What you get" items={product.included} />
            {product.tools.length > 0 && (
              <section>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-blue-text">Built with</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.tools.map((tool) => <li key={tool} className="rounded-full border border-line-strong px-3 py-1 text-[13px]">{tool}</li>)}
                </ul>
                {product.sourceNote && <p className="mt-4 flex gap-2 text-[13px] text-muted"><Lock size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {product.sourceNote}</p>}
              </section>
            )}
          </div>
          <footer className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <Button onClick={() => { onClose(); startInquiry({ serviceId: SERVICE_FOR_INQUIRY, plan: product.name }); }}>
              Get this for my business <ArrowRight size={18} />
            </Button>
            {live && <ButtonLink href={live} isExternal variant="secondary">Open live shop <ArrowUpRight size={17} /></ButtonLink>}
            <span className="text-sm text-muted">{priceText(product)}</span>
          </footer>
        </article>
      )}
    </Modal>
  );
}

/* ---------- 5. Section ---------- */
export function ProductsSection() {
  const [open, setOpen] = useState<ProductForSale | null>(null);
  if (PRODUCTS_FOR_SALE.length === 0) return null; // every product switched off

  return (
    <section id="products" aria-labelledby="products-title" className="py-24 sm:py-28">
      <div className="page-container">
        <SectionHeading
          headingId="products-title"
          eyebrow="Ready-made products"
          title={
            <>
              Launch-ready systems <span className="text-gradient">you can own</span>
            </>
          }
          description="Finished, working products — not mock-ups. Pick one and I set it up for your business with your brand, products and hosting, so you can start selling without building from scratch."
        />
        <div className="mt-10 grid gap-6">
          {PRODUCTS_FOR_SALE.map((product) => (
            <Reveal key={product.id}>
              <ProductCard product={product} onDetails={() => setOpen(product)} />
            </Reveal>
          ))}
        </div>
      </div>
      <ProductDetails product={open} onClose={() => setOpen(null)} />
    </section>
  );
}
