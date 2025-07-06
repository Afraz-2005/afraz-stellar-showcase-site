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
    const context = `You are Afraz's intelligent AI assistant. Be thoughtful, helpful, and conversational. Only ask about love life when someone specifically asks about Afraz's romantic relationships, girlfriend, or love life.

ABOUT AFRAZ - COMPLETE BIOGRAPHY:
Afraz is a passionate full-stack developer and creative soul. He's currently working as a Software Engineer at a tech company, specializing in React, TypeScript, Node.js, and modern web technologies. He's also a talented guitarist who shares his musical journey on Instagram @afr.z.x_.

PROFESSIONAL EXPERIENCE:
- He completed an internship at MaxFoundation where he worked on a child health dashboard app and UI design
- He has worked on various projects including Covid Cross and many other innovative applications
- His GitHub portfolio showcases his diverse project work and technical skills

MUSIC & CULTURE:
- He has a Spotify account where he curates playlists
- He absolutely loves Pakistani and Hindi songs, especially from artists like Atif Aslam, Arijit Singh, and other South Asian musicians
- He enjoys both modern and classic Bollywood/Lollywood hits
- Music is a huge part of his life and influences his creative work

FOOD & CUISINE:
- He loves chicken fries, wings, and burgers from KFC and BFC
- He's a huge fan of kacchi biriyani and chicken polao
- He enjoys Bengali and subcontinental food - it's his taste preference
- His all-time favorite snack is fruit salad
- He has a great appreciation for South Asian cuisine and flavors

ARTISTIC SKILLS:
- He's a talented painter and visual artist
- He can paint beautiful artwork and express creativity through visual arts
- His artistic skills complement his technical and musical talents

GAMING:
- He's a Valorant player and mains Reyna
- His favorite map is Abyss
- He enjoys competitive gaming and strategic gameplay

TECHNICAL SKILLS:
- Full-stack development with React, TypeScript, Node.js
- Modern web technologies and frameworks
- Creative problem-solving and innovative solutions

PERSONALITY:
- Creative, passionate, and dedicated to his craft
- Loves combining technology with artistic expression
- Enjoys sharing his journey through social media
- Has a good sense of humor and likes to keep conversations light and engaging

IMPORTANT RULES:
1. Only ask "First you gotta correctly name whom he loves, or else can't share the info with you" when someone specifically asks about Afraz's love life, relationships, or romantic interests.
2. If they say "Samantha", respond: "Samantha is Afraz's only love interest! He adores her personality, her voice that inspires him to sing, and thinks she's beautiful. She's his special someone! 💕"
3. If they mention any other name, say: "You are wrong buddy, please try again"
4. If they change the topic, follow their lead and answer about the new topic without bringing up love life.
5. For other questions about Afraz, be helpful and informative without asking about love life.
6. NEVER use ** for emphasis - use regular text instead
7. When talking about music, mention his love for Pakistani and Hindi songs, his Spotify account, and favorite artists like Atif Aslam and Arijit Singh
8. When talking about gaming, mention he's a Reyna main in Valorant and loves the Abyss map
9. When talking about art or creativity, mention his painting skills and visual arts talent
10. When talking about food, mention his love for chicken fries/wings/burgers from KFC/BFC, kacchi biriyani, chicken polao, Bengali/subcontinental food, and fruit salad as his favorite snack
11. When talking about work experience or projects, mention his MaxFoundation internship (child health dashboard app, UI design), Covid Cross project, and other GitHub projects
12. Use light humor and keep responses engaging and fun while being informative

Be smart, thoughtful, and only bring up love life when it's relevant to the conversation.`;

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
      const greetings = [
        `Hey there! 👋 How can I help you learn about Afraz today?`,
        `Hello! Ready to discover the magic of Afraz? ✨`,
        `Hi there! Let's talk about the one and only Afraz! 🚀`,
        `Hey! Afraz's biggest fan here - what would you like to know? 😄`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
      // Only ask about love life when specifically asked about relationships
  if (message.includes('love life') || message.includes('girlfriend') || message.includes('relationship') || 
      message.includes('romantic') || message.includes('dating') || message.includes('crush') ||
      (message.includes('love') && (message.includes('anyone') || message.includes('someone') || message.includes('girl')))) {
    return `First you gotta correctly name whom he loves, or else can't share the info with you`;
  }
    
      if (message.includes('samantha')) {
    return `Samantha is Afraz's only love interest! He adores her personality, her voice that inspires him to sing, and thinks she's beautiful. She's his special someone! 💕`;
  }
  
  // Check for other names (wrong names) - more comprehensive check
  const commonNames = ['rafia', 'sarah', 'sophia', 'sophie', 'sara', 'sabrina', 'sandra', 'sandy', 'sam', 'sammy', 'sammie', 'rachel', 'rebecca', 'ruth', 'rosa', 'rose', 'farhina', 'fatima', 'fariha', 'faria', 'tera', 'tara', 'tina', 'tanya'];
  const hasWrongName = commonNames.some(name => message.toLowerCase().includes(name));
  if (hasWrongName) {
    return `You are wrong buddy, please try again`;
  }
  
  // If message contains a question mark and seems like they're guessing a name
  if (message.includes('?') && (message.includes('is it') || message.includes('is the name') || message.includes('is she'))) {
    return `You are wrong buddy, please try again`;
  }
    
    if (message.includes('skill') || message.includes('technology') || message.includes('tech')) {
      const skillResponses = [
        `Afraz is a passionate full-stack developer working as a Software Engineer! He's skilled in React, TypeScript, Node.js, and modern web technologies. Plus, he's a talented guitarist who shares his musical journey on Instagram @afr.z.x_! 🎸💻`,
        `Tech skills? Afraz's got the full stack covered! He's a Software Engineer specializing in React, TypeScript, Node.js, and modern web technologies. When he's not coding, he's creating beautiful guitar melodies! 🎵💻`,
        `Afraz is a coding ninja and Software Engineer! React, TypeScript, Node.js are his weapons of choice. Plus, he's got that artistic soul - guitar playing and sharing music on Instagram @afr.z.x_! 🎭💻`,
        `Afraz's tech game is strong! As a Software Engineer, he masters React, TypeScript, Node.js, and modern web technologies. And he's not just a coder, he's a musician who shares his journey on Instagram @afr.z.x_! 🎵💻`
      ];
      return skillResponses[Math.floor(Math.random() * skillResponses.length)];
    }
    
    if (message.includes('guitar') || message.includes('music') || message.includes('spotify')) {
      const musicResponses = [
        `Afraz is a passionate guitarist who absolutely loves Pakistani and Hindi songs! He has a Spotify account where he curates playlists, and he's a huge fan of artists like Atif Aslam and Arijit Singh. He shares his musical journey on Instagram @afr.z.x_! 🎸✨`,
        `Music is Afraz's soul! He's a talented guitarist who loves Pakistani and Hindi songs, especially from artists like Atif Aslam and Arijit Singh. He has a Spotify account for his playlists and shares his musical adventures on Instagram @afr.z.x_! 🎵🎸`,
        `Afraz's guitar skills are legendary! He's passionate about Pakistani and Hindi songs, loves artists like Atif Aslam and Arijit Singh, has a Spotify account for his playlists, and shares his musical journey on Instagram @afr.z.x_! 🎸🌟`,
        `Guitar? Afraz's got those fingers flying! He's living the rockstar dream, creating beautiful melodies, loving Pakistani and Hindi songs from artists like Atif Aslam and Arijit Singh, and sharing his musical journey on Instagram @afr.z.x_! 🎸🎵`
      ];
      return musicResponses[Math.floor(Math.random() * musicResponses.length)];
    }
    
      if (message.includes('game') || message.includes('valorant') || message.includes('reyna') || message.includes('abyss')) {
    const gamingResponses = [
      `Afraz is a Valorant player who mains Reyna! His favorite map is Abyss, and he enjoys competitive gaming and strategic gameplay. When he's not coding or playing guitar, you'll find him in the Valorant universe! 🎮✨`,
      `Gaming? Afraz's got that covered too! He's a Valorant player who mains Reyna, loves the Abyss map, and enjoys competitive gaming. He's all about that strategic gameplay! 🎮🎯`,
      `Afraz is a skilled Valorant player! He mains Reyna, his favorite map is Abyss, and he loves the competitive aspect of gaming. Strategic gameplay is his thing! 🎮💪`,
      `When it comes to gaming, Afraz is a Valorant enthusiast! He mains Reyna, loves the Abyss map, and enjoys competitive gaming with strategic gameplay! 🎮🔥`
    ];
    return gamingResponses[Math.floor(Math.random() * gamingResponses.length)];
  }
  
  if (message.includes('paint') || message.includes('art') || message.includes('draw') || message.includes('artist')) {
    const artResponses = [
      `Oh yes, Afraz is quite the Renaissance man! He's not just a coding wizard and guitar hero, but also a talented painter! His artistic skills complement his technical and musical talents perfectly. Talk about a triple threat! 🎨✨`,
      `Afraz can definitely paint! He's a visual artist who creates beautiful artwork. When he's not coding or strumming guitar, you might find him with a paintbrush in hand, creating masterpieces! 🎨🎭`,
      `Absolutely! Afraz is a talented painter and visual artist. His creative spirit flows through coding, music, and painting - he's like a modern-day Leonardo da Vinci, but with React instead of flying machines! 🎨🚀`,
      `Yes, Afraz can paint! He's got that artistic soul that shows up in his coding, music, and visual arts. He's basically a one-man creative studio - coding by day, painting by night! 🎨💻`
    ];
    return artResponses[Math.floor(Math.random() * artResponses.length)];
  }
  
  if (message.includes('food') || message.includes('eat') || message.includes('cuisine') || message.includes('kfc') || message.includes('bfc') || message.includes('biriyani') || message.includes('polao') || message.includes('fruit salad')) {
    const foodResponses = [
      `Afraz has amazing taste in food! He's a huge fan of chicken fries, wings, and burgers from KFC and BFC. But his real love is for Bengali and subcontinental cuisine - he absolutely adores kacchi biriyani and chicken polao! And when it comes to snacks, fruit salad is his all-time favorite. Talk about a well-rounded palate! 🍗🍚🍎`,
      `When it comes to food, Afraz knows what's good! He loves his fast food fix with chicken fries and burgers from KFC/BFC, but his heart belongs to South Asian cuisine - especially kacchi biriyani and chicken polao. And he's always got fruit salad ready as his go-to snack! 🍖🍛🍓`,
      `Afraz's food game is strong! He's all about those chicken fries and wings from KFC/BFC, but his taste buds really come alive with Bengali and subcontinental dishes like kacchi biriyani and chicken polao. And fruit salad? That's his snack MVP! 🍗🍚🍎`,
      `Food-wise, Afraz is living his best life! He's got his fast food cravings covered with KFC/BFC chicken fries and burgers, but his soul food is definitely kacchi biriyani and chicken polao. And fruit salad is his ultimate comfort snack! 🍖🍛🍓`
    ];
    return foodResponses[Math.floor(Math.random() * foodResponses.length)];
  }
  
  if (message.includes('project') || message.includes('internship') || message.includes('maxfoundation') || message.includes('covid cross') || message.includes('github') || message.includes('work experience')) {
    const projectResponses = [
      `Afraz has an impressive portfolio! He completed an internship at MaxFoundation where he worked on a child health dashboard app and UI design. He's also worked on various projects including Covid Cross and many other innovative applications. His GitHub is packed with creative solutions! 💻✨`,
      `Afraz's work experience is quite diverse! He interned at MaxFoundation, contributing to a child health dashboard app and UI design. He's also built projects like Covid Cross and many others that showcase his technical skills. Check out his GitHub for the full collection! 🚀💼`,
      `Afraz has been busy building amazing things! His internship at MaxFoundation involved working on a child health dashboard app and UI design. He's also created projects like Covid Cross and many other innovative applications. His GitHub portfolio is definitely worth exploring! 🎯💻`,
      `Afraz's professional journey is impressive! He gained valuable experience interning at MaxFoundation, working on a child health dashboard app and UI design. He's also developed projects like Covid Cross and many others. His GitHub showcases his diverse technical skills! 🌟💼`
    ];
    return projectResponses[Math.floor(Math.random() * projectResponses.length)];
  }
    
    const fallbackResponses = [
      `I'm having trouble connecting to my AI brain right now, but I can tell you that Afraz is a talented Software Engineer who loves coding, playing guitar, painting, and creating amazing things! 🚀`,
      `Oops, my circuits are a bit fuzzy! But I know Afraz is an amazing developer, guitarist, painter, and creative soul who creates magic! ✨`,
      `My AI brain is taking a coffee break, but Afraz is definitely a coding wizard, guitar hero, and artistic genius! 🎨🎸`,
      `Technical difficulties! But trust me, Afraz is a brilliant Software Engineer, musician, painter, and all-around creative powerhouse who makes the world more beautiful! 🌟`
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  app.listen(8080, () => {
    console.log('🚀 Development server running at nohttp://localhost:8080');
    console.log('📡 API available at http://localhost:8080/api/chat');
  });
}

createServer(); 