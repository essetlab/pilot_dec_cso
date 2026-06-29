# HRBA Certificate Visual QA Report

## 1. Purpose

Generate one local sample certificate PDF for visual QA using the existing Hub Slice 3.0 certificate PDF generation system and the approved HRBA certificate template.

No product features, certificate template files, authentication flows, callback logic, or source code were changed for this evidence pass.

## 2. Certificate record used

The evidence PDF was generated from an existing issued certificate record:

- Certificate code: `CERT-E-V1-DEMO-QGMM`
- Name on certificate: `Participant Completed`
- Course title: `Applying the Human Rights-Based Approach in CSO Practice`
- Certificate status: `ISSUED`

No learner email, assessment answers, raw score, private organization details, portfolio content, secrets, or internal database IDs were included in the evidence output or this report.

## 3. Output PDF path

```text
docs/evidence/certificates/hrba-certificate-visual-qa-sample.pdf
```

Absolute path:

```text
D:\z CDP-Lg-Andy-main-main\docs\evidence\certificates\hrba-certificate-visual-qa-sample.pdf
```

## 4. Template used

Approved template:

```text
public/certificate-templates/hrba-certificate-template.pdf
```

The generated evidence PDF retained the approved template page size:

- pages: `1`
- width: `1448`
- height: `1086`

## 5. Dynamic fields rendered

The generated PDF text layer includes:

- learner certificate name;
- course title;
- certificate code;
- verification URL;
- date awarded / issue date.

The issuing platform text and logo are visible as part of the approved template artwork.

## 6. Privacy checks

Checked that the evidence PDF path was generated from the learner-owned issued certificate record through the existing protected download route.

The evidence PDF does not intentionally include:

- learner email;
- assessment answers;
- raw score;
- private organization profile details;
- internal database IDs;
- portfolio content;
- secrets or database URLs.

## 7. Validation checks

Validated:

- output PDF exists;
- file begins with `%PDF`;
- PDF loads successfully with `pdf-lib`;
- PDF has one page;
- PDF page size is `1448 x 1086`;
- PDF file size is approximately `1.96 MB`;
- text extraction confirms the expected learner name, course title, certificate code, and verification URL.

Preview created:

```text
docs/evidence/certificates/hrba-certificate-visual-qa-sample-preview.png
```

Poppler rendered the preview successfully, but reported missing local display fonts for several template fonts. The preview was still created and is usable for visual QA.

## 8. Commands run and results

```powershell
docker start cso-learning-hub-postgres
npm run prisma:validate
npm run lint
npm run build
npm run verify:hrba-external-course
```

Results:

- `docker start cso-learning-hub-postgres`: container started or was already available.
- `npm run prisma:validate`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run verify:hrba-external-course`: passed and generated an additional valid verifier certificate record, `CERT-E-V1-DEMO-JOYL`, after the evidence PDF had already been generated from `CERT-E-V1-DEMO-QGMM`.

Additional validation:

- Downloaded the evidence PDF through `/learn/certificates/[certificateCode]/download` using a local signed session for the certificate owner.
- Rendered a PNG preview using bundled Poppler.
- Loaded the generated PDF with `pdf-lib`.
- Extracted text with `pypdf` for basic field presence checks.

## 9. Visual QA notes for human reviewer

The PDF uses the approved template and the dynamic fields are present, but the PNG preview shows visible placement issues:

- The course title overlays the template line and nearby body text.
- The date awarded appears too low, near the signature area instead of above `DATE AWARDED`.
- The certificate code appears too low, near the signature/program lead area instead of above `CERTIFICATE ID`.
- The verification URL appears very low and overlaps the lower logo area.

These are coordinate/configuration issues in the existing Slice 3.0 template overlay configuration. Per the request, no source/config changes were made in this evidence pass.

## 10. Any issues found

Issue found: dynamic overlay coordinates need adjustment before the PDF should be considered visually polished for stakeholder/demo use.

Recommended fix: update `src/lib/certificate-template-config.ts` in a follow-up implementation pass, regenerate this evidence PDF, and re-render the preview to confirm alignment.
