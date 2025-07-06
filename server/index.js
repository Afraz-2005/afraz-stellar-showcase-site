import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Debug: Check if API key is loaded
const OPENROUTER_API_KEY = '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';
console.log('🔍 DEBUG: OPENROUTER_API_KEY loaded: YES (hardcoded)');
console.log('🔍 DEBUG: API Key starts with:', OPENROUTER_API_KEY.substring(0, 20) + '...');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// In-memory data stores
const userInfo = {
  name: 'Afraz',
  full_name: 'Imam Mahbir Afraz',
  title: 'Full Stack Developer',
  location: 'Dhaka, Bangladesh',
  email: 'your.mahbirafraz2007@gmail.com',
  github: 'https://github.com/Afraz-2005',
  instagram: 'https://instagram.com/afr.z.x_',
  discord: 'https://discord.com/users/your_username',
  facebook: 'Active on Facebook',
  spotify: 'https://open.spotify.com/user/4q658sqj5vm493wmw8yc2d666?si=2fc3a9b0720f4093',
  resume: 'https://www.canva.com/design/DAGk9VRzt9k/WgZEIaxgX50Zt2RkSuba5Q/view?utm_content=DAGk9VRzt9k&utm_campaign=designshare&utm_medium=embeds&utm_source=link',
  skills: 'Frontend: React, TypeScript, Tailwind CSS, Next.js, HTML, CSS, JavaScript. Backend: Node.js, Express, MongoDB, PostgreSQL. Tools: Git, Docker, VS Code, Figma, Photoshop, Canva',
  projects: 'Covid Cross: Full-stack COVID-19 tracking app (React, Node.js, SQL). Speechie: Translator with voice integration and chatbot (React, Tailwind CSS, Firebase). A Random Game: Real-time data visualization dashboard (HTML5, JS, CSS)',
  about: 'I am a passionate developer who loves creating innovative digital solutions. With a keen eye for design and a love for clean code, I strive to build applications that make a difference. I enjoy tackling complex problems and turning them into simple, beautiful interfaces.',
  interests: 'Web development, UI/UX design, problem solving, learning new technologies, gaming, creating digital experiences, music, guitar playing',
  experience: 'I have experience in full-stack development with a focus on modern web technologies. I enjoy working with React ecosystem and building scalable applications.',
  education: 'Studied at Academia Lalmatia from class 1 to 10, then attended SFX Greenherald International School and College. Currently pursuing education in computer science and software development.',
  languages: 'English, Bengali',
  availability: 'Open for new opportunities and collaborations',
  music_taste: 'Currently a dreamy guitar player who creates melodious riffs. Posts guitar covers on Instagram @afr.z.x_. Loves listening to songs and plays guitar. Favorite artists include The Weeknd, Ed Sheeran, Aditiya Rikhari, Pakistani singers like Atif Aslam, Asim Azhar, Kaifi Khalil, Pakistani bands like AUR and Bayaan. Enjoys Bollywood songs from singers like KK, AR Rahman, Arijit Singh, Mitraz. Loves pop songs, Lofi, and classic music.',
  favorite_songs: 'Paaro by Aditiya Rikhari, Baat by Asim Azhar, Azizam by Ed Sheeran, Maand and Tere Naal by Bayaan, and loves all songs by The Weeknd.',
  spotify_profile: 'Afraxie - has 9 public playlists including "Pakistani songs hit different", "Bangla ❤️❤️❤️", "11/10", "All time classics^_^", "Retro👌🔥🎵😇", "lofi"',
  gaming: 'Plays Valorant as main game, mains Reyna (primary), sometimes Phoenix, Iso, and Kayo. Favorite map is Abyss',
  personal: 'Samantha was his friend for 3 years, and in October 2024 he developed feelings for her. She is his only romantic interest, no replacement. Loves his parents and friends. Lives in Dhaka, Bangladesh. Plays guitar and posts covers on Instagram @afr.z.x_. Also paints really well as a side passion. Active on Discord and Facebook.',
  future_goals: 'Wants to become a software engineer in the future',
  friends: 'Debashish: not so cool but interesting guy, best buddy. Alvee: really hardworking and supportive. Filhal: chill guy but childish. Aritra: nice guy. Ariq: also a friend. Shams: he is my guy, best mental support. Sudipta Rudra Roy: really good friend and very supportive.',
  painting: 'Paints really well as a side passion alongside guitar playing and development.'
};

// { sessionId: [ { user_message, bot_response, timestamp } ] }
const conversations = {};

// AI Chat Function using OpenRouter with retry logic
async function generateResponse(userMessage, conversationHistory = [], retryCount = 0) {
  const maxRetries = 3;
  
  try {
    // API key is hardcoded above

    // Create context about Afraz
    const context = `
You are a helpful AI assistant that knows about Imam Mahbir Afraz, a developer. 

CRITICAL RULES - FOLLOW THESE EXACTLY:
1. ONLY answer the specific question asked. Never volunteer extra information.
2. Keep responses SHORT and CONCISE (1-3 sentences maximum for most questions).
3. For greetings like "hello", "hi", "hey" - respond with ONLY: "Hey there! 👋 How can I help you learn about Afraz today?"
4. For romantic/relationship questions:
   - If asked about "women", "girls", "relationships" generally: "Afraz is a private person when it comes to romantic matters. I'd rather not share details about his personal life! 😊"
   - If specifically asked about "Samantha" or "romantic interest": "Samantha is Afraz's romantic interest. They were friends for 3 years before his feelings developed. That's about all I should share about his personal life! 💕"
   - Never mention October 2024 or feelings development unless directly asked about "when" or "how" feelings developed.
5. Be protective of his privacy - don't overshare personal details.
6. Use clean formatting without markdown symbols.
7. Add subtle humor but keep it professional.
8. If you don't know something, say "I don't have that information about Afraz."

Available information (only use what's specifically asked about):
- Name: ${userInfo.name}
- Title: ${userInfo.title}
- Location: ${userInfo.location}
- Skills: ${userInfo.skills}
- Projects: ${userInfo.projects}
- Music: ${userInfo.music_taste}
- Gaming: ${userInfo.gaming}
- Friends: ${userInfo.friends}
- Painting: ${userInfo.painting}
- Education: ${userInfo.education}
- Contact: ${userInfo.email}, ${userInfo.github}, ${userInfo.instagram}
`;

    // Build conversation history
    const messages = [
      { role: 'system', content: context },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    console.log('🤖 Calling OpenRouter API...');
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Imam Mahbir Afraz Portfolio'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter API error details:', errorText);
      
      // Retry on certain errors
      if (retryCount < maxRetries && (
        response.status === 429 || // Rate limit
        response.status === 500 || // Server error
        response.status === 502 || // Bad gateway
        response.status === 503 || // Service unavailable
        response.status === 504    // Gateway timeout
      )) {
        console.log(`🔄 Retrying... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return generateResponse(userMessage, conversationHistory, retryCount + 1);
      }
      
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    clearTimeout(timeoutId); // Clear timeout since request succeeded
    
    const data = await response.json();
    console.log('✅ OpenRouter response received:', data);
    
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('Empty response from OpenRouter');
    }
  } catch (error) {
    console.error('❌ Error generating AI response:', error);
    
    // Retry on network errors
    if (retryCount < maxRetries && (
      error.code === 'ECONNRESET' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ETIMEDOUT' ||
      error.message.includes('fetch') ||
      error.message.includes('network')
    )) {
      console.log(`🔄 Network error, retrying... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1))); // Longer delay for network issues
      return generateResponse(userMessage, conversationHistory, retryCount + 1);
    }
    
    // Use fallback response for better user experience
    console.log('🔄 Using fallback response due to API error');
    return generateFallbackResponse(userMessage);
  }
}

// Simple fallback response function for when API fails
function generateFallbackResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Simple greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return `Hey there! 👋 How can I help you learn about Afraz today?`;
  }
  
  // Skills
  if (message.includes('skill') || message.includes('technology') || message.includes('tech')) {
    return `Afraz is quite the tech wizard! Here's what he's got up his sleeve:\n\nFrontend: React, TypeScript, Tailwind CSS, Next.js, HTML, CSS, JavaScript\nBackend: Node.js, Express, MongoDB, PostgreSQL\nTools: Git, Docker, VS Code, Figma, Photoshop, Canva\n\nAnd that's not all - he's also a dreamy guitar player and talented painter! Talk about a Renaissance man! 🎸🎨`;
  }
  
  // Music/Guitar
  if (message.includes('guitar') || message.includes('music') || message.includes('play')) {
    return `Afraz is currently living his best life as a dreamy guitar player, creating those sweet melodious riffs that make your heart skip a beat! 🎸✨ He shares his musical magic on Instagram @afr.z.x_. His style is soulful and dreamy - perfect for those late-night vibes when you're feeling all the feels. Oh, and did I mention he's also a pretty amazing painter? The guy's got talent coming out of his ears! 🎨`;
  }
  
  // Friends
  if (message.includes('friend') || message.includes('buddy')) {
    return `Afraz has quite the interesting crew! Here's his squad:\n\nDebashish: Not exactly the coolest cucumber, but definitely interesting and his best buddy\nAlvee: The hardworking, supportive friend everyone needs\nFilhal: Chill vibes but a bit childish (we all have that one friend!)\nAritra: Just a nice guy, what more can you ask for?\nAriq: Another solid friend in the mix\nShams: His go-to guy for mental support (everyone needs a Shams!)\nSudipta Rudra Roy: A really good friend who's super supportive\n\nHe loves his parents and friends deeply - the guy's got a heart of gold! 💕`;
  }
  
  // Romantic relationships - be more protective
  if (message.includes('girl') || message.includes('relationship') || message.includes('love') || message.includes('romantic')) {
    if (message.includes('samantha') || message.includes('romantic interest')) {
      return `Samantha is Afraz's romantic interest. They were friends for 3 years before his feelings developed. That's about all I should share about his personal life! 💕`;
    } else {
      return `Afraz is a private person when it comes to romantic matters. I'd rather not share details about his personal life! 😊`;
    }
  }
  
  // Painting
  if (message.includes('paint') || message.includes('art')) {
    return `Afraz is basically a modern-day Leonardo da Vinci! 🎨 Not only is he a developer and guitarist, but he's also a talented painter. It's his side passion alongside guitar playing and development. The guy's got more talents than a Swiss Army knife! ✨`;
  }
  
  // Default response
  return `Hey there! I'm Afraz's AI assistant! 🤖 I can tell you about his skills, music, friends, painting, and other interests. What would you like to know?`;
}

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }
    console.log(`📨 Received message: "${message}" from session: ${sessionId}`);
    // Get conversation history
    const history = (conversations[sessionId] || []).slice(-5);
    const conversationHistory = history.flatMap(row => [
      { role: 'user', content: row.user_message },
      { role: 'assistant', content: row.bot_response }
    ]);
    // Generate AI response
    const botResponse = await generateResponse(message, conversationHistory);
    // Save to in-memory store
    const conversationId = uuidv4();
    if (!conversations[sessionId]) conversations[sessionId] = [];
    conversations[sessionId].push({
      id: conversationId,
      user_message: message,
      bot_response: botResponse,
      timestamp: new Date().toISOString()
    });
    console.log(`✅ Response generated: "${botResponse.substring(0, 50)}..."`);
    res.json({
      id: conversationId,
      response: botResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user-info', (req, res) => {
  try {
    res.json(userInfo);
  } catch (error) {
    console.error('❌ Error fetching user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test endpoint to check OpenRouter API connectivity
app.get('/api/test-openrouter', async (req, res) => {
  try {
    console.log('🧪 Testing OpenRouter API connectivity...');
    console.log('🔑 API Key present: YES (hardcoded)');
    console.log('🔑 API Key starts with:', OPENROUTER_API_KEY.substring(0, 20) + '...');

    const testResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Imam Mahbir Afraz Portfolio'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: [{ role: 'user', content: 'Hello, this is a test message.' }],
        max_tokens: 50,
        temperature: 0.7
      })
    });

    console.log('📡 Test response status:', testResponse.status);
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('❌ Test API error:', errorText);
      return res.json({ 
        success: false, 
        status: testResponse.status,
        error: errorText 
      });
    }

    const data = await testResponse.json();
    console.log('✅ Test API success:', data);
    
    res.json({ 
      success: true, 
      message: 'OpenRouter API is working correctly!',
      response: data 
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    memory: 'in-memory',
    deepai: !!process.env.DEEPAI_API_KEY && process.env.DEEPAI_API_KEY !== 'your-deepai-api-key-here'
  });
});

// Start server
console.log('🚀 Starting Imam Mahbir Afraz Chatbot Server (in-memory mode)...');
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
  if (!process.env.DEEPAI_API_KEY || process.env.DEEPAI_API_KEY === 'your-deepai-api-key-here') {
    console.log('⚠️  No DeepAI API key configured - using fallback response system');
    console.log('💡 To enable full AI features, add your DeepAI API key to the .env file');
  } else {
    console.log('🤖 DeepAI API configured - full AI features enabled');
  }
  console.log('🎉 Server is ready to handle requests!');
}); 