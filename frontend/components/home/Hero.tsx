'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export default function Hero() {
  const router = useRouter();
  const { darkMode } = useTheme();

  return (
    <section
      id="home-hero"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-zinc-950"
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.85 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/obra_echoes.png"
          alt="Azevedo Muhanguena — Ecos do Vento Background"
          className="w-full h-full object-cover object-center"
        />
        <div className={`absolute inset-0 transition-colors duration-500 ${
          darkMode
            ? 'bg-gradient-to-t from-brand-dark via-brand-dark/30 to-brand-dark/60'
            : 'bg-gradient-to-t from-[#fefdfb] via-[#fefdfb]/20 to-[#fefdfb]/50'
        }`} />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className={`font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-tight mb-6 ${
            darkMode ? 'text-zinc-50' : 'text-zinc-900'
          }`}
        >
          Azevedo Muhanguena
        </motion.h1>

        <motion.button
          id="btn-explore-artworks"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          onClick={() => router.push('/galeria')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-8 py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 border focus:outline-none ${
            darkMode
              ? 'bg-transparent text-white border-white/20 hover:bg-white hover:text-brand-dark hover:border-white'
              : 'bg-transparent text-brand-charcoal border-brand-charcoal/20 hover:bg-brand-charcoal hover:text-white hover:border-brand-charcoal'
          }`}
        >
          Explorar Obras
        </motion.button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className={`text-[9px] uppercase tracking-[0.3em] font-medium leading-none mb-2 ${
            darkMode ? 'text-zinc-500' : 'text-zinc-600'
          }`}
        >
          Descer
        </motion.span>
        <button
          id="btn-scroll-down"
          onClick={() => document.getElementById('editorial-intro')?.scrollIntoView({ behavior: 'smooth' })}
          className={`p-2 rounded-full border transition-transform hover:translate-y-1 focus:outline-none ${
            darkMode ? 'border-white/10 text-zinc-400' : 'border-black/5 text-zinc-600'
          }`}
          aria-label="Descer para próxima seção"
        >
          <ArrowDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
