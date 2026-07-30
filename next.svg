import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Server-only client. Uses the service role key, which bypasses Row Level
// Security entirely — that's intentional here: this app is single-tenant
// (just you), nothing calls Supabase directly from the browser, and every
// table has RLS enabled with zero policies, so the public/anon key (even if
// it ever leaked) can't read or write anything on its own.
//
// Never import this file from a Client Component. It should only be used
// inside Route Handlers, Server Components, or Server Actions.

let cached: ReturnType<typeof createClient<Database>> | null = null;

export function supabaseAdmin() {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check your .env.local file."
    );
  }

  cached = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
