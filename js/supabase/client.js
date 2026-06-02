import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://sjakqhzvqilxkmltmhli.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Nf2rnWpYGW53T2JrRDxZ_w_2cvOCZKL";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

export function getSupabaseClient() {
    return supabase;
}