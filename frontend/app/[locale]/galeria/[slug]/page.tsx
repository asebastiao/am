import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtworkBySlug, getArtworks } from '@/lib/api';
import ArtworkDetail from '@/components/gallery/ArtworkDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const artworks = await getArtworks();
    return artworks.map(a => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) return { title: 'Obra não encontrada' };
  return {
    title: artwork.title,
    description: artwork.description ?? `${artwork.title} — ${artwork.medium}, ${artwork.year}`,
    openGraph: {
      images: artwork.image_url ? [{ url: artwork.image_url }] : [],
    },
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const [artwork, allArtworks] = await Promise.all([
    getArtworkBySlug(slug),
    getArtworks(),
  ]);

  if (!artwork) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-10">
      <ArtworkDetail artwork={artwork} allArtworks={allArtworks} />
    </div>
  );
}
