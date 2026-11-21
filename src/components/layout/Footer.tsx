import { Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-gold/25 bg-parchment/80 py-10 px-4 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 text-gold" aria-hidden="true">
          <Sparkles className="h-4 w-4" />
          <span className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            Enzo’s Christening Celebration
          </span>
          <Sparkles className="h-4 w-4" />
        </div>
        <p className="font-display italic text-lg text-primary-container">
          “Every good and perfect gift is from above, coming down from the Father of the heavenly lights.”
        </p>
        <p className="mt-3 font-label text-xs tracking-wider text-ink-muted">
          © 2027 Reyes Family. Blessed with eternal love.
        </p>
        {onOpenAdmin && (
          <div className="mt-4 no-print">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="font-label text-[11px] uppercase tracking-wider text-ink-muted/70 hover:text-primary-container underline underline-offset-4 cursor-pointer"
            >
              Host Admin
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
