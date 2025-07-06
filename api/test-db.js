// Test endpoint to check Supabase connection
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://jhhxjxgkhtfnizebdnmr.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

  try {
    // Check if service key exists
    if (!supabaseServiceKey) {
      return res.status(500).json({ 
        error: 'SUPABASE_SERVICE_ROLE_KEY not found',
        message: 'Environment variable is not set'
      });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test connection by fetching personal info
    const { data: personalInfo, error: personalError } = await supabase
      .from('personal_info')
      .select('*')
      .limit(1);

    if (personalError) {
      return res.status(500).json({ 
        error: 'Database connection failed',
        message: personalError.message,
        details: personalError
      });
    }

    // Test conversation table
    const { data: conversations, error: convError } = await supabase
      .from('chat_conversations')
      .select('*')
      .limit(1);

    if (convError) {
      return res.status(500).json({ 
        error: 'Conversation table access failed',
        message: convError.message,
        details: convError
      });
    }

    // Success response
    res.json({
      success: true,
      message: 'Database connection successful',
      personalInfoCount: personalInfo ? personalInfo.length : 0,
      conversationsCount: conversations ? conversations.length : 0,
      supabaseUrl: supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    });

  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({ 
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    });
  }
} 