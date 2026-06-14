'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/lib/theme';

const navItems = [
  { href: '/',          label: 'Home' },
  { href: '/galeria',   label: 'Galeria' },
  { href: '/biografia', label: 'Biografia' },
  { href: '/agenda',    label: 'Agenda' },
  { href: '/contacto',  label: 'Contacto' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { darkMode, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? darkMode
              ? 'bg-brand-dark/95 border-b border-white/5 shadow-sm backdrop-blur-md py-4'
              : 'bg-white/95 border-b border-black/5 shadow-[0_1px_10px_rgba(0,0,0,0.02)] backdrop-blur-md py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex flex-col items-start focus:outline-none">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.2em] uppercase transition-colors duration-300">
              Azevedo Muhanguena
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-brand-gold mt-1 group-hover:tracking-[0.5em] transition-all duration-300">
              Contemporary Art
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-xs uppercase tracking-[0.25em] py-2 transition-colors duration-300 focus:outline-none hover:text-brand-gold ${
                    active
                      ? 'text-brand-gold font-medium'
                      : darkMode ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <button
              id="theme-toggle-desktop"
              onClick={toggle}
              className={`p-2 rounded-full border transition-all duration-300 ${
                darkMode
                  ? 'border-white/10 hover:bg-white/5 text-brand-gold'
                  : 'border-black/5 hover:bg-black/5 text-zinc-600 hover:text-brand-gold'
              } focus:outline-none`}
              aria-label="Alternar sala clara / escura"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              id="theme-toggle-mobile"
              onClick={toggle}
              className={`p-2 rounded-full border ${
                darkMode ? 'border-white/10 text-brand-gold' : 'border-black/5 text-zinc-600'
              } focus:outline-none`}
              aria-label="Alternar visual"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 -mr-2 transition-colors ${
                darkMode ? 'text-zinc-200 hover:text-white' : 'text-zinc-800 hover:text-black'
              } focus:outline-none`}
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-overlay"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-40 md:hidden flex flex-col justify-center px-8 sm:px-12 ${
              darkMode ? 'bg-brand-dark' : 'bg-[#fefdfb]'
            }`}
          >
            <div className="space-y-6 flex flex-col items-start mt-12">
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`text-2xl font-serif tracking-widest text-left focus:outline-none py-1 border-b border-transparent block ${
                        active
                          ? 'text-brand-gold border-brand-gold/20'
                          : darkMode ? 'text-zinc-300' : 'text-zinc-700'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute bottom-12 left-8 sm:left-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Azevedo Muhanguena
              </p>
              <p className="text-[9px] tracking-wider text-zinc-400 mt-1">
                Atelier d&apos;Art Contemporain — Évora
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
