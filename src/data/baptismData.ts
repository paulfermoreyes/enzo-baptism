import type { BlessingNote, GuestRecord, RegistryItem } from '../types/baptism';

export const EVENT_INFO = {
  babyFullName: 'Lorenzo Paul',
  babyNickname: 'Enzo',
  dateDisplay: 'Tuesday, January 12, 2027',
  rsvpDeadline: 'December 20, 2026',
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
    note: 'Dress Code: Formal pastel or Sunday best',
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
  livestream: {
    title: 'Live Ceremony Stream & Spiritual Presence',
    dateTime: 'January 12, 2027 • 11:00 AM PHT',
    description:
      'Even from afar, your prayers envelope Lorenzo in divine grace. The Sacred Rite of Baptism will be broadcast live via private family stream so you can witness every moment in prayer with us.',
    streamUrl: 'https://meet.google.com/',
  },
};

export const INITIAL_GUESTS: GuestRecord[] = [
  {
    id: 'elena-marco',
    displayName: 'Elena & Marco Santos',
    searchName: 'elena & marco santos',
    reservedSeats: 2,
    rsvpCode: '#ENZO-2027-01',
  },
  {
    id: 'angel-carlo',
    displayName: 'Angel & Carlo Reyes',
    searchName: 'angel & carlo reyes',
    reservedSeats: 2,
    rsvpCode: '#ENZO-2027-02',
  },
  {
    id: 'marco-bea',
    displayName: 'Marco & Bea Mendoza',
    searchName: 'marco & bea mendoza',
    reservedSeats: 3,
    rsvpCode: '#ENZO-2027-03',
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

export const INITIAL_BLESSINGS: BlessingNote[] = [
  {
    id: 'b-1',
    author: 'Ninang Angel & Ninong Carlo',
    initials: 'NA',
    role: 'Godparents • Manila',
    message:
      'Dearest little Enzo, may God’s radiant light guide every tender step you take. We promise to stand by your side with boundless love, wisdom, and laughter!',
    folioPage: 'Page 11',
    createdAt: 1700000001000,
  },
  {
    id: 'b-2',
    author: 'Tito Marco & Tita Bea',
    initials: 'TM',
    role: 'Cousins • Quezon City',
    message:
      'Welcome to Christ’s warm embrace, baby Lorenzo Paul! You bring our entire family so much peace and sunshine. We cannot wait to celebrate your special day.',
    folioPage: 'Page 12',
    createdAt: 1700000002000,
  },
  {
    id: 'b-3',
    author: 'Elena & Marco Santos',
    initials: 'EM',
    role: 'Principal Sponsors • Quezon City',
    message:
      'May God bless you with abundant wisdom, pure wonder, and eternal peace every step of your sacred journey, sweet Enzo. We love you with all our hearts.',
    folioPage: 'Page 14',
    createdAt: 1700000003000,
  },
];

export const FAQ_ITEMS = [
  {
    id: 'attire',
    title: 'Attire & Dress Code',
    badge: 'Light Tones Preferred',
    description:
      'We kindly ask guests to dress in reverent church attire with soft palettes: tender baby blues, creams, champagne gold, or light pastels.',
  },
  {
    id: 'gifts',
    title: 'Gifts & Keepsakes',
    badge: "Enzo's Future Fund",
    description:
      'Your prayers, presence, and warm memories are Enzo’s greatest gifts. For those wishing to contribute to Enzo’s education and nursery savings fund, an envelope box will be prepared at Shakey’s reception.',
  },
  {
    id: 'children',
    title: 'Young Children Welcome',
    badge: 'Fun For All Ages',
    description:
      'Little cousins and friends are warmly invited! The reception at Shakey’s will feature a dedicated kid-friendly play corner with coloring storybooks and balloon keepsakes.',
  },
  {
    id: 'livestream',
    title: 'Celebrating From Afar',
    badge: 'Live Altar Stream',
    description:
      'Loved ones joining remotely can RSVP as "Celebrating in Spirit" to receive the private Basilica livestream link and have their blessing inscribed in Enzo’s Memory Folio.',
  },
];
