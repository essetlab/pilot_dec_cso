# HRBA Certificate Visual QA V2 Report

## 1. Summary of refinements

This pass refined only the certificate PDF overlay layout. No certificate workflow logic, external-course callback logic, registration/auth logic, approved template PDF, or platform feature behavior was changed.

The v2 output moves dynamic text away from the recognition paragraph, signatures, static labels, and partner logo area.

## 2. Files changed

- `src/lib/certificate-template-config.ts`
- `docs/evidence/certificates/hrba-certificate-visual-qa-sample-v2.pdf`
- `docs/evidence/certificates/hrba-certificate-visual-qa-sample-v2-preview.png`
- `docs/evidence/certificates/hrba-certificate-visual-qa-v2-report.md`

`src/lib/certificate-pdf.ts` was inspected but not changed; existing wrapping and shrink-to-fit behavior was sufficient.

## 3. Coordinate changes made

Template coordinate changes:

- Participant name:
  - font size `44 -> 42`
  - line height `50 -> 48`
  - y `593 -> 586`
- Course title:
  - font size `28 -> 20`
  - line height `34 -> 25`
  - max width `900 -> 760`
  - y `438 -> 501`
- Date awarded:
  - font size `21 -> 15`
  - line height `24 -> 18`
  - y `202 -> 349`
- Certificate ID:
  - font size `17 -> 13`
  - line height `20 -> 16`
  - y `202 -> 349`
- Verification URL:
  - font size `11 -> 8`
  - line height `13 -> 10`
  - max width `360 -> 300`
  - y `161 -> 314`

The x coordinates remained unchanged because the fields were horizontally aligned with the intended template columns.

## 4. Wrapping/shrink-to-fit changes

No code changes were needed in `src/lib/certificate-pdf.ts`.

The existing behavior still applies:

- single-line fields shrink to fit within their configured width;
- course title can wrap to two lines;
- overlong text is truncated only when it cannot fit in the configured line count.

The course title config was tightened to reduce font size and max width, which keeps the HRBA course title in the blank course-title area above the recognition paragraph.

## 5. Verification URL/QR handling

No QR code was added.

No existing QR package was available, and adding a new dependency only for QR generation was avoided. The verification URL is rendered as small text near the certificate ID area, below the certificate code and away from the bottom partner logos.

## 6. Output PDF path

```text
docs/evidence/certificates/hrba-certificate-visual-qa-sample-v2.pdf
```

Validation:

- file begins with `%PDF`;
- PDF loads successfully with `pdf-lib`;
- PDF has one page;
- PDF page size is `1448 x 1086`;
- PDF text extraction includes learner name, course title, certificate code, and verification URL.

## 7. Preview path if created

```text
docs/evidence/certificates/hrba-certificate-visual-qa-sample-v2-preview.png
```

Preview rendering used bundled Poppler directly. Poppler still reported missing local display fonts for several template fonts, but the preview rendered and was visually usable.

## 8. Visual QA notes

V2 visual inspection shows:

- participant name is centered and no longer crowding the surrounding line;
- course title is centered in the intended blank course-title area and no longer overlaps the recognition paragraph;
- date awarded is above the `DATE AWARDED` label and no longer overlaps the signature area;
- certificate ID is above the `CERTIFICATE ID` label and no longer overlaps the signature area;
- verification URL is away from the bottom logos and appears near the certificate ID area;
- no dynamic text appears over partner logos, signatures, static labels, or the recognition paragraph.

Remaining visual note: the verification URL is intentionally very small. It is present for verification traceability, but a future QR code pass could improve scan/read ergonomics if a lightweight QR dependency is approved.

## 9. Commands run and results

```powershell
docker start cso-learning-hub-postgres
npm run prisma:validate
npm run lint
npm run build
npm run verify:hrba-external-course
```

Results:

- `docker start cso-learning-hub-postgres`: succeeded.
- `npm run prisma:validate`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run verify:hrba-external-course`: passed and generated an additional valid verifier certificate record, `CERT-E-V1-DEMO-WY0C`, after the v2 evidence PDF had already been generated from `CERT-E-V1-DEMO-JOYL`.

Additional validation:

- generated v2 PDF through the existing protected learner certificate download route;
- rendered v2 PNG preview;
- loaded v2 PDF with `pdf-lib`;
- extracted text with `pypdf` to confirm expected dynamic fields.

## 10. Remaining issues

- Verification URL is readable only as very small text in the certificate ID area.
- Poppler preview rendering reports missing local display fonts for some template fonts, though the preview still renders.
- Further micro-adjustment may be useful after stakeholder review, but the major overlap issues from v1 are resolved.
