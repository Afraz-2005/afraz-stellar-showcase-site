-- Supabase SQL script to set up admin controls and special user instructions
-- Run this in your Supabase SQL Editor

-- Create the admin_users table to identify you as the admin
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  admin_level TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'super_admin'
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the special_instructions table for admin commands about specific users
CREATE TABLE IF NOT EXISTS special_instructions (
  id BIGSERIAL PRIMARY KEY,
  target_user_id TEXT NOT NULL,
  instruction_type TEXT NOT NULL, -- 'behavior', 'tone', 'topics', 'relationship', 'custom'
  instruction_text TEXT NOT NULL,
  admin_user_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1, -- Higher number = higher priority
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (admin_user_id) REFERENCES admin_users(user_id) ON DELETE CASCADE
);

-- Create the user_behavior_rules table for specific behavior patterns
CREATE TABLE IF NOT EXISTS user_behavior_rules (
  id BIGSERIAL PRIMARY KEY,
  target_user_id TEXT NOT NULL,
  rule_name TEXT NOT NULL,
  rule_description TEXT,
  behavior_pattern JSONB NOT NULL, -- Store specific behavior rules
  admin_user_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (admin_user_id) REFERENCES admin_users(user_id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_special_instructions_target_user ON special_instructions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_special_instructions_admin_user ON special_instructions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_rules_target_user ON user_behavior_rules(target_user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_rules ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (for serverless function)
CREATE POLICY "Allow all operations for admin users" ON admin_users
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for special instructions" ON special_instructions
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for user behavior rules" ON user_behavior_rules
  FOR ALL USING (true);

-- Insert Afraz as the main admin (you can update this with your actual user ID)
INSERT INTO admin_users (user_id, admin_level, permissions) VALUES
('afraz_admin', 'super_admin', '{"manage_users": true, "set_instructions": true, "view_all_conversations": true, "modify_ai_behavior": true}')
ON CONFLICT (user_id) DO UPDATE SET
  admin_level = EXCLUDED.admin_level,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- Create a function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM admin_users 
    WHERE user_id = p_user_id AND admin_level IN ('admin', 'super_admin')
  ) INTO admin_exists;
  
  RETURN admin_exists;
END;
$$ LANGUAGE plpgsql;

-- Create a function to add special instruction
CREATE OR REPLACE FUNCTION add_special_instruction(
  p_admin_user_id TEXT,
  p_target_user_id TEXT,
  p_instruction_type TEXT,
  p_instruction_text TEXT,
  p_priority INTEGER DEFAULT 1
)
RETURNS INTEGER AS $$
DECLARE
  instruction_id INTEGER;
BEGIN
  -- Check if admin user exists
  IF NOT is_admin(p_admin_user_id) THEN
    RAISE EXCEPTION 'User is not authorized as admin';
  END IF;
  
  -- Insert the instruction
  INSERT INTO special_instructions (
    target_user_id,
    instruction_type,
    instruction_text,
    admin_user_id,
    priority
  )
  VALUES (
    p_target_user_id,
    p_instruction_type,
    p_instruction_text,
    p_admin_user_id,
    p_priority
  )
  RETURNING id INTO instruction_id;
  
  RETURN instruction_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get all active instructions for a user
CREATE OR REPLACE FUNCTION get_user_instructions(p_target_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  instructions JSONB;
  behavior_rules JSONB;
BEGIN
  -- Get active special instructions
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', si.id,
      'type', si.instruction_type,
      'text', si.instruction_text,
      'priority', si.priority,
      'created_at', si.created_at
    )
  ) INTO instructions
  FROM special_instructions si
  WHERE si.target_user_id = p_target_user_id 
    AND si.is_active = true
  ORDER BY si.priority DESC, si.created_at DESC;
  
  -- Get active behavior rules
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', ubr.id,
      'name', ubr.rule_name,
      'description', ubr.rule_description,
      'behavior_pattern', ubr.behavior_pattern,
      'created_at', ubr.created_at
    )
  ) INTO behavior_rules
  FROM user_behavior_rules ubr
  WHERE ubr.target_user_id = p_target_user_id 
    AND ubr.is_active = true
  ORDER BY ubr.created_at DESC;
  
  -- Return combined instructions
  RETURN jsonb_build_object(
    'special_instructions', COALESCE(instructions, '[]'::JSONB),
    'behavior_rules', COALESCE(behavior_rules, '[]'::JSONB)
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to add behavior rule
CREATE OR REPLACE FUNCTION add_behavior_rule(
  p_admin_user_id TEXT,
  p_target_user_id TEXT,
  p_rule_name TEXT,
  p_rule_description TEXT,
  p_behavior_pattern JSONB
)
RETURNS INTEGER AS $$
DECLARE
  rule_id INTEGER;
BEGIN
  -- Check if admin user exists
  IF NOT is_admin(p_admin_user_id) THEN
    RAISE EXCEPTION 'User is not authorized as admin';
  END IF;
  
  -- Insert the behavior rule
  INSERT INTO user_behavior_rules (
    target_user_id,
    rule_name,
    rule_description,
    behavior_pattern,
    admin_user_id
  )
  VALUES (
    p_target_user_id,
    p_rule_name,
    p_rule_description,
    p_behavior_pattern,
    p_admin_user_id
  )
  RETURNING id INTO rule_id;
  
  RETURN rule_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to deactivate instruction
CREATE OR REPLACE FUNCTION deactivate_instruction(
  p_admin_user_id TEXT,
  p_instruction_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if admin user exists
  IF NOT is_admin(p_admin_user_id) THEN
    RAISE EXCEPTION 'User is not authorized as admin';
  END IF;
  
  -- Deactivate the instruction
  UPDATE special_instructions 
  SET is_active = false, updated_at = NOW()
  WHERE id = p_instruction_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get admin dashboard data
CREATE OR REPLACE FUNCTION get_admin_dashboard()
RETURNS JSONB AS $$
DECLARE
  total_users INTEGER;
  total_conversations INTEGER;
  recent_instructions JSONB;
  active_rules JSONB;
BEGIN
  -- Get total users
  SELECT COUNT(*) INTO total_users FROM users;
  
  -- Get total conversations
  SELECT COUNT(*) INTO total_conversations FROM user_conversations;
  
  -- Get recent instructions
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', si.id,
      'target_user_id', si.target_user_id,
      'type', si.instruction_type,
      'text', si.instruction_text,
      'created_at', si.created_at,
      'is_active', si.is_active
    )
  ) INTO recent_instructions
  FROM special_instructions si
  ORDER BY si.created_at DESC
  LIMIT 10;
  
  -- Get active behavior rules
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', ubr.id,
      'target_user_id', ubr.target_user_id,
      'name', ubr.rule_name,
      'description', ubr.rule_description,
      'created_at', ubr.created_at
    )
  ) INTO active_rules
  FROM user_behavior_rules ubr
  WHERE ubr.is_active = true
  ORDER BY ubr.created_at DESC;
  
  -- Return dashboard data
  RETURN jsonb_build_object(
    'total_users', total_users,
    'total_conversations', total_conversations,
    'recent_instructions', COALESCE(recent_instructions, '[]'::JSONB),
    'active_rules', COALESCE(active_rules, '[]'::JSONB)
  );
END;
$$ LANGUAGE plpgsql; 