import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getBiography } from '@/lib/api';
import BiographyContent from '@/components/biography/BiographyContent';

export const metadata: Metadata = {
  title: 'Biografia',
  description: 'Trajectória artística e currículo de Azevedo Muhanguena — exposições, prémios e manifesto.',
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BiografiaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const biography = await getBiography();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-12">
      {biography ? (
        <BiographyContent biography={biography} />
      ) : (
        <p className="font-serif italic text-center py-24" style={{ color: 'var(--color-fg-muted)' }}>
          Biografia temporariamente indisponível.
        </p>
      )}
    </div>
  );
}
