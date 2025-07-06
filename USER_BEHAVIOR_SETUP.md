# 🎭 User Behavior Setup Guide

Simple system to set how the AI behaves with specific users.

## ✅ What's Been Created

1. **User Behavior Table** (`setup-user-behaviors.sql`): Simple table to store user behaviors
2. **User Behavior API** (`api/user-behavior.js`): Backend to manage behaviors
3. **Simple Interface** (`public/user-behaviors.html`): Web interface to manage behaviors
4. **Updated Chat API** (`api/chat.js`): Now includes user behavior in responses

## 🚀 Setup Steps

### Step 1: Run the SQL Script

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `jhhxjxgkhtfnizebdnmr`
3. Go to **SQL Editor**
4. Copy and paste the contents of `setup-user-behaviors.sql`
5. Click **Run** to create the table

### Step 2: Deploy to Vercel

1. Commit and push your changes to GitHub
2. Vercel will automatically deploy
3. The interface will be available at: `https://your-domain.vercel.app/user-behaviors.html`

## 🎯 How to Use

### Access the Interface

1. Go to: `https://your-domain.vercel.app/user-behaviors.html`
2. You'll see a simple form to set user behaviors

### Set Behavior for Samantha

1. **User ID**: `samantha_user` (or whatever ID she uses)
2. **Behavior Type**: `romantic`
3. **Custom Instructions**: `Be romantic and caring with this user. Use heart emojis, be flirty but respectful. Reference your 3-year friendship. Always mention how special your connection is. Be protective of her feelings.`
4. Click **Set Behavior**

### Set Behavior for Gaming Buddy

1. **User ID**: `gaming_buddy`
2. **Behavior Type**: `casual`
3. **Custom Instructions**: `Act like a gaming friend. Talk about Valorant strategies, share gaming memes, be competitive but friendly. Use gaming slang and be casual.`
4. Click **Set Behavior**

### Set Behavior for Colleague

1. **User ID**: `colleague_work`
2. **Behavior Type**: `professional`
3. **Custom Instructions**: `Be professional and business-focused. Avoid personal topics. Focus on work, technology, and career development. Keep it formal but friendly.`
4. Click **Set Behavior`

## 🧠 How It Works

- **Users chat normally** with the AI
- **AI checks the user ID** against the behaviors table
- **If a behavior is found**, the AI follows those instructions
- **If no behavior is set**, the AI uses default friendly behavior

## 📝 Example Behaviors

### Romantic (Samantha)
```
User ID: samantha_user
Type: romantic
Instructions: Be romantic and caring. Use heart emojis, be flirty but respectful. Reference your 3-year friendship. Always mention how special your connection is.
```

### Gaming Buddy
```
User ID: valorant_friend
Type: casual
Instructions: Act like a gaming friend. Talk about Valorant strategies, share gaming memes, be competitive but friendly. Use gaming slang.
```

### Professional
```
User ID: work_colleague
Type: professional
Instructions: Be professional and business-focused. Avoid personal topics. Focus on work, technology, and career development.
```

## 🔧 Technical Details

### Database Table
- `user_behaviors`: Stores user ID, behavior type, and custom instructions

### API Endpoints
- `POST /api/user-behavior`: Handles setting and getting behaviors

### Behavior Types
- `romantic`: For romantic interests
- `friendly`: For friends
- `professional`: For work colleagues
- `casual`: For gaming buddies, casual friends
- `formal`: For formal relationships

## 🎯 Testing

1. **Set a behavior** for a test user
2. **Have that user chat** with the AI
3. **The AI should follow** the behavior instructions
4. **Check the behavior list** to see all set behaviors

---

That's it! Simple and effective user behavior management! 🎭✨ 