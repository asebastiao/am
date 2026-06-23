'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/lib/theme';
import { Artwork } from '@/types';

interface Props { artworks: Artwork[] }

type FilterType = 'all' | 'disponivel' | 'archived';

export default function GalleryGrid({ artworks }: Props) {
  const { darkMode } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  const filtered = artworks.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'disponivel') return a.status === 'disponivel';
    return a.status === 'vendido' || a.status === 'colecao_particular';
  });

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-16 sm:mb-24">
        {([
          { id: 'all',       label: 'Colecção Completa' },
          { id: 'disponivel', label: 'Disponíveis para Aquisição' },
          { id: 'archived',  label: 'Exposições & Arquivo' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-6 py-2.5 text-xs uppercase tracking-[0.25em] border transition-all duration-300 focus:outline-none ${
              filter === tab.id
                ? darkMode
                  ? 'bg-brand-gold text-black border-brand-gold font-medium'
                  : 'bg-brand-charcoal text-[#fefdfb] border-brand-charcoal font-medium'
                : darkMode
                  ? 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
                  : 'border-black/5 text-zinc-600 hover:border-black/20 hover:text-brand-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className={`font-serif italic text-lg ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Nenhuma obra encontrada para esta categoria neste momento.
          </p>
          <button
            onClick={() => setFilter('all')}
            className="mt-6 text-xs uppercase tracking-widest text-[#c3a472] hover:underline"
          >
            Voltar à colecção completa
          </button>
        </div>
      ) : (
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-8 sm:gap-10 xl:gap-12 pb-24">
          <AnimatePresence mode="popLayout">
            {filtered.map(artwork => (
              <motion.div
                key={artwork.id}
                layoutId={`artwork-card-${artwork.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="break-inside-avoid mb-10 sm:mb-12 group cursor-pointer w-full flex flex-col"
                onClick={() => router.push(`/galeria/${artwork.slug}`)}
              >
                <div className="relative overflow-hidden bg-neutral-100 flex items-center justify-center">
                  {!imagesLoaded[artwork.id] && (
                    <div className={`absolute inset-0 animate-pulse ${
                      darkMode ? 'bg-zinc-900' : 'bg-neutral-200'
                    }`} />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    onLoad={() => setImagesLoaded(p => ({ ...p, [artwork.id]: true }))}
                    className={`w-full max-h-[80vh] h-auto object-contain transition-all duration-1000 ${
                      imagesLoaded[artwork.id] ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'
                    } group-hover:scale-[1.02]`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="text-white space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium">
                        Ver Detalhes &rarr;
                      </span>
                      <h4 className="font-serif text-lg tracking-normal">{artwork.title}</h4>
                      <p className="text-[11px] font-light text-zinc-300">{artwork.medium}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <div>
                    <h4 className={`font-serif text-base tracking-normal group-hover:text-brand-gold transition-colors ${
                      darkMode ? 'text-zinc-100' : 'text-zinc-950'
                    }`}>
                      {artwork.title}
                    </h4>
                    <p className={`text-xs font-light mt-0.5 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {artwork.medium}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-serif italic text-xs text-brand-gold">{artwork.year}</span>
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                      artwork.status === 'disponivel'
                        ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                        : artwork.status === 'vendido'
                          ? 'border-neutral-500/20 text-neutral-400'
                          : 'border-brand-gold/20 text-brand-gold bg-brand-gold/5'
                    }`}>
                      {artwork.status === 'disponivel' ? 'Disponível' : artwork.status === 'vendido' ? 'Vendido' : 'Coleção Particular'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
