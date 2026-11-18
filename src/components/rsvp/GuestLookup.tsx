import { useId, useState } from 'react';
import { AlertCircle, BadgeCheck, Loader2, Search, Sparkles } from 'lucide-react';
import { lookupGuestAndRsvp } from '../../services/baptismService';
import type { GuestRecord, RsvpSubmission } from '../../types/baptism';

interface GuestLookupProps {
  verifiedGuest: GuestRecord | null;
  onVerify: (guest: GuestRecord) => void;
  onFoundExistingRsvp: (guest: GuestRecord, rsvp: RsvpSubmission) => void;
  onClearGuest: () => void;
}

export function GuestLookup({
  verifiedGuest,
  onVerify,
  onFoundExistingRsvp,
  onClearGuest,
}: GuestLookupProps) {
  const [query, setQuery] = useState(verifiedGuest?.displayName ?? '');
  const [isSearching, setIsSearching] = useState(false);
  const [notFoundError, setNotFoundError] = useState<string | null>(null);
  const inputId = useId();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setNotFoundError(null);

    try {
      const { guest, existingRsvp } = await lookupGuestAndRsvp(trimmed);
      if (!guest) {
        onClearGuest();
        setNotFoundError(
          'We could not find that name on our invitation list. Please check the spelling on your invitation or contact the parents.'
        );
        return;
      }

      if (existingRsvp) {
        onFoundExistingRsvp(guest, existingRsvp);
      } else {
        onVerify(guest);
      }
    } catch {
      setNotFoundError('Unable to verify your invitation right now. Please try again in a moment.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section aria-labelledby="lookup-heading" className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-label text-sm font-semibold text-white">
          1
        </span>
        <div>
          <h2 id="lookup-heading" className="font-display text-2xl font-medium text-primary">
            Guest Verification
          </h2>
          <p className="font-body text-base text-ink-muted">
            Please enter your name as written on your physical or digital invitation. If you have already responded, you will be taken straight to your confirmation.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gold/35 bg-surface p-5 sm:p-6">
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <label
              htmlFor={inputId}
              className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1.5"
            >
              Invitation Name
            </label>
            <input
              id={inputId}
              name="guestLookup"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (notFoundError) setNotFoundError(null);
              }}
              placeholder="e.g. Elena & Marco Santos"
              className="celestial-input w-full rounded-lg border border-gold-light bg-white px-4 py-2.5 text-ink"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="min-h-12 inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-2.5 font-label text-sm font-semibold text-white hover:bg-primary disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="w-4 h-4" aria-hidden="true" />
            )}
            {isSearching ? 'Checking...' : 'Verify Guest'}
          </button>
        </form>

        {notFoundError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-error/30 bg-[#fff6f6] p-4 text-error"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-body text-base leading-snug">{notFoundError}</p>
          </div>
        )}

        {verifiedGuest && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-gold/45 bg-parchment p-4">
            <BadgeCheck className="w-6 h-6 text-gold shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-label text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                Invitation Found
              </p>
              <p className="font-display text-xl font-medium text-primary-container">
                {verifiedGuest.displayName}
              </p>
              <p className="font-label text-xs text-ink-muted mt-0.5">
                {verifiedGuest.reservedSeats} Reserved {verifiedGuest.reservedSeats === 1 ? 'Seat' : 'Seats'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
