'use client';

import { useRouter } from '@/i18n/routing';
import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useTranslateDynamic } from '@/lib/dynamic-translator';
import { Artwork } from '@/types';

interface Props {
  artwork:     Artwork;
  allArtworks: Artwork[];
}

const statusBadgeClass = (status: Artwork['status']) => {
  switch (status) {
    case 'disponivel':         return 'badge-success';
    case 'vendido':            return 'badge-neutral';
    case 'colecao_particular': return 'badge-gold';
  }
};

const statusLabel = (status: Artwork['status'], t: any) => {
  switch (status) {
    case 'disponivel':         return t('statusAvailable');
    case 'vendido':            return t('statusSold');
    case 'colecao_particular': return t('statusPrivate');
  }
};

export default function ArtworkDetail({ artwork, allArtworks }: Props) {
  const router = useRouter();
  const t = useTranslations('artworkDetail');
  const locale = useLocale();

  const translated = useTranslateDynamic({
    title: artwork.title ?? '',
    medium: artwork.medium ?? '',
    description: artwork.description ?? '',
  }, locale);

  return (
    <article id={`artwork-detail-${artwork.id}`} className="py-12 sm:py-16">
      <div className="mb-10">
        <button
          onClick={() => router.push('/obras')}
          className="btn-ghost !px-0 !py-0 normal-case tracking-[0.25em] text-xs group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>{t('backToGallery')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-start">
        {/* Image */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <motion.div
            layoutId={`artwork-card-${artwork.id}`}
            className="card w-full overflow-hidden flex items-center justify-center p-4 md:p-8"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.image_url}
              alt={translated.title}
              className="max-h-[70vh] w-auto h-auto object-contain"
              style={{ filter: 'drop-shadow(0 20px 35px rgb(0 0 0 / 20%))' }}
            />
          </motion.div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-gold font-medium">
                {t('category')}
              </span>
              <span className="text-sm font-serif italic" style={{ color: 'var(--color-fg-muted)' }}>
                {artwork.year}
              </span>
            </div>
            <h1
              className="font-serif text-3xl sm:text-4xl xl:text-5xl tracking-tight leading-tight"
              style={{ color: 'var(--color-fg-primary)' }}
            >
              {translated.title}
            </h1>
            <div className="h-[1px] w-full bg-brand-gold/15" />
          </div>

          {/* Technical sheet */}
          <div className="card p-6 space-y-4">
            {[
              { label: t('technique'),  value: translated.medium },
              { label: t('dimensions'), value: <span className="font-mono text-[11px]">{artwork.dimensions}</span> },
              { label: t('status'),     value: <span className={`badge ${statusBadgeClass(artwork.status)}`}>{statusLabel(artwork.status, t)}</span> },
            ].map((row, i) => (
              <div key={i}>
                {i > 0 && <div className="h-[1px] mb-4" style={{ backgroundColor: 'var(--color-border-subtle)' }} />}
                <div className="grid grid-cols-3 gap-2 text-xs items-center">
                  <span className="uppercase tracking-wider" style={{ color: 'var(--color-fg-muted)' }}>{row.label}</span>
                  <span className="col-span-2 font-light" style={{ color: 'var(--color-fg-secondary)' }}>{row.value}</span>
                </div>
              </div>
            ))}
          </div>

          {artwork.description && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: 'var(--color-fg-secondary)' }}>
                {t('atelierNote')}
              </h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>
                {translated.description}
              </p>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => router.push(`/contacto?obra=${artwork.id}`)}
              className="btn-primary w-full"
            >
              <MessageSquare size={14} />
              <span>{t('requestQuote')}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
