'use client';

import { Calendar, MapPin } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useTranslateDynamic } from '@/lib/dynamic-translator';
import { AgendaEvent } from '@/types';

interface Props { events: AgendaEvent[] }

// ── Individual event card that translates its own content ────────────────────
function EventCard({ event, t, variant }: { event: AgendaEvent; t: any; variant: 'upcoming' | 'past' }) {
  const locale = useLocale();

  const translated = useTranslateDynamic({
    title: event.title ?? '',
    location: event.location ?? '',
    description: event.description ?? '',
    date_string: event.date_string ?? '',
  }, locale);

  const typeLabel = () => {
    switch (event.type) {
      case 'exposicao': return t('typeExhibition');
      case 'workshop':  return t('typeWorkshop');
      case 'palestra':  return t('typeTalk');
      case 'evento':    return t('typeEvent');
    }
  };

  if (variant === 'upcoming') {
    return (
      <div className="relative group">
        <div
          className="absolute -left-[41px] sm:-left-[57px] top-1 h-5 w-5 flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
          style={{ backgroundColor: 'var(--color-surface-0)', border: '2px solid var(--color-brand-gold)' }}
        >
          <div className="h-2 w-2 bg-brand-gold" />
        </div>

        <div className="card p-6 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge badge-gold !text-[10px] font-mono normal-case">
              {typeLabel()}
            </span>
            <span className="text-[10px] sm:text-xs font-mono flex items-center uppercase tracking-wider" style={{ color: 'var(--color-fg-muted)' }}>
              <Calendar size={12} className="mr-1" />
              {translated.date_string}
            </span>
          </div>

          <div className="space-y-2">
            <h3
              className="font-serif text-xl sm:text-2xl tracking-normal transition-colors duration-200 group-hover:text-brand-gold"
              style={{ color: 'var(--color-fg-primary)' }}
            >
              {translated.title}
            </h3>
            <p className="text-xs flex items-center" style={{ color: 'var(--color-fg-secondary)' }}>
              <MapPin size={12} className="text-[#c3a472] mr-1.5 flex-shrink-0" />
              <span className="font-light">{translated.location}</span>
            </p>
          </div>

          <p className="text-sm font-light leading-relaxed max-w-2xl" style={{ color: 'var(--color-fg-secondary)' }}>
            {translated.description}
          </p>
        </div>
      </div>
    );
  }

  // Past event card
  return (
    <div className="card card-hover p-6 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--color-fg-muted)' }}>{typeLabel()}</span>
          <span className="text-[9px] font-mono" style={{ color: 'var(--color-fg-muted)' }}>{translated.date_string}</span>
        </div>
        <h3 className="font-serif text-lg tracking-normal" style={{ color: 'var(--color-fg-primary)' }}>
          {translated.title}
        </h3>
        <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>
          {translated.description}
        </p>
      </div>
      <p className="text-[10px] flex items-center pt-2 font-mono" style={{ color: 'var(--color-fg-muted)' }}>
        <MapPin size={10} className="mr-1" />
        {translated.location}
      </p>
    </div>
  );
}

export default function AgendaTimeline({ events }: Props) {
  const t = useTranslations('agenda');
  const upcoming = events.filter(e => e.upcoming);
  const past     = events.filter(e => !e.upcoming);

  return (
    <div id="agenda-timeline-section" className="py-8 sm:py-12 space-y-24">

      {/* Upcoming */}
      <div className="space-y-12">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-brand-gold font-semibold block mb-2">
            {t('upcomingSubtitle')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight" style={{ color: 'var(--color-fg-primary)' }}>
            {t('upcomingTitle')}
          </h2>
        </div>

        {upcoming.length === 0 ? (
          <p className="text-sm italic font-light" style={{ color: 'var(--color-fg-muted)' }}>
            {t('noUpcoming')}
          </p>
        ) : (
          <div className="relative border-l ml-4 pl-8 sm:pl-12 space-y-16 py-4" style={{ borderColor: 'color-mix(in srgb, var(--color-brand-gold) 15%, transparent)' }}>
            {upcoming.map(event => (
              <EventCard key={event.id} event={event} t={t} variant="upcoming" />
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div className="pt-16 space-y-12" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] font-semibold block mb-2" style={{ color: 'var(--color-fg-muted)' }}>
              {t('pastSubtitle')}
            </span>
            <h2 className="font-serif text-2xl tracking-tight" style={{ color: 'var(--color-fg-secondary)' }}>
              {t('pastTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {past.map(event => (
              <EventCard key={event.id} event={event} t={t} variant="past" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
