# 🧠 Chatbot Memory Setup Guide

Your chatbot currently forgets everything when you deploy to Vercel. This guide will fix that by adding persistent memory using Supabase.

## ✅ What's Been Fixed

1. **Updated API** (`api/chat.js`): Now uses Supabase to store conversation history
2. **Updated Vercel Config** (`vercel.json`): Points to the correct API function
3. **Created SQL Script** (`setup-chatbot-memory.sql`): Database setup script

## 🚀 Setup Steps

### Step 1: Set Up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `jhhxjxgkhtfnizebdnmr`
3. Go to **SQL Editor**
4. Copy and paste the contents of `setup-chatbot-memory.sql`
5. Click **Run** to create the table

### Step 2: Get Your Service Role Key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoaHhqeGdraHRmbml6ZWJkbm1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTc4MTExNywiZXhwIjoyMDY3MzU3MTE3fQ.bPqiYVztgGBUcrrUQkYsxUDVcqMbMIkbrSRoGlRBHgQ

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy the **service_role** key (not the anon key)
3. Keep this key safe - you'll need it for Step 3

### Step 3: Add Environment Variable to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add a new variable:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Paste your service role key from Step 2
5. Click **Save**

### Step 4: Deploy to Vercel

1. Commit and push your changes to GitHub
2. Vercel will automatically deploy
3. The chatbot will now have persistent memory! 🎉

## 🧪 Testing

After deployment, test the chatbot:

1. Ask a question like "What are Afraz's skills?"
2. Ask a follow-up like "Tell me more about his guitar playing"
3. The AI should remember the context and provide better responses

## 🔧 How It Works

- Each chat session gets a unique ID
- Conversations are stored in Supabase database
- AI uses last 10 messages as context
- Memory persists across deployments and server restarts

## 🐛 Troubleshooting

**If the chatbot still doesn't remember:**

1. Check Vercel logs for errors
2. Verify the environment variable is set correctly
3. Ensure the Supabase table was created successfully
4. Check that the service role key has proper permissions

**Common Issues:**
- Wrong API key (using anon key instead of service role key)
- Database table not created
- Environment variable not set in Vercel

## 📊 Database Management

The `chat_conversations` table will store:
- Session ID (unique per chat session)
- User messages
- Bot responses
- Timestamps

Old conversations are automatically cleaned up after 30 days to keep the database lean.

---

That's it! Your chatbot will now remember conversations even after Vercel deployments. 🎯 