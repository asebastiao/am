import { getGalleryItems } from '@/lib/api';
import GalleryItemsGrid from '@/components/gallery/GalleryItemsGrid';

export const metadata = {
  title: 'Arquivos',
  description: 'Itens de galeria categorizados como Arquivo.'
};

export default async function ArquivosPage() {
  const items = await getGalleryItems('outros');

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-12">
      <h2 className="font-serif text-3xl mb-6">Arquivos</h2>
      <GalleryItemsGrid items={items} />
    </div>
  );
}
