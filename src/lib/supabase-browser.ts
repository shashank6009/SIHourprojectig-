import { createClient } from '@supabase/supabase-js';

// TODO: Phase 2 - Add auth state management and error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
