import { createClient } from '@supabase/supabase-js';

// Lovable automatically provides these when connected to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: log what we're getting
console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase Key available:', !!supabaseAnonKey);
console.log('All env vars:', import.meta.env);

// Create supabase client
let supabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure you\'re connected to Supabase in Lovable.');
  // Create a mock client to prevent crashes during development
  supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;