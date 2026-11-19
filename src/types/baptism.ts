export type PageView = 'invitation' | 'rsvp' | 'pass' | 'admin';

export type AttendanceMode = 'in-person' | 'remote';

export interface GuestRecord {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  searchName: string;
  rsvpCode: string;
}

export interface RegistryItem {
  id: string;
  category: string;
  title: string;
  priceLabel: string;
  description: string;
  isFund: boolean;
  allowMultiple: boolean;
  reservedByGuestId: string | null;
  reservedByGuestIds?: string[];
}

export interface BlessingNote {
  id: string;
  author: string;
  initials: string;
  role: string;
  message: string;
  folioPage?: string;
  createdAt?: number;
}

export interface RsvpSubmission {
  guestId: string;
  firstName: string;
  lastName: string;
  guestName: string;
  email: string;
  attendance: AttendanceMode;
  dietaryNotes: string;
  reservedGiftId: string | null;
  pledgeAmount?: string | null;
  blessingMessage: string;
  rsvpCode: string;
  submittedAt: string;
  updatedAt?: string;
}
