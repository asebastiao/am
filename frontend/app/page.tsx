import { getFeaturedArtworks } from '@/lib/api';
import Hero from '@/components/home/Hero';
import FeaturedGrid from '@/components/home/FeaturedGrid';

export default async function HomePage() {
  const featuredArtworks = await getFeaturedArtworks();

  return (
    <>
      <Hero />
      <FeaturedGrid artworks={featuredArtworks} />
    </>
  );
}
