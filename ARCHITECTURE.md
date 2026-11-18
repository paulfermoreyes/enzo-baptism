# Architecture Reference — Lorenzo Paul ("Enzo") Holy Baptism

## 1. Current Architecture Overview

`enzo-baptism` is a static, client-side React single-page application (SPA) built with Vite, TypeScript, and Tailwind CSS v4. It has no backend, no routing library, and no persistent storage.

### Tech Stack
| Layer | Technology | Notes |
| --- | --- | --- |
| UI Framework | React 19 (`^19.0.0`) | Functional components + hooks |
| Language | TypeScript (`~5.7.2`) | `strict: true` in `tsconfig.json` |
| Build Tool | Vite (`^6.2.0`) | Outputs static bundle to `dist/` via `tsc -b && vite build` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Design tokens defined in `src/index.css` & `DESIGN.md` |
| Icons | `lucide-react` (`^0.475.0`) | UI iconography |
| Fonts | Google Fonts (`index.html`) | `Playfair Display`, `EB Garamond`, `Nunito Sans` |

### Directory & Module Structure
```text
src/
├── App.tsx                         # Root state container & view switcher ('invitation' | 'rsvp' | 'pass')
├── main.tsx                        # React DOM entry point
├── index.css                       # Tailwind v4 @theme tokens, celestial styles, print rules
├── types/
│   └── baptism.ts                  # Core domain interfaces (GuestRecord, RegistryItem, BlessingNote, RsvpSubmission)
├── data/
│   └── baptismData.ts              # Static seed data (EVENT_INFO, VIP_GUESTS, INITIAL_REGISTRY_ITEMS, INITIAL_BLESSINGS, FAQ_ITEMS, DEFAULT_SUBMISSION)
└── components/
    ├── layout/
    │   ├── Navbar.tsx              # Top navigation & pass confirmation indicator
    │   └── Footer.tsx              # Footer credits & event summary
    ├── ui/
    │   ├── StationeryCard.tsx      # Parchment card container with optional arch top
    │   ├── CeremonialRule.tsx      # Gold tapering divider
    │   └── ModalDialog.tsx         # Native <dialog> wrapper
    ├── invitation/
    │   ├── HeroSection.tsx         # Event title, date, scripture, CTAs
    │   ├── ScheduleSection.tsx     # Ceremony & reception details + maps/calendar links
    │   ├── FaqSection.tsx          # Attire, gifts, children, livestream info
    │   └── BlessingsWall.tsx       # Displays BlessingNote[]
    ├── rsvp/
    │   ├── GuestLookup.tsx         # Step 1: Name search against VIP_GUESTS (falls back to generated GuestRecord)
    │   ├── RsvpForm.tsx            # Step 2 & 4: Attendance, guest count, dietary notes, blessing message
    │   └── GiftRegistryGrid.tsx    # Step 3: Gift selection / educational fund pledge
    └── pass/
        └── ConfirmationPass.tsx    # Digital event pass, .ics download, print, Web Share / clipboard
```

### Current Data Flow & Limitations
All application state is held in React `useState` inside `src/App.tsx`:
- `currentView`: switches between `'invitation'`, `'rsvp'`, and `'pass'` without URL routing.
- `verifiedGuest`: initialized to `VIP_GUESTS[0]` (`Elena & Marco Santos`).
- `registryItems`: initialized to `INITIAL_REGISTRY_ITEMS` (currently read-only—no state setter is wired to mark an item's `reservedBy`).
- `blessings`: initialized to `INITIAL_BLESSINGS`; `handleSubmitRsvp` prepends new blessings in memory only.
- `submission`: initialized to `DEFAULT_SUBMISSION`; updated in memory on form submit.

**Current gaps for real-world use:**
1. **No persistence:** Refreshing the page resets all RSVPs, blessings, and gift selections.
2. **No shared state:** Guests cannot see gifts reserved by other guests or blessings posted by others.
3. **No host visibility:** Submitted RSVPs, headcounts, and dietary notes are not sent or saved anywhere for the hosts.
4. **Decorative QR code:** `ConfirmationPass.tsx` renders a static SVG pattern rather than encoding the guest's `rsvpCode`.

---

## 2. Feasibility Analysis: GitHub Pages & "No Database" Options

### Can this run on GitHub Pages alone?
**Yes for hosting, no for shared data storage.**  
GitHub Pages only serves static files (`HTML`, `CSS`, `JS`). It cannot receive `POST` requests or write files on a server.

### Can the features work without a database?
It depends on which features you are willing to drop or simplify:

| Feature | Without a Database (Static + `localStorage` / URL params) | With Google Sheets / Forms (No traditional DB) | With Firebase Firestore (Minimal DB) |
| --- | --- | --- | --- |
| Invitation, Schedule, FAQ, `.ics` Calendar, Print | Works fully | Works fully | Works fully |
| Guest Pass & Returning to Edit | Single-device only (`localStorage`) or via shareable URL params | Works if queried via Apps Script | Works across devices via `rsvpCode` |
| Host Receiving RSVPs & Dietary Notes | **Does not work** (unless replaced with a `mailto:` link or external Google Form) | Works (appends rows to a Google Sheet) | Works (stored in `rsvps` collection) |
| Shared Gift Registry (preventing duplicate gifts) | **Does not work** (guests cannot see what others reserved) | Possible via Apps Script, but prone to race conditions & cold-start latency | Works cleanly with Firestore transactions |
| Live Blessings Wall | **Does not work** across visitors | Possible via Apps Script JSON endpoint | Works in real time |

> **Bottom line:** If you want guests to see which gifts are already taken and see each other's blessings on the wall—without manually updating `baptismData.ts` and redeploying—you need a shared data store.

---

## 3. Proposed Minimal Architecture (GitHub Pages + Firebase)

The lowest-cost, lowest-maintenance architecture keeps **GitHub Pages** for static hosting and uses **Firebase (Spark free tier)** purely as a serverless database. No backend server, no Cloud Functions, and no paid Blaze plan are required.

```text
┌───────────────────────────┐        HTTPS (Client SDK)        ┌──────────────────────────────┐
│  GitHub Pages             │ ───────────────────────────────▶ │  Firebase (Spark Free Tier)  │
│  Static Vite/React Bundle │                                  │  • Cloud Firestore (DB)      │
│  (dist/)                  │ ◀─────────────────────────────── │  • Security Rules (AuthZ)    │
└───────────────────────────┘     Reads / Transactional Writes └──────────────────────────────┘
```

### Why Firebase Fits Here
- **Zero extra cost:** Firestore Spark plan includes 1 GiB storage, 50,000 reads/day, and 20,000 writes/day—far above what a family baptism invitation requires.
- **No backend code to maintain:** The `firebase` Web SDK talks directly to Firestore from the browser.
- **Atomic gift reservations:** Firestore `runTransaction()` prevents two guests from reserving the same registry item simultaneously.

### Minimal Firestore Data Model
Keep the schema flat and aligned with `src/types/baptism.ts`:

1. **`guests/{guestId}`** (seeded by host before launch)
   - `displayName`: string
   - `searchName`: string (lowercased for case-insensitive lookup)
   - `tier`: string (e.g., `"Godparent Tier"`, `"Beloved Family"`)
   - `reservedSeats`: number
   - `tableNumber`: string
   - `rsvpCode`: string (e.g., `"#ENZO-2027-GODP-88"`)

2. **`rsvps/{rsvpCode}`** (created/updated by guest on submit)
   - `guestName`, `attendance`, `guestCount`, `dietaryNotes`, `reservedGiftId`, `pledgeAmount`, `blessingMessage`, `rsvpCode`, `tier`, `tableNumber`, `submittedAt`, `updatedAt`
   - *Privacy note:* Store `email` in a write-only or private field/subcollection if you do not want guests able to read other guests' email addresses.

3. **`registry/{itemId}`** (seeded by host)
   - `category`, `title`, `priceLabel`, `description`, `isFund`
   - `reservedByCode`: string | null (stores `rsvpCode` or `null`, updated via transaction; avoid exposing guest email)
   - `reservedByName`: string | null (optional display label or simply show `"Reserved"`)

4. **`blessings/{blessingId}`** (public wall)
   - `author`, `initials`, `role`, `message`, `folioPage`, `rsvpCode`, `createdAt`

### Recommended Code Additions (Minimal Footprint)
1. **Dependencies:** `npm install firebase`
2. **Config & Service Layer:**
   - `src/lib/firebase.ts`: Initialize `initializeApp` and `getFirestore` using `VITE_FIREBASE_*` environment variables.
   - `src/services/baptismService.ts`:
     - `lookupGuest(nameOrCode)`
     - `submitRsvp(submission)` (writes `rsvps/{rsvpCode}`, optionally writes/updates `blessings`, and runs a Firestore transaction on `registry/{itemId}` to claim/release a gift)
     - `fetchRegistryItems()` & `fetchBlessings()` (or `onSnapshot` listeners)
3. **GitHub Pages Deployment Config:**
   - Set `base: '/enzo-baptism/'` (or your repo name) in `vite.config.ts` if deploying to `https://<user>.github.io/enzo-baptism/`.
   - Add a GitHub Actions workflow (`.github/workflows/deploy.yml`) that runs `npm run build` with the `VITE_FIREBASE_*` variables (safe to embed in client bundles; security is enforced by Firestore Rules) and publishes `dist/` to GitHub Pages.
4. **Local Fallback / Dev Mode:**
   - If `VITE_FIREBASE_PROJECT_ID` is not set, `baptismService.ts` can fall back to the existing static `src/data/baptismData.ts` so local development and previews continue working without credentials.

### Security Rules Considerations (No Login Flow)
Because guests verify by name/code rather than Firebase Auth accounts:
- **Validate shapes & sizes** in `firestore.rules` (e.g., `message.size() <= 1000`, required fields present, valid `attendance` enum `'in-person' | 'remote'`).
- **Protect `guests` & `rsvps`:** Avoid `allow list: if true` on `rsvps` if it contains emails; allow `get` by exact `rsvpCode` document ID so a guest can load/edit their own RSVP without listing everyone else's email.
- **Protect `registry`:** Allow `update` on `reservedByCode` only when `resource.data.reservedByCode == null` (claiming) or `resource.data.reservedByCode == request.resource.data.prevCode` (releasing), preventing someone from overwriting another guest's reservation.
- **Optional:** Enable **Firebase App Check** (reCAPTCHA v3) if you want extra protection against automated spam writes.
