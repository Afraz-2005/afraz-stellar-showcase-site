# Deployment Guide for Afraz Stellar Showcase Site

This guide will help you deploy your site with separate frontend and backend deployments.

## 🚀 Frontend Deployment (Netlify)

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

## 🔧 Backend Deployment (Render)

### Step 1: Deploy to Render
1. Go to [Render](https://render.com/) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select your repo: `afraz-stellar-showcase-site`
4. Configure the service:
   - **Name:** `afraz-chatbot-server` (or whatever you prefer)
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid if you need more resources)
5. Click "Create Web Service"

### Step 2: Set Environment Variables
1. In your Render dashboard, go to your web service
2. Click "Environment" tab
3. Click "Add Environment Variable"
4. Add this variable:
   - **Key:** `DEEPAI_API_KEY`
   - **Value:** Your actual DeepAI API key (get it from [DeepAI](https://deepai.org/))
5. Click "Save Changes"
6. Your service will automatically redeploy

### Step 3: Get Your Render URL
After deployment, you'll get a URL like: `https://your-render-app-name.onrender.com`

---

## 🔗 Connect Frontend to Backend

### Step 1: Update API Configuration
1. Open `src/config/api.ts`
2. Replace `'https://your-render-app-name.onrender.com'` with your actual Render URL
3. Save the file

### Step 2: Rebuild and Redeploy Frontend
1. Run `npm run build` locally
2. Commit and push your changes
3. Netlify will automatically redeploy

---

## 🌐 Custom Domain (Optional)

### Netlify Custom Domain
1. In your Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow the instructions to configure your domain

### Render Custom Domain
1. In your Render dashboard, go to your web service
2. Click "Settings" → "Custom Domains"
3. Add your custom domain and configure DNS

---

## 🔍 Testing Your Deployment

### Test Frontend
1. Visit your Netlify URL
2. Check that all pages load correctly
3. Test the navigation and animations

### Test Backend
1. Visit your Render URL + `/api/chat`
2. You should see a response (even if it's an error, it means the server is running)

### Test Chatbot
1. Open your deployed site
2. Click the chat button
3. Send a message to test the API connection

---

## 🛠️ Troubleshooting

### Common Issues

**Frontend not loading:**
- Check Netlify build logs
- Verify build command and publish directory
- Check for TypeScript/compilation errors

**Backend not responding:**
- Check Render logs
- Verify environment variables are set
- Check if the server is starting correctly

**Chatbot not working:**
- Verify the API URL in `src/config/api.ts`
- Check browser console for CORS errors
- Verify your DeepAI API key is valid

**CORS Errors:**
- Make sure your Render server has CORS configured
- Check that the frontend URL is allowed in CORS settings

### Environment Variables Checklist
- [ ] `DEEPAI_API_KEY` set in Render
- [ ] API URL updated in `src/config/api.ts`
- [ ] Frontend rebuilt and redeployed

---

## 📝 Notes

- The frontend will automatically use the correct API URL based on the environment
- In development, it uses `localhost:3001`
- In production, it uses your Render URL
- The ChatWindow component uses relative URLs, so it will work with any domain

---

## 🎉 You're Done!

Your site should now be fully deployed and functional. The chatbot will work with your AI backend, and everything should be accessible online. 