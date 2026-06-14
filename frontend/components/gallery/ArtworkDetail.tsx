'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { Artwork } from '@/types';

interface Props {
  artwork:     Artwork;
  allArtworks: Artwork[];
}

const statusLabel = (status: Artwork['status']) => {
  switch (status) {
    case 'disponivel':       return { text: 'Disponível',              color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' };
    case 'vendido':          return { text: 'Vendida / Colecção Privada', color: 'text-zinc-400 border-zinc-200 bg-transparent' };
    case 'colecao_particular': return { text: 'Coleção Particular',    color: 'text-brand-gold border-brand-gold/20 bg-brand-gold/5' };
  }
};

export default function ArtworkDetail({ artwork, allArtworks }: Props) {
  const { darkMode } = useTheme();
  const router = useRouter();
  const related = allArtworks.filter(a => a.id !== artwork.id).slice(0, 3);
  const si = statusLabel(artwork.status);

  return (
    <article id={`artwork-detail-${artwork.id}`} className="py-12 sm:py-16">
      <div className="mb-10">
        <button
          onClick={() => router.push('/galeria')}
          className={`flex items-center space-x-2 text-xs uppercase tracking-[0.25em] focus:outline-none transition-colors group ${
            darkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
          }`}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Galeria</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-start">
        {/* Image */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <motion.div
            layoutId={`artwork-card-${artwork.id}`}
            className={`w-full overflow-hidden flex items-center justify-center p-4 md:p-8 border ${
              darkMode ? 'bg-zinc-950/40 border-white/5' : 'bg-brand-soft-gray/30 border-black/5'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="max-h-[70vh] w-auto h-auto object-contain shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-gold font-medium">
                Pintura Contemporânea
              </span>
              <span className={`text-sm font-serif italic ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {artwork.year}
              </span>
            </div>
            <h1 className={`font-serif text-3xl sm:text-4xl xl:text-5xl tracking-tight leading-tight ${
              darkMode ? 'text-white' : 'text-zinc-900'
            }`}>
              {artwork.title}
            </h1>
            <div className="h-[1px] w-full bg-brand-gold/10 pt-2" />
          </div>

          {/* Technical sheet */}
          <div className={`p-6 border space-y-4 ${
            darkMode ? 'border-white/5 bg-zinc-900/10' : 'border-black/5 bg-[#faf9f6]'
          }`}>
            {[
              { label: 'Técnica',  value: artwork.medium },
              { label: 'Dimensões', value: <span className="font-mono text-[11px]">{artwork.dimensions}</span> },
              { label: 'Estado',   value: <span className={`inline-block text-[10px] uppercase tracking-wider px-2.5 py-1 border ${si.color}`}>{si.text}</span> },
            ].map((row, i) => (
              <div key={i}>
                {i > 0 && <div className="h-[1px] bg-neutral-200/40 dark:bg-zinc-800/40 mb-4" />}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <span className={`uppercase tracking-wider ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{row.label}</span>
                  <span className={`col-span-2 font-light ${darkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>{row.value}</span>
                </div>
              </div>
            ))}
          </div>

          {artwork.description && (
            <div className="space-y-4">
              <h3 className={`text-xs uppercase tracking-[0.25em] font-semibold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Nota do Atelier
              </h3>
              <p className={`text-sm font-light leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {artwork.description}
              </p>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => router.push(`/contacto?obra=${artwork.id}`)}
              className={`w-full py-4 px-6 text-xs tracking-[0.3em] uppercase transition-all duration-300 border flex items-center justify-center space-x-3 focus:outline-none ${
                darkMode
                  ? 'bg-white text-zinc-950 border-white hover:bg-brand-gold hover:text-zinc-950 hover:border-brand-gold'
                  : 'bg-brand-charcoal text-[#fefdfb] border-brand-charcoal hover:bg-brand-gold hover:text-brand-charcoal hover:border-brand-gold'
              }`}
            >
              <MessageSquare size={14} />
              <span>Solicitar Cotação / Visita</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
