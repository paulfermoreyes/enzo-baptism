import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  INITIAL_BLESSINGS,
  INITIAL_GUESTS,
  INITIAL_REGISTRY_ITEMS,
} from '../data/baptismData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type {
  BlessingNote,
  GuestRecord,
  RegistryItem,
  RsvpSubmission,
} from '../types/baptism';

const GUESTS_COLLECTION = 'guests';
const RSVPS_COLLECTION = 'rsvps';
const REGISTRY_COLLECTION = 'registry';
const BLESSINGS_COLLECTION = 'blessings';

function buildInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'GZ';
}

export function subscribeRegistry(
  onUpdate: (items: RegistryItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    onUpdate(INITIAL_REGISTRY_ITEMS);
    return () => {};
  }

  return onSnapshot(
    collection(db, REGISTRY_COLLECTION),
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_REGISTRY_ITEMS);
        return;
      }
      const items = snapshot.docs.map((d) => ({
        ...(d.data() as RegistryItem),
        id: d.id,
      }));
      onUpdate(items);
    },
    (err) => {
      onError?.(err);
    }
  );
}

export function subscribeBlessings(
  onUpdate: (notes: BlessingNote[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    onUpdate(INITIAL_BLESSINGS);
    return () => {};
  }

  const q = query(collection(db, BLESSINGS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_BLESSINGS);
        return;
      }
      const notes = snapshot.docs.map((d) => ({
        ...(d.data() as BlessingNote),
        id: d.id,
      }));
      onUpdate(notes);
    },
    (err) => {
      onError?.(err);
    }
  );
}

export interface GuestLookupResult {
  guest: GuestRecord | null;
  existingRsvp: RsvpSubmission | null;
}

export async function lookupGuestAndRsvp(rawName: string): Promise<GuestLookupResult> {
  const normalized = rawName.trim().toLowerCase();
  if (!normalized) {
    return { guest: null, existingRsvp: null };
  }

  if (!isFirebaseConfigured || !db) {
    const localMatch =
      INITIAL_GUESTS.find(
        (g) =>
          g.searchName === normalized ||
          g.displayName.toLowerCase().includes(normalized)
      ) ?? null;
    return { guest: localMatch, existingRsvp: null };
  }

  const guestsSnap = await getDocs(collection(db, GUESTS_COLLECTION));
  const allGuests = guestsSnap.docs.map((d) => ({
    ...(d.data() as GuestRecord),
    id: d.id,
  }));

  const exactMatch = allGuests.find(
    (g) => g.searchName === normalized || g.displayName.toLowerCase() === normalized
  );
  const partialMatch =
    exactMatch ??
    allGuests.find((g) => g.displayName.toLowerCase().includes(normalized));

  if (!partialMatch) {
    return { guest: null, existingRsvp: null };
  }

  const rsvpSnap = await getDoc(doc(db, RSVPS_COLLECTION, partialMatch.id));
  const existingRsvp = rsvpSnap.exists() ? (rsvpSnap.data() as RsvpSubmission) : null;

  return { guest: partialMatch, existingRsvp };
}

export async function submitRsvpToStore(
  submission: RsvpSubmission,
  previousGiftId: string | null
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    return;
  }

  const firestore = db;

  await runTransaction(firestore, async (tx) => {
    // 1. Release previous gift if guest changed selection
    if (previousGiftId && previousGiftId !== submission.reservedGiftId) {
      const prevRef = doc(firestore, REGISTRY_COLLECTION, previousGiftId);
      const prevSnap = await tx.get(prevRef);
      if (prevSnap.exists()) {
        const prevData = prevSnap.data() as RegistryItem;
        if (prevData.allowMultiple) {
          const nextIds = (prevData.reservedByGuestIds ?? []).filter(
            (id) => id !== submission.guestId
          );
          tx.update(prevRef, { reservedByGuestIds: nextIds });
        } else if (prevData.reservedByGuestId === submission.guestId) {
          tx.update(prevRef, { reservedByGuestId: null });
        }
      }
    }

    // 2. Reserve newly selected gift (if any)
    if (submission.reservedGiftId) {
      const giftRef = doc(firestore, REGISTRY_COLLECTION, submission.reservedGiftId);
      const giftSnap = await tx.get(giftRef);
      if (giftSnap.exists()) {
        const giftData = giftSnap.data() as RegistryItem;
        if (giftData.allowMultiple) {
          const currentIds = giftData.reservedByGuestIds ?? [];
          if (!currentIds.includes(submission.guestId)) {
            tx.update(giftRef, {
              reservedByGuestIds: [...currentIds, submission.guestId],
            });
          }
        } else {
          if (
            giftData.reservedByGuestId !== null &&
            giftData.reservedByGuestId !== submission.guestId
          ) {
            throw new Error(
              `"${giftData.title}" was just reserved by another guest. Please select another gift.`
            );
          }
          tx.update(giftRef, { reservedByGuestId: submission.guestId });
        }
      }
    }

    // 3. Upsert RSVP keyed by guestId
    const rsvpRef = doc(firestore, RSVPS_COLLECTION, submission.guestId);
    tx.set(
      rsvpRef,
      {
        ...submission,
        pledgeAmount: submission.pledgeAmount ?? null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // 4. Upsert blessing if provided
    if (submission.blessingMessage.trim()) {
      const blessingRef = doc(firestore, BLESSINGS_COLLECTION, submission.guestId);
      const existingBlessing = await tx.get(blessingRef);
      const existingCreatedAt = existingBlessing.exists()
        ? (existingBlessing.data() as BlessingNote).createdAt
        : undefined;

      tx.set(
        blessingRef,
        {
          id: submission.guestId,
          author: submission.guestName,
          initials: buildInitials(submission.guestName),
          role:
            submission.attendance === 'in-person'
              ? 'Confirmed Guest'
              : 'Celebrating in Spirit',
          message: submission.blessingMessage.trim(),
          createdAt: existingCreatedAt ?? Date.now(),
        } satisfies BlessingNote,
        { merge: true }
      );
    }
  });
}

// --- Admin Operations ---

export async function fetchAllGuests(): Promise<GuestRecord[]> {
  if (!isFirebaseConfigured || !db) return INITIAL_GUESTS;
  const snap = await getDocs(collection(db, GUESTS_COLLECTION));
  return snap.docs
    .map((d) => ({ ...(d.data() as GuestRecord), id: d.id }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export async function fetchAllRsvps(): Promise<RsvpSubmission[]> {
  if (!isFirebaseConfigured || !db) return [];
  const snap = await getDocs(collection(db, RSVPS_COLLECTION));
  return snap.docs.map((d) => d.data() as RsvpSubmission);
}

export async function addGuestRecord(
  displayName: string,
  reservedSeats: number
): Promise<GuestRecord> {
  const trimmed = displayName.trim();
  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const id = `${slug || 'guest'}-${Date.now().toString(36).slice(-4)}`;
  const codeSuffix = Math.floor(100 + Math.random() * 899);
  const record: GuestRecord = {
    id,
    displayName: trimmed,
    searchName: trimmed.toLowerCase(),
    reservedSeats,
    rsvpCode: `#ENZO-2027-${codeSuffix}`,
  };

  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, GUESTS_COLLECTION, id), record);
  }
  return record;
}

export async function deleteGuestRecord(guestId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, GUESTS_COLLECTION, guestId));
}

export async function deleteBlessingNote(blessingId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, BLESSINGS_COLLECTION, blessingId));
}

export async function seedInitialCollections(): Promise<{
  guestsSeeded: number;
  registrySeeded: number;
  blessingsSeeded: number;
}> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  let guestsSeeded = 0;
  let registrySeeded = 0;
  let blessingsSeeded = 0;

  for (const guest of INITIAL_GUESTS) {
    await setDoc(doc(db, GUESTS_COLLECTION, guest.id), guest, { merge: true });
    guestsSeeded += 1;
  }

  for (const item of INITIAL_REGISTRY_ITEMS) {
    const ref = doc(db, REGISTRY_COLLECTION, item.id);
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      await setDoc(ref, item);
      registrySeeded += 1;
    }
  }

  for (const note of INITIAL_BLESSINGS) {
    const ref = doc(db, BLESSINGS_COLLECTION, note.id);
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      await setDoc(ref, note);
      blessingsSeeded += 1;
    }
  }

  return { guestsSeeded, registrySeeded, blessingsSeeded };
}
