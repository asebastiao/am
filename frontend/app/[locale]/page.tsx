import { getFeaturedArtworks, getHomeGalleryItems } from '@/lib/api';
import Hero from '@/components/home/Hero';
import FeaturedGrid from '@/components/home/FeaturedGrid';

export default async function HomePage() {
  const [featuredArtworks, gallerySlides] = await Promise.all([
    getFeaturedArtworks(),
    getHomeGalleryItems(),
  ]);

  return (
    <>
      <Hero slides={gallerySlides} />
      <FeaturedGrid artworks={featuredArtworks} />
    </>
  );
}
