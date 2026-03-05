-- CreatorRank Database Schema
-- Run this in your Supabase SQL Editor to set up the required tables.

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  channel_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Required channels table (admin-managed)
CREATE TABLE IF NOT EXISTS required_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL
);

-- Help requests table
CREATE TABLE IF NOT EXISTS help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  helper_id UUID REFERENCES users(id),
  target_id UUID REFERENCES users(id),
  confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE required_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own record" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policies for required_channels table
CREATE POLICY "Anyone can read required channels" ON required_channels
  FOR SELECT USING (true);

-- Policies for help_requests table
CREATE POLICY "Authenticated users can read help requests" ON help_requests
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert help requests" ON help_requests
  FOR INSERT WITH CHECK (auth.uid() = helper_id);

CREATE POLICY "Target user can update help requests" ON help_requests
  FOR UPDATE USING (auth.uid() = target_id);
