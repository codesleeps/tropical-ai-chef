import { createClient } from '@supabase/supabase-js';

// For now, create a working client that won't crash the app
// When Supabase is properly connected, these will be automatically populated
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://temp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'temp-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);