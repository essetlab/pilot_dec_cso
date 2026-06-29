# HRBA Certificate Visual QA V3 Report

## 1. Summary of final refinements

This final polish pass focused only on participant name and course title visibility in the certificate PDF overlay.

No certificate workflow logic, certificate template PDF, external-course callback logic, registration/auth logic, or platform features were changed.

## 2. Files changed

- `src/lib/certificate-template-config.ts`
- `src/lib/certificate-pdf.ts`
- `docs/evidence/certificates/hrba-certificate-visual-qa-sample-v3.pdf`
- `docs/evidence/certificates/hrba-certificate-visual-qa-sample-v3-preview.png`
- `docs/evidence/certificates/hrba-certificate-visual-qa-v3-report.md`

## 3. Participant name styling

The participant name remains centered on the name line below `THIS IS TO CERTIFY THAT`.

Refinement:

- kept the standard serif italic font selection;
- kept the v2 font size and placement;
- changed the participant-name color to a stronger dark navy for clearer contrast.

The v3 preview shows the name is readable, centered, and not overlapping the label above or blue line below.

## 4. Course title placement and styling

The course title remains centered in the blank course-title area below `HAS SUCCESSFULLY COMPLETED THE COURSE`.

Refinements:

- moved the course title slightly down from the v2 position;
- added a dedicated deep DEC blue color for course-title text;
- kept wrapping/shrink-to-fit behavior unchanged.

The v3 preview shows the course title remains above the green horizontal line and above the recognition paragraph without overlap.

## 5. Output PDF path

```text
docs/evidence/certificates/hrba-certificate-visual-qa-sample-v3.pdf
```

Validation:

- file begins with `%PDF`;
- PDF loads successfully with `pdf-lib`;
- PDF has one page;
- PDF page size is `1448 x 1086`;
- text extraction includes the learner name, course title, certificate code, and verification URL.

## 6. Preview path if created

```text
docs/evidence/certificates/hrba-certificate-visual-qa-sample-v3-preview.png
```

Preview rendering used bundled Poppler directly. Poppler reported missing local display fonts for several template fonts, as in earlier previews, but the output rendered successfully and was usable for visual QA.

## 7. Commands run and results

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
- `npm run verify:hrba-external-course`: passed and generated an additional valid verifier certificate record, `CERT-E-V1-DEMO-K4I6`, after the v3 evidence PDF had already been generated from `CERT-E-V1-DEMO-WY0C`.

Additional validation:

- generated v3 PDF through the existing protected learner certificate download route;
- rendered v3 PNG preview;
- loaded v3 PDF with `pdf-lib`;
- extracted text with `pypdf` to confirm expected dynamic fields.

## 8. Remaining visual notes

- The verification URL remains intentionally small and subtle near the certificate ID area.
- No QR code was added.
- The v3 preview resolves the requested participant-name and course-title polish without moving date, certificate ID, or verification URL into overlap zones.
