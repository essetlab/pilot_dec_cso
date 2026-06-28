# MVP Slice 1 Public Navigation Certificate Verification Report

## 1. Summary of changes

- Removed disabled/misleading public navigation items from the public header and mobile menu.
- Activated a working public `Verify Certificate` navigation link.
- Added a public `/verify-certificate` route with:
  - initial verification form
  - valid certificate result
  - invalid/not-found state
  - inactive certificate state support through existing certificate statuses
- Added a public certificate lookup helper that returns only verification-safe fields.
- Kept existing `/courses` and `/courses/[courseSlug]` behavior unchanged.
- Kept HRBA external-course workflows unchanged.

## 2. Files changed

- `src/components/shell/PublicShell.tsx`
- `src/lib/certificate-workflow.ts`
- `src/lib/routes.ts`
- `src/app/(public)/verify-certificate/page.tsx`
- `src/components/public/CertificateVerificationPage.tsx`
- `docs/mvp-slice-1-public-navigation-certificate-verification-report.md`

## 3. Public navigation behavior

- Header and mobile public navigation now show:
  - `HOME`
  - `COURSES`
  - `VERIFY CERTIFICATE`
- Disabled `ABOUT`, disabled `CATALOG`, and disabled `VERIFY CERTIFICATE` entries were removed.
- Footer platform links now include active `Home`, `Verify Certificate`, and `Courses` links.
- Footer non-working policy/terms text was removed to avoid presenting inactive controls as links.

## 4. Certificate verification behavior

Public route:

```text
/verify-certificate
```

Lookup route format:

```text
/verify-certificate?code=CERTIFICATE_CODE
```

States implemented:

- Initial form: shown when no `code` query parameter is present.
- Valid certificate: shows a public verification card.
- Not found / invalid code: shows a clear not-found state.
- Inactive/revoked/expired: supported using existing `CertificateStatus` values and shown as a record found but not active.

The page uses a GET form, so verification URLs are shareable without adding new server actions or database models.

## 5. Data privacy protections

The public lookup returns only:

- certificate status
- learner display name / name on certificate
- course title
- issue date
- certificate code / ID
- issuing platform

The public lookup does not select or render:

- learner email
- assessment answers
- quiz score
- private progress records
- private organization details
- role assignments
- feedback content
- portfolio or private course activity

## 6. HRBA external-course stability check

No HRBA external-course code was modified.

Existing HRBA evidence remains in place:

- `/learn/courses/[courseSlug]/external` still routes through the learner catchall.
- `src/lib/external-course-workflow.ts` remains unchanged.
- `src/app/api/external-course-progress/route.ts` remains unchanged.
- Prior DB verification passed:
  - `npm run register:hrba-external-course`
  - `npm run verify:hrba-external-course`
  - `npm run verify:hrba-course-import`

Manual route to check after sign-in:

```text
/learn/courses/applying-human-rights-based-approach-in-cso-practice/external
```

## 7. Commands run and results

Commands run:

```powershell
npm run lint
npm run build
npm run prisma:validate
```

Results:

- `npm run lint`: passed.
- `npm run build`: passed.
  - Build route output now includes `/verify-certificate`.
  - The previous Prisma `ECONNREFUSED` warning did not appear.
- `npm run prisma:validate`: passed.

Additional DB lookup used for manual verification planning:

```powershell
select "certificateCode" from "Certificate" order by "issuedAt" desc limit 1;
```

Seeded/generated valid code observed:

```text
CERT-E-V1-DEMO-GVO5
```

## 8. Manual verification steps

With the local app running, verify:

1. Open `/`.
   - Confirm the public nav does not show disabled `ABOUT` or disabled `CATALOG`.
   - Confirm `VERIFY CERTIFICATE` is an active link.

2. Open `/courses`.
   - Confirm the catalogue still loads.

3. Open a public course detail route, for example:

```text
/courses/applying-human-rights-based-approach-in-cso-practice
```

   - Confirm course detail behavior remains stable.

4. Open `/verify-certificate`.
   - Confirm the initial form appears.

5. Open:

```text
/verify-certificate?code=CERT-E-V1-DEMO-GVO5
```

   - Confirm a valid certificate state appears.
   - Confirm only public certificate details are shown.

6. Open:

```text
/verify-certificate?code=NOT-A-REAL-CERTIFICATE
```

   - Confirm the not-found state appears.

7. Sign in as a participant and open:

```text
/learn/courses/applying-human-rights-based-approach-in-cso-practice/external
```

   - Confirm the HRBA external course route still launches through the existing learner route.

## 9. Remaining issues

- No automated UI/browser test pattern was identified for this route, so manual verification steps are documented.
- No new PDF certificate generation or public certificate download was added in this slice.
- Support tickets, forums, privacy settings, learner profile editing, and new database models were intentionally not implemented.

## 10. Recommended next slice

MVP Slice 2 should focus on the next approved cleanup item after manual verification of Slice 1, without expanding into Phase 2/3 modules.
