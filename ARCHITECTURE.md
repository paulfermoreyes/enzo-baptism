# Architecture Reference — Lorenzo Paul ("Enzo") Holy Baptism

## 1. Architecture Overview

`enzo-baptism` is a static React + TypeScript SPA built with Vite and Tailwind CSS v4, hosted on **GitHub Pages** and backed by **Firebase (Spark free tier)** for Cloud Firestore persistence and Google Sign-In host administration.

### Tech Stack
| Layer | Technology | Notes |
| --- | --- | --- |
| UI Framework | React 19 (`^19.0.0`) | Functional components + hooks |
| Language | TypeScript (`~5.7.2`) | `strict: true` in `tsconfig.json` |
| Build Tool | Vite (`^6.2.0`) | `base: '/enzo-baptism/'`, builds to `dist/` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Design tokens in `src/index.css` & `DESIGN.md` |
| Icons | `lucide-react` (`^0.475.0`) | UI iconography |
| Database & Auth | Firebase Web SDK (`firebase`) | Cloud Firestore + Google Sign-In (`enzo-baptism-2027`) |
| CI/CD & Hosting | GitHub Actions + GitHub Pages | Build on `push` to `main`, manual approval via `github-pages` environment |

### Directory & Module Structure
```text
.github/workflows/
└── deploy.yml                      # GitHub Actions build + approval-gated Pages deploy
scripts/
└── seed-firestore.mjs              # Optional CLI seed script (Firestore REST API)
src/
├── App.tsx                         # Root state container, Firestore subscriptions & view router
├── main.tsx                        # React DOM entry point
├── index.css                       # Tailwind v4 @theme tokens, celestial styles, print rules
├── lib/
│   └── firebase.ts                 # Firebase app, Firestore, Auth & admin email check
├── services/
│   └── baptismService.ts           # Firestore CRUD, transactional gift reservations & local fallback
├── types/
│   └── baptism.ts                  # Domain interfaces (GuestRecord, RegistryItem, BlessingNote, RsvpSubmission)
├── data/
│   └── baptismData.ts              # Static event info & initial seed data / offline fallback
└── components/
    ├── admin/
    │   └── AdminPage.tsx           # Google Sign-In protected host dashboard (#admin)
    ├── layout/
    │   ├── Navbar.tsx              # Top navigation (shows Confirmation once verified/submitted)
    │   └── Footer.tsx              # Footer credits + Host Admin link
    ├── ui/
    │   ├── StationeryCard.tsx      # Parchment card container with optional arch top
    │   ├── CeremonialRule.tsx      # Gold tapering divider
    │   └── ModalDialog.tsx         # Native <dialog> wrapper
    ├── invitation/
    │   ├── HeroSection.tsx         # Event title, date, scripture, CTAs
    │   ├── ScheduleSection.tsx     # Ceremony & reception details + maps/calendar links
    │   ├── FaqSection.tsx          # Attire, gifts, children, livestream info
    │   └── BlessingsWall.tsx       # Live BlessingNote[] from Firestore
    ├── rsvp/
    │   ├── GuestLookup.tsx         # Invite-only guest lookup; redirects to Confirmation if already RSVPed
    │   ├── RsvpForm.tsx            # Attendance, guest count, dietary notes, gift & blessing form
    │   └── GiftRegistryGrid.tsx    # Single-claim ("Reserved") & multi-pledge consumable/fund items
    └── pass/
        └── ConfirmationPass.tsx    # Confirmation summary, .ics calendar downloads, print, share & edit RSVP
```

---

## 2. Data Model & Guest Flow

### Firestore Collections (`enzo-baptism-2027`, `asia-southeast1`)
1. **`guests/{guestId}`** (invite-only list, no tier/table classification)
   - `id`, `displayName`, `searchName` (lowercased), `reservedSeats`, `rsvpCode`
2. **`rsvps/{guestId}`** (keyed by `guestId` so re-submissions update cleanly)
   - `guestId`, `guestName`, `email`, `attendance` (`'in-person' | 'remote'`), `guestCount`, `dietaryNotes`, `reservedGiftId`, `pledgeAmount`, `blessingMessage`, `rsvpCode`, `submittedAt`, `updatedAt`
3. **`registry/{itemId}`**
   - `id`, `category`, `title`, `priceLabel`, `description`, `isFund`, `allowMultiple`
   - Single-claim items (`allowMultiple: false`): `reservedByGuestId` (`string | null`), displayed to other guests simply as `"Reserved"` for privacy.
   - Consumable / fund items (`allowMultiple: true`, e.g., Diapers, Wet Wipes, Educational Trust): `reservedByGuestIds` (`string[]`), allowing multiple guests to pledge simultaneously.
4. **`blessings/{guestId}`**
   - `id`, `author`, `initials`, `role`, `message`, `createdAt`

### Key User Flows
- **Invite-Only Verification (`GuestLookup.tsx`):** Guests enter their name. Only names matching the `guests` collection are accepted. If the guest has already submitted an RSVP (`rsvps/{guestId}` exists), they are redirected straight to the Confirmation view (`ConfirmationPass.tsx`), where they can also click **Edit RSVP Response**.
- **Atomic Gift Reservations (`baptismService.ts`):** `submitRsvpToStore` runs a Firestore `runTransaction()` that releases any previously selected gift, verifies a single-claim gift is still unreserved, claims the new gift, upserts `rsvps/{guestId}`, and upserts `blessings/{guestId}`.
- **Host Admin (`#admin` / Footer link):** Protected by Firebase Google Sign-In (`VITE_ADMIN_EMAILS` + `firestore.rules` `isAdmin()`). Allows 1-click initial data seeding, adding/removing invited guests, viewing RSVPs & dietary notes, and moderating blessings.

---

## 3. Deployment & Configuration Checklist

1. **Firebase Auth Authorized Domains:**
   In Firebase Console → **Authentication → Settings → Authorized domains**, add `<username>.github.io` so Google Sign-In works on GitHub Pages (in addition to `localhost`).
2. **GitHub Repository Secrets:**
   Add the variables from `.env.example` (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_ADMIN_EMAILS`) under **GitHub Repo → Settings → Secrets and variables → Actions**.
3. **GitHub Pages + Approval Gate:**
   - Enable **GitHub Pages** with Source = **GitHub Actions** (**Settings → Pages**).
   - Configure **Required reviewers** on the `github-pages` environment (**Settings → Environments → github-pages**) so pushes to `main` pause before deploying until you approve the job.
