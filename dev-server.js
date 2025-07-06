import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // API routes - handle before Vite middleware
  app.use('/api/chat', express.json(), async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { message, sessionId } = req.body;
      
      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
      }

      console.log('📨 Received message:', message);
      console.log('🆔 Session ID:', sessionId);

      // Generate AI response
      const aiResponse = await generateResponse(message);
      
      console.log('🤖 AI Response:', aiResponse);

      // Return response
      res.json({
        id: `bot_${Date.now()}`,
        response: aiResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error in chat endpoint:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Sorry, I\'m having trouble processing your request right now.'
      });
    }
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // AI Chat Function using OpenRouter
  async function generateResponse(userMessage) {
    try {
      // API key from environment variable
      const OPENROUTER_API_KEY = process.env.DEEPAI_API_KEY || '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';
      
      // Create context about Afraz
      const context = `You are a helpful AI assistant that knows about Imam Mahbir Afraz, a developer. Keep responses SHORT and CONCISE (1-3 sentences maximum). For greetings like "hello", "hi", "hey" - respond with ONLY: "Hey there! 👋 How can I help you learn about Afraz today?" Be protective of his privacy - don't overshare personal details. Use clean formatting without markdown symbols. Add subtle humor but keep it professional.`;

      const messages = [
        { role: 'system', content: context },
        { role: 'user', content: userMessage }
      ];

      console.log('🤖 Calling OpenRouter API...');
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:8080',
          'X-Title': 'Imam Mahbir Afraz Portfolio'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ OpenRouter response received');
      
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error('Empty response from OpenRouter');
      }
    } catch (error) {
      console.error('❌ Error generating AI response:', error);
      return generateFallbackResponse(userMessage);
    }
  }

  // Simple fallback response function
  function generateFallbackResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hey there! 👋 How can I help you learn about Afraz today?`;
    }
    
    if (message.includes('skill') || message.includes('technology') || message.includes('tech')) {
      return `Afraz is quite the tech wizard! He's skilled in React, TypeScript, Node.js, and more. Plus, he's a dreamy guitar player and talented painter! 🎸🎨`;
    }
    
    if (message.includes('guitar') || message.includes('music')) {
      return `Afraz is currently living his best life as a dreamy guitar player, creating sweet melodious riffs! 🎸✨ He shares his musical magic on Instagram @afr.z.x_.`;
    }
    
    return `I'm having trouble connecting to my AI brain right now, but I can tell you that Afraz is a talented developer who loves coding, playing guitar, and creating amazing things! 🚀`;
  }

  app.listen(8080, () => {
    console.log('🚀 Development server running at http://localhost:8080');
    console.log('📡 API available at http://localhost:8080/api/chat');
  });
}

createServer(); 