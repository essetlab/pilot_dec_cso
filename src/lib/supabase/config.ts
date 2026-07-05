export const SUPABASE_PUBLIC_ENV_KEYS = {
  publishableKey: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  url: "NEXT_PUBLIC_SUPABASE_URL",
} as const;

export type SupabasePublicConfig = {
  publishableKey: string;
  url: string;
};

export function readSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) {
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
      "Supabase public configuration is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return config;
}
