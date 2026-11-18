import { useId, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Heart, Loader2, Sparkles } from 'lucide-react';
import type { AttendanceMode, GuestRecord, RegistryItem, RsvpSubmission } from '../../types/baptism';
import { GiftRegistryGrid } from './GiftRegistryGrid';

interface RsvpFormProps {
  verifiedGuest: GuestRecord;
  registryItems: RegistryItem[];
  initialSubmission: RsvpSubmission | null;
  onSubmitRsvp: (submission: RsvpSubmission) => Promise<void>;
}

export function RsvpForm({
  verifiedGuest,
  registryItems,
  initialSubmission,
  onSubmitRsvp,
}: RsvpFormProps) {
  const [guestName, setGuestName] = useState(
    initialSubmission?.guestName ?? verifiedGuest.displayName
  );
  const [email, setEmail] = useState(initialSubmission?.email ?? '');
  const [attendance, setAttendance] = useState<AttendanceMode>(
    initialSubmission?.attendance ?? 'in-person'
  );
  const [guestCount, setGuestCount] = useState<number>(
    initialSubmission?.guestCount ?? verifiedGuest.reservedSeats
  );
  const [dietaryNotes, setDietaryNotes] = useState(initialSubmission?.dietaryNotes ?? '');
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(
    initialSubmission?.reservedGiftId ?? null
  );
  const [pledgeAmount, setPledgeAmount] = useState(initialSubmission?.pledgeAmount ?? '');
  const [blessingMessage, setBlessingMessage] = useState(
    initialSubmission?.blessingMessage ?? ''
  );

  // Track field-level post-interaction invalid state for ARIA synchronization
  const [nameInvalid, setNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [liveMessage, setLiveMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const nameId = useId();
  const nameErrorId = useId();
  const emailId = useId();
  const emailHintId = useId();
  const emailErrorId = useId();
  const guestCountId = useId();
  const dietaryId = useId();
  const blessingId = useId();

  // Keep form synced when user verifies a different guest in step 1
  const [lastVerifiedId, setLastVerifiedId] = useState<string>(verifiedGuest.id);
  if (verifiedGuest.id !== lastVerifiedId) {
    setLastVerifiedId(verifiedGuest.id);
    setGuestName(initialSubmission?.guestName ?? verifiedGuest.displayName);
    setEmail(initialSubmission?.email ?? '');
    setAttendance(initialSubmission?.attendance ?? 'in-person');
    setGuestCount(initialSubmission?.guestCount ?? verifiedGuest.reservedSeats);
    setDietaryNotes(initialSubmission?.dietaryNotes ?? '');
    setSelectedGiftId(initialSubmission?.reservedGiftId ?? null);
    setPledgeAmount(initialSubmission?.pledgeAmount ?? '');
    setBlessingMessage(initialSubmission?.blessingMessage ?? '');
    setNameInvalid(false);
    setEmailInvalid(false);
    setSubmitError(null);
  }

  const syncControlValidity = (
    input: HTMLInputElement | null,
    setInvalid: (val: boolean) => void,
    announceText: string
  ) => {
    if (!input) return true;
    const isInvalid = !input.validity.valid;
    setInvalid(isInvalid);
    if (isInvalid) {
      setLiveMessage(announceText);
    } else {
      setLiveMessage('');
    }
    return !isInvalid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const isNameOk = syncControlValidity(
      nameInputRef.current,
      setNameInvalid,
      'Full Name: Please enter your name as it should appear on your confirmation.'
    );
    const isEmailOk = syncControlValidity(
      emailInputRef.current,
      setEmailInvalid,
      'Email Address: Enter an email address in the format you@example.com.'
    );

    if (!isNameOk) {
      nameInputRef.current?.focus();
      return;
    }
    if (!isEmailOk) {
      emailInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRsvp({
        guestId: verifiedGuest.id,
        guestName: guestName.trim(),
        email: email.trim(),
        attendance,
        guestCount: attendance === 'in-person' ? guestCount : 1,
        dietaryNotes: dietaryNotes.trim(),
        reservedGiftId: selectedGiftId,
        pledgeAmount:
          selectedGiftId === 'educational-trust' && pledgeAmount.trim()
            ? pledgeAmount.trim()
            : null,
        blessingMessage: blessingMessage.trim(),
        rsvpCode: verifiedGuest.rsvpCode,
        submittedAt: initialSubmission?.submittedAt ?? new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Could not save your RSVP right now. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxSeats = Math.max(5, verifiedGuest.reservedSeats);
  const seatOptions = Array.from({ length: maxSeats }, (_, idx) => idx + 1);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="rsvp-form-heading"
      className="space-y-10"
    >
      {/* Polite live region for screen reader validation announcements */}
      <div aria-live="polite" className="visually-hidden">
        {liveMessage}
      </div>

      {/* Step 2: Attendance & Guest Details */}
      <section aria-labelledby="rsvp-form-heading">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-label text-sm font-semibold text-white">
            2
          </span>
          <div>
            <h2 id="rsvp-form-heading" className="font-display text-2xl font-medium text-primary">
              Your Attendance & Details
            </h2>
            <p className="font-body text-base text-ink-muted">
              Please choose whether you will celebrate with us in person or in spirit.
            </p>
          </div>
        </div>

        <fieldset className="mb-6">
          <legend className="font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-3">
            Celebration Attendance <span aria-hidden="true">*</span>
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer transition-all ${
                attendance === 'in-person'
                  ? 'border-gold bg-sky-soft/50 shadow-sm'
                  : 'border-gold/30 bg-surface hover:border-gold/60'
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value="in-person"
                checked={attendance === 'in-person'}
                onChange={() => setAttendance('in-person')}
                className="mt-1 h-5 w-5 accent-secondary cursor-pointer"
              />
              <div>
                <span className="flex items-center gap-1.5 font-display text-lg font-medium text-primary-container">
                  <CheckCircle2 className="w-4 h-4 text-gold" aria-hidden="true" />
                  Joyfully Accepts
                </span>
                <span className="block font-label text-xs font-semibold text-secondary mt-0.5">
                  Attending in person
                </span>
                <span className="block font-body text-sm text-ink-muted mt-1">
                  Will celebrate with Lorenzo Paul at Mount Carmel & Shakey’s.
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer transition-all ${
                attendance === 'remote'
                  ? 'border-gold bg-sky-soft/50 shadow-sm'
                  : 'border-gold/30 bg-surface hover:border-gold/60'
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value="remote"
                checked={attendance === 'remote'}
                onChange={() => setAttendance('remote')}
                className="mt-1 h-5 w-5 accent-secondary cursor-pointer"
              />
              <div>
                <span className="flex items-center gap-1.5 font-display text-lg font-medium text-primary-container">
                  <Heart className="w-4 h-4 text-gold" aria-hidden="true" />
                  Celebrating in Spirit
                </span>
                <span className="block font-label text-xs font-semibold text-secondary mt-0.5">
                  Joining via Altar Livestream
                </span>
                <span className="block font-body text-sm text-ink-muted mt-1">
                  Sending love, heartfelt prayers, and joining remotely from afar.
                </span>
              </div>
            </label>
          </div>
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor={nameId}
              className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1.5"
            >
              Guest / Family Name <span aria-hidden="true">*</span>
            </label>
            <input
              ref={nameInputRef}
              id={nameId}
              name="guestName"
              type="text"
              required
              autoComplete="name"
              value={guestName}
              aria-invalid={nameInvalid ? 'true' : 'false'}
              aria-describedby={nameInvalid ? nameErrorId : undefined}
              onChange={(e) => {
                setGuestName(e.target.value);
                if (nameInvalid && e.target.validity.valid) {
                  setNameInvalid(false);
                  setLiveMessage('');
                }
              }}
              onBlur={() =>
                syncControlValidity(
                  nameInputRef.current,
                  setNameInvalid,
                  'Guest Name: Please enter your name as it should appear on your confirmation.'
                )
              }
              className={`celestial-input w-full rounded-lg border border-gold-light bg-white px-4 py-2.5 text-ink ${
                nameInvalid ? 'user-invalid-fallback' : ''
              }`}
            />
            <div
              id={nameErrorId}
              className="field-error items-center gap-1.5 mt-1.5 font-label text-xs font-semibold text-error"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-label="Error" />
              <span>Please enter your name for the confirmation.</span>
            </div>
          </div>

          <div>
            <label
              htmlFor={emailId}
              className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1.5"
            >
              Email Address <span aria-hidden="true">*</span>
            </label>
            <span id={emailHintId} className="block font-label text-xs text-ink-muted mb-1">
              Format: you@example.com (for updates & stream link)
            </span>
            <input
              ref={emailInputRef}
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              aria-invalid={emailInvalid ? 'true' : 'false'}
              aria-describedby={emailInvalid ? `${emailHintId} ${emailErrorId}` : emailHintId}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailInvalid && e.target.validity.valid) {
                  setEmailInvalid(false);
                  setLiveMessage('');
                }
              }}
              onBlur={() =>
                syncControlValidity(
                  emailInputRef.current,
                  setEmailInvalid,
                  'Email Address: Enter an email address in the format you@example.com.'
                )
              }
              className={`celestial-input w-full rounded-lg border border-gold-light bg-white px-4 py-2.5 text-ink ${
                emailInvalid ? 'user-invalid-fallback' : ''
              }`}
            />
            <div
              id={emailErrorId}
              className="field-error items-center gap-1.5 mt-1.5 font-label text-xs font-semibold text-error"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-label="Error" />
              <span>Enter an email address in the format you@example.com.</span>
            </div>
          </div>

          {attendance === 'in-person' && (
            <>
              <div>
                <label
                  htmlFor={guestCountId}
                  className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1.5"
                >
                  Number of Guests Attending
                </label>
                <select
                  id={guestCountId}
                  name="guestCount"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="celestial-input w-full rounded-lg border border-gold-light bg-white px-4 py-2.5 text-ink"
                >
                  {seatOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={dietaryId}
                  className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1.5"
                >
                  Dietary Notes or High Chair Request
                </label>
                <input
                  id={dietaryId}
                  name="dietaryNotes"
                  type="text"
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="Optional (e.g. Vegetarian, 1 high chair)"
                  className="celestial-input w-full rounded-lg border border-gold-light bg-white px-4 py-2.5 text-ink"
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Step 3: Gift Registry */}
      <GiftRegistryGrid
        items={registryItems}
        currentGuestId={verifiedGuest.id}
        selectedId={selectedGiftId}
        onSelect={setSelectedGiftId}
        pledgeAmount={pledgeAmount}
        onPledgeAmountChange={setPledgeAmount}
      />

      {/* Step 4: Prayer & Blessing */}
      <section aria-labelledby="blessing-heading">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-label text-sm font-semibold text-white">
              4
            </span>
            <div>
              <h2 id="blessing-heading" className="font-display text-2xl font-medium text-primary">
                Leave a Prayer & Blessing for Little Enzo
              </h2>
              <p className="font-body text-base text-ink-muted">
                Your loving words will be bound into Enzo’s Keepsake Memory Folio.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-3.5 py-1 font-label text-xs font-semibold text-primary-container">
            <Sparkles className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            Archived Forever
          </span>
        </div>

        <label
          htmlFor={blessingId}
          className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1.5"
        >
          Your Keepsake Message
        </label>
        <textarea
          id={blessingId}
          name="blessingMessage"
          rows={4}
          value={blessingMessage}
          onChange={(e) => setBlessingMessage(e.target.value)}
          placeholder="Write a prayer, wish, or blessing for Lorenzo Paul..."
          className="celestial-input w-full rounded-xl border border-gold-light bg-white p-4 text-ink"
        />
      </section>

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-error/30 bg-[#fff6f6] p-4 text-error"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-body text-base leading-snug">{submitError}</p>
        </div>
      )}

      <div className="pt-4 flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 inline-flex items-center gap-2.5 rounded-full bg-gold px-8 py-3.5 font-label text-sm font-semibold uppercase tracking-wider text-primary shadow-md hover:bg-gold-bright/90 disabled:opacity-60 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Saving RSVP...
            </>
          ) : (
            <>
              Confirm RSVP & Send Blessings
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
