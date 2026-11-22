# Architecture

`enzo-baptism` is a static React 19 + TypeScript SPA built with Vite and Tailwind CSS v4, hosted on **GitHub Pages** and backed by **Firebase (Spark free tier)**.

## Core Dependencies

- **`enzo-firestore`** (`asia-southeast1`): Stores `guests`, `rsvps`, `registry`, and `blessings`. Security rules are version-controlled in `firestore.rules`.
- **`enzo-firebase-auth`**: Google Sign-In protecting the `#admin` host dashboard via `VITE_ADMIN_EMAILS` and server-side `firestore.rules` `isAdmin()` checks.
- **`enzo-github-pages`**: Static bundle deployment with manual approval gate on the `github-pages` GitHub Environment.

## Key Engineering Patterns

1. **Atomic Gift Reservations**: `submitRsvpToStore` in `src/services/baptismService.ts` uses `runTransaction()` to prevent double-booking single-claim gifts while supporting multi-pledge consumables and funds.
2. **Offline Resilience**: Static fallback data in `src/data/baptismData.ts` ensures the invitation degrades gracefully if Firestore is unreachable.
3. **Strict TypeScript**: `strict: true` enforced on every PR in CI (`tsc -b && vite build`).

> For the full component and data-model reference, see `ARCHITECTURE.md` at the repository root.
