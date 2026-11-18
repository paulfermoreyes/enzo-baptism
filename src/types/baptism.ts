export type PageView = 'invitation' | 'rsvp' | 'pass';

export type AttendanceMode = 'in-person' | 'remote';

export interface GuestRecord {
  id: string;
  displayName: string;
  tier: string;
  reservedSeats: number;
  tableNumber: string;
  rsvpCode: string;
}

export interface RegistryItem {
  id: string;
  category: string;
  title: string;
  priceLabel: string;
  description: string;
  isFund?: boolean;
  reservedBy?: string;
}

export interface BlessingNote {
  id: string;
  author: string;
  initials: string;
  role: string;
  message: string;
  folioPage?: string;
}

export interface RsvpSubmission {
  guestName: string;
  email: string;
  attendance: AttendanceMode;
  guestCount: number;
  dietaryNotes: string;
  reservedGiftId: string | null;
  pledgeAmount?: string;
  blessingMessage: string;
  rsvpCode: string;
  tier: string;
  tableNumber: string;
  submittedAt: string;
}
