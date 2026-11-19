import { BookOpen, PenLine } from 'lucide-react';
import type { BlessingNote } from '../../types/baptism';
import { StationeryCard } from '../ui/StationeryCard';

interface BlessingsWallProps {
  blessings: BlessingNote[];
  onLeaveBlessing: () => void;
}

export function BlessingsWall({ blessings, onLeaveBlessing }: BlessingsWallProps) {
  return (
    <section aria-labelledby="blessings-heading" className="mx-auto max-w-4xl py-8">
      <StationeryCard>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 font-label text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              <BookOpen className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              Heirloom Notes • Vol. I Keepsake
            </span>
            <h2
              id="blessings-heading"
              className="mt-2 font-display text-3xl font-medium text-primary"
            >
              Blessings from Godparents & Family
            </h2>
          </div>

          <button
            type="button"
            onClick={onLeaveBlessing}
            className="min-h-11 inline-flex items-center gap-2 rounded-full border border-gold bg-parchment px-5 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-primary-container hover:bg-sky-soft/70 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <PenLine className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            Leave a Blessing
          </button>
        </div>

        {blessings.length === 0 ? (
          <p className="rounded-xl border border-gold/25 bg-surface p-6 text-center font-body text-base text-ink-muted">
            No blessings have been inscribed yet. Be the first to leave a prayer or note for Baby Enzo.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 list-none p-0 m-0">
            {blessings.map((note) => (
              <li
                key={note.id}
                className="flex flex-col justify-between rounded-xl border border-gold/30 bg-surface p-5"
              >
                <blockquote className="font-body italic text-base text-ink leading-relaxed">
                  “{note.message}”
                </blockquote>

                <div className="mt-5 pt-4 border-t border-gold/20 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container font-label text-xs font-semibold text-white"
                  >
                    {note.initials}
                  </span>
                  <div>
                    <p className="font-label text-sm font-semibold text-primary-container leading-tight">
                      {note.author}
                    </p>
                    <p className="font-label text-xs text-ink-muted mt-0.5">{note.role}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </StationeryCard>
    </section>
  );
}
