import "server-only";

import { readFile } from "node:fs/promises";
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
} from "pdf-lib";
import type { LearnerCertificatePdfData } from "./certificate-workflow";
import { certificateTemplateConfig } from "./certificate-template-config";

type TemplateField = (typeof certificateTemplateConfig.fields)[keyof typeof certificateTemplateConfig.fields];
type EmbeddedFonts = {
  sans: PDFFont;
  sansBold: PDFFont;
  serifItalic: PDFFont;
};

function normalizePdfText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
}

function formatAwardDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

export function buildCertificateVerificationUrl(certificateCode: string) {
  const baseUrl = certificateTemplateConfig.verificationBaseUrl.replace(/\/$/, "");

  return `${baseUrl}/verify-certificate?code=${encodeURIComponent(certificateCode)}`;
}

export function buildCertificatePdfFileName(certificateCode: string) {
  const safeCode = certificateCode.replace(/[^A-Za-z0-9_-]/g, "-");

  return `cso-learning-hub-certificate-${safeCode}.pdf`;
}

function fontForField(field: TemplateField, fonts: EmbeddedFonts) {
  return fonts[field.font];
}

function fitTextToWidth({
  font,
  maxWidth,
  minFontSize = 8,
  size,
  text,
}: {
  font: PDFFont;
  maxWidth: number;
  minFontSize?: number;
  size: number;
  text: string;
}) {
  let fittedSize = size;

  while (font.widthOfTextAtSize(text, fittedSize) > maxWidth && fittedSize > minFontSize) {
    fittedSize -= 1;
  }

  return fittedSize;
}

function truncateToWidth({
  font,
  maxWidth,
  size,
  text,
}: {
  font: PDFFont;
  maxWidth: number;
  size: number;
  text: string;
}) {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) {
    return text;
  }

  let truncated = text;
  while (truncated.length > 0 && font.widthOfTextAtSize(`${truncated}...`, size) > maxWidth) {
    truncated = truncated.slice(0, -1).trimEnd();
  }

  return truncated ? `${truncated}...` : text;
}

function wrapText({
  font,
  maxLines,
  maxWidth,
  size,
  text,
}: {
  font: PDFFont;
  maxLines: number;
  maxWidth: number;
  size: number;
  text: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;

    if (lines.length === maxLines) {
      break;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  if (lines.length === maxLines) {
    lines[lines.length - 1] = truncateToWidth({
      font,
      maxWidth,
      size,
      text: lines[lines.length - 1],
    });
  }

  return lines.length > 0 ? lines : [text];
}

function drawConfiguredText({
  field,
  fonts,
  page,
  text,
}: {
  field: TemplateField;
  fonts: EmbeddedFonts;
  page: PDFPage;
  text: string;
}) {
  const font = fontForField(field, fonts);
  const normalizedText = normalizePdfText(text);
  const fontSize =
    field.maxLines === 1
      ? fitTextToWidth({
          font,
          maxWidth: field.maxWidth,
          size: field.fontSize,
          text: normalizedText,
        })
      : field.fontSize;
  const lines =
    field.maxLines === 1
      ? [truncateToWidth({ font, maxWidth: field.maxWidth, size: fontSize, text: normalizedText })]
      : wrapText({
          font,
          maxLines: field.maxLines,
          maxWidth: field.maxWidth,
          size: fontSize,
          text: normalizedText,
        });
  const totalHeight = (lines.length - 1) * field.lineHeight;
  const color =
    field === certificateTemplateConfig.fields.learnerName
      ? certificateTemplateConfig.colors.name
      : field === certificateTemplateConfig.fields.verificationUrl
        ? certificateTemplateConfig.colors.muted
        : certificateTemplateConfig.colors.body;

  lines.forEach((line, index) => {
    const textWidth = font.widthOfTextAtSize(line, fontSize);
    const x =
      field.align === "center"
        ? field.x - textWidth / 2
        : field.align === "right"
          ? field.x - textWidth
          : field.x;
    const y = field.y + totalHeight / 2 - index * field.lineHeight;

    page.drawText(line, {
      color,
      font,
      size: fontSize,
      x,
      y,
    });
  });
}

export async function generateCertificatePdf(data: LearnerCertificatePdfData) {
  const templateBytes = await readFile(certificateTemplateConfig.templatePath);
  const pdfDocument = await PDFDocument.load(templateBytes);
  const page = pdfDocument.getPage(0);
  const fonts: EmbeddedFonts = {
    sans: await pdfDocument.embedFont(StandardFonts.Helvetica),
    sansBold: await pdfDocument.embedFont(StandardFonts.HelveticaBold),
    serifItalic: await pdfDocument.embedFont(StandardFonts.TimesRomanItalic),
  };
  const awardDate = data.completionDate ?? data.issuedAt;
  const verificationUrl = buildCertificateVerificationUrl(data.certificateCode);

  drawConfiguredText({
    field: certificateTemplateConfig.fields.learnerName,
    fonts,
    page,
    text: data.participantName,
  });
  drawConfiguredText({
    field: certificateTemplateConfig.fields.courseTitle,
    fonts,
    page,
    text: data.courseTitle,
  });
  drawConfiguredText({
    field: certificateTemplateConfig.fields.dateAwarded,
    fonts,
    page,
    text: formatAwardDate(awardDate),
  });
  drawConfiguredText({
    field: certificateTemplateConfig.fields.certificateCode,
    fonts,
    page,
    text: data.certificateCode,
  });
  drawConfiguredText({
    field: certificateTemplateConfig.fields.verificationUrl,
    fonts,
    page,
    text: verificationUrl,
  });

  return pdfDocument.save();
}
