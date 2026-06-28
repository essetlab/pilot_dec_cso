export function areDemoFallbacksEnabled() {
  return process.env.NODE_ENV !== "production";
}
