'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '@/types';

interface Props {
  slides?: GalleryItem[];
}

export default function Hero({ slides }: Props) {
  const [current, setCurrent] = useState(0);

  // Apenas dados dinâmicos vindos do destaque da galeria — sem fallback estático/mockado.
  const images = (slides ?? []).map(s => s.image_url).filter(Boolean) as string[];

  useEffect(() => {
    if (images.length < 2) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section
      id="home-hero"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-zinc-950"
    >
      {/* Carousel — apenas dados dinâmicos do destaque da galeria */}
      <div className="absolute inset-0 z-0">
        {images.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.img
              key={images[current]}
              src={images[current]}
              alt="Artwork Background"
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
            />
          </AnimatePresence>
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: 'linear-gradient(to top, var(--color-surface-0), color-mix(in srgb, var(--color-surface-0) 30%, transparent), color-mix(in srgb, var(--color-surface-0) 55%, transparent))',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-tight mb-6"
          style={{ color: 'var(--color-fg-primary)' }}
        >
        </motion.h1>
      </div>

      {/* Indicators — só fazem sentido com 2+ imagens dinâmicas */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`${index + 1}`}
              aria-current={current === index ? 'true' : 'false'}
              className={`h-2 transition-all duration-300 focus-visible:outline-none ${
                current === index ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}