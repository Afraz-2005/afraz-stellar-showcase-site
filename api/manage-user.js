// Vercel serverless function for managing user relationships and preferences
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://jhhxjxgkhtfnizebdnmr.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (req.method === 'GET') {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Get user context
      const { data: userContext, error } = await supabase
        .rpc('get_user_context', {
          p_user_id: userId
        });

      if (error) {
        console.error('❌ Error getting user context:', error);
        return res.status(500).json({ error: 'Failed to get user context' });
      }

      return res.json({ data: userContext });
    }

    if (req.method === 'POST') {
      const { 
        userId, 
        relationshipType, 
        familiarityLevel, 
        interactionStyle, 
        topicsOfInterest, 
        topicsToAvoid, 
        personalDetails,
        name,
        email 
      } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      console.log('👤 Updating user relationship:', { userId, relationshipType, familiarityLevel });

      // Update user relationship
      const { error: relationshipError } = await supabase
        .rpc('update_user_relationship', {
          p_user_id: userId,
          p_relationship_type: relationshipType,
          p_familiarity_level: familiarityLevel,
          p_interaction_style: interactionStyle,
          p_topics_of_interest: topicsOfInterest,
          p_topics_to_avoid: topicsToAvoid,
          p_personal_details: personalDetails
        });

      if (relationshipError) {
        console.error('❌ Error updating user relationship:', relationshipError);
        return res.status(500).json({ error: 'Failed to update user relationship' });
      }

      // Update user info if provided
      if (name || email) {
        const { error: userError } = await supabase
          .from('users')
          .update({
            name: name || undefined,
            email: email || undefined,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (userError) {
          console.error('❌ Error updating user info:', userError);
        }
      }

      console.log('✅ User relationship updated successfully');
      return res.json({ 
        success: true, 
        message: 'User relationship updated successfully'
      });
    }

  } catch (error) {
    console.error('❌ Error in manage user endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Sorry, I\'m having trouble processing your request right now.'
    });
  }
} 