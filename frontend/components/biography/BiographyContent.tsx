'use client';

import { motion } from 'motion/react';
import { useTheme } from '@/lib/theme';
import { Biography } from '@/types';

interface Props { biography: Biography }

export default function BiographyContent({ biography }: Props) {
  const { darkMode } = useTheme();

  return (
    <article id="biography-section" className="py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start mb-24 sm:mb-32">

        <div className="lg:col-span-5 relative group">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`p-4 border ${darkMode ? 'bg-zinc-950/40 border-white/5' : 'bg-brand-soft-gray/30 border-black/5'}`}
          >
            <div className="aspect-[1/1] overflow-hidden bg-neutral-100 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={biography.portrait_url || '/images/artist_portrait.png'}
                alt={biography.name}
                className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 mix-blend-multiply" />
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-brand-gold font-semibold block">
              Manifesto & Alma
            </span>
            <h1 className={`font-serif text-4xl sm:text-5xl tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              {biography.name}
            </h1>
            {biography.role && (
              <p className="text-zinc-400 font-serif italic text-lg tracking-wide">{biography.role}</p>
            )}
            <div className="h-[1px] w-16 bg-brand-gold pt-2" />
          </div>

          {biography.statement && (
            <blockquote className={`font-serif text-lg sm:text-xl lg:text-2xl leading-relaxed italic border-l-2 border-brand-gold pl-6 ${
              darkMode ? 'text-zinc-200' : 'text-zinc-800'
            }`}>
              &ldquo;{biography.statement}&rdquo;
            </blockquote>
          )}

          <div className={`space-y-6 text-sm sm:text-base font-light leading-relaxed ${
            darkMode ? 'text-zinc-300' : 'text-zinc-700'
          }`}>
            {biography.full_text.map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </div>
      </div>

      {/* CV columns */}
      {(biography.exhibitions_solo.length > 0 || biography.exhibitions_group.length > 0 || biography.awards.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 pt-16 border-t border-black/5 dark:border-white/5">
          {[
            { title: 'Exposições Individuais', list: biography.exhibitions_solo },
            { title: 'Exposições Colectivas',  list: biography.exhibitions_group },
            { title: 'Prémios & Distinções',   list: biography.awards },
          ].map(col => col.list.length > 0 && (
            <div key={col.title} className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                <h3 className={`text-xs uppercase tracking-[0.3em] font-semibold ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
                  {col.title}
                </h3>
              </div>
              <ul className="space-y-4 text-xs font-light leading-relaxed">
                {col.list.map((item, i) => {
                  const parts = item.split(' — ');
                  return (
                    <li key={i} className="flex flex-col space-y-1">
                      <span className={darkMode ? 'text-zinc-300' : 'text-zinc-800'}>{parts[1] ?? item}</span>
                      {parts[0] && <span className="text-[10px] text-brand-gold font-mono uppercase tracking-wider">{parts[0]}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
