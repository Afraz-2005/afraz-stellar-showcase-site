# Fly.io Deployment Guide for Afraz Stellar Showcase Site

This guide will help you deploy your backend server to Fly.io (completely free, no credit card required).

## 🚀 Backend Deployment (Fly.io)

### Step 1: Sign Up for Fly.io
1. Go to [Fly.io](https://fly.io/) and sign up
2. No credit card required!
3. Verify your email

### Step 2: Login to Fly CLI
```bash
fly auth login
```

### Step 3: Deploy Your Server
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

### Step 4: Set Environment Variables
```bash
fly secrets set DEEPAI_API_KEY="your-actual-deepai-api-key"
```

### Step 5: Deploy
```bash
fly deploy
```

### Step 6: Get Your URL
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

### Test Chatbot:
1. Open your deployed frontend
2. Click the chat button
3. Send a message to test the API connection

---

## 🛠️ Troubleshooting

### Common Issues:

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

---

## 💰 Fly.io Free Tier Limits

- **3 shared-cpu VMs** (1GB RAM each)
- **3GB persistent volume storage**
- **160GB outbound data transfer**
- **No inbound data transfer limits**

This is more than enough for your chatbot server!

---

## 🎉 You're Done!

Your server is now deployed on Fly.io and ready to handle requests from your frontend. The deployment is completely free and will stay running 24/7.

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