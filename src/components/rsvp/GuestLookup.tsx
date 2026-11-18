import { useId, useState } from 'react';
import { BadgeCheck, QrCode, Search, Sparkles } from 'lucide-react';
import { VIP_GUESTS } from '../../data/baptismData';
import type { GuestRecord } from '../../types/baptism';

interface GuestLookupProps {
  verifiedGuest: GuestRecord | null;
  onVerify: (guest: GuestRecord) => void;
  onAccessPass: () => void;
}

export function GuestLookup({ verifiedGuest, onVerify, onAccessPass }: GuestLookupProps) {
  const [query, setQuery] = useState(verifiedGuest?.displayName ?? 'Elena & Marco Santos');
  const inputId = useId();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const match = VIP_GUESTS.find((g) =>
      g.displayName.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (match) {
      onVerify(match);
    } else {
      onVerify({
        id: `guest-${Date.now()}`,
        displayName: trimmed,
        tier: 'Cherished Guest',
        reservedSeats: 2,
        tableNumber: 'Table No. 6',
        rsvpCode: `#ENZO-2027-GST-${Math.floor(10 + Math.random() * 89)}`,
      });
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
            Please enter your name as written on your physical or digital invitation.
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Elena & Marco Santos"
              className="celestial-input w-full rounded-lg border border-gold-light bg-white px-4 py-2.5 text-ink"
            />
          </div>

          <button
            type="submit"
            className="min-h-12 inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-2.5 font-label text-sm font-semibold text-white hover:bg-primary transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Verify Guest
          </button>
        </form>

        {/* Quick-select VIP guest chips for easy testing */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-label text-xs text-ink-muted">Quick select:</span>
          {VIP_GUESTS.map((guest) => (
            <button
              key={guest.id}
              type="button"
              onClick={() => {
                setQuery(guest.displayName);
                onVerify(guest);
              }}
              className="rounded-full bg-sky-soft/80 px-3 py-1 font-label text-xs font-semibold text-primary-container hover:bg-sky transition-colors cursor-pointer"
            >
              {guest.displayName}
            </button>
          ))}
        </div>

        {verifiedGuest && (
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gold/45 bg-parchment p-4">
            <div className="flex items-start gap-3">
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
                  {verifiedGuest.tier} • {verifiedGuest.reservedSeats} Reserved Seats • {verifiedGuest.tableNumber}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onAccessPass}
              className="min-h-11 inline-flex items-center justify-center gap-2 rounded-full border border-gold bg-white px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary-container hover:bg-sky-soft/70 transition-colors cursor-pointer shrink-0"
            >
              <QrCode className="w-4 h-4 text-gold" aria-hidden="true" />
              Access My Pass
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
