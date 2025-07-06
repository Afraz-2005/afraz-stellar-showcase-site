// Supabase Configuration
// Replace these values with your own Supabase project configuration
const SUPABASE_URL = 'https://jhhxjxgkhtfnizebdnmr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoaHhqeGdraHRmbml6ZWJkbm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODExMTcsImV4cCI6MjA2NzM1NzExN30.-l-8ZVJGa7h4pse1cGeMmcPf3zE5W7pF-3C8I64lUyI';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase; 