# Vercel Deployment Guide for Afraz Stellar Showcase Site

This guide will help you deploy your entire site (frontend + backend) to Vercel using their web interface (no CLI required!).

## 🚀 Complete Deployment (Frontend + Backend)

### Step 1: Sign Up for Vercel
1. Go to [Vercel](https://vercel.com/) and click "Sign Up"
2. Sign up with your GitHub account
3. No credit card required!

### Step 2: Deploy Your Project
1. **Click "New Project"** in your Vercel dashboard
2. **Import your repository:** `afraz-stellar-showcase-site`
3. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave empty)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. **Click "Deploy"**

### Step 3: Set Environment Variables
1. **In your Vercel dashboard, go to your project**
2. **Click "Settings" → "Environment Variables"**
3. **Add environment variable:**
   - **Name:** `DEEPAI_API_KEY`
   - **Value:** Your actual DeepAI API key (get it from [DeepAI](https://deepai.org/))
   - **Environment:** Production, Preview, Development
4. **Click "Save"**
5. **Redeploy your project** (Vercel will do this automatically)

### Step 4: Get Your URL
After deployment, you'll get a URL like: `https://afraz-stellar-showcase.vercel.app`

---

## 🔧 How It Works

### Frontend (React App)
- **Built with Vite** and deployed as static files
- **Served from Vercel's global CDN** for fast loading
- **Automatic HTTPS** and optimization

### Backend (Serverless Functions)
- **API routes** in `/api` folder become serverless functions
- **Automatic scaling** - no cold starts
- **Global edge network** for fast API responses

---

## 🔍 Testing Your Deployment

### Test Frontend:
1. Visit your Vercel URL
2. Check that all pages load correctly
3. Test the navigation and animations

### Test Backend:
1. Visit your Vercel URL + `/api/chat`
2. You should see a response (even if it's an error, it means the server is running)

### Test Chatbot:
1. Open your deployed site
2. Click the chat button
3. Send a message to test the API connection

---

## 🛠️ Troubleshooting

### Common Issues:

**Build fails:**
- Check Vercel build logs
- Verify `package.json` has correct build script
- Make sure all dependencies are in `package.json`

**API not working:**
- Check environment variables are set correctly
- Verify the API route is in `/api` folder
- Check Vercel function logs

**Chatbot not responding:**
- Verify the API URL in `src/config/api.ts`
- Check browser console for CORS errors
- Verify your DeepAI API key is valid

**CORS errors:**
- Vercel handles CORS automatically for same-domain requests
- If you have issues, check the CORS configuration in the API function

### Environment Variables Checklist:
- [ ] `DEEPAI_API_KEY` set in Vercel
- [ ] API URL updated in `src/config/api.ts`
- [ ] Project redeployed after environment variable changes

---

## 💰 Vercel Free Tier Limits

- **100GB bandwidth** per month
- **100GB storage**
- **100GB function execution time**
- **Unlimited serverless function invocations**
- **Automatic HTTPS**
- **Global CDN**

This is more than enough for your portfolio site!

---

## ⚡ Performance Benefits

- **Global edge network** - servers worldwide for fast access
- **No cold starts** - functions stay warm
- **Automatic optimization** - images, CSS, JS optimized
- **CDN included** - fast content delivery
- **Automatic scaling** - handles traffic spikes

---

## 🎉 You're Done!

Your entire site (frontend + backend) is now deployed on Vercel and ready to use. The chatbot will work with your AI backend, and everything should be accessible online.

---

## 📝 Notes

- Vercel automatically handles HTTPS
- Your functions will scale automatically
- No cold starts - functions stay warm
- Automatic deployments when you push to GitHub

---

## 🔄 Updating Your App

To update your app after making changes:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Update site"
   git push
   ```

2. **Vercel will automatically redeploy** when you push to GitHub

That's it! No manual deployment needed.

---

## 🌟 Advantages of Vercel

- **Single platform** for frontend and backend
- **Web-based deployment** - no CLI required
- **Automatic deployments** from GitHub
- **Excellent performance** with global CDN
- **Great developer experience** with detailed logs
- **Free tier** is very generous 