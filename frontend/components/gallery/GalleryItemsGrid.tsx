'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations, useLocale } from 'next-intl';
import { useTranslateDynamic } from '@/lib/dynamic-translator';
import { GalleryItem } from '@/types';

interface Props { items: GalleryItem[] }

type FilterType = 'exposicao' | 'arquivo';

// ── Individual item card ─────────────────────────────────────────────────────
function GalleryItemCard({ item }: { item: GalleryItem }) {
  const locale = useLocale();
  const [loaded, setLoaded] = useState(false);

  const translated = useTranslateDynamic({
    title: item.title ?? '',
  }, locale);

  return (
    <motion.div
      layoutId={`gallery-item-${item.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="card card-hover break-inside-avoid mb-10 sm:mb-12 group w-full flex flex-col overflow-hidden"
    >
      <div className="relative overflow-hidden bg-neutral-100 flex items-center justify-center">
        {!loaded && <div className="absolute inset-0 skeleton" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image_url}
          alt={translated.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full max-h-[80vh] h-auto object-contain transition-all duration-1000 ${
            loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'
          } group-hover:scale-[1.02]`}
        />
      </div>

      {(translated.title || item.date) && (
        <div className="mt-4 mb-4 mx-4 flex items-baseline justify-between gap-4">
          <div>
            {translated.title && (
              <h4 className="font-serif text-base tracking-normal" style={{ color: 'var(--color-fg-primary)' }}>
                {translated.title}
              </h4>
            )}
            <p className="text-xs font-light mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>
              {item.date ?? ''}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Main gallery repository grid, with Exposições / Arquivo tabs ─────────────
export default function GalleryItemsGrid({ items }: Props) {
  const t = useTranslations('galleryItems');

  // Escolhe automaticamente o primeiro separador que tenha conteúdo, para
  // nunca abrir numa aba vazia.
  const hasExposicoes = items.some(i => i.type === 'exposicao');
  const [filter, setFilter] = useState<FilterType>(hasExposicoes ? 'exposicao' : 'arquivo');

  const filtered = items.filter(item => item.type === filter);

  const tabs: { id: FilterType; label: string; count: number }[] = [
    { id: 'exposicao', label: t('tabExposicoes'), count: items.filter(i => i.type === 'exposicao').length },
    { id: 'arquivo',   label: t('tabArquivo'),     count: items.filter(i => i.type === 'arquivo').length },
  ];

  return (
    <div className="w-full">
      {/* Separadores — Exposições / Arquivo */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16 sm:mb-24">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            disabled={tab.count === 0}
            className={`filter-chip disabled:opacity-30 disabled:cursor-not-allowed ${filter === tab.id ? 'active' : ''}`}
          >
            {tab.label}
            <span className="ml-1.5 opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif italic text-lg" style={{ color: 'var(--color-fg-muted)' }}>
            {t('noItems')}
          </p>
        </div>
      ) : (
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-8 sm:gap-10 xl:gap-12 pb-24">
          <AnimatePresence mode="popLayout">
            {filtered.map(item => (
              <GalleryItemCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
