-- Create ai_conversations table for storing AI chat history
-- Migration: 020_create_ai_conversations_table.sql

-- Drop existing table if it exists
DROP TABLE IF EXISTS ai_conversations CASCADE;

-- Create ai_conversations table
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('student', 'teacher', 'dean')),
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for performance
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at DESC);
CREATE INDEX idx_ai_conversations_user_role ON ai_conversations(user_role);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own conversations
CREATE POLICY "Users can view their own conversations"
  ON ai_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON ai_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Deans and teachers can view all conversations (for monitoring/support)
CREATE POLICY "Deans can view all conversations"
  ON ai_conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE auth_user_id = auth.uid()
      AND role = 'dean'
    )
  );

CREATE POLICY "Teachers can view all conversations"
  ON ai_conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE auth_user_id = auth.uid()
      AND role IN ('teacher', 'dean')
    )
  );

-- Grant permissions
GRANT SELECT, INSERT ON ai_conversations TO authenticated;
GRANT ALL ON ai_conversations TO service_role;

-- Add comment
COMMENT ON TABLE ai_conversations IS 'Stores AI chat conversations for all users with role-based access';
