import type { GuestRecord, RegistryItem } from '../types/baptism';

export const EVENT_INFO = {
  babyFullName: 'Lorenzo Paul Reyes',
  babyNickname: 'Enzo',
  dateDisplay: 'Tuesday, January 12, 2027',
  rsvpDeadline: 'December 15, 2026',
  scripture: {
    text: 'Whoever welcomes a little child like this in my name welcomes me.',
    reference: 'Matthew 18:5',
  },
  ceremony: {
    part: 'Part I',
    title: 'Holy Baptism',
    time: '11:00 AM – 12:00 PM',
    venue: 'Minor Basilica of the National Shrine of Our Lady of Mount Carmel',
    shortVenue: 'Minor Basilica of Mount Carmel',
    address: 'Broadway Ave, corner 5th St, Mariana, New Manila, Quezon City, Metro Manila',
    mapsUrl: 'https://maps.google.com/?q=Minor+Basilica+of+Our+Lady+of+Mount+Carmel+New+Manila+Quezon+City',
    note: 'Dress Code: Baby Blue, Beige, or Brown (Sunday best)',
    isoStart: '20270112T030000Z',
    isoEnd: '20270112T040000Z',
  },
  reception: {
    part: 'Part II',
    title: 'Reception & Luncheon',
    time: '01:00 PM – 03:00 PM',
    venue: "Shakey's Pizza Parlor & Event Hall",
    shortVenue: "Shakey's Tomas Morato",
    address: 'Tomas Morato Ave cor. Sct. Gandia St., Diliman, Quezon City, Metro Manila (Party Hall B)',
    mapsUrl: 'https://maps.google.com/?q=Shakeys+Tomas+Morato+Quezon+City',
    note: 'Valet & reserved parking available in building rear',
    isoStart: '20270112T050000Z',
    isoEnd: '20270112T070000Z',
  },
  remotePresence: {
    title: 'Celebrating in Spirit & Prayer',
    dateTime: 'January 12, 2027 • 11:00 AM PHT',
    description:
      'Even from afar, your prayers and loving wishes surround Lorenzo in divine grace. Thank you for keeping Baby Enzo in your heart on his Christening Day.',
  },
};

export const INITIAL_GUESTS: GuestRecord[] = [
  {
    id: 'elena-santos',
    firstName: 'Elena',
    lastName: 'Santos',
    displayName: 'Elena Santos',
    searchName: 'elena santos',
    rsvpCode: '#ENZO-2027-01',
  },
  {
    id: 'marco-santos',
    firstName: 'Marco',
    lastName: 'Santos',
    displayName: 'Marco Santos',
    searchName: 'marco santos',
    rsvpCode: '#ENZO-2027-02',
  },
  {
    id: 'angel-reyes',
    firstName: 'Angel',
    lastName: 'Reyes',
    displayName: 'Angel Reyes',
    searchName: 'angel reyes',
    rsvpCode: '#ENZO-2027-03',
  },
  {
    id: 'carlo-reyes',
    firstName: 'Carlo',
    lastName: 'Reyes',
    displayName: 'Carlo Reyes',
    searchName: 'carlo reyes',
    rsvpCode: '#ENZO-2027-04',
  },
];

export const INITIAL_REGISTRY_ITEMS: RegistryItem[] = [
  {
    id: 'memory-box',
    category: 'Heirloom Keepsake',
    title: 'Engraved Wooden Memory Box',
    priceLabel: '$75',
    description:
      "Handmade cedar keepsake chest for preserving Enzo's hospital bracelet, baptismal stole, and first curls.",
    isFund: false,
    allowMultiple: false,
    reservedByGuestId: null,
  },
  {
    id: 'silver-cup',
    category: 'Sacramental Classic',
    title: 'Silver Christening Cup & Spoon',
    priceLabel: '$120',
    description:
      'Traditional heirloom engraved with his baptismal date and patron saint blessing motif.',
    isFund: false,
    allowMultiple: false,
    reservedByGuestId: null,
  },
  {
    id: 'montessori-blocks',
    category: 'Sensory & Play',
    title: 'Soft Montessori Sensory Blocks',
    priceLabel: '$45',
    description:
      'BPA-free sensory stacking blocks featuring textured animals, numerals, and gentle chiming bells.',
    isFund: false,
    allowMultiple: false,
    reservedByGuestId: null,
  },
  {
    id: 'diapers-bundle',
    category: 'Daily Essentials',
    title: 'Newborn & Size-M Diapers',
    priceLabel: 'Consumable',
    description:
      'Soft, breathable diapers for Enzo’s growing months—multiple guests are welcome to pledge a pack.',
    isFund: false,
    allowMultiple: true,
    reservedByGuestId: null,
    reservedByGuestIds: [],
  },
  {
    id: 'wet-wipes-pack',
    category: 'Daily Essentials',
    title: 'Sensitive Unscented Wet Wipes',
    priceLabel: 'Consumable',
    description:
      'Gentle 99% pure water baby wipes for everyday care—multiple pledges warmly appreciated.',
    isFund: false,
    allowMultiple: true,
    reservedByGuestId: null,
    reservedByGuestIds: [],
  },
  {
    id: 'educational-trust',
    category: 'Future Dreams Fund',
    title: 'Enzo’s Educational Trust',
    priceLabel: 'Any Amount',
    description:
      "Direct contribution to Lorenzo's future schooling and developmental savings account.",
    isFund: true,
    allowMultiple: true,
    reservedByGuestId: null,
    reservedByGuestIds: [],
  },
];

export const FAQ_ITEMS = [
  {
    id: 'attire',
    title: 'Attire & Dress Code',
    badge: 'Baby Blue, Beige & Brown',
    description:
      'We kindly ask guests to dress in reverent church attire featuring soft, warm tones: baby blue, beige, or brown.',
  },
  {
    id: 'gifts',
    title: 'Gifts & Keepsakes',
    badge: 'Registry & Monetary Option',
    description:
      'Your prayers, presence, and warm memories are Enzo’s greatest gifts. If you wish to bless him further, you may browse his Gift Registry when you RSVP—a monetary gift option is also available.',
  },
  {
    id: 'afar',
    title: 'Celebrating From Afar',
    badge: 'Prayers From Afar',
    description:
      'Loved ones joining remotely can RSVP as "Celebrating in Spirit" to send their love and have their blessing inscribed in Enzo’s Memory Folio.',
  },
];
