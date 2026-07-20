"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();

  // Browser-safe: the SSR browser client stores PKCE verifiers and sessions in
  // cookies shared with the server callback. Never pass the service_role key.
  return createBrowserClient(config.url, config.publishableKey);
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }

  return browserClient;
}
