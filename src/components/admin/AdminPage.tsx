import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  AlertCircle,
  Database,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  auth,
  googleProvider,
  isAuthorizedAdminEmail,
  isFirebaseConfigured,
} from '../../lib/firebase';
import {
  addGuestRecord,
  deleteBlessingNote,
  deleteGuestRecord,
  fetchAllGuests,
  fetchAllRsvps,
  seedInitialCollections,
} from '../../services/baptismService';
import type { BlessingNote, GuestRecord, RegistryItem, RsvpSubmission } from '../../types/baptism';
import { StationeryCard } from '../ui/StationeryCard';

interface AdminPageProps {
  registryItems: RegistryItem[];
  blessings: BlessingNote[];
  onBackToSite: () => void;
}

export function AdminPage({ registryItems, blessings, onBackToSite }: AdminPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestSeats, setNewGuestSeats] = useState(2);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
  }, []);

  const isAuthorized = Boolean(user && isAuthorizedAdminEmail(user.email));

  const loadAdminData = useCallback(async () => {
    if (!isAuthorized) return;
    setDataLoading(true);
    try {
      const [guestList, rsvpList] = await Promise.all([fetchAllGuests(), fetchAllRsvps()]);
      setGuests(guestList);
      setRsvps(rsvpList);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to load admin data.');
    } finally {
      setDataLoading(false);
    }
  }, [isAuthorized]);

  useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  const handleSignIn = async () => {
    if (!auth) return;
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign-in failed.');
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    setStatusMessage(null);
    try {
      await addGuestRecord(newGuestName, newGuestSeats);
      setNewGuestName('');
      setNewGuestSeats(2);
      setStatusMessage('Guest added to invitation list.');
      await loadAdminData();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to add guest.');
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    setStatusMessage(null);
    try {
      await deleteGuestRecord(guestId);
      setStatusMessage('Guest removed.');
      await loadAdminData();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to remove guest.');
    }
  };

  const handleSeed = async () => {
    setStatusMessage(null);
    setAuthError(null);
    try {
      const res = await seedInitialCollections();
      setStatusMessage(
        `Seeded ${res.guestsSeeded} guests, ${res.registrySeeded} new registry items, and ${res.blessingsSeeded} new blessings.`
      );
      await loadAdminData();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to seed Firestore.');
    }
  };

  const handleDeleteBlessing = async (blessingId: string) => {
    try {
      await deleteBlessingNote(blessingId);
      setStatusMessage('Blessing deleted.');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to delete blessing.');
    }
  };

  const rsvpByGuestId = new Map(rsvps.map((r) => [r.guestId, r]));
  const inPersonHeadcount = rsvps
    .filter((r) => r.attendance === 'in-person')
    .reduce((sum, r) => sum + (r.guestCount || 0), 0);
  const remoteCount = rsvps.filter((r) => r.attendance === 'remote').length;

  const giftTitleById = new Map(registryItems.map((i) => [i.id, i.title]));

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <StationeryCard className="text-center">
          <h1 className="font-display text-3xl text-primary">Host Admin</h1>
          <p className="mt-3 font-body text-lg text-ink-muted">
            Firebase environment variables are not configured yet. Add your{' '}
            <code className="font-mono text-sm">VITE_FIREBASE_*</code> values in{' '}
            <code className="font-mono text-sm">.env</code> to enable admin sign-in and Firestore management.
          </p>
          <button
            type="button"
            onClick={onBackToSite}
            className="mt-6 min-h-11 rounded-full bg-primary-container px-6 py-2 font-label text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
          >
            Back to Invitation
          </button>
        </StationeryCard>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl py-8 text-center font-body text-lg text-ink-muted">
        Checking authentication...
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return (
      <div className="mx-auto max-w-xl py-8">
        <StationeryCard className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-soft text-primary-container">
            <ShieldCheck className="h-6 w-6 text-gold" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl text-primary">Host Admin Portal</h1>
          <p className="mt-2 font-body text-lg text-ink-muted">
            Sign in with an authorized host Google account to manage the guest list and view RSVPs.
          </p>

          {user && !isAuthorized && (
            <div className="mt-4 rounded-xl border border-error/30 bg-[#fff6f6] p-3 text-sm text-error">
              Signed in as <strong>{user.email}</strong>, which is not in the authorized admin list.
            </div>
          )}

          {authError && (
            <div className="mt-4 rounded-xl border border-error/30 bg-[#fff6f6] p-3 text-sm text-error">
              {authError}
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {!user ? (
              <button
                type="button"
                onClick={handleSignIn}
                className="min-h-11 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-white hover:bg-primary cursor-pointer"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Sign in with Google
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignOut}
                className="min-h-11 inline-flex items-center gap-2 rounded-full border border-gold bg-white px-6 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-primary-container cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign Out
              </button>
            )}
            <button
              type="button"
              onClick={onBackToSite}
              className="min-h-11 rounded-full border border-gold/50 px-5 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-primary-container cursor-pointer"
            >
              Back to Invitation
            </button>
          </div>
        </StationeryCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-parchment px-6 py-4">
        <div>
          <p className="font-label text-xs font-semibold uppercase tracking-wider text-secondary">
            Host Admin • {user.email}
          </p>
          <h1 className="font-display text-3xl text-primary">Lorenzo Paul RSVP Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleSeed}
            className="min-h-10 inline-flex items-center gap-1.5 rounded-full border border-gold bg-white px-4 py-2 font-label text-xs font-semibold text-primary-container hover:bg-sky-soft/70 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            Seed Initial Data
          </button>
          <button
            type="button"
            onClick={() => void loadAdminData()}
            disabled={dataLoading}
            className="min-h-10 inline-flex items-center gap-1.5 rounded-full border border-gold bg-white px-4 py-2 font-label text-xs font-semibold text-primary-container hover:bg-sky-soft/70 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold ${dataLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-10 inline-flex items-center gap-1.5 rounded-full bg-primary-container px-4 py-2 font-label text-xs font-semibold text-white cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-xl border border-gold/40 bg-sky-soft/60 px-4 py-3 font-label text-sm text-primary-container">
          {statusMessage}
        </div>
      )}

      {authError && (
        <div className="flex items-center gap-2 rounded-xl border border-error/30 bg-[#fff6f6] px-4 py-3 text-sm text-error">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{authError}</span>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gold/30 bg-parchment p-5">
          <p className="font-label text-xs uppercase tracking-wider text-ink-muted">Invited</p>
          <p className="mt-1 font-display text-3xl text-primary">{guests.length}</p>
        </div>
        <div className="rounded-2xl border border-gold/30 bg-parchment p-5">
          <p className="font-label text-xs uppercase tracking-wider text-ink-muted">RSVPs Received</p>
          <p className="mt-1 font-display text-3xl text-primary">{rsvps.length}</p>
        </div>
        <div className="rounded-2xl border border-gold/30 bg-parchment p-5">
          <p className="font-label text-xs uppercase tracking-wider text-ink-muted">In-Person Seats</p>
          <p className="mt-1 font-display text-3xl text-primary">{inPersonHeadcount}</p>
        </div>
        <div className="rounded-2xl border border-gold/30 bg-parchment p-5">
          <p className="font-label text-xs uppercase tracking-wider text-ink-muted">Remote Guests</p>
          <p className="mt-1 font-display text-3xl text-primary">{remoteCount}</p>
        </div>
      </div>

      {/* Guest List Management */}
      <StationeryCard>
        <h2 className="font-display text-2xl text-primary mb-4">Invited Guest List</h2>
        <form onSubmit={handleAddGuest} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            placeholder="Guest or family name (e.g. Tito Juan & Tita Maria)"
            className="celestial-input flex-1 rounded-lg border border-gold-light bg-white px-4 py-2 text-ink"
          />
          <select
            value={newGuestSeats}
            onChange={(e) => setNewGuestSeats(Number(e.target.value))}
            aria-label="Reserved seats"
            className="celestial-input rounded-lg border border-gold-light bg-white px-4 py-2 text-ink"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Seat' : 'Seats'}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!newGuestName.trim()}
            className="min-h-12 inline-flex items-center justify-center gap-1.5 rounded-full bg-gold px-6 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add Guest
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold/30 font-label text-xs uppercase tracking-wider text-secondary">
                <th className="py-2.5 pr-4">Name</th>
                <th className="py-2.5 pr-4">Seats</th>
                <th className="py-2.5 pr-4">Status</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/15 font-body text-base">
              {guests.map((g) => {
                const rsvp = rsvpByGuestId.get(g.id);
                return (
                  <tr key={g.id}>
                    <td className="py-3 pr-4 font-medium text-primary-container">{g.displayName}</td>
                    <td className="py-3 pr-4 text-ink-muted">{g.reservedSeats}</td>
                    <td className="py-3 pr-4">
                      {rsvp ? (
                        <span className="rounded-full bg-sky-soft px-2.5 py-0.5 font-label text-xs font-semibold text-primary-container">
                          {rsvp.attendance === 'in-person'
                            ? `Confirmed (${rsvp.guestCount})`
                            : 'Remote'}
                        </span>
                      ) : (
                        <span className="font-label text-xs text-ink-muted">Pending</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void handleDeleteGuest(g.id)}
                        className="inline-flex items-center gap-1 text-xs font-label text-error hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              {guests.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-ink-muted">
                    No guests yet. Add guests above or click “Seed Initial Data”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </StationeryCard>

      {/* Submitted RSVPs */}
      <StationeryCard>
        <h2 className="font-display text-2xl text-primary mb-4">Submitted RSVPs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold/30 font-label text-xs uppercase tracking-wider text-secondary">
                <th className="py-2.5 pr-4">Guest</th>
                <th className="py-2.5 pr-4">Email</th>
                <th className="py-2.5 pr-4">Attendance</th>
                <th className="py-2.5 pr-4">Dietary Notes</th>
                <th className="py-2.5">Gift / Pledge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/15 font-body text-base">
              {rsvps.map((r) => (
                <tr key={r.guestId}>
                  <td className="py-3 pr-4 font-medium text-primary-container">{r.guestName}</td>
                  <td className="py-3 pr-4 text-ink-muted text-sm">{r.email}</td>
                  <td className="py-3 pr-4 text-sm">
                    {r.attendance === 'in-person' ? `In-person (${r.guestCount})` : 'Remote'}
                  </td>
                  <td className="py-3 pr-4 text-sm text-ink-muted">{r.dietaryNotes || '—'}</td>
                  <td className="py-3 text-sm text-ink-muted">
                    {r.reservedGiftId ? giftTitleById.get(r.reservedGiftId) ?? r.reservedGiftId : '—'}
                    {r.pledgeAmount ? ` (${r.pledgeAmount})` : ''}
                  </td>
                </tr>
              ))}
              {rsvps.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-ink-muted">
                    No RSVPs submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </StationeryCard>

      {/* Blessings Moderation */}
      <StationeryCard>
        <h2 className="font-display text-2xl text-primary mb-4">Blessings Wall Moderation</h2>
        <div className="space-y-3">
          {blessings.map((note) => (
            <div
              key={note.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-gold/25 bg-surface p-4"
            >
              <div>
                <p className="font-label text-xs font-semibold text-primary-container">
                  {note.author} • <span className="text-ink-muted">{note.role}</span>
                </p>
                <p className="mt-1 font-body text-base text-ink-muted">“{note.message}”</p>
              </div>
              <button
                type="button"
                onClick={() => void handleDeleteBlessing(note.id)}
                className="shrink-0 inline-flex items-center gap-1 font-label text-xs text-error hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                Delete
              </button>
            </div>
          ))}
        </div>
      </StationeryCard>
    </div>
  );
}
