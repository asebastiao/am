import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getArtworks, getContactInfo } from '@/lib/api';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Entre em contacto com o atelier de Azevedo Muhanguena para aquisições, visitas privadas ou informações.',
};

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ obra?: string }>;
}

export default async function ContactoPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { obra } = await searchParams;
  const artworkId = obra ? parseInt(obra, 10) || null : null;

  const [artworks, contactInfo] = await Promise.all([
    getArtworks(),
    getContactInfo(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-12">
      <ContactForm
        artworks={artworks}
        selectedArtworkId={artworkId}
        contactInfo={contactInfo}
      />
    </div>
  );
}
