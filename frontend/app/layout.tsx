import type { Metadata } from 'next';
import { ThemeProvider } from '@/lib/theme';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Azevedo Muhanguena — Arte Contemporânea',
    template: '%s | Azevedo Muhanguena',
  },
  description:
    'Portfolio de Azevedo Muhanguena — Artista plástica especializada em escultura monolítica, pintura de cargas minerais e relevos texturais. Atelier no Alentejo, Portugal.',
  openGraph: {
    type:   'website',
    locale: 'pt_PT',
    siteName: 'Azevedo Muhanguena',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
            <Navbar />
            <main className="flex-grow pt-24">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
