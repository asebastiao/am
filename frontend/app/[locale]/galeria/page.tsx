import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getGalleryItems } from '@/lib/api';
import GalleryItemsGrid from '@/components/gallery/GalleryItemsGrid';

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Exposições, bastidores e arquivo visual de Azevedo Muhanguena.',
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function GaleriaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const items = await getGalleryItems();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-12">
      <GalleryItemsGrid items={items} />
    </div>
  );
}
