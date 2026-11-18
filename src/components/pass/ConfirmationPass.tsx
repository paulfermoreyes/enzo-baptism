import { useState } from 'react';
import {
  BookMarked,
  CalendarPlus,
  CheckCircle2,
  Church,
  Edit3,
  Heart,
  MapPin,
  Printer,
  Share2,
  Sparkles,
  Utensils,
  Video,
} from 'lucide-react';
import { EVENT_INFO } from '../../data/baptismData';
import type { AttendanceMode, RegistryItem, RsvpSubmission } from '../../types/baptism';
import { CeremonialRule } from '../ui/CeremonialRule';
import { StationeryCard } from '../ui/StationeryCard';

interface ConfirmationPassProps {
  submission: RsvpSubmission;
  registryItems: RegistryItem[];
  onEditRsvp: () => void;
}

function downloadIcs(title: string, location: string, start: string, end: string, filename: string) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lorenzo Paul Baptism//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    'DESCRIPTION:Celebration of the Holy Baptism of Lorenzo Paul (Enzo).',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ConfirmationPass({
  submission,
  registryItems,
  onEditRsvp,
}: ConfirmationPassProps) {
  const [previewMode, setPreviewMode] = useState<AttendanceMode>(submission.attendance);
  const [copiedShare, setCopiedShare] = useState(false);

  const reservedGift = registryItems.find((i) => i.id === submission.reservedGiftId);

  const handleShare = async () => {
    const shareText = `Enzo's Christening Day — ${EVENT_INFO.dateDisplay}\nCeremony: ${EVENT_INFO.ceremony.time} at ${EVENT_INFO.ceremony.shortVenue}\nReception: ${EVENT_INFO.reception.time} at ${EVENT_INFO.reception.shortVenue}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Enzo's Christening Schedule", text: shareText });
        return;
      } catch {
        // Fall through to clipboard
      }
    }
    await navigator.clipboard?.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      {/* Top Status Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-parchment px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-gold shrink-0" aria-hidden="true" />
          <div>
            <p className="font-label text-xs font-semibold uppercase tracking-wider text-secondary">
              Status: RSVP Confirmed • Response Recorded
            </p>
            <p className="font-label text-sm font-semibold text-primary-container">
              {submission.guestName}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEditRsvp}
          className="min-h-11 inline-flex items-center justify-center gap-2 rounded-full border border-gold bg-white px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary-container hover:bg-sky-soft/70 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
          Edit RSVP Response
        </button>
      </div>

      {/* Main Confirmation Card */}
      <StationeryCard archTop className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-soft px-4 py-1.5 border border-gold/30 mb-4">
          <Sparkles className="w-4 h-4 text-gold" aria-hidden="true" />
          <span className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-primary-container">
            RSVP Confirmation
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-normal text-primary">
          Your Presence is Blessed!
        </h1>
        <p className="mt-3 max-w-xl mx-auto font-body text-lg text-ink-muted">
          We cannot wait to share the joy and sacred grace of Lorenzo “Enzo” Paul’s Christening with you.
        </p>

        {/* Attendance Mode Toggle */}
        <div
          className="no-print mt-6 inline-flex flex-wrap justify-center gap-2 rounded-full border border-gold/35 bg-surface p-1.5"
          role="group"
          aria-label="Confirmation view mode"
        >
          <button
            type="button"
            aria-pressed={previewMode === 'in-person'}
            onClick={() => setPreviewMode('in-person')}
            className={`min-h-10 inline-flex items-center gap-2 rounded-full px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              previewMode === 'in-person'
                ? 'bg-primary-container text-white'
                : 'text-primary-container hover:bg-sky-soft/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            Attending in Person
          </button>
          <button
            type="button"
            aria-pressed={previewMode === 'remote'}
            onClick={() => setPreviewMode('remote')}
            className={`min-h-10 inline-flex items-center gap-2 rounded-full px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              previewMode === 'remote'
                ? 'bg-primary-container text-white'
                : 'text-primary-container hover:bg-sky-soft/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5" aria-hidden="true" />
            Celebrating in Spirit / Remote
          </button>
        </div>

        <CeremonialRule />

        {/* Confirmation Summary Box */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-gold/45 bg-surface p-6 sm:p-8 text-left">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            Baby Enzo • Confirmed Guest
          </p>
          <h2 className="mt-1 font-display text-3xl font-medium text-primary">
            {submission.guestName}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-soft px-3.5 py-1 font-label text-xs font-semibold text-primary-container">
              {previewMode === 'in-person'
                ? `${submission.guestCount} Confirmed ${submission.guestCount === 1 ? 'Guest' : 'Guests'}`
                : 'Remote Prayer Guest'}
            </span>
            {submission.dietaryNotes && previewMode === 'in-person' && (
              <span className="rounded-full bg-parchment border border-gold/40 px-3.5 py-1 font-label text-xs font-semibold text-secondary">
                Notes: {submission.dietaryNotes}
              </span>
            )}
            {reservedGift && (
              <span className="rounded-full bg-parchment border border-gold/40 px-3.5 py-1 font-label text-xs font-semibold text-primary-container">
                Gift: {reservedGift.title}
                {submission.pledgeAmount ? ` (${submission.pledgeAmount})` : ''}
              </span>
            )}
          </div>

          <p className="mt-6 pt-4 border-t border-gold/25 font-body italic text-base text-ink-muted text-center">
            “For this child I prayed, and the Lord hath given me my petition which I asked of him.” — 1 Samuel 1:27
          </p>
        </div>

        {/* Memory Folio Inscription */}
        {submission.blessingMessage && (
          <div className="mx-auto max-w-2xl mt-6 rounded-2xl border border-gold/35 bg-parchment p-6 text-left">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 font-label text-xs font-semibold uppercase tracking-wider text-secondary">
                <BookMarked className="w-4 h-4 text-gold" aria-hidden="true" />
                Permanently Inscribed in Enzo’s Memory Folio
              </span>
              <span className="font-label text-xs text-ink-muted">Volume I • Keepsake</span>
            </div>
            <blockquote className="font-body italic text-lg text-primary leading-relaxed">
              “{submission.blessingMessage}”
            </blockquote>
            <p className="mt-2 font-label text-xs font-semibold text-primary-container">
              — Inscribed with love by {submission.guestName}
            </p>
          </div>
        )}
      </StationeryCard>

      {/* Venue & Calendar Cards (or Livestream Card) */}
      {previewMode === 'in-person' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StationeryCard>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-3.5 py-1 font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-3">
              <Church className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              The Holy Sacrament • {EVENT_INFO.ceremony.time}
            </span>
            <h3 className="font-display text-2xl font-medium text-primary">
              {EVENT_INFO.ceremony.shortVenue}
            </h3>
            <p className="mt-2 font-body text-base text-ink-muted">{EVENT_INFO.ceremony.address}</p>
            <p className="mt-2 font-label text-xs font-semibold text-secondary">
              {EVENT_INFO.ceremony.note}
            </p>
            <div className="no-print mt-5 flex flex-wrap gap-2.5">
              <a
                href={EVENT_INFO.ceremony.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-10 inline-flex items-center gap-1.5 rounded-full border border-gold bg-white px-4 py-2 font-label text-xs font-semibold text-primary-container hover:bg-sky-soft/70"
              >
                <MapPin className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                Waze / Maps
              </a>
              <button
                type="button"
                onClick={() =>
                  downloadIcs(
                    "Enzo's Holy Baptism",
                    EVENT_INFO.ceremony.venue,
                    EVENT_INFO.ceremony.isoStart,
                    EVENT_INFO.ceremony.isoEnd,
                    'enzo-baptism-ceremony.ics'
                  )
                }
                className="min-h-10 inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-4 py-2 font-label text-xs font-semibold text-primary-container hover:bg-sky cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                Ceremony to iCal
              </button>
            </div>
          </StationeryCard>

          <StationeryCard>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-3.5 py-1 font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-3">
              <Utensils className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              Fellowship & Luncheon • {EVENT_INFO.reception.time}
            </span>
            <h3 className="font-display text-2xl font-medium text-primary">
              {EVENT_INFO.reception.shortVenue}
            </h3>
            <p className="mt-2 font-body text-base text-ink-muted">{EVENT_INFO.reception.address}</p>
            <p className="mt-2 font-label text-xs font-semibold text-secondary">
              {EVENT_INFO.reception.note}
            </p>
            <div className="no-print mt-5 flex flex-wrap gap-2.5">
              <a
                href={EVENT_INFO.reception.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-10 inline-flex items-center gap-1.5 rounded-full border border-gold bg-white px-4 py-2 font-label text-xs font-semibold text-primary-container hover:bg-sky-soft/70"
              >
                <MapPin className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                Directions
              </a>
              <button
                type="button"
                onClick={() =>
                  downloadIcs(
                    "Enzo's Baptism Reception",
                    EVENT_INFO.reception.venue,
                    EVENT_INFO.reception.isoStart,
                    EVENT_INFO.reception.isoEnd,
                    'enzo-baptism-reception.ics'
                  )
                }
                className="min-h-10 inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-4 py-2 font-label text-xs font-semibold text-primary-container hover:bg-sky cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                Add to Calendar
              </button>
            </div>
          </StationeryCard>
        </div>
      ) : (
        <StationeryCard className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-4 py-1.5 font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-3">
            <Video className="w-4 h-4 text-gold" aria-hidden="true" />
            {EVENT_INFO.livestream.dateTime}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-medium text-primary">
            {EVENT_INFO.livestream.title}
          </h3>
          <p className="mt-3 max-w-xl mx-auto font-body text-lg text-ink-muted">
            {EVENT_INFO.livestream.description}
          </p>
          <div className="no-print mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={EVENT_INFO.livestream.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-12 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 font-label text-sm font-semibold text-primary shadow-sm hover:bg-gold-bright/90"
            >
              <Video className="w-4 h-4" aria-hidden="true" />
              Access Altar Livestream
            </a>
            <button
              type="button"
              onClick={() =>
                downloadIcs(
                  "Enzo's Baptism Livestream",
                  'Private Family Livestream',
                  EVENT_INFO.ceremony.isoStart,
                  EVENT_INFO.ceremony.isoEnd,
                  'enzo-baptism-stream.ics'
                )
              }
              className="min-h-12 inline-flex items-center gap-2 rounded-full border border-gold bg-white px-6 py-3 font-label text-sm font-semibold text-primary-container hover:bg-sky-soft/70 cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 text-gold" aria-hidden="true" />
              Add Stream to Calendar
            </button>
          </div>
        </StationeryCard>
      )}

      {/* Bottom Action Bar */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3.5 pt-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-white hover:bg-primary transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          Print Keepsake Confirmation
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="min-h-11 inline-flex items-center gap-2 rounded-full border border-gold bg-parchment px-6 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-primary-container hover:bg-sky-soft/70 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-gold" aria-hidden="true" />
          {copiedShare ? 'Schedule Copied!' : 'Share Schedule'}
        </button>
      </div>
    </div>
  );
}
