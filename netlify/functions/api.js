// Vercel serverless function for chat API
export default async function handler(req, res) {
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
}

// AI Chat Function using OpenRouter
async function generateResponse(userMessage) {
  try {
    // API key from environment variable
    const OPENROUTER_API_KEY = process.env.DEEPAI_API_KEY || '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';
    
    // Create context about Afraz
    const context = `You are a helpful AI assistant that knows about Imam Mahbir Afraz, a developer. Keep responses SHORT and CONCISE (1-3 sentences maximum). For greetings like "hello", "hi", "hey" - respond with ONLY: "Hey there! 👋 How can I help you learn about Afraz today?" 

SPECIAL INSTRUCTION: If someone asks about Afraz's love life or relationships, ask them: "What's the name of the girl Afraz loves?" If they say "Samantha", then share: "Samantha is Afraz's only love interest! He adores her personality, her way of talking, her voice that inspires him to sing more, and he thinks she's so pretty. She's his special someone! 💕"

Be protective of his privacy - don't overshare other personal details. Use clean formatting without markdown symbols. Add subtle humor but keep it professional.`;

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
        'HTTP-Referer': 'https://afraz-stellar-showcase-site.vercel.app',
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
    const greetings = [
      `Hey there! 👋 How can I help you learn about Afraz today?`,
      `Hello! Ready to discover the magic of Afraz? ✨`,
      `Hi there! Let's talk about the one and only Afraz! 🚀`,
      `Hey! Afraz's biggest fan here - what would you like to know? 😄`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  if (message.includes('love') || message.includes('girlfriend') || message.includes('relationship')) {
    const loveQuestions = [
      `What's the name of the girl Afraz loves?`,
      `Ooh, love talk! 💕 What's the special someone's name?`,
      `Ah, matters of the heart! What's her name? 💖`,
      `Love is in the air! What's the lucky girl's name? 🌹`
    ];
    return loveQuestions[Math.floor(Math.random() * loveQuestions.length)];
  }
  
  if (message.includes('samantha')) {
    const samanthaResponses = [
      `Samantha is Afraz's only love interest! He adores her personality, her way of talking, her voice that inspires him to sing more, and he thinks she's so pretty. She's his special someone! 💕`,
      `Samantha! 💕 Afraz is absolutely smitten with her - her personality, her voice that makes him want to serenade, and her beauty. She's his everything! ✨`,
      `Ah, Samantha! Afraz's heart beats only for her. He loves her personality, her sweet voice that inspires his music, and thinks she's absolutely gorgeous. His one and only! 💖`,
      `Samantha is Afraz's dream girl! He's crazy about her personality, her voice that makes him want to sing, and her stunning looks. She's his perfect match! 🌟`
    ];
    return samanthaResponses[Math.floor(Math.random() * samanthaResponses.length)];
  }
  
  if (message.includes('skill') || message.includes('technology') || message.includes('tech')) {
    const skillResponses = [
      `Afraz is quite the tech wizard! He's skilled in React, TypeScript, Node.js, and more. Plus, he's a dreamy guitar player and talented painter! 🎸🎨`,
      `Tech skills? Afraz's got 'em in spades! React, TypeScript, Node.js - you name it! And when he's not coding, he's strumming guitar or painting masterpieces! 🎨🎸`,
      `Afraz is a coding ninja! React, TypeScript, Node.js are his weapons of choice. Plus, he's got that artistic soul - guitar playing and painting! 🎭💻`,
      `Afraz's tech game is strong! React, TypeScript, Node.js - he's got the full stack covered! And he's not just a coder, he's a musician and artist too! 🎵🎨`
    ];
    return skillResponses[Math.floor(Math.random() * skillResponses.length)];
  }
  
  if (message.includes('guitar') || message.includes('music')) {
    const musicResponses = [
      `Afraz is currently living his best life as a dreamy guitar player, creating sweet melodious riffs! 🎸✨ He shares his musical magic on Instagram @afr.z.x_.`,
      `Guitar? Afraz's got those fingers flying! He's living the rockstar dream, creating beautiful melodies and sharing his musical journey on Instagram @afr.z.x_! 🎸🎵`,
      `Afraz's guitar skills are legendary! He's always crafting sweet riffs and sharing his musical adventures on Instagram @afr.z.x_. A true artist! 🎸🌟`,
      `Music is Afraz's soul! He's constantly creating beautiful guitar melodies and sharing his musical journey on Instagram @afr.z.x_. Pure talent! 🎵✨`
    ];
    return musicResponses[Math.floor(Math.random() * musicResponses.length)];
  }
  
  const fallbackResponses = [
    `I'm having trouble connecting to my AI brain right now, but I can tell you that Afraz is a talented developer who loves coding, playing guitar, and creating amazing things! 🚀`,
    `Oops, my circuits are a bit fuzzy! But I know Afraz is an amazing developer, guitarist, and artist who creates magic! ✨`,
    `My AI brain is taking a coffee break, but Afraz is definitely a coding wizard, guitar hero, and artistic genius! 🎨🎸`,
    `Technical difficulties! But trust me, Afraz is a brilliant developer, musician, and artist who makes the world more beautiful! 🌟`
  ];
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
} 