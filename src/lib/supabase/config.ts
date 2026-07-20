export const SUPABASE_PUBLIC_ENV_KEYS = {
  anonKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  publishableKey: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  url: "NEXT_PUBLIC_SUPABASE_URL",
} as const;

export type SupabasePublicConfig = {
  publishableKey: string;
  url: string;
};

function isPlaceholder(value: string) {
  return value.includes("[") || value.includes("]");
}

export function readSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (
    !url ||
    !publishableKey ||
    isPlaceholder(url) ||
    isPlaceholder(publishableKey)
  ) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return null;
    }
  } catch {
    return null;
  }

  return {
    publishableKey,
    url,
  };
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const config = readSupabasePublicConfig();

  if (!config) {
    throw new Error(
      "Supabase public configuration is missing. Set NEXT_PUBLIC_SUPABASE_URL and a Supabase publishable or legacy anon key.",
    );
  }

  return config;
}
