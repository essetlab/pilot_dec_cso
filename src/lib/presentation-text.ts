const replacements: Array<[RegExp, string]> = [
  [/\bCSOLH-DEMO-/gi, "CSOLH-"],
  [/\bdemo-course\b/gi, "proposal-course"],
  [/\bseed-platform-admin-demo\b/gi, "seed-platform-admin"],
  [/@demo\.local\b/gi, "@learninghub.local"],
  [/\bDemo\b/g, ""],
  [/\bdemo\b/g, ""],
];

export function cleanPresentationText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return replacements
    .reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

export function cleanPresentationEmail(value: string | null | undefined) {
  return cleanPresentationText(value).toLowerCase();
}
