'use client';

import { useState, useEffect, useTransition } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/lib/theme';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';

const navItems = [
  { href: '/',          key: 'home' },
  { href: '/obras',     key: 'obras' },
  { href: '/galeria',   key: 'galeria' },
  { href: '/agenda',    key: 'agenda' },
  { href: '/biografia', key: 'biografia' },
  { href: '/contacto',  key: 'contacto' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { darkMode, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const toggleLanguage = () => {
    const nextLocale = locale === 'pt' ? 'en' : 'pt';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
        style={scrolled ? {
          backgroundColor: 'color-mix(in srgb, var(--color-surface-1) 92%, transparent)',
          borderBottom: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex flex-col items-start focus-visible:outline-none">
            <span
              className="font-serif text-xl sm:text-2xl tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: 'var(--color-fg-primary)' }}
            >
              Azevedo Muhanguena
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-brand-gold mt-1 group-hover:tracking-[0.5em] transition-all duration-300">
              Contemporary Art
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-xs uppercase tracking-[0.25em] py-2 transition-colors duration-300 focus-visible:outline-none hover:text-brand-gold"
                  style={{ color: active ? 'var(--color-brand-gold)' : 'var(--color-fg-secondary)', fontWeight: active ? 500 : 400 }}
                >
                  {t(`nav.${item.key}`)}
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

            <div className="flex items-center space-x-2 pl-2">
              <button
                id="theme-toggle-desktop"
                onClick={toggle}
                className="icon-btn"
                aria-label={t('common.toggleTheme')}
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              <button
                id="lang-toggle-desktop"
                onClick={toggleLanguage}
                disabled={isPending}
                className="icon-btn !w-auto px-3 text-[11px] uppercase tracking-widest font-medium"
                aria-label={t('common.switchLang')}
              >
                {locale === 'pt' ? 'EN' : 'PT'}
              </button>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              id="theme-toggle-mobile"
              onClick={toggle}
              className="icon-btn"
              aria-label={t('common.toggleTheme')}
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              id="lang-toggle-mobile"
              onClick={toggleLanguage}
              disabled={isPending}
              className="icon-btn !w-auto px-2.5 text-[10px] uppercase tracking-widest font-medium"
              aria-label={t('common.switchLang')}
            >
              {locale === 'pt' ? 'EN' : 'PT'}
            </button>
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="icon-btn"
              aria-label={t('common.mainMenu')}
              aria-expanded={mobileMenuOpen}
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
            className="fixed inset-0 z-40 md:hidden flex flex-col justify-center px-8 sm:px-12 overlay-surface"
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
                      className="text-2xl font-serif tracking-widest text-left focus-visible:outline-none py-1 border-b block transition-colors duration-200"
                      style={{
                        color: active ? 'var(--color-brand-gold)' : 'var(--color-fg-secondary)',
                        borderColor: active ? 'color-mix(in srgb, var(--color-brand-gold) 20%, transparent)' : 'transparent',
                      }}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute bottom-12 left-8 sm:left-12">
              <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--color-fg-muted)' }}>
                Azevedo Muhanguena
              </p>
              <p className="text-[9px] tracking-wider mt-1" style={{ color: 'var(--color-fg-muted)' }}>
                {t('common.atelierSubtitle')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
