import { Calendar, Heart, MailCheck, Palette, Sparkles } from 'lucide-react';
import { EVENT_INFO } from '../../data/baptismData';
import { StationeryCard } from '../ui/StationeryCard';
import { CeremonialRule } from '../ui/CeremonialRule';
import bearBowtie from '../../assets/bear 1.png';
import bearDove from '../../assets/bear 2.png';
import bearBalloons from '../../assets/bear with balloon.png';

interface HeroSectionProps {
  onGoToRsvp: () => void;
  onOpenDressCode: () => void;
}

export function HeroSection({ onGoToRsvp, onOpenDressCode }: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-3xl pt-4 pb-6">
      <div className="relative">
        <StationeryCard archTop className="text-center">
          <div className="relative z-20 pb-24 sm:pb-24 md:pb-16">
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
                Dress Code: Baby Blue, Beige &amp; Brown
              </button>
            </div>

            <p className="mt-4 max-w-[15rem] sm:max-w-sm mx-auto font-label text-xs text-ink-muted">
              Kindly respond by <strong className="text-primary-container">{EVENT_INFO.rsvpDeadline}</strong> to ensure seating and communion keepsakes.
            </p>
          </div>
        </StationeryCard>

        {/* Decorative watercolor bear illustrations straddling the card corners */}
        <img
          src={bearBalloons}
          alt=""
          aria-hidden="true"
          width={378}
          height={547}
          decoding="async"
          className="pointer-events-none select-none absolute z-10 top-0 -right-2 sm:-top-5 sm:-right-6 md:-top-7 md:-right-10 w-20 sm:w-28 md:w-36 h-auto drop-shadow-[0_6px_12px_rgba(43,68,91,0.14)]"
        />
        <img
          src={bearBowtie}
          alt=""
          aria-hidden="true"
          width={486}
          height={677}
          decoding="async"
          className="pointer-events-none select-none absolute z-10 -bottom-2 -left-2 sm:-bottom-5 sm:-left-6 md:-bottom-6 md:-left-9 w-20 sm:w-28 md:w-32 h-auto -rotate-3 drop-shadow-[0_6px_12px_rgba(43,68,91,0.14)]"
        />
        <img
          src={bearDove}
          alt=""
          aria-hidden="true"
          width={397}
          height={533}
          decoding="async"
          className="pointer-events-none select-none absolute z-10 -bottom-2 -right-2 sm:-bottom-5 sm:-right-6 md:-bottom-6 md:-right-9 w-24 sm:w-32 md:w-36 h-auto rotate-2 drop-shadow-[0_6px_12px_rgba(43,68,91,0.14)]"
        />
      </div>
    </section>
  );
}
