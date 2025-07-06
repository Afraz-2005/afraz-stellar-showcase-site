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

  try {
    console.log('🔍 Testing admin database connection...');

    // Test 1: Check if admin_users table exists
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    console.log('Admin users check:', { data: adminUsers, error: adminError });

    // Test 2: Check if special_instructions table exists
    const { data: instructions, error: instructionsError } = await supabase
      .from('special_instructions')
      .select('*')
      .limit(1);

    console.log('Special instructions check:', { data: instructions, error: instructionsError });

    // Test 3: Check if user_behavior_rules table exists
    const { data: rules, error: rulesError } = await supabase
      .from('user_behavior_rules')
      .select('*')
      .limit(1);

    console.log('Behavior rules check:', { data: rules, error: rulesError });

    // Test 4: Check if users table exists
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    console.log('Users check:', { data: users, error: usersError });

    // Test 5: Check if user_conversations table exists
    const { data: conversations, error: conversationsError } = await supabase
      .from('user_conversations')
      .select('*')
      .limit(1);

    console.log('User conversations check:', { data: conversations, error: conversationsError });

    // Test 6: Try to call the is_admin function
    const { data: adminCheck, error: adminCheckError } = await supabase
      .rpc('is_admin', { p_user_id: 'afraz_admin' });

    console.log('Admin check function:', { data: adminCheck, error: adminCheckError });

    // Test 7: Try to call the get_admin_dashboard function
    const { data: dashboard, error: dashboardError } = await supabase
      .rpc('get_admin_dashboard');

    console.log('Dashboard function:', { data: dashboard, error: dashboardError });

    // Return comprehensive test results
    res.json({
      success: true,
      tests: {
        admin_users_table: { exists: !adminError, error: adminError?.message },
        special_instructions_table: { exists: !instructionsError, error: instructionsError?.message },
        user_behavior_rules_table: { exists: !rulesError, error: rulesError?.message },
        users_table: { exists: !usersError, error: usersError?.message },
        user_conversations_table: { exists: !conversationsError, error: conversationsError?.message },
        is_admin_function: { works: !adminCheckError, error: adminCheckError?.message },
        get_admin_dashboard_function: { works: !dashboardError, error: dashboardError?.message }
      },
      environment: {
        has_service_key: !!supabaseServiceKey,
        service_key_length: supabaseServiceKey ? supabaseServiceKey.length : 0
      }
    });

  } catch (error) {
    console.error('❌ Test admin error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
} 