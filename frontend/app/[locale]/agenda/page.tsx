import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getAgenda } from '@/lib/api';
import AgendaTimeline from '@/components/agenda/AgendaTimeline';

export const metadata: Metadata = {
  title: 'Agenda',
  description: 'Exposições, workshops e palestras de Azevedo Muhanguena — próximos eventos e histórico.',
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AgendaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const events = await getAgenda();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 py-12">
      <AgendaTimeline events={events} />
    </div>
  );
}
