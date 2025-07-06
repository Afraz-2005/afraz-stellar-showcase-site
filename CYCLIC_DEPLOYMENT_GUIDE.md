# Cyclic.sh Deployment Guide for Afraz Stellar Showcase Site

This guide will help you deploy your backend server to Cyclic.sh using their web interface (no CLI required!).

## 🚀 Backend Deployment (Cyclic.sh)

### Step 1: Sign Up for Cyclic.sh
1. Go to [Cyclic.sh](https://cyclic.sh/) and click "Get Started"
2. Sign up with your GitHub account
3. No credit card required!

### Step 2: Deploy Your Server
1. **Click "Deploy"** in your Cyclic.sh dashboard
2. **Select your repository:** `afraz-stellar-showcase-site`
3. **Configure deployment:**
   - **Root Directory:** `server`
   - **Branch:** `main`
   - **Framework:** `Node.js`
4. **Click "Deploy"**

### Step 3: Set Environment Variables
1. **In your Cyclic.sh dashboard, go to your app**
2. **Click "Variables" tab**
3. **Add environment variable:**
   - **Key:** `DEEPAI_API_KEY`
   - **Value:** Your actual DeepAI API key (get it from [DeepAI](https://deepai.org/))
4. **Click "Save"**
5. **Your app will automatically redeploy**

### Step 4: Get Your URL
After deployment, you'll get a URL like: `https://your-app-name.cyclic.app`

---

## 🔗 Connect Frontend to Backend

### Step 1: Update API Configuration
1. Open `src/config/api.ts`
2. Replace `'https://your-app-name.cyclic.app'` with your actual Cyclic.sh URL
3. Save the file

### Step 2: Rebuild and Deploy Frontend
1. Run `npm run build` locally
2. Deploy to Netlify (follow the frontend deployment guide)

---

## 🌐 Frontend Deployment (Netlify)

### Step 1: Deploy to Netlify
1. Go to [Netlify](https://netlify.com/) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account and select your repo: `afraz-stellar-showcase-site`
4. Configure the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (leave empty - use root)
5. Click "Deploy site"

### Step 2: Get Your Netlify URL
After deployment, you'll get a URL like: `https://your-site-name.netlify.app`

---

## 🔍 Testing Your Deployment

### Test Backend:
1. Visit your Cyclic.sh URL + `/api/chat`
2. You should see a response (even if it's an error, it means the server is running)

### Test Frontend:
1. Visit your Netlify URL
2. Check that all pages load correctly
3. Test the navigation and animations

### Test Chatbot:
1. Open your deployed site
2. Click the chat button
3. Send a message to test the API connection

---

## 🛠️ Troubleshooting

### Common Issues:

**Backend not responding:**
- Check Cyclic.sh logs in the dashboard
- Verify environment variables are set correctly
- Make sure the root directory is set to `server`

**Frontend not loading:**
- Check Netlify build logs
- Verify build command and publish directory
- Check for TypeScript/compilation errors

**Chatbot not working:**
- Verify the API URL in `src/config/api.ts`
- Check browser console for CORS errors
- Verify your DeepAI API key is valid

**CORS errors:**
- The server is configured to allow all origins
- If you have issues, check the CORS configuration in `server/index.js`

### Environment Variables Checklist:
- [ ] `DEEPAI_API_KEY` set in Cyclic.sh
- [ ] API URL updated in `src/config/api.ts`
- [ ] Frontend rebuilt and redeployed

---

## 💰 Cyclic.sh Free Tier Limits

- **1 app**
- **512MB RAM**
- **Shared CPU**
- **No request limits**
- **Always-on apps**

This is perfect for your chatbot server!

---

## 🎉 You're Done!

Your site should now be fully deployed and functional. The chatbot will work with your AI backend, and everything should be accessible online.

---

## 📝 Notes

- Cyclic.sh automatically handles HTTPS
- Your app will stay running 24/7
- No cold starts - your app is always available
- Automatic deployments when you push to GitHub

---

## 🔄 Updating Your App

To update your app after making changes:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Update server"
   git push
   ```

2. **Cyclic.sh will automatically redeploy** when you push to GitHub

That's it! No manual deployment needed. 