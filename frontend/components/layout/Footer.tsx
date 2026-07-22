'use client';

import { Link } from '@/i18n/routing';
import { Instagram, Mail, Facebook, ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer
      id="main-footer"
      className="relative pt-14 pb-6 transition-colors duration-300 surface-1"
      style={{ borderTop: '1px solid var(--color-border-subtle)', color: 'var(--color-fg-secondary)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif text-lg tracking-widest uppercase" style={{ color: 'var(--color-fg-primary)' }}>
              Azevedo Muhanguena
            </h4>
            <p className="text-xs font-light max-w-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Facebook">
                <Facebook size={14} />
              </a>
              <a href="mailto:atelier@azevedomuhanguena.com" className="icon-btn" aria-label="Email">
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: 'var(--color-fg-primary)' }}>
              {t('footer.navTitle')}
            </h5>
            <ul className="space-y-2.5 text-xs font-light">
              {[
                { href: '/',          label: t('footer.navHome') },
                { href: '/obras',     label: t('footer.navObras') },
                { href: '/galeria',   label: t('footer.navGaleria') },
                { href: '/agenda',    label: t('footer.navAgenda') },
                { href: '/biografia', label: t('footer.navBiografia') },
                { href: '/contacto',  label: t('footer.navContacto') },
              ].map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href as any}
                    className="hover:text-brand-gold transition-colors duration-200 focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: 'var(--color-fg-primary)' }}>
              {t('footer.contactTitle')}
            </h5>
            <ul className="space-y-3 text-xs font-light">
              <li className="flex items-center space-x-2">
                <Mail size={12} className="text-brand-gold flex-shrink-0" />
                <a href="mailto:atelier@azevedomuhanguena.com" className="hover:text-brand-gold transition-colors duration-200">
                  atelier@azevedomuhanguena.com
                </a>
              </li>
              <li>{t('footer.location')}</li>
            </ul>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-light tracking-wider"
          style={{ borderTop: '1px solid var(--color-border-subtle)', color: 'var(--color-fg-muted)' }}
        >
          <div>
            &copy; {new Date().getFullYear()} Azevedo Muhanguena. {t('footer.rights')}
          </div>
          <button
            id="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-1.5 hover:text-brand-gold transition-colors duration-200 focus-visible:outline-none group"
            aria-label={t('footer.backToTop')}
          >
            <span>{t('footer.backToTop')}</span>
            <ArrowUp size={11} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </footer>
  );
}
