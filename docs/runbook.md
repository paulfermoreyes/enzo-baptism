# Operations Runbook

## 1. Deployment & Rollback

### Standard Release
1. Open a Pull Request targeting `main`. Verify `.github/workflows/ci.yml` passes (typecheck, Vite build, dependency audit).
2. Merge to `main`. This triggers `.github/workflows/deploy.yml`.
3. Approve the pending deployment in **GitHub Actions → `github-pages` environment**.

### Emergency Rollback
1. Identify the last known-good commit SHA in GitHub Actions or `git log`.
2. Revert the bad commit on `main` (`git revert <sha> && git push origin main`) and approve the resulting `github-pages` deployment.
3. If `firestore.rules` was modified, redeploy the previous ruleset via `firebase deploy --only firestore:rules`.

## 2. Common Incidents & Remediation

### Google Sign-In Fails on `#admin`
- **Symptom**: OAuth popup closes with `auth/unauthorized-domain`.
- **Fix**: In Firebase Console → **Authentication → Settings → Authorized domains**, ensure `<username>.github.io` is listed.

### Host Admin Shows "Unauthorized" After Login
- **Symptom**: Signed-in Google user cannot access admin mutations.
- **Fix**: Verify the email is included in both GitHub Secret `VITE_ADMIN_EMAILS` and the `isAdmin()` allowlist in `firestore.rules`.

### Missing Firebase Secrets in Production Build
- **Symptom**: App falls back to offline seed mode in production.
- **Fix**: Verify all `VITE_FIREBASE_*` secrets are populated under **Repo Settings → Secrets and variables → Actions** and re-run `deploy.yml`.
