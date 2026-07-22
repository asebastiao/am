import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from '@/lib/theme';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '../globals.css';

// Necessário para que páginas filhas com generateStaticParams (ex:
// /obras/[slug]) consigam ser pré-renderizadas em AMBOS os idiomas.
// Sem isto, o next-intl acaba por ler o idioma via headers() em tempo de
// pedido, o que entra em conflito com a geração estática e provoca o erro
// "DYNAMIC_SERVER_USAGE" nas rotas com locale diferente do por omissão.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: {
      default: t('titleDefault'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'pt_PT',
      siteName: t('siteName'),
    },
  };
}

export default async function RootLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode, 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  // Fixa o locale para esta renderização — obrigatório sempre que existe
  // generateStaticParams nesta árvore de rotas (ver comentário acima).
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale === 'en' ? 'en-US' : 'pt-PT'} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
              <Navbar />
              <main className="flex-grow pt-24">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
