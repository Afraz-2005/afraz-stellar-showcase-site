# Chatbot Setup Guide

## Overview
This chatbot is an AI-powered assistant that can answer questions about Afraz Mahbub. It uses OpenAI's GPT-3.5-turbo model and stores conversation history in a SQLite database.

## Features
- 🤖 AI-powered responses using OpenAI GPT-3.5-turbo
- 💾 Conversation history stored in SQLite database
- 🎨 Modern, responsive UI with animations
- 🔄 Session-based conversations
- 📱 Mobile-friendly design
- ⚡ Real-time responses

## Setup Instructions

### 1. Install Dependencies

First, install the frontend dependencies:
```bash
npm install
```

Then install the backend dependencies:
```bash
cd server
npm install
cd ..
```

### 2. Configure OpenAI API

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env` file in the `server` directory:
```env
OPENAI_API_KEY=your-actual-openai-api-key-here
PORT=3001
NODE_ENV=development
```

### 3. Start the Development Servers

Run both frontend and backend simultaneously:
```bash
npm run dev:full
```

Or run them separately:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health

## How It Works

### Backend (Node.js + Express)
- **API Endpoints:**
  - `POST /api/chat` - Send messages and get AI responses
  - `GET /api/user-info` - Get Afraz's information
  - `GET /api/health` - Health check

- **Database (SQLite):**
  - `conversations` table - Stores chat history
  - `user_info` table - Stores Afraz's information

- **AI Integration:**
  - Uses OpenAI GPT-3.5-turbo
  - Context-aware responses based on Afraz's information
  - Conversation history for better context

### Frontend (React + TypeScript)
- **Chatbot Component:**
  - Floating chat button
  - Expandable chat window
  - Real-time message updates
  - Smooth animations

- **Features:**
  - Session-based conversations
  - Message timestamps
  - Loading states
  - Error handling
  - Responsive design

## Database Schema

### conversations table
```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### user_info table
```sql
CREATE TABLE user_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Customization

### Adding More Information About Afraz

Edit the `userInfo` array in `server/index.js`:

```javascript
const userInfo = [
  { key: 'name', value: 'Afraz' },
  { key: 'full_name', value: 'Afraz Mahbub' },
  // Add more fields here
  { key: 'new_field', value: 'New information' }
];
```

### Modifying AI Behavior

Edit the context in the `generateResponse` function in `server/index.js`:

```javascript
const context = `
You are a helpful AI assistant that knows everything about Afraz Mahbub.
// Modify the instructions here
`;
```

## Troubleshooting

### Common Issues

1. **"Failed to send message" error:**
   - Check if the backend server is running
   - Verify the OpenAI API key is correct
   - Check the browser console for CORS errors

2. **Database not initializing:**
   - Ensure the `server` directory has write permissions
   - Check if SQLite is properly installed

3. **Chatbot not appearing:**
   - Check if the Chatbot component is imported in Index.tsx
   - Verify there are no console errors

### API Rate Limits

The backend includes rate limiting (100 requests per 15 minutes per IP). Adjust in `server/index.js`:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // requests per windowMs
});
```

## Security Features

- Rate limiting to prevent abuse
- Input validation
- CORS configuration
- Helmet.js for security headers
- Environment variable protection

## Deployment

### Backend Deployment
1. Set up a Node.js server (Heroku, Vercel, Railway, etc.)
2. Add environment variables
3. Deploy the `server` directory

### Frontend Deployment
1. Update the API URL in `Chatbot.tsx` to point to your deployed backend
2. Deploy the frontend (Vercel, Netlify, etc.)

## Example Questions

The chatbot can answer questions like:
- "What are Afraz's skills?"
- "Tell me about his projects"
- "How can I contact him?"
- "What does Afraz do?"
- "Where is Afraz from?"
- "What technologies does Afraz use?"

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify all dependencies are installed
4. Ensure the OpenAI API key is valid and has credits 