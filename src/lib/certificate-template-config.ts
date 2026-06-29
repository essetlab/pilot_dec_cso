import path from "node:path";
import { rgb } from "pdf-lib";

export const certificateTemplateConfig = {
  templatePath: path.join(
    process.cwd(),
    "public",
    "certificate-templates",
    "hrba-certificate-template.pdf",
  ),
  page: {
    // Approved HRBA template measured with pdf-lib on 2026-06-29.
    // Coordinates use PDF points from the bottom-left corner.
    height: 1086,
    width: 1448,
  },
  verificationBaseUrl:
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000",
  colors: {
    body: rgb(0.15, 0.17, 0.2),
    muted: rgb(0.29, 0.33, 0.38),
    name: rgb(0.05, 0.1, 0.18),
  },
  fields: {
    learnerName: {
      align: "center",
      font: "serifItalic",
      fontSize: 42,
      lineHeight: 48,
      maxLines: 1,
      maxWidth: 840,
      x: 724,
      y: 586,
    },
    courseTitle: {
      align: "center",
      font: "sansBold",
      fontSize: 20,
      lineHeight: 25,
      maxLines: 2,
      maxWidth: 760,
      x: 724,
      y: 501,
    },
    dateAwarded: {
      align: "center",
      font: "sansBold",
      fontSize: 15,
      lineHeight: 18,
      maxLines: 1,
      maxWidth: 260,
      x: 488,
      y: 349,
    },
    certificateCode: {
      align: "center",
      font: "sansBold",
      fontSize: 13,
      lineHeight: 16,
      maxLines: 1,
      maxWidth: 320,
      x: 948,
      y: 349,
    },
    verificationUrl: {
      align: "center",
      font: "sans",
      fontSize: 8,
      lineHeight: 10,
      maxLines: 2,
      maxWidth: 300,
      x: 948,
      y: 314,
    },
  },
} as const;
