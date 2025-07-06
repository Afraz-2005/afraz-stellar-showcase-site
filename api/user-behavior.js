import { createClient } from '@supabase/supabase-js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, userId, behaviorType, customInstructions } = req.body;

    switch (action) {
      case 'set_behavior':
        if (!userId || !behaviorType) {
          return res.status(400).json({ error: 'User ID and behavior type are required' });
        }

        const { data: setData, error: setError } = await supabase
          .rpc('set_user_behavior', {
            p_user_id: userId,
            p_behavior_type: behaviorType,
            p_custom_instructions: customInstructions
          });

        if (setError) {
          console.error('Set behavior error:', setError);
          return res.status(500).json({ error: 'Failed to set user behavior' });
        }

        return res.status(200).json({ 
          success: true, 
          message: 'User behavior set successfully',
          behaviorId: setData
        });

      case 'get_behavior':
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }

        const { data: getData, error: getError } = await supabase
          .rpc('get_user_behavior', {
            p_user_id: userId
          });

        if (getError) {
          console.error('Get behavior error:', getError);
          return res.status(500).json({ error: 'Failed to get user behavior' });
        }

        return res.status(200).json({ 
          success: true, 
          behavior: getData
        });

      case 'list_behaviors':
        const { data: listData, error: listError } = await supabase
          .from('user_behaviors')
          .select('*')
          .order('created_at', { ascending: false });

        if (listError) {
          console.error('List behaviors error:', listError);
          return res.status(500).json({ error: 'Failed to list behaviors' });
        }

        return res.status(200).json({ 
          success: true, 
          behaviors: listData
        });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('User behavior API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 