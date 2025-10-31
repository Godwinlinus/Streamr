// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!URL || !KEY) {
  // eslint-disable-next-line no-console
  console.warn("Supabase env vars missing. Auth will not work until you add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(URL || "", KEY || "");
