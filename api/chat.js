// Vercel serverless function for chat API with Supabase memory persistence
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://jhhxjxgkhtfnizebdnmr.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const { message, sessionId, userId, userName } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('📨 Received message:', message);
    console.log('🆔 Session ID:', sessionId);
    console.log('👤 User ID:', userId);

    // Generate or get user ID if not provided
    let finalUserId = userId;
    if (!finalUserId) {
      // Create a user ID based on session ID for anonymous users
      finalUserId = `anon_${sessionId.split('_')[1]}`;
    }

    console.log('🔧 Final User ID:', finalUserId);

    // Get or create user in database
    const { data: userData, error: userError } = await supabase
      .rpc('get_or_create_user', {
        p_user_id: finalUserId,
        p_name: userName || null,
        p_email: null
      });

    if (userError) {
      console.error('❌ Error getting/creating user:', userError);
    } else {
      console.log('✅ User data retrieved/created successfully');
    }

    // Get user context (relationship, preferences, recent conversations)
    const { data: userContext, error: contextError } = await supabase
      .rpc('get_user_context', {
        p_user_id: finalUserId
      });

    if (contextError) {
      console.error('❌ Error getting user context:', contextError);
    } else {
      console.log('✅ User context retrieved successfully');
    }

    // Get user behavior for this user
    const { data: userBehavior, error: behaviorError } = await supabase
      .rpc('get_user_behavior', {
        p_user_id: finalUserId
      });

    if (behaviorError) {
      console.error('❌ Error getting user behavior:', behaviorError);
    } else {
      console.log('✅ User behavior retrieved successfully');
    }

    // Get conversation history from Supabase (both session-based and user-based)
    const { data: history, error: historyError } = await supabase
      .from('user_conversations')
      .select('*')
      .eq('user_id', finalUserId)
      .order('created_at', { ascending: true })
      .limit(10); // Keep last 10 messages for context

    if (historyError) {
      console.error('❌ Error fetching history:', historyError);
    } else {
      console.log('✅ Conversation history retrieved successfully');
    }

    // Generate AI response with user context, conversation history, and user behavior
    const aiResponse = await generateResponse(message, history || [], userContext || {}, userBehavior);
    
    console.log('🤖 AI Response:', aiResponse);

    // Save the conversation to Supabase (both user-based and session-based)
    const { error: saveError } = await supabase
      .from('user_conversations')
      .insert([
        {
          user_id: finalUserId,
          session_id: sessionId,
          user_message: message,
          bot_response: aiResponse,
          created_at: new Date().toISOString()
        }
      ]);

    // Also save to original chat_conversations table for backward compatibility
    const { error: legacySaveError } = await supabase
      .from('chat_conversations')
      .insert([
        {
          session_id: sessionId,
          user_message: message,
          bot_response: aiResponse,
          created_at: new Date().toISOString()
        }
      ]);

    if (saveError) {
      console.error('❌ Error saving user conversation:', saveError);
    }
    if (legacySaveError) {
      console.error('❌ Error saving legacy conversation:', legacySaveError);
    }

    if (saveError) {
      console.error('❌ Error saving conversation:', saveError);
    }

    // Return response
    res.json({
      id: `bot_${Date.now()}`,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in chat endpoint:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Sorry, I\'m having trouble processing your request right now.'
    });
  }
}

// AI Chat Function using OpenRouter with conversation history, user context, and user behavior
async function generateResponse(userMessage, conversationHistory = [], userContext = {}, userBehavior = null) {
  try {
    // API key from environment variable
    const OPENROUTER_API_KEY = process.env.DEEPAI_API_KEY || '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';
    
    console.log('🔑 Using API key:', OPENROUTER_API_KEY.substring(0, 20) + '...');
    console.log('🔑 Environment variable DEEPAI_API_KEY exists:', !!process.env.DEEPAI_API_KEY);
    console.log('🔑 Using fallback key:', !process.env.DEEPAI_API_KEY);
    
    // Fetch personal information from Supabase
    const { data: personalInfo, error: personalInfoError } = await supabase
      .from('personal_info')
      .select('*')
      .order('category', { ascending: true });

    if (personalInfoError) {
      console.error('❌ Error fetching personal info:', personalInfoError);
    } else {
      console.log('✅ Personal info fetched successfully');
    }

    // Build personal information context
    let personalInfoContext = '';
    if (personalInfo && personalInfo.length > 0) {
      const infoByCategory = {};
      personalInfo.forEach(item => {
        if (!infoByCategory[item.category]) {
          infoByCategory[item.category] = [];
        }
        infoByCategory[item.category].push(`${item.key_name}: ${item.value}`);
      });

      personalInfoContext = Object.entries(infoByCategory)
        .map(([category, items]) => `${category.toUpperCase()}: ${items.join(', ')}`)
        .join('\n');
    }

    // Build user context information
    let userContextInfo = '';
    if (userContext && userContext.user) {
      const user = userContext.user;
      const relationship = userContext.relationship;
      
      userContextInfo = `
USER CONTEXT:
- User ID: ${user.user_id}
- Name: ${user.name || 'Anonymous'}
- Visit Count: ${user.visit_count}
- First Visit: ${user.first_visit}
- Last Visit: ${user.last_visit}
- Relationship Type: ${relationship?.relationship_type || 'stranger'}
- Familiarity Level: ${relationship?.familiarity_level || 1}/5
- Interaction Style: ${relationship?.interaction_style || 'friendly'}
- Topics of Interest: ${relationship?.topics_of_interest?.join(', ') || 'none specified'}
- Topics to Avoid: ${relationship?.topics_to_avoid?.join(', ') || 'none specified'}
- Personal Details: ${JSON.stringify(relationship?.personal_details || {})}
`;
    }

    // Build user behavior context
    let userBehaviorContext = '';
    if (userBehavior) {
      userBehaviorContext = `\nUSER BEHAVIOR INSTRUCTIONS:\n`;
      userBehaviorContext += `Behavior Type: ${userBehavior.behavior_type}\n`;
      if (userBehavior.custom_instructions) {
        userBehaviorContext += `Custom Instructions: ${userBehavior.custom_instructions}\n`;
      }
      userBehaviorContext += `\nIMPORTANT: Follow these behavior instructions for this specific user.\n`;
    }

    // Create context about Afraz with dynamic personal information and user context
    const context = `You are a helpful AI assistant that knows about Imam Mahbir Afraz, a developer. Keep responses SHORT and CONCISE (1-3 sentences maximum). For greetings like "hello", "hi", "hey" - respond with ONLY: "Hey there! 👋 How can I help you learn about Afraz today?" Be protective of his privacy - don't overshare personal details. Use clean formatting without markdown symbols. Add subtle humor but keep it professional.

ABOUT AFRAZ - COMPLETE BIOGRAPHY:
${personalInfoContext || 'Basic information about Afraz is available.'}

${userContextInfo}

${userBehaviorContext}

IMPORTANT RULES:
1. Use the personal information above to answer questions accurately
2. For food questions, mention his specific preferences like KFC chicken fries, kacchi biriyani, fruit salad
3. For music questions, mention his favorite artists like The Weeknd, Atif Aslam, Arijit Singh
4. For gaming questions, mention he's a Valorant Reyna main who loves the Abyss map
5. For romantic questions about "Samantha", respond: "Samantha is Afraz's romantic interest. They were friends for 3 years before his feelings developed. That's about all I should share about his personal life! 💕"
6. For other romantic questions, say: "Afraz is a private person when it comes to romantic matters. I'd rather not share details about his personal life! 😊"
7. PERSONALIZATION: Adapt your tone based on the user's relationship type and familiarity level:
   - For 'friend' with high familiarity: Be casual, use inside jokes, reference past conversations
   - For 'colleague': Be professional but friendly, focus on work-related topics
   - For 'stranger': Be welcoming and helpful, gradually build familiarity
   - For 'regular_visitor': Be warm and familiar, reference their interests
8. Remember the user's topics of interest and avoid topics they want to avoid
9. Use the user's name if provided, and reference their visit count and relationship
10. USER BEHAVIOR: If specific behavior instructions are provided for this user, follow them precisely`;

    // Build conversation history for context
    const messages = [
      { role: 'system', content: context }
    ];

    // Add conversation history (last 5 exchanges for context)
    const recentHistory = conversationHistory.slice(-10);
    for (const exchange of recentHistory) {
      messages.push({ role: 'user', content: exchange.user_message });
      messages.push({ role: 'assistant', content: exchange.bot_response });
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    console.log('🤖 Calling OpenRouter API with conversation history...');
    console.log('📤 Request payload:', JSON.stringify({
      model: 'deepseek/deepseek-r1',
      messages: messages.length,
      max_tokens: 500,
      temperature: 0.7
    }));
    
    // Debug the Authorization header
    const authHeader = `Bearer ${OPENROUTER_API_KEY}`;
    console.log('🔑 Authorization header:', authHeader.substring(0, 30) + '...');
    console.log('🔑 API key length:', OPENROUTER_API_KEY.length);
    console.log('🔑 API key starts with:', OPENROUTER_API_KEY.substring(0, 10));
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://afraz-stellar-showcase.vercel.app',
        'X-Title': 'Imam Mahbir Afraz Portfolio'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter API error details:', errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ OpenRouter response received');
    
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    } else {
      console.error('❌ Empty or invalid response from OpenRouter:', data);
      throw new Error('Empty response from OpenRouter');
    }
  } catch (error) {
    console.error('❌ Error generating AI response:', error);
    console.error('❌ Error stack:', error.stack);
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