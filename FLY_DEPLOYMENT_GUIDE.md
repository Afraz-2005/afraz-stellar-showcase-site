# Fly.io Deployment Guide for Afraz Stellar Showcase Site

This guide will help you deploy your backend server to Fly.io (completely free, no credit card required, fast performance).

## 🚀 Backend Deployment (Fly.io)

### Step 1: Sign Up for Fly.io
1. Go to [Fly.io](https://fly.io/) and sign up
2. No credit card required!
3. Verify your email

### Step 2: Restart Your Terminal
After installing Fly CLI, restart your terminal/PowerShell so the `fly` command works.

### Step 3: Login to Fly CLI
```bash
fly auth login
```

### Step 4: Deploy Your Server
1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Launch your app:**
   ```bash
   fly launch
   ```

3. **Follow the prompts:**
   - **App name:** `afraz-chatbot-server` (or whatever you prefer)
   - **Region:** Choose the closest to you (e.g., `iad` for US East)
   - **Would you like to deploy now?** Yes

### Step 5: Set Environment Variables
```bash
fly secrets set DEEPAI_API_KEY="your-actual-deepai-api-key"
```

### Step 6: Deploy
```bash
fly deploy
```

### Step 7: Get Your URL
After deployment, you'll get a URL like: `https://afraz-chatbot-server.fly.dev`

---

## 🔗 Connect Frontend to Backend

### Step 1: Update API Configuration
1. Open `src/config/api.ts`
2. Replace `'https://afraz-chatbot-server.fly.dev'` with your actual Fly.io URL
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

## 🛠️ Fly.io Commands

### Useful Commands:
```bash
# Check app status
fly status

# View logs
fly logs

# Scale your app
fly scale count 1

# Set environment variables
fly secrets set KEY=value

# Open your app
fly open

# SSH into your app (if needed)
fly ssh console
```

---

## 🔍 Testing Your Deployment

### Test Backend:
1. Visit your Fly.io URL + `/api/chat`
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

**"fly command not found":**
- Restart your terminal after installing Fly CLI

**"Not logged in":**
- Run `fly auth login` and follow browser prompts

**App won't start:**
```bash
fly logs
```
Check the logs for errors.

**Environment variables not working:**
```bash
fly secrets list
```
Verify your secrets are set correctly.

**Port issues:**
- Make sure your server listens on `process.env.PORT || 8080`
- Fly.io expects port 8080 by default

**CORS errors:**
- The server is configured to allow all origins
- If you have issues, check the CORS configuration in `server/index.js`

### Environment Variables Checklist:
- [ ] `DEEPAI_API_KEY` set in Fly.io
- [ ] API URL updated in `src/config/api.ts`
- [ ] Frontend rebuilt and redeployed

---

## 💰 Fly.io Free Tier Limits

- **3 shared-cpu VMs** (1GB RAM each)
- **3GB persistent volume storage**
- **160GB outbound data transfer**
- **No inbound data transfer limits**

This is more than enough for your chatbot server!

---

## ⚡ Performance Benefits

- **Global edge network** - servers worldwide for fast access
- **No cold starts** - apps stay running
- **Dedicated resources** - not shared like other free tiers
- **CDN included** - fast content delivery
- **Auto-scaling** - scales to zero when not in use

---

## 🎉 You're Done!

Your server is now deployed on Fly.io and ready to handle requests from your frontend. The deployment is completely free, fast, and will stay running 24/7.

---

## 📝 Notes

- Fly.io automatically handles HTTPS
- Your app will scale to zero when not in use (saves resources)
- Cold starts may take a few seconds for the first request
- All subsequent requests will be fast

---

## 🔄 Updating Your App

To update your app after making changes:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Update server"
   git push
   ```

2. **Deploy to Fly.io:**
   ```bash
   cd server
   fly deploy
   ```

That's it! Your app will be updated automatically. 