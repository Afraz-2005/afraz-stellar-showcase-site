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

# Supabase Setup for Chatbot Memory

## Database Table Setup

To enable chatbot memory persistence, you need to create a table in your Supabase database.

### 1. Go to Supabase Dashboard
1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `jhhxjxgkhtfnizebdnmr`

### 2. Create the Chat Conversations Table

In the SQL Editor, run this SQL command:

```sql
-- Create the chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries by session_id
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);

-- Create an index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_chat_conversations_created_at ON chat_conversations(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for serverless function)
CREATE POLICY "Allow all operations for chat conversations" ON chat_conversations
  FOR ALL USING (true);
```

### 3. Environment Variables

Add these environment variables to your Vercel project:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add:
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (found in Settings > API)

### 4. Get Your Service Role Key

1. In Supabase dashboard, go to Settings > API
2. Copy the "service_role" key (not the anon key)
3. Add it to Vercel environment variables

## How It Works

- Each chat session gets a unique `session_id`
- Conversations are stored in the `chat_conversations` table
- The AI uses the last 10 messages as context for responses
- Data persists across Vercel deployments

## Testing

After setup, the chatbot should:
- Remember previous conversations in the same session
- Provide context-aware responses
- Maintain memory even after website updates 