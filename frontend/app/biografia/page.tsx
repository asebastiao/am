import type { Metadata } from 'next';
import { getBiography } from '@/lib/api';
import BiographyContent from '@/components/biography/BiographyContent';

export const metadata: Metadata = {
  title: 'Biografia',
  description: 'Trajectória artística e currículo de Azevedo Muhanguena — exposições, prémios e manifesto.',
};

export default async function BiografiaPage() {
  const biography = await getBiography();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-12">
      {biography ? (
        <BiographyContent biography={biography} />
      ) : (
        <p className="font-serif italic text-zinc-500 text-center py-24">
          Biografia temporariamente indisponível.
        </p>
      )}
    </div>
  );
}
