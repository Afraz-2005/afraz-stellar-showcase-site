import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
const supabaseUrl = 'https://jhhxjxgkhtfnizebdnmr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoaHhqeGdraHRmbml6ZWJkbm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODExMTcsImV4cCI6MjA2NzM1NzExN30.-l-8ZVJGa7h4pse1cGeMmcPf3zE5W7pF-3C8I64lUyI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Video interface for TypeScript
export interface Video {
  id: string
  title: string
  description: string
  genre: string
  date: string
  video_url: string
  thumbnail_url?: string
  upload_date: string
} 