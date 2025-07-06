# Supabase Integration Setup

## Quick Setup Guide

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy your **Project URL** and **anon public** key

### 2. Update Configuration

Open `src/lib/supabase.ts` and replace the placeholder values:

```typescript
const supabaseUrl = 'YOUR_ACTUAL_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_ACTUAL_SUPABASE_ANON_KEY'
```

### 3. Database Setup

Make sure your Supabase database has the `videos` table with this structure:

```sql
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  date TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Test the Integration

1. Start your React app: `npm run dev`
2. Navigate to the Blog page
3. Upload a video through your admin website
4. Check if it appears on your portfolio

## Features

- **Real-time updates**: Videos uploaded through admin appear instantly
- **Loading states**: Beautiful loading animations while fetching data
- **Error handling**: Graceful error messages if something goes wrong
- **Empty states**: Helpful messages when no videos are uploaded
- **Click to play**: Videos open in new tab when clicked

## Admin Website

Your admin website at `admin-supabase/` handles:
- Video uploads with progress tracking
- Thumbnail generation
- Recent uploads list
- Delete functionality

## Security Notes

- The anon key is safe to use in frontend code
- Row Level Security (RLS) is recommended for production
- Consider adding authentication for admin access

## Troubleshooting

**Videos not loading?**
- Check browser console for errors
- Verify Supabase credentials are correct
- Ensure database table exists and has data

**Upload issues?**
- Check admin website console
- Verify Supabase storage bucket permissions
- Ensure file size is within limits 