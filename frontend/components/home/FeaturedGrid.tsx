'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useTheme } from '@/lib/theme';
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

export default function FeaturedGrid({ artworks }: Props) {
  const { darkMode } = useTheme();
  const router = useRouter();
  const featured = artworks.filter(w => w.featured).slice(0, 4);

  return (
    <section
      id="featured-artworks-grid"
      className={`py-24 sm:py-32 xl:py-40 border-t ${
        darkMode ? 'bg-brand-dark/20 border-white/5' : 'bg-brand-beige border-black/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-brand-gold font-semibold">
              Curadoria Selecta
            </span>
            <h3 className={`font-serif text-3xl sm:text-4xl xl:text-5xl tracking-normal ${
              darkMode ? 'text-white' : 'text-zinc-900'
            }`}>
              Obras Fundamentais
            </h3>
          </div>
          <Link
            href="/galeria"
            className={`text-xs uppercase tracking-[0.3em] font-medium pb-2 border-b transition-colors hover:text-brand-gold focus:outline-none ${
              darkMode ? 'text-zinc-300 border-white/20 hover:border-brand-gold' : 'text-zinc-700 border-black/20 hover:border-brand-gold'
            }`}
          >
            Ver Galeria Completa &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
          {featured.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`${gridClass(index)} w-full flex flex-col group cursor-pointer`}
              onClick={() => router.push(`/galeria/${artwork.slug}`)}
            >
              <div className="overflow-hidden bg-neutral-100 aspect-square md:aspect-auto w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 dark:group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-end p-6 sm:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 via-black/10 to-transparent">
                  <p className="text-white text-xs font-light uppercase tracking-widest">
                    Consultar Obra &rarr;
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
