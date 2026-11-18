import type { ReactNode } from 'react';

interface StationeryCardProps {
  children: ReactNode;
  className?: string;
  archTop?: boolean;
}

/**
 * Celestial Cherub parchment stationery panel with nested gilded hairline borders
 * and soft baby-blue atmospheric glow.
 */
export function StationeryCard({
  children,
  className = '',
  archTop = false,
}: StationeryCardProps) {
  const outerRadius = archTop ? 'rounded-t-[10rem] rounded-b-2xl' : 'rounded-2xl';
  const innerRadius = archTop ? 'rounded-t-[9.5rem] rounded-b-xl' : 'rounded-xl';

  return (
    <div
      className={`relative bg-parchment border border-gold/45 atmospheric-glow p-2 sm:p-3 ${outerRadius} ${className}`}
    >
      <div
        className={`relative border border-gold/30 p-6 sm:p-10 md:p-12 ${innerRadius}`}
      >
        {/* Decorative 4-point corner stars */}
        <svg
          className="pointer-events-none absolute top-3 left-3 w-3.5 h-3.5 text-gold/70"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
        <svg
          className="pointer-events-none absolute top-3 right-3 w-3.5 h-3.5 text-gold/70"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
        {children}
      </div>
    </div>
  );
}
