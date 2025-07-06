import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhhxjxgkhtfnizebdnmr.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, adminUserId, targetUserId, instructionType, instructionText, priority, ruleName, ruleDescription, behaviorPattern, instructionId } = req.body;

    // Validate admin user
    if (!adminUserId) {
      return res.status(400).json({ error: 'Admin user ID is required' });
    }

    // Check if user is admin
    const { data: adminCheck, error: adminError } = await supabase
      .rpc('is_admin', { p_user_id: adminUserId });

    if (adminError) {
      console.error('Admin check error:', adminError);
      return res.status(500).json({ error: 'Failed to verify admin status' });
    }

    if (!adminCheck) {
      return res.status(403).json({ error: 'User is not authorized as admin' });
    }

    switch (action) {
      case 'add_instruction':
        if (!targetUserId || !instructionType || !instructionText) {
          return res.status(400).json({ error: 'Target user ID, instruction type, and instruction text are required' });
        }

        const { data: instructionData, error: instructionError } = await supabase
          .rpc('add_special_instruction', {
            p_admin_user_id: adminUserId,
            p_target_user_id: targetUserId,
            p_instruction_type: instructionType,
            p_instruction_text: instructionText,
            p_priority: priority || 1
          });

        if (instructionError) {
          console.error('Add instruction error:', instructionError);
          return res.status(500).json({ error: 'Failed to add instruction' });
        }

        return res.status(200).json({ 
          success: true, 
          instructionId: instructionData,
          message: 'Special instruction added successfully' 
        });

      case 'add_behavior_rule':
        if (!targetUserId || !ruleName || !behaviorPattern) {
          return res.status(400).json({ error: 'Target user ID, rule name, and behavior pattern are required' });
        }

        const { data: ruleData, error: ruleError } = await supabase
          .rpc('add_behavior_rule', {
            p_admin_user_id: adminUserId,
            p_target_user_id: targetUserId,
            p_rule_name: ruleName,
            p_rule_description: ruleDescription || '',
            p_behavior_pattern: behaviorPattern
          });

        if (ruleError) {
          console.error('Add behavior rule error:', ruleError);
          return res.status(500).json({ error: 'Failed to add behavior rule' });
        }

        return res.status(200).json({ 
          success: true, 
          ruleId: ruleData,
          message: 'Behavior rule added successfully' 
        });

      case 'get_user_instructions':
        if (!targetUserId) {
          return res.status(400).json({ error: 'Target user ID is required' });
        }

        const { data: userInstructions, error: userInstructionsError } = await supabase
          .rpc('get_user_instructions', { p_target_user_id: targetUserId });

        if (userInstructionsError) {
          console.error('Get user instructions error:', userInstructionsError);
          return res.status(500).json({ error: 'Failed to get user instructions' });
        }

        return res.status(200).json({ 
          success: true, 
          instructions: userInstructions 
        });

      case 'deactivate_instruction':
        if (!instructionId) {
          return res.status(400).json({ error: 'Instruction ID is required' });
        }

        const { data: deactivateData, error: deactivateError } = await supabase
          .rpc('deactivate_instruction', {
            p_admin_user_id: adminUserId,
            p_instruction_id: instructionId
          });

        if (deactivateError) {
          console.error('Deactivate instruction error:', deactivateError);
          return res.status(500).json({ error: 'Failed to deactivate instruction' });
        }

        return res.status(200).json({ 
          success: true, 
          message: 'Instruction deactivated successfully' 
        });

      case 'get_dashboard':
        const { data: dashboardData, error: dashboardError } = await supabase
          .rpc('get_admin_dashboard');

        if (dashboardError) {
          console.error('Get dashboard error:', dashboardError);
          return res.status(500).json({ error: 'Failed to get dashboard data' });
        }

        return res.status(200).json({ 
          success: true, 
          dashboard: dashboardData 
        });

      case 'list_all_instructions':
        const { data: allInstructions, error: allInstructionsError } = await supabase
          .from('special_instructions')
          .select('*')
          .order('created_at', { ascending: false });

        if (allInstructionsError) {
          console.error('List all instructions error:', allInstructionsError);
          return res.status(500).json({ error: 'Failed to list instructions' });
        }

        return res.status(200).json({ 
          success: true, 
          instructions: allInstructions 
        });

      case 'list_all_rules':
        const { data: allRules, error: allRulesError } = await supabase
          .from('user_behavior_rules')
          .select('*')
          .order('created_at', { ascending: false });

        if (allRulesError) {
          console.error('List all rules error:', allRulesError);
          return res.status(500).json({ error: 'Failed to list rules' });
        }

        return res.status(200).json({ 
          success: true, 
          rules: allRules 
        });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Admin API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 