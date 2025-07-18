import { createClient } from '@supabase/supabase-js';

// Correct Supabase project URL and anon/public key
const supabaseUrl = 'https://brxkiocdifhmyyihzsea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeGtpb2NkaWZobXl5aWh6c2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NjY2OTksImV4cCI6MjA2ODQ0MjY5OX0.IvhlaCeWVFjFE8xl6jG_jNYbFbIdBPa5HyKiUE5MlIg';

export const supabase = createClient(supabaseUrl, supabaseKey); 