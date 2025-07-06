-- Supabase SQL script to set up user identification and personalized conversations
-- Run this in your Supabase SQL Editor

-- Create the users table to store visitor information
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1,
  preferences JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the user_conversations table for personalized chat history
CREATE TABLE IF NOT EXISTS user_conversations (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  context_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create the user_relationships table to store how the AI should interact with each user
CREATE TABLE IF NOT EXISTS user_relationships (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL, -- 'friend', 'family', 'colleague', 'stranger', 'regular_visitor'
  familiarity_level INTEGER DEFAULT 1, -- 1-5 scale (1=just met, 5=very familiar)
  personal_details JSONB DEFAULT '{}', -- Store personal info shared by user
  interaction_style TEXT DEFAULT 'friendly', -- 'formal', 'casual', 'friendly', 'professional'
  topics_of_interest TEXT[], -- Array of topics they're interested in
  topics_to_avoid TEXT[], -- Array of topics to avoid
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_user_conversations_user_id ON user_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_conversations_session_id ON user_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_user_relationships_user_id ON user_relationships(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (for serverless function)
CREATE POLICY "Allow all operations for users" ON users
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for user conversations" ON user_conversations
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for user relationships" ON user_relationships
  FOR ALL USING (true);

-- Note: Example relationships will be created automatically when users are created
-- No need to insert example data here as it would violate foreign key constraints

-- Create a function to get or create a user
CREATE OR REPLACE FUNCTION get_or_create_user(p_user_id TEXT, p_name TEXT DEFAULT NULL, p_email TEXT DEFAULT NULL)
RETURNS users AS $$
DECLARE
  user_record users;
BEGIN
  -- Try to find existing user
  SELECT * INTO user_record FROM users WHERE user_id = p_user_id;
  
  IF user_record IS NULL THEN
    -- Create new user
    INSERT INTO users (user_id, name, email, first_visit, last_visit, visit_count)
    VALUES (p_user_id, p_name, p_email, NOW(), NOW(), 1)
    RETURNING * INTO user_record;
    
    -- Create default relationship record
    INSERT INTO user_relationships (user_id, relationship_type, familiarity_level, interaction_style)
    VALUES (p_user_id, 'stranger', 1, 'friendly')
    ON CONFLICT (user_id) DO NOTHING;
  ELSE
    -- Update existing user's visit info
    UPDATE users 
    SET last_visit = NOW(), 
        visit_count = visit_count + 1,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Get updated record
    SELECT * INTO user_record FROM users WHERE user_id = p_user_id;
  END IF;
  
  RETURN user_record;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update user relationship
CREATE OR REPLACE FUNCTION update_user_relationship(
  p_user_id TEXT,
  p_relationship_type TEXT DEFAULT NULL,
  p_familiarity_level INTEGER DEFAULT NULL,
  p_interaction_style TEXT DEFAULT NULL,
  p_topics_of_interest TEXT[] DEFAULT NULL,
  p_topics_to_avoid TEXT[] DEFAULT NULL,
  p_personal_details JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_relationships (
    user_id, 
    relationship_type, 
    familiarity_level, 
    interaction_style, 
    topics_of_interest, 
    topics_to_avoid,
    personal_details
  )
  VALUES (
    p_user_id,
    COALESCE(p_relationship_type, 'stranger'),
    COALESCE(p_familiarity_level, 1),
    COALESCE(p_interaction_style, 'friendly'),
    COALESCE(p_topics_of_interest, ARRAY[]::TEXT[]),
    COALESCE(p_topics_to_avoid, ARRAY[]::TEXT[]),
    COALESCE(p_personal_details, '{}'::JSONB)
  )
  ON CONFLICT (user_id) DO UPDATE SET
    relationship_type = COALESCE(p_relationship_type, user_relationships.relationship_type),
    familiarity_level = COALESCE(p_familiarity_level, user_relationships.familiarity_level),
    interaction_style = COALESCE(p_interaction_style, user_relationships.interaction_style),
    topics_of_interest = COALESCE(p_topics_of_interest, user_relationships.topics_of_interest),
    topics_to_avoid = COALESCE(p_topics_to_avoid, user_relationships.topics_to_avoid),
    personal_details = COALESCE(p_personal_details, user_relationships.personal_details),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to get user context for AI
CREATE OR REPLACE FUNCTION get_user_context(p_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  user_info JSONB;
  relationship_info JSONB;
  recent_conversations JSONB;
BEGIN
  -- Get user information
  SELECT to_jsonb(u.*) INTO user_info
  FROM users u
  WHERE u.user_id = p_user_id;
  
  -- Get relationship information
  SELECT to_jsonb(r.*) INTO relationship_info
  FROM user_relationships r
  WHERE r.user_id = p_user_id;
  
  -- Get recent conversations (last 5)
  SELECT jsonb_agg(to_jsonb(c.*)) INTO recent_conversations
  FROM (
    SELECT user_message, bot_response, created_at
    FROM user_conversations
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 5
  ) c;
  
  -- Return combined context
  RETURN jsonb_build_object(
    'user', user_info,
    'relationship', relationship_info,
    'recent_conversations', COALESCE(recent_conversations, '[]'::JSONB)
  );
END;
$$ LANGUAGE plpgsql; 