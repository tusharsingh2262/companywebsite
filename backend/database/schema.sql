-- ============================================
-- Company Website Database Schema
-- ============================================
-- This schema matches the backend/server.js code exactly
-- Run this SQL in your PostgreSQL database

-- Drop existing table if it exists (WARNING: This deletes all data!)
DROP TABLE IF EXISTS users;

-- Create users table with all required columns + timestamps
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'intern',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups (already unique, but index helps)
CREATE INDEX idx_users_email ON users(email);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at on row updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verify the table was created correctly
-- ============================================
-- Run this to see the table structure:
-- \d users

-- ============================================
-- INTERNSHIPS TABLE
-- ============================================
DROP TABLE IF EXISTS internships;

CREATE TABLE internships (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  duration TEXT NOT NULL,
  mode TEXT NOT NULL,
  stipend TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Accepting',
  link TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_internships_status ON internships(status);

CREATE TRIGGER update_internships_updated_at
  BEFORE UPDATE ON internships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample data (optional - for testing)
-- ============================================
-- INSERT INTO users (name, email, password, role)
-- VALUES 
--   ('Admin User', 'admin@example.com', '$2b$10$example_hashed_password', 'admin'),
--   ('Test User', 'test@example.com', '$2b$10$example_hashed_password', 'intern');

-- INSERT INTO internships (title, skills, duration, mode, stipend, status, link)
-- VALUES 
--   ('Web Development Intern', ARRAY['React', 'TypeScript', 'Tailwind'], '3 months', 'Remote', 'Performance-based', 'Accepting', 'https://example.com/apply/web'),
--   ('Machine Learning Intern', ARRAY['Python', 'TensorFlow', 'Data Ops'], '4 months', 'Hybrid', 'Yes', 'Accepting', 'https://example.com/apply/ml');

