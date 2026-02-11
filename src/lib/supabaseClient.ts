// Supabase Utility for Server-Side Interactions
import { createClient } from '@supabase/supabase-js';

// Load keys from env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for public access (client-side safe if used carefully, but here used server-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for privileged operations (server-side ONLY)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
