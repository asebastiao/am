import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getArtworks } from '@/lib/api';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export const metadata: Metadata = {
  title: 'Obras',
  description: 'Colecção completa de obras de Azevedo Muhanguena — pinturas, esculturas e relevos texturais.',
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ObrasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const artworks = await getArtworks();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-12">
      <GalleryGrid artworks={artworks} />
    </div>
  );
}
