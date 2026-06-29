# MVP Slice 3.0 Certificate PDF Generation Report

## 1. Summary of changes

- Added server-side professional certificate PDF generation from the approved HRBA PDF template.
- Added a learner-protected download route at `/learn/certificates/[certificateCode]/download`.
- Updated learner certificate list and detail views so issued certificates show `Download certificate`.
- Kept public certificate verification separate and unchanged.
- Added `pdf-lib` as the lightweight server-side PDF template overlay dependency.

## 2. Files changed

- `package.json`
- `package-lock.json`
- `public/certificate-templates/hrba-certificate-template.pdf`
- `src/app/(learn)/learn/certificates/[certificateCode]/download/route.ts`
- `src/components/learner/LearnerCertificates.tsx`
- `src/lib/certificate-pdf.ts`
- `src/lib/certificate-template-config.ts`
- `src/lib/certificate-workflow.ts`
- `docs/mvp-slice-3-0-certificate-pdf-generation-report.md`

## 3. Template asset used

The implementation uses only:

```text
public/certificate-templates/hrba-certificate-template.pdf
```

Template inspection with `pdf-lib` confirmed:

- pages: `1`
- width: `1448`
- height: `1086`

No PNG, JPG, fake, plain HTML, or generated substitute template was used.

## 4. PDF generation approach

PDF generation is server-side using `pdf-lib`.

The generator:

- loads the approved PDF template from `public/certificate-templates/`;
- embeds standard PDF fonts;
- overlays dynamic certificate fields at fixed coordinates;
- returns a downloadable `application/pdf` response;
- avoids browser screenshot generation, headless Chrome, and plain HTML certificates.

`pdf-lib` was added because no suitable PDF generation dependency was already installed.

## 5. Dynamic fields rendered

The PDF overlays these fields from existing certificate records:

- learner name from the certificate participant snapshot;
- course title from the certificate course snapshot or course record;
- date awarded from completion date, falling back to issue date;
- certificate ID from `certificateCode`;
- verification URL in the form `/verify-certificate?code=...`.

No learner email, assessment answers, raw score, organization profile details, internal database IDs, portfolio content, or admin-only data is rendered.

## 6. Coordinate/configuration notes

Coordinates live in:

```text
src/lib/certificate-template-config.ts
```

The config documents the approved template dimensions and positions:

- learner name below `THIS IS TO CERTIFY THAT`;
- course title below `HAS SUCCESSFULLY COMPLETED THE COURSE`;
- date above `DATE AWARDED`;
- certificate code above `CERTIFICATE ID`;
- verification URL below the certificate code area.

Text is centered and constrained by configured maximum widths. Long course titles can wrap to two lines; single-line fields shrink within a safe minimum font size.

## 7. Certificate download behavior

Route added:

```text
/learn/certificates/[certificateCode]/download
```

Behavior:

- returns `401` when no learner session exists;
- returns `404` for invalid, revoked, not-issued, or non-owned certificates;
- returns `application/pdf` for an issued certificate owned by the signed-in learner;
- sends `Content-Disposition: attachment` with a certificate-specific filename;
- uses `Cache-Control: private, no-store`.

## 8. Learner authorization behavior

The download route uses the current signed-in learner session and `getLearnerCertificatePdfData`.

That lookup only returns certificates where:

- `status` is `ISSUED`;
- the certificate code matches;
- the certificate belongs to the signed-in learner.

Route-level smoke verification confirmed a different signed-in learner receives `404` for another learner's certificate.

## 9. Public verification behavior

Public verification remains separate:

```text
/verify-certificate
/verify-certificate?code=...
```

The public page still shows only minimal verification data and does not expose or automatically download the learner PDF certificate.

## 10. Data privacy protections

- No `.env` values, secrets, database URLs, learner emails, assessment answers, raw scores, private organization profile details, internal IDs, or portfolio content are rendered in the PDF.
- Download access is learner-protected and scoped to the certificate owner.
- Public verification remains minimal and read-only.

## 11. Commands run and results

Commands run during implementation:

```powershell
npm install pdf-lib
npm run lint
npm run build
npm run prisma:validate
npm run verify:hrba-external-course
```

Results:

- `npm install pdf-lib`: completed and updated package files. npm reported 9 audit findings after install; no automatic audit fix was run because that could change unrelated dependencies.
- `npm run lint`: passed.
- `npm run build`: passed. After starting `cso-learning-hub-postgres`, the DB-backed build warning was resolved in the final build.
- `npm run prisma:validate`: passed.
- `npm run verify:hrba-external-course`: passed.

## 12. Manual verification steps

HTTP smoke verification used a real issued certificate from `npm run verify:hrba-external-course` and signed session cookies generated locally without printing secrets.

Verified:

1. `/learn/certificates` returned `200` for the certificate owner.
2. The learner certificate list contained `Download certificate`.
3. `/learn/certificates/[certificateCode]/download` returned `200`.
4. The download response content type was `application/pdf`.
5. The downloaded file began with `%PDF`.
6. The downloaded PDF opened with `pdf-lib` as a valid one-page PDF.
7. The generated PDF retained the approved template dimensions: `1448 x 1086`.
8. `/verify-certificate?code=[certificateCode]` returned `200` and showed the verified state.
9. A different signed-in learner received `404` for the same download URL.

## 13. Remaining limitations

- Text positions are fixed and may need visual adjustment after stakeholder review of the generated PDF.
- Standard PDF fonts are used; names with unsupported characters are normalized to avoid generation errors.
- No QR code was added because no QR dependency existed and the slice only required the verification URL.
- Public verification does not download PDFs, by design.

## 14. Recommended next slice

Perform visual QA on the generated HRBA certificate PDF and adjust `src/lib/certificate-template-config.ts` coordinates if needed.
