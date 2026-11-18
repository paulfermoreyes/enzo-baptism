import { Calendar, Heart, MailCheck, Palette, Sparkles } from 'lucide-react';
import { EVENT_INFO } from '../../data/baptismData';
import { StationeryCard } from '../ui/StationeryCard';
import { CeremonialRule } from '../ui/CeremonialRule';

interface HeroSectionProps {
  onGoToRsvp: () => void;
  onOpenDressCode: () => void;
}

export function HeroSection({ onGoToRsvp, onOpenDressCode }: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-3xl pt-4 pb-6">
      <StationeryCard archTop className="text-center">
        {/* Celestial cloud & starlight emblem */}
        <div className="mx-auto mb-5 flex flex-col items-center">
          <div className="relative inline-flex items-center justify-center rounded-full bg-sky-soft/80 px-5 py-2 border border-gold/30 mb-4">
            <Sparkles className="w-4 h-4 text-gold mr-2" aria-hidden="true" />
            <span className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-primary-container">
              A Blessed Sacrament
            </span>
          </div>

          <svg
            className="w-28 h-16 text-sky mb-2"
            viewBox="0 0 160 80"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M36 62h88a18 18 0 0 0 3.2-35.7A26 26 0 0 0 77.5 18 22 22 0 0 0 38 30.5 16 16 0 0 0 36 62Z"
              fill="currentColor"
              fillOpacity="0.55"
            />
            <path
              d="M80 12v14M73 19h14"
              stroke="#c5a059"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="30" cy="24" r="2" fill="#c5a059" />
            <circle cx="132" cy="20" r="2.5" fill="#c5a059" />
            <circle cx="122" cy="48" r="1.5" fill="#c5a059" />
          </svg>
        </div>

        <h1
          id="hero-heading"
          className="font-display text-4xl sm:text-5xl md:text-[3.25rem] leading-tight text-primary font-normal"
        >
          Enzo’s Christening Day
        </h1>

        <p className="mt-4 max-w-xl mx-auto font-body text-lg sm:text-xl text-ink-muted leading-relaxed">
          You are cordially invited to celebrate the baptism and divine blessings of our beloved
        </p>

        <div className="mt-5">
          <p className="font-display italic text-3xl sm:text-4xl text-primary-container font-medium">
            {EVENT_INFO.babyFullName}
          </p>
          <p className="mt-1 font-label text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            “{EVENT_INFO.babyNickname}”
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-sky-soft px-5 py-2.5 border border-sky text-primary-container">
          <Calendar className="w-4 h-4 text-gold" aria-hidden="true" />
          <span className="font-label text-sm font-semibold tracking-wide">
            {EVENT_INFO.dateDisplay}
          </span>
        </div>

        <CeremonialRule />

        <blockquote className="max-w-lg mx-auto font-body italic text-lg text-ink-muted">
          “{EVENT_INFO.scripture.text}”
          <footer className="mt-1.5 not-italic font-label text-xs font-semibold uppercase tracking-[0.14em] text-secondary flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            {EVENT_INFO.scripture.reference}
          </footer>
        </blockquote>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onGoToRsvp}
            className="min-h-12 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 font-label text-sm font-semibold tracking-wide text-primary shadow-md hover:bg-gold-bright/90 transition-all cursor-pointer"
          >
            <MailCheck className="w-4 h-4" aria-hidden="true" />
            RSVP & Verification
          </button>

          <button
            type="button"
            onClick={onOpenDressCode}
            className="min-h-12 inline-flex items-center gap-2 rounded-full border border-gold bg-parchment/90 px-6 py-3 font-label text-sm font-semibold tracking-wide text-primary-container hover:bg-sky-soft/60 transition-colors cursor-pointer"
          >
            <Palette className="w-4 h-4 text-gold" aria-hidden="true" />
            Dress Code: Pastels
          </button>
        </div>

        <p className="mt-4 font-label text-xs text-ink-muted">
          Kindly respond by <strong className="text-primary-container">{EVENT_INFO.rsvpDeadline}</strong> to ensure seating and communion keepsakes.
        </p>
      </StationeryCard>
    </section>
  );
}
