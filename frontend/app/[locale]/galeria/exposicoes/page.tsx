import { getGalleryItems } from '@/lib/api';
import GalleryItemsGrid from '@/components/gallery/GalleryItemsGrid';

export const metadata = {
  title: 'Exposições',
  description: 'Itens de galeria categorizados como Exposições.'
};

export default async function ExposicoesPage() {
  const items = await getGalleryItems('exposicao');

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-12">
      <h2 className="font-serif text-3xl mb-6">Exposições</h2>
      <GalleryItemsGrid items={items} />
    </div>
  );
}
