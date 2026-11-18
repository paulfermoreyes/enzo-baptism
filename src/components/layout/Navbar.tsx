import { Sparkles } from 'lucide-react';
import type { PageView } from '../../types/baptism';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  hasConfirmedPass: boolean;
}

const NAV_ITEMS: { id: PageView; label: string }[] = [
  { id: 'invitation', label: 'Invitation' },
  { id: 'rsvp', label: 'RSVP & Registry' },
  { id: 'pass', label: 'Event Pass' },
];

export function Navbar({ currentView, onNavigate, hasConfirmedPass }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gold/25 bg-parchment/90 backdrop-blur-md">
      <a
        href="#main-content"
        className="visually-hidden focus:not-sr-only fixed top-3 left-3 z-50 rounded-full bg-primary px-4 py-2 font-label text-xs font-semibold uppercase tracking-wider text-white shadow-md"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('invitation')}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-soft border border-gold/40 text-gold transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <span className="block font-display text-lg font-semibold leading-tight text-primary-container">
              Lorenzo Paul
            </span>
            <span className="block font-label text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
              Holy Baptism
            </span>
          </div>
        </button>

        <nav aria-label="Primary" className="flex items-center gap-1.5 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
                className={`min-h-10 rounded-full px-3.5 sm:px-4 py-2 font-label text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-white shadow-sm'
                    : 'text-primary-container hover:bg-sky-soft/70 border border-transparent hover:border-gold/30'
                }`}
              >
                {item.label}
                {item.id === 'pass' && hasConfirmedPass && !isActive && (
                  <span
                    className="ml-1.5 inline-block h-2 w-2 rounded-full bg-gold"
                    aria-label="Confirmed"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
