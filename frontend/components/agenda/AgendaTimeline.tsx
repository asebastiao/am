'use client';

import { Calendar, MapPin } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { AgendaEvent } from '@/types';

interface Props { events: AgendaEvent[] }

const typeLabel = (type: AgendaEvent['type']) => {
  switch (type) {
    case 'exposicao': return 'Exposição';
    case 'workshop':  return 'Workshop Prático';
    case 'palestra':  return 'Conferência / Debate';
    case 'evento':    return 'Vernissage / Evento';
  }
};

export default function AgendaTimeline({ events }: Props) {
  const { darkMode } = useTheme();
  const upcoming = events.filter(e => e.upcoming);
  const past     = events.filter(e => !e.upcoming);

  return (
    <div id="agenda-timeline-section" className="py-8 sm:py-12 space-y-24">

      {/* Upcoming */}
      <div className="space-y-12">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-brand-gold font-semibold block mb-2">
            Próximos Compromissos
          </span>
          <h2 className={`font-serif text-3xl sm:text-4xl tracking-tight ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
            Exposições & Projectos Futuros
          </h2>
        </div>

        {upcoming.length === 0 ? (
          <p className={`text-sm italic font-light ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Não existem eventos agendados para os próximos meses. Por favor verifique o catálogo ou entre em contacto.
          </p>
        ) : (
          <div className="relative border-l border-brand-gold/15 ml-4 pl-8 sm:pl-12 space-y-16 py-4">
            {upcoming.map(event => (
              <div key={event.id} className="relative group">
                <div className="absolute -left-[41px] sm:-left-[57px] top-1 h-5 w-5 rounded-full bg-[#fefdfb] dark:bg-brand-dark border-2 border-brand-gold flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                  <div className="h-2 w-2 rounded-full bg-brand-gold" />
                </div>

                <div className="space-y-4 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-[#c3a472] px-2.5 py-1 border border-brand-gold/20 bg-brand-gold/5">
                      {typeLabel(event.type)}
                    </span>
                    <span className={`text-[10px] sm:text-xs font-mono flex items-center uppercase tracking-wider ${
                      darkMode ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>
                      <Calendar size={12} className="text-zinc-400 mr-1" />
                      {event.date_string}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className={`font-serif text-xl sm:text-2xl tracking-normal transition-colors group-hover:text-brand-gold ${
                      darkMode ? 'text-white' : 'text-zinc-950'
                    }`}>
                      {event.title}
                    </h3>
                    <p className={`text-xs flex items-center ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      <MapPin size={12} className="text-[#c3a472] mr-1.5 flex-shrink-0" />
                      <span className="font-light">{event.location}</span>
                    </p>
                  </div>

                  <p className={`text-sm font-light leading-relaxed max-w-2xl ${
                    darkMode ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div className="pt-16 border-t border-black/5 dark:border-white/5 space-y-12">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-zinc-400 font-semibold block mb-2">
              Histórico do Percurso
            </span>
            <h2 className={`font-serif text-2xl tracking-tight ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
              Exposições & Palestras Anteriores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {past.map(event => (
              <div
                key={event.id}
                className={`p-6 border flex flex-col justify-between space-y-4 transition-colors ${
                  darkMode
                    ? 'bg-zinc-900/10 border-white/5 hover:bg-zinc-900/20'
                    : 'bg-brand-soft-gray/30 border-black/5 hover:bg-brand-soft-gray/60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">{typeLabel(event.type)}</span>
                    <span className="text-[9px] text-zinc-400 font-mono">{event.date_string}</span>
                  </div>
                  <h3 className={`font-serif text-lg tracking-normal ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {event.title}
                  </h3>
                  <p className={`text-xs font-light leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {event.description}
                  </p>
                </div>
                <p className="text-[10px] flex items-center text-zinc-400 pt-2 font-mono">
                  <MapPin size={10} className="mr-1" />
                  {event.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
