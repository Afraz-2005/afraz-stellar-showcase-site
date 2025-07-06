# Afraz Blog Admin - Supabase Version
afraz2005sep
A simple admin panel for uploading guitar cover videos using Supabase. Much easier than Firebase!

## 🚀 Quick Setup (5 minutes)

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for setup to complete

### 2. Get Your API Keys

1. In your project dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key
3. Update `supabase-config.js`:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3. Create Database Table

1. Go to **Table Editor** in your Supabase dashboard
2. Click "New Table"
3. Name it `videos`
4. Add these columns:

```sql
id: uuid (primary key, auto-generate)
title: text (not null)
description: text (not null)
genre: text (not null)
date: text
video_url: text (not null)
thumbnail_url: text
upload_date: timestamp with timezone (default: now())
```

### 4. Create Storage Buckets

1. Go to **Storage** in your dashboard
2. Create bucket named `videos`
3. Create bucket named `thumbnails`
4. Set both to **Public** (for easy access)

### 5. Deploy Admin Website

Upload these files to any static hosting:
- **Netlify**: Drag & drop the folder
- **Vercel**: Use their CLI
- **GitHub Pages**: Push to a repo

## 📁 Files

```
admin-supabase/
├── index.html          # Main admin page
├── styles.css          # Styling (same as Firebase version)
├── app.js             # Supabase integration
├── supabase-config.js # Your Supabase config
└── README.md          # This file
```

## 🎯 Features

- ✅ **Simple Setup**: Just 2 API keys needed
- ✅ **Video Upload**: MP4, MOV, AVI files
- ✅ **Thumbnail Support**: Optional custom images
- ✅ **Rich Metadata**: Title, description, genre, date
- ✅ **Preview Mode**: See how it'll look before uploading
- ✅ **Recent Uploads**: View and manage videos
- ✅ **Delete Videos**: Remove unwanted uploads
- ✅ **Responsive Design**: Works on all devices

## 🔧 Usage

1. Fill in video details (title, description, genre)
2. Select your video file
3. Optionally add a thumbnail
4. Click "Upload Video" or "Preview" first
5. View recent uploads at the bottom

## 🔗 Integration with Main Portfolio

To display uploaded videos on your React portfolio:

1. Install Supabase in your React project:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Use the same config in your React app
3. Fetch videos from the `videos` table
4. Display them in your Blog component

## 💰 Pricing

- **Free Tier**: 500MB database + 1GB file storage
- **Perfect for**: Small to medium video collections
- **Upgrade when**: You need more storage

## 🛡️ Security

The current setup allows public uploads. For production:
1. Add authentication (Supabase Auth)
2. Restrict uploads to your account only
3. Add file size limits

## 🆘 Troubleshooting

**"Supabase not initialized"**
- Check your config in `supabase-config.js`
- Ensure project URL and key are correct

**"Upload failed"**
- Check file size (Supabase has limits)
- Ensure storage buckets are created
- Check browser console for errors

**"Permission denied"**
- Make sure storage buckets are public
- Check database table permissions

## 🎉 That's It!

Your admin website is ready! Upload videos and they'll be stored in Supabase, ready to display on your main portfolio. 