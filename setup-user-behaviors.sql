-- Simple user behavior system for AI chatbot
-- Run this in your Supabase SQL Editor

-- Create the user_behaviors table to store how the AI should behave with specific users
CREATE TABLE IF NOT EXISTS user_behaviors (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  behavior_type TEXT NOT NULL, -- 'romantic', 'friendly', 'professional', 'casual', 'formal'
  custom_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_behaviors_user_id ON user_behaviors(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_behaviors ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (for serverless function)
CREATE POLICY "Allow all operations for user behaviors" ON user_behaviors
  FOR ALL USING (true);

-- Insert some example behaviors
INSERT INTO user_behaviors (user_id, behavior_type, custom_instructions) VALUES
('samantha_user', 'romantic', 'Be romantic and caring with this user. Use heart emojis, be flirty but respectful. Reference your 3-year friendship. Always mention how special your connection is. Be protective of her feelings.'),
('gaming_buddy', 'casual', 'Act like a gaming friend. Talk about Valorant strategies, share gaming memes, be competitive but friendly. Use gaming slang and be casual.'),
('colleague_work', 'professional', 'Be professional and business-focused. Avoid personal topics. Focus on work, technology, and career development. Keep it formal but friendly.')
ON CONFLICT (user_id) DO UPDATE SET
  behavior_type = EXCLUDED.behavior_type,
  custom_instructions = EXCLUDED.custom_instructions,
  updated_at = NOW();

-- Create a function to get user behavior
CREATE OR REPLACE FUNCTION get_user_behavior(p_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  behavior_record JSONB;
BEGIN
  SELECT to_jsonb(ub.*) INTO behavior_record
  FROM user_behaviors ub
  WHERE ub.user_id = p_user_id;
  
  RETURN behavior_record;
END;
$$ LANGUAGE plpgsql;

-- Create a function to set user behavior
CREATE OR REPLACE FUNCTION set_user_behavior(
  p_user_id TEXT,
  p_behavior_type TEXT,
  p_custom_instructions TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  behavior_id INTEGER;
BEGIN
  INSERT INTO user_behaviors (user_id, behavior_type, custom_instructions)
  VALUES (p_user_id, p_behavior_type, p_custom_instructions)
  ON CONFLICT (user_id) DO UPDATE SET
    behavior_type = EXCLUDED.behavior_type,
    custom_instructions = EXCLUDED.custom_instructions,
    updated_at = NOW()
  RETURNING id INTO behavior_id;
  
  RETURN behavior_id;
END;
$$ LANGUAGE plpgsql; 