/**
 * Optional CLI seed script for Firestore.
 *
 * Note: Because firestore.rules restricts writes to `guests` and `registry`
 * to authenticated admin users, the easiest way to seed initial data is to
 * open `#admin` in the app, sign in with your authorized Google account, and
 * click "Seed Initial Data".
 *
 * If you want to run this script from the CLI, pass an admin Firebase Auth
 * ID token via FIREBASE_ID_TOKEN (or temporarily relax rules while seeding):
 *
 *   FIREBASE_ID_TOKEN=<token> node --env-file=.env scripts/seed-firestore.mjs
 */

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const idToken = process.env.FIREBASE_ID_TOKEN;

if (!projectId) {
  console.error('Missing VITE_FIREBASE_PROJECT_ID in .env');
  process.exit(1);
}

const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

const GUESTS = [
  { id: 'elena-marco', displayName: 'Elena & Marco Santos', searchName: 'elena & marco santos', reservedSeats: 2, rsvpCode: '#ENZO-2027-01' },
  { id: 'angel-carlo', displayName: 'Angel & Carlo Reyes', searchName: 'angel & carlo reyes', reservedSeats: 2, rsvpCode: '#ENZO-2027-02' },
  { id: 'marco-bea', displayName: 'Marco & Bea Mendoza', searchName: 'marco & bea mendoza', reservedSeats: 3, rsvpCode: '#ENZO-2027-03' },
];

const REGISTRY = [
  { id: 'memory-box', category: 'Heirloom Keepsake', title: 'Engraved Wooden Memory Box', priceLabel: '$75', description: "Handmade cedar keepsake chest for preserving Enzo's hospital bracelet, baptismal stole, and first curls.", isFund: false, allowMultiple: false, reservedByGuestId: null },
  { id: 'silver-cup', category: 'Sacramental Classic', title: 'Silver Christening Cup & Spoon', priceLabel: '$120', description: 'Traditional heirloom engraved with his baptismal date and patron saint blessing motif.', isFund: false, allowMultiple: false, reservedByGuestId: null },
  { id: 'montessori-blocks', category: 'Sensory & Play', title: 'Soft Montessori Sensory Blocks', priceLabel: '$45', description: 'BPA-free sensory stacking blocks featuring textured animals, numerals, and gentle chiming bells.', isFund: false, allowMultiple: false, reservedByGuestId: null },
  { id: 'diapers-bundle', category: 'Daily Essentials', title: 'Newborn & Size-M Diapers', priceLabel: 'Consumable', description: 'Soft, breathable diapers for Enzo’s growing months—multiple guests are welcome to pledge a pack.', isFund: false, allowMultiple: true, reservedByGuestId: null, reservedByGuestIds: [] },
  { id: 'wet-wipes-pack', category: 'Daily Essentials', title: 'Sensitive Unscented Wet Wipes', priceLabel: 'Consumable', description: 'Gentle 99% pure water baby wipes for everyday care—multiple pledges warmly appreciated.', isFund: false, allowMultiple: true, reservedByGuestId: null, reservedByGuestIds: [] },
  { id: 'educational-trust', category: 'Future Dreams Fund', title: 'Enzo’s Educational Trust', priceLabel: 'Any Amount', description: "Direct contribution to Lorenzo's future schooling and developmental savings account.", isFund: true, allowMultiple: true, reservedByGuestId: null, reservedByGuestIds: [] },
];

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  throw new Error(`Unsupported value: ${typeof val}`);
}

async function upsertDoc(collection, docId, data) {
  const fields = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)]));
  const headers = { 'Content-Type': 'application/json' };
  if (idToken) headers.Authorization = `Bearer ${idToken}`;

  const res = await fetch(`${baseUrl}/${collection}/${docId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed ${collection}/${docId}: ${res.status} ${text}`);
  }
}

async function main() {
  for (const g of GUESTS) {
    await upsertDoc('guests', g.id, g);
  }
  for (const r of REGISTRY) {
    await upsertDoc('registry', r.id, r);
  }
  console.log(`Seeded ${GUESTS.length} guests and ${REGISTRY.length} registry items into ${projectId}.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
