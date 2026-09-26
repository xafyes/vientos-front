/**
 * Central, typed access to build-time environment variables.
 * Fails fast with a clear message instead of letting `undefined` leak
 * into the Supabase client or the HTTP client at runtime.
 */

interface AppEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseBucketVientos: string;
  supabaseBucketYareta: string;
  apiBaseUrl: string;
  contactEmail: string | null;
  contactPhone: string | null;
}

function readRequired(key: keyof ImportMetaEnv, fallback?: string): string {
  const value = import.meta.env[key] ?? fallback;
  if (!value) {
    throw new Error(
      `[config] Missing required environment variable "${key}". ` +
        'Copy .env.example to .env and fill in the values.',
    );
  }
  return value;
}

export const env: AppEnv = {
  supabaseUrl: readRequired('VITE_SUPABASE_URL'),
  supabaseAnonKey: readRequired('VITE_SUPABASE_ANON_KEY'),
  supabaseBucketVientos: import.meta.env.VITE_SUPABASE_BUCKET_VIENTOS || 'Vientos',
  supabaseBucketYareta: import.meta.env.VITE_SUPABASE_BUCKET_YARETA || 'Yareta',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || null,
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || null,
};
