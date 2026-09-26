import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

/**
 * Single Supabase client for the whole app. Only the storage anon key is
 * used, and only against public, read-only buckets (image galleries) — see
 * SupabaseStorageRepository. No table/auth access is configured, so this
 * client cannot read or write application data even if the key leaked.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false },
});
