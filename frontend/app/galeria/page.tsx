import type { Metadata } from 'next';
import { getArtworks } from '@/lib/api';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Colecção completa de obras de Azevedo Muhanguena — pinturas, esculturas e relevos texturais.',
};

export default async function GaleriaPage() {
  const artworks = await getArtworks();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-12">
      <GalleryGrid artworks={artworks} />
    </div>
  );
}
