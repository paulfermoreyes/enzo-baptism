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
  INITIAL_GUESTS,
  INITIAL_REGISTRY_ITEMS,
} from '../data/baptismData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type {
  AttendanceMode,
  BlessingNote,
  GuestRecord,
  RegistryItem,
  RsvpSubmission,
} from '../types/baptism';

const GUESTS_COLLECTION = 'guests';
const RSVPS_COLLECTION = 'rsvps';
const REGISTRY_COLLECTION = 'registry';
const BLESSINGS_COLLECTION = 'blessings';

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { firstName: parts[0] ?? '', lastName: '' };
  }
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
}

function normalizeGuestRecord(raw: Partial<GuestRecord>, id: string): GuestRecord {
  const fallback = splitFullName(raw.displayName ?? '');
  const firstName = (raw.firstName ?? fallback.firstName).trim();
  const lastName = (raw.lastName ?? fallback.lastName).trim();
  const displayName = (raw.displayName ?? `${firstName} ${lastName}`).trim();
  return {
    id,
    firstName,
    lastName,
    displayName,
    searchName: (raw.searchName ?? displayName).trim().toLowerCase(),
    rsvpCode: raw.rsvpCode ?? '',
  };
}

function normalizeRsvpSubmission(raw: Partial<RsvpSubmission>, fallbackId?: string): RsvpSubmission {
  const fallback = splitFullName(raw.guestName ?? '');
  const firstName = (raw.firstName ?? fallback.firstName).trim();
  const lastName = (raw.lastName ?? fallback.lastName).trim();
  const guestName = (raw.guestName ?? `${firstName} ${lastName}`).trim();
  return {
    guestId: raw.guestId ?? fallbackId ?? '',
    firstName,
    lastName,
    guestName,
    email: raw.email ?? '',
    attendance: raw.attendance ?? 'in-person',
    dietaryNotes: raw.dietaryNotes ?? '',
    reservedGiftId: raw.reservedGiftId ?? null,
    pledgeAmount: raw.pledgeAmount ?? null,
    blessingMessage: raw.blessingMessage ?? '',
    rsvpCode: raw.rsvpCode ?? '',
    submittedAt: raw.submittedAt ?? '',
    updatedAt: raw.updatedAt,
    confirmedByAdmin: Boolean(raw.confirmedByAdmin),
  };
}

function buildInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'GZ';
}

function normalizeRegistryItem(raw: Partial<RegistryItem>, id: string): RegistryItem {
  const isFund = Boolean(raw.isFund);
  const allowMultiple = isFund ? true : Boolean(raw.allowMultiple);
  return {
    id,
    category: (raw.category ?? 'Gift').trim(),
    title: (raw.title ?? '').trim(),
    priceLabel: (raw.priceLabel ?? '').trim(),
    description: (raw.description ?? '').trim(),
    isFund,
    allowMultiple,
    reservedByGuestId: allowMultiple ? null : (raw.reservedByGuestId ?? null),
    reservedByGuestIds: allowMultiple ? (raw.reservedByGuestIds ?? []) : [],
  };
}

function sortRegistryItems(items: RegistryItem[]): RegistryItem[] {
  return [...items].sort((a, b) => {
    if (a.isFund !== b.isFund) return a.isFund ? 1 : -1;
    return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
  });
}

export function subscribeRegistry(
  onUpdate: (items: RegistryItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    onUpdate(sortRegistryItems(INITIAL_REGISTRY_ITEMS));
    return () => { };
  }

  return onSnapshot(
    collection(db, REGISTRY_COLLECTION),
    (snapshot) => {
      const items = snapshot.docs.map((d) =>
        normalizeRegistryItem(d.data() as Partial<RegistryItem>, d.id)
      );
      onUpdate(sortRegistryItems(items));
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
    onUpdate([]);
    return () => { };
  }

  const q = query(collection(db, BLESSINGS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
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

export async function lookupGuestAndRsvp(
  rawFirstName: string,
  rawLastName: string
): Promise<GuestLookupResult> {
  const first = rawFirstName.trim().toLowerCase();
  const last = rawLastName.trim().toLowerCase();
  if (!first || !last) {
    return { guest: null, existingRsvp: null };
  }
  const combined = `${first} ${last}`;

  const matchesGuest = (g: GuestRecord): boolean =>
    (g.firstName.trim().toLowerCase() === first &&
      g.lastName.trim().toLowerCase() === last) ||
    g.searchName === combined ||
    g.displayName.trim().toLowerCase() === combined;

  if (!isFirebaseConfigured || !db) {
    const localMatch = INITIAL_GUESTS.find(matchesGuest) ?? null;
    return { guest: localMatch, existingRsvp: null };
  }

  const guestsSnap = await getDocs(collection(db, GUESTS_COLLECTION));
  const allGuests = guestsSnap.docs.map((d) =>
    normalizeGuestRecord(d.data() as Partial<GuestRecord>, d.id)
  );

  const match = allGuests.find(matchesGuest) ?? null;

  if (!match) {
    return { guest: null, existingRsvp: null };
  }

  const rsvpSnap = await getDoc(doc(db, RSVPS_COLLECTION, match.id));
  const existingRsvp = rsvpSnap.exists()
    ? normalizeRsvpSubmission(rsvpSnap.data() as Partial<RsvpSubmission>, match.id)
    : null;

  return { guest: match, existingRsvp };
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
    const trimmedBlessing = submission.blessingMessage.trim();

    // --- Phase 1: Execute all reads before any writes (Firestore requirement) ---
    const prevRef =
      previousGiftId && previousGiftId !== submission.reservedGiftId
        ? doc(firestore, REGISTRY_COLLECTION, previousGiftId)
        : null;
    const prevSnap = prevRef ? await tx.get(prevRef) : null;

    const giftRef = submission.reservedGiftId
      ? doc(firestore, REGISTRY_COLLECTION, submission.reservedGiftId)
      : null;
    const giftSnap = giftRef ? await tx.get(giftRef) : null;

    const blessingRef = trimmedBlessing
      ? doc(firestore, BLESSINGS_COLLECTION, submission.guestId)
      : null;
    const existingBlessing = blessingRef ? await tx.get(blessingRef) : null;

    // --- Phase 2: Validate gift availability ---
    if (giftSnap?.exists()) {
      const giftData = giftSnap.data() as RegistryItem;
      if (
        !giftData.allowMultiple &&
        giftData.reservedByGuestId !== null &&
        giftData.reservedByGuestId !== submission.guestId
      ) {
        throw new Error(
          `"${giftData.title}" was just reserved by another guest. Please select another gift.`
        );
      }
    }

    // --- Phase 3: Execute all writes ---
    // 1. Release previous gift if guest changed selection
    if (prevRef && prevSnap?.exists()) {
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

    // 2. Reserve newly selected gift (if any)
    if (giftRef && giftSnap?.exists()) {
      const giftData = giftSnap.data() as RegistryItem;
      if (giftData.allowMultiple) {
        const currentIds = giftData.reservedByGuestIds ?? [];
        if (!currentIds.includes(submission.guestId)) {
          tx.update(giftRef, {
            reservedByGuestIds: [...currentIds, submission.guestId],
          });
        }
      } else {
        tx.update(giftRef, { reservedByGuestId: submission.guestId });
      }
    }

    // 3. Upsert RSVP keyed by guestId
    const rsvpRef = doc(firestore, RSVPS_COLLECTION, submission.guestId);
    tx.set(
      rsvpRef,
      {
        ...submission,
        pledgeAmount: submission.pledgeAmount ?? null,
        confirmedByAdmin: false,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // 4. Upsert blessing if provided
    if (blessingRef && trimmedBlessing) {
      const existingCreatedAt = existingBlessing?.exists()
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
          message: trimmedBlessing,
          createdAt: existingCreatedAt ?? Date.now(),
        } satisfies BlessingNote,
        { merge: true }
      );
    }
  });
}

// --- Admin Operations ---

export async function fetchAllGuests(): Promise<GuestRecord[]> {
  if (!isFirebaseConfigured || !db) {
    return [...INITIAL_GUESTS].sort(
      (a, b) =>
        a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
    );
  }
  const snap = await getDocs(collection(db, GUESTS_COLLECTION));
  return snap.docs
    .map((d) => normalizeGuestRecord(d.data() as Partial<GuestRecord>, d.id))
    .sort(
      (a, b) =>
        a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
    );
}

export async function fetchAllRsvps(): Promise<RsvpSubmission[]> {
  if (!isFirebaseConfigured || !db) return [];
  const snap = await getDocs(collection(db, RSVPS_COLLECTION));
  return snap.docs.map((d) =>
    normalizeRsvpSubmission(d.data() as Partial<RsvpSubmission>, d.id)
  );
}

export async function addGuestRecord(
  firstName: string,
  lastName: string
): Promise<GuestRecord> {
  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const displayName = `${trimmedFirst} ${trimmedLast}`.trim();
  const slug = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const id = `${slug || 'guest'}-${Date.now().toString(36).slice(-4)}`;
  const codeSuffix = Math.floor(100 + Math.random() * 899);
  const record: GuestRecord = {
    id,
    firstName: trimmedFirst,
    lastName: trimmedLast,
    displayName,
    searchName: displayName.toLowerCase(),
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

export interface AdminAttendanceInput {
  attendance: AttendanceMode;
  email?: string;
  dietaryNotes?: string;
}

export async function confirmGuestAttendance(
  guest: GuestRecord,
  input: AdminAttendanceInput,
  existingRsvp?: RsvpSubmission | null
): Promise<RsvpSubmission> {
  const nowIso = new Date().toISOString();
  const record: RsvpSubmission = {
    guestId: guest.id,
    firstName: existingRsvp?.firstName || guest.firstName,
    lastName: existingRsvp?.lastName || guest.lastName,
    guestName: existingRsvp?.guestName || guest.displayName,
    email: (input.email ?? existingRsvp?.email ?? '').trim(),
    attendance: input.attendance,
    dietaryNotes:
      input.attendance === 'in-person'
        ? (input.dietaryNotes ?? existingRsvp?.dietaryNotes ?? '').trim()
        : '',
    reservedGiftId: existingRsvp?.reservedGiftId ?? null,
    pledgeAmount: existingRsvp?.pledgeAmount ?? null,
    blessingMessage: existingRsvp?.blessingMessage ?? '',
    rsvpCode: existingRsvp?.rsvpCode || guest.rsvpCode,
    submittedAt: existingRsvp?.submittedAt || nowIso.slice(0, 10),
    updatedAt: nowIso,
    confirmedByAdmin: true,
  };

  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, RSVPS_COLLECTION, guest.id), record, { merge: true });
  }
  return record;
}

export async function clearGuestAttendance(guestId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const firestore = db;

  await runTransaction(firestore, async (tx) => {
    const rsvpRef = doc(firestore, RSVPS_COLLECTION, guestId);
    const rsvpSnap = await tx.get(rsvpRef);
    if (!rsvpSnap.exists()) return;

    const rsvpData = rsvpSnap.data() as Partial<RsvpSubmission>;
    if (rsvpData.reservedGiftId) {
      const giftRef = doc(firestore, REGISTRY_COLLECTION, rsvpData.reservedGiftId);
      const giftSnap = await tx.get(giftRef);
      if (giftSnap.exists()) {
        const giftData = giftSnap.data() as RegistryItem;
        if (giftData.allowMultiple) {
          const nextIds = (giftData.reservedByGuestIds ?? []).filter((id) => id !== guestId);
          tx.update(giftRef, { reservedByGuestIds: nextIds });
        } else if (giftData.reservedByGuestId === guestId) {
          tx.update(giftRef, { reservedByGuestId: null });
        }
      }
    }

    tx.delete(rsvpRef);
  });
}

export interface RegistryItemInput {
  category: string;
  title: string;
  priceLabel: string;
  description: string;
  isFund: boolean;
  allowMultiple: boolean;
}

export async function addRegistryItem(input: RegistryItemInput): Promise<RegistryItem> {
  const title = input.title.trim();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const id = `${slug || 'gift'}-${Date.now().toString(36).slice(-4)}`;
  const isFund = Boolean(input.isFund);
  const allowMultiple = isFund ? true : Boolean(input.allowMultiple);

  const record: RegistryItem = {
    id,
    category: input.category.trim(),
    title,
    priceLabel: input.priceLabel.trim(),
    description: input.description.trim(),
    isFund,
    allowMultiple,
    reservedByGuestId: null,
    reservedByGuestIds: [],
  };

  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, REGISTRY_COLLECTION, id), record);
  }
  return record;
}

export async function updateRegistryItem(
  itemId: string,
  input: RegistryItemInput
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  const ref = doc(db, REGISTRY_COLLECTION, itemId);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? (snap.data() as Partial<RegistryItem>) : {};

  const isFund = Boolean(input.isFund);
  const allowMultiple = isFund ? true : Boolean(input.allowMultiple);

  let reservedByGuestId: string | null = existing.reservedByGuestId ?? null;
  let reservedByGuestIds: string[] = existing.reservedByGuestIds ?? [];

  if (allowMultiple) {
    if (reservedByGuestId && !reservedByGuestIds.includes(reservedByGuestId)) {
      reservedByGuestIds = [reservedByGuestId, ...reservedByGuestIds];
    }
    reservedByGuestId = null;
  } else {
    if (!reservedByGuestId && reservedByGuestIds.length > 0) {
      reservedByGuestId = reservedByGuestIds[0];
    }
    reservedByGuestIds = [];
  }

  await setDoc(
    ref,
    {
      id: itemId,
      category: input.category.trim(),
      title: input.title.trim(),
      priceLabel: input.priceLabel.trim(),
      description: input.description.trim(),
      isFund,
      allowMultiple,
      reservedByGuestId,
      reservedByGuestIds,
    } satisfies RegistryItem,
    { merge: true }
  );
}

export async function clearRegistryReservations(itemId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(
    doc(db, REGISTRY_COLLECTION, itemId),
    {
      reservedByGuestId: null,
      reservedByGuestIds: [],
    },
    { merge: true }
  );
}

export async function deleteRegistryItem(itemId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, REGISTRY_COLLECTION, itemId));
}

export async function deleteBlessingNote(blessingId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, BLESSINGS_COLLECTION, blessingId));
}

export async function seedInitialCollections(): Promise<{
  guestsSeeded: number;
  registrySeeded: number;
}> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  let guestsSeeded = 0;
  let registrySeeded = 0;

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

  return { guestsSeeded, registrySeeded };
}
