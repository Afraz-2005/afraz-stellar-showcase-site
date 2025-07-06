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
    console.log('🔍 Simple admin test - checking environment...');
    
    // Check if environment variables are set
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const serviceKeyLength = process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0;
    
    console.log('Environment check:', { hasServiceKey, serviceKeyLength });

    // Try to import Supabase
    let supabase;
    try {
      const { createClient } = await import('@supabase/supabase-js');
      supabase = createClient(
        'https://jhhxjxgkhtfnizebdnmr.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      console.log('✅ Supabase client created successfully');
    } catch (importError) {
      console.error('❌ Supabase import error:', importError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to import Supabase',
        details: importError.message 
      });
    }

    // Try a simple database query
    let dbTest;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .limit(1);
      
      dbTest = { success: !error, data, error: error?.message };
      console.log('Database test result:', dbTest);
    } catch (dbError) {
      console.error('❌ Database test error:', dbError);
      dbTest = { success: false, error: dbError.message };
    }

    res.json({
      success: true,
      message: 'Simple admin test completed',
      environment: {
        hasServiceKey,
        serviceKeyLength,
        nodeEnv: process.env.NODE_ENV
      },
      database: dbTest,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Simple admin test error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
} 