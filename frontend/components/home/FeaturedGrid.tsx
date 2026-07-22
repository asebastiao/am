'use client';

import { Link, useRouter } from '@/i18n/routing';
import { motion } from 'motion/react';
import { useTranslations, useLocale } from 'next-intl';
import { useTranslateDynamic } from '@/lib/dynamic-translator';
import { Artwork } from '@/types';

interface Props { artworks: Artwork[] }

const gridClass = (index: number) => {
  switch (index) {
    case 0: return 'md:col-span-12 lg:col-span-8 lg:aspect-[16/10]';
    case 1: return 'md:col-span-6  lg:col-span-4 lg:aspect-[3/4]';
    case 2: return 'md:col-span-6  lg:col-span-5 lg:aspect-[4/3]';
    case 3: return 'md:col-span-12 lg:col-span-7 lg:aspect-[16/9]';
    default: return 'md:col-span-6  lg:col-span-6';
  }
};

// ── Individual card that translates its own content ──────────────────────────
function FeaturedCard({ artwork, index, t }: { artwork: Artwork; index: number; t: any }) {
  const router = useRouter();
  const locale = useLocale();

  const translated = useTranslateDynamic({
    title: artwork.title ?? '',
  }, locale);

  return (
    <motion.div
      key={artwork.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`${gridClass(index)} card card-hover w-full flex flex-col group cursor-pointer overflow-hidden`}
      onClick={() => router.push(`/obras/${artwork.slug}`)}
    >
      <div className="overflow-hidden bg-neutral-100 aspect-square md:aspect-auto w-full relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.image_url}
          alt={translated.title}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-500" />
        <div className="absolute inset-0 flex items-end p-6 sm:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/55 via-black/10 to-transparent">
          <p className="text-white text-xs font-light uppercase tracking-widest">
            {t('consultWork')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedGrid({ artworks }: Props) {
  const t = useTranslations('home');
  const featured = artworks.filter(w => w.featured).slice(0, 4);

  return (
    <section
      id="featured-artworks-grid"
      className="py-24 sm:py-32 xl:py-40 border-t surface-2"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-brand-gold font-semibold">
              {t('curatorship')}
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl xl:text-5xl tracking-normal" style={{ color: 'var(--color-fg-primary)' }}>
              {t('featuredWorks')}
            </h3>
          </div>
          <Link
            href="/obras"
            className="text-xs uppercase tracking-[0.3em] font-medium pb-2 border-b transition-colors duration-200 hover:text-brand-gold focus-visible:outline-none"
            style={{ color: 'var(--color-fg-secondary)', borderColor: 'var(--color-border)' }}
          >
            {t('viewGalleryCta')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
          {featured.map((artwork, index) => (
            <FeaturedCard
              key={artwork.id}
              artwork={artwork}
              index={index}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
