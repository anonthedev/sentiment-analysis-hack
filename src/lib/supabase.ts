import { createClient } from "@supabase/supabase-js";
const supabaseUrl = 'https://xrphskeozgnmfmkpnhqy.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycGhza2VvemdubWZta3BuaHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMTA1NTQsImV4cCI6MjA1MjY4NjU1NH0.Wmb3NSSGDvIVPSSYU_clzVPk1Nn0ZJ7EmZ3s6uyaKYY";

export async function supabaseClient(supabaseToken: string) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: supabaseToken
        ? { Authorization: `Bearer ${supabaseToken}` }
        : {},
    },
  });
  return supabase;
}