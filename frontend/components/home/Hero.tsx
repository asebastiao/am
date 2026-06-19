'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useTheme } from '@/lib/theme';

const slides = [
  '/images/obra_echoes.png',
  '/images/obra_2.png',
  '/images/obra_3.png',
  '/images/obra_4.png',
];

export default function Hero() {
  const { darkMode } = useTheme();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home-hero"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-zinc-950"
    >
      {/* Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[current]}
            src={slides[current]}
            alt="Artwork Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            darkMode
              ? 'bg-gradient-to-t from-brand-dark via-brand-dark/30 to-brand-dark/60'
              : 'bg-gradient-to-t from-[#fefdfb] via-[#fefdfb]/20 to-[#fefdfb]/50'
          }`}
        />
      </div>

      {/* Content */}
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
      </div>

      {/* Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              current === index
                ? 'bg-white scale-125'
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}