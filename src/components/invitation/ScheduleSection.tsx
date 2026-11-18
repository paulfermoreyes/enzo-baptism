import { Church, Clock, ExternalLink, MapPin, Utensils } from 'lucide-react';
import { EVENT_INFO } from '../../data/baptismData';
import { StationeryCard } from '../ui/StationeryCard';

export function ScheduleSection() {
  const parts = [
    {
      ...EVENT_INFO.ceremony,
      eyebrow: 'Holy Ceremony',
      badge: 'Sacrament',
      Icon: Church,
    },
    {
      ...EVENT_INFO.reception,
      eyebrow: 'Celebration Feast',
      badge: 'Luncheon',
      Icon: Utensils,
    },
  ];

  return (
    <section aria-labelledby="schedule-heading" className="mx-auto max-w-4xl py-8">
      <div className="text-center mb-8">
        <span className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          Order of Celebration
        </span>
        <h2
          id="schedule-heading"
          className="mt-2 font-display text-3xl sm:text-4xl font-medium text-primary"
        >
          Ceremony & Reception
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parts.map(({ part, eyebrow, title, time, venue, address, mapsUrl, badge, Icon }) => (
          <StationeryCard key={part} className="h-full">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-3.5 py-1 font-label text-xs font-semibold uppercase tracking-wider text-primary-container">
                <Icon className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                {part} • {eyebrow}
              </span>
              <span className="font-label text-xs font-semibold uppercase tracking-wider text-secondary">
                {badge}
              </span>
            </div>

            <h3 className="font-display text-2xl font-medium text-primary-container">
              {title}
            </h3>

            <div className="mt-4 space-y-3 text-ink-muted">
              <p className="flex items-center gap-2.5 font-label text-sm font-semibold text-primary-container">
                <Clock className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                {time}
              </p>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="font-body text-lg font-medium text-primary">{venue}</p>
                  <p className="font-body text-base text-ink-muted leading-snug mt-0.5">
                    {address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gold/25">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center gap-2 rounded-full border border-gold bg-parchment px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary-container hover:bg-sky-soft/70 transition-colors"
              >
                Directions (Google Maps)
                <ExternalLink className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              </a>
            </div>
          </StationeryCard>
        ))}
      </div>
    </section>
  );
}
