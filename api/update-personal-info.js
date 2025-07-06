// Vercel serverless function for updating personal information
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

  // Only allow POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (req.method === 'GET') {
      // Get all personal information
      const { data: personalInfo, error } = await supabase
        .from('personal_info')
        .select('*')
        .order('category', { ascending: true })
        .order('key_name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching personal info:', error);
        return res.status(500).json({ error: 'Failed to fetch personal information' });
      }

      return res.json({ data: personalInfo });
    }

    if (req.method === 'POST') {
      const { category, key_name, value, description } = req.body;
      
      if (!category || !key_name || !value) {
        return res.status(400).json({ error: 'Category, key_name, and value are required' });
      }

      console.log('📝 Updating personal info:', { category, key_name, value });

      // Update or insert personal information
      const { data, error } = await supabase
        .from('personal_info')
        .upsert([
          {
            category,
            key_name,
            value,
            description: description || null,
            updated_at: new Date().toISOString()
          }
        ], {
          onConflict: 'category,key_name'
        });

      if (error) {
        console.error('❌ Error updating personal info:', error);
        return res.status(500).json({ error: 'Failed to update personal information' });
      }

      console.log('✅ Personal info updated successfully');
      return res.json({ 
        success: true, 
        message: 'Personal information updated successfully',
        data 
      });
    }

  } catch (error) {
    console.error('❌ Error in personal info endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Sorry, I\'m having trouble processing your request right now.'
    });
  }
} 