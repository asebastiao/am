'use client';

import Link from 'next/link';
import { Instagram, Mail, Facebook, ArrowUp } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export default function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer
      id="main-footer"
      className={`relative pt-8 pb-4 transition-colors duration-300 ${
        darkMode
          ? 'bg-brand-charcoal/40 text-neutral-400 border-t border-white/5'
          : 'bg-brand-soft-gray/50 text-zinc-500 border-t border-black/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 pb-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-2">
            <h4 className={`font-serif text-lg tracking-widest uppercase ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
              Azevedo Muhanguena
            </h4>
            <p className="text-xs font-light max-w-sm leading-relaxed">
              Pesquisa plástica dedicada à matéria, escultura monolítica e pintura de cargas minerais estruturadas sob o silêncio da planície alentejana.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <h5 className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${darkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
              Navegação
            </h5>
            <ul className="space-y-2 text-xs font-light">
              {[
                { href: '/',          label: 'Início' },
                { href: '/galeria',   label: 'Galeria de Obras' },
                { href: '/biografia', label: 'Biografia' },
                { href: '/agenda',    label: 'Agenda & Exposições' },
                { href: '/contacto',  label: 'Contacto' },
              ].map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-brand-gold transition-colors focus:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-2">
            <h5 className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${darkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
              Atelier & Contactos
            </h5>
            <ul className="space-y-2 text-xs font-light">
              <li className="flex items-center space-x-2">
                <Mail size={12} className="text-brand-gold" />
                <a href="mailto:atelier@azevedomuhanguena.com" className="hover:text-brand-gold transition-colors">
                  atelier@azevedomuhanguena.com
                </a>
              </li>
              <li>Luanda, Angola</li>
              <li className="pt-2 flex items-center space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors" aria-label="Instagram">
                  <Instagram size={14} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors" aria-label="Facebook">
                  <Facebook size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={`pt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-light tracking-wider ${
          darkMode ? 'border-white/5 text-zinc-600' : 'border-black/5 text-zinc-400'
        }`}>
          <div>
            &copy; {new Date().getFullYear()} Azevedo Muhanguena. Todos os direitos reservados.
          </div>
          <div className="flex items-center space-x-4">
            <button
              id="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-1 hover:text-brand-gold transition-colors focus:outline-none group"
              aria-label="Subir ao topo"
            >
              <span>Subir</span>
              <ArrowUp size={11} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
