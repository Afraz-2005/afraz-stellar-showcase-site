-- Supabase SQL script to set up chatbot memory persistence
-- Run this in your Supabase SQL Editor

-- Create the chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries by session_id
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);

-- Create an index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_chat_conversations_created_at ON chat_conversations(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for serverless function)
CREATE POLICY "Allow all operations for chat conversations" ON chat_conversations
  FOR ALL USING (true);

-- Optional: Create a cleanup function to remove old conversations (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_conversations()
RETURNS void AS $$
BEGIN
  DELETE FROM chat_conversations 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Note: Automatic cleanup requires pg_cron extension which may not be available
-- You can manually run cleanup with: SELECT cleanup_old_conversations(); 