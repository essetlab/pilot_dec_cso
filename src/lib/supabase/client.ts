"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();

  // Browser-safe: this client uses only public/publishable Supabase values.
  // Never import or pass the service_role key here.
  return createClient(config.url, config.publishableKey);
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }

  return browserClient;
}
