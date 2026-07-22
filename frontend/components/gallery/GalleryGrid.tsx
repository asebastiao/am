'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations, useLocale } from 'next-intl';
import { useTranslateDynamic } from '@/lib/dynamic-translator';
import { Artwork } from '@/types';

interface Props { artworks: Artwork[] }

type FilterType = 'all' | 'disponivel' | 'archived';

// ── Individual card component ─────────────────────────────────────────────────
function ArtworkCard({ artwork, t }: { artwork: Artwork; t: any }) {
  const router = useRouter();
  const locale = useLocale();
  const [loaded, setLoaded] = useState(false);

  const translated = useTranslateDynamic({
    title: artwork.title ?? '',
    medium: artwork.medium ?? '',
  }, locale);

  const statusBadge = artwork.status === 'disponivel'
    ? 'badge-success'
    : artwork.status === 'vendido'
      ? 'badge-neutral'
      : 'badge-gold';

  return (
    <motion.div
      layoutId={`artwork-card-${artwork.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="card card-hover break-inside-avoid mb-10 sm:mb-12 group cursor-pointer w-full flex flex-col overflow-hidden"
      onClick={() => router.push(`/obras/${artwork.slug}`)}
    >
      <div className="relative overflow-hidden bg-neutral-100 flex items-center justify-center">
        {!loaded && <div className="absolute inset-0 skeleton" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.image_url}
          alt={translated.title}
          onLoad={() => setLoaded(true)}
          className={`w-full max-h-[80vh] h-auto object-contain transition-all duration-1000 ${
            loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'
          } group-hover:scale-[1.02]`}
        />
        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="text-white space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium">
              {t('viewDetails')}
            </span>
            <h4 className="font-serif text-lg tracking-normal">{translated.title}</h4>
            <p className="text-[11px] font-light text-zinc-300">{translated.medium}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 mb-4 mx-4 flex items-baseline justify-between gap-4">
        <div>
          <h4
            className="font-serif text-base tracking-normal group-hover:text-brand-gold transition-colors duration-200"
            style={{ color: 'var(--color-fg-primary)' }}
          >
            {translated.title}
          </h4>
          <p className="text-xs font-light mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>
            {translated.medium}
          </p>
        </div>
        <div className="text-right flex flex-col items-end gap-1.5">
          <span className="font-serif italic text-xs text-brand-gold">{artwork.year}</span>
          <span className={`badge ${statusBadge}`}>
            {artwork.status === 'disponivel' ? t('statusAvailable') : artwork.status === 'vendido' ? t('statusSold') : t('statusPrivate')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main gallery grid ─────────────────────────────────────────────────────────
export default function GalleryGrid({ artworks }: Props) {
  const t = useTranslations('gallery');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = artworks.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'disponivel') return a.status === 'disponivel';
    return a.status === 'vendido' || a.status === 'colecao_particular';
  });

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16 sm:mb-24">
        {([
          { id: 'all',       label: t('all') },
          { id: 'disponivel', label: t('available') },
          { id: 'archived',  label: t('archived') },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`filter-chip ${filter === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif italic text-lg" style={{ color: 'var(--color-fg-muted)' }}>
            {t('noItems')}
          </p>
          <button
            onClick={() => setFilter('all')}
            className="btn-ghost mt-6 !px-0 !py-0 normal-case tracking-widest text-xs underline underline-offset-4"
          >
            {t('backToAll')}
          </button>
        </div>
      ) : (
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-8 sm:gap-10 xl:gap-12 pb-24">
          <AnimatePresence mode="popLayout">
            {filtered.map(artwork => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                t={t}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
