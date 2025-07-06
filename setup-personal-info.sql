-- Supabase SQL script to set up personal information storage
-- Run this in your Supabase SQL Editor

-- Create the personal_info table
CREATE TABLE IF NOT EXISTS personal_info (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  key_name TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, key_name)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_personal_info_category ON personal_info(category);
CREATE INDEX IF NOT EXISTS idx_personal_info_key ON personal_info(key_name);

-- Enable Row Level Security (RLS)
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for serverless function)
CREATE POLICY "Allow all operations for personal info" ON personal_info
  FOR ALL USING (true);

-- Insert initial personal information about Afraz
INSERT INTO personal_info (category, key_name, value, description) VALUES
-- Basic Info
('basic', 'name', 'Imam Mahbir Afraz', 'Full name'),
('basic', 'age', '20', 'Current age'),
('basic', 'location', 'Dhaka, Bangladesh', 'Current location'),
('basic', 'title', 'Software Engineer', 'Professional title'),

-- Food Preferences
('food', 'favorite_food', 'KFC chicken fries, wings, and burgers', 'Favorite fast food'),
('food', 'favorite_dish', 'Kacchi biriyani and chicken polao', 'Favorite traditional dishes'),
('food', 'favorite_snack', 'Fruit salad', 'All-time favorite snack'),
('food', 'cuisine_preference', 'Bengali and subcontinental food', 'Preferred cuisine types'),
('food', 'restaurants', 'KFC and BFC', 'Favorite restaurant chains'),

-- Music Preferences
('music', 'favorite_artists', 'The Weeknd, Atif Aslam, Arijit Singh, Ed Sheeran, Charlie Puth, Mohit Chauhan, AR Rahman, KK, Hridoy Khan, Afrin Rumey', 'Favorite music artists'),
('music', 'favorite_bands', 'Level 5, Warfaze, Shunno', 'Favorite bands'),
('music', 'genres', 'Lofi, Hindi Classics, Hollywood Pop, Bangladeshi Band Songs', 'Favorite music genres'),
('music', 'spotify_username', 'Afraxie', 'Spotify username'),
('music', 'spotify_playlists', 'Pakistani songs hit different, Bangla ❤️❤️❤️, 11/10, All time classics^_^, Retro👌🔥🎵😇, lofi', 'Spotify playlists'),
('music', 'favorite_songs', 'Paaro by Aditiya Rikhari, Baat by Asim Azhar, Azizam by Ed Sheeran, Maand and Tere Naal by Bayaan', 'Specific favorite songs'),

-- Gaming
('gaming', 'main_game', 'Valorant', 'Primary game'),
('gaming', 'main_agent', 'Reyna', 'Main Valorant agent'),
('gaming', 'secondary_agents', 'Phoenix, Iso, Kayo', 'Secondary Valorant agents'),
('gaming', 'favorite_map', 'Abyss', 'Favorite Valorant map'),
('gaming', 'other_games', 'CS2, Overwatch, Fragpunk, Marvel Rivals', 'Other games played'),
('gaming', 'esports_follows', 'VCT (Valorant Champions Tour)', 'Esports tournaments followed'),
('gaming', 'favorite_players', 'TenZ, Boaster, Leo, Tarik, Zekken, Sinatraa, Aspas, PRX Something', 'Favorite esports players'),

-- Skills & Interests
('skills', 'programming', 'React, TypeScript, Node.js, Express, MongoDB, PostgreSQL, HTML, CSS, JavaScript, Next.js, Tailwind CSS', 'Programming skills'),
('skills', 'tools', 'Git, Docker, VS Code, Figma, Photoshop, Canva', 'Development tools'),
('skills', 'creative', 'Guitar playing, singing, painting, sketching', 'Creative skills'),
('skills', 'sports', 'Football, Badminton', 'Sports activities'),
('skills', 'tech_interests', 'Designing, Keyboard Building, PC Components, Tech Gadgets', 'Tech-related interests'),

-- Personal Life
('personal', 'education', 'Studied at Academia Lalmatia from class 1 to 10, then attended SFX Greenherald International School and College', 'Educational background'),
('personal', 'romantic_interest', 'Samantha', 'Romantic interest name'),
('personal', 'relationship_status', 'Friends for 3 years, developed feelings in October 2024', 'Relationship details'),
('personal', 'friends', 'Debashish (best buddy), Alvee (hardworking and supportive), Filhal (chill but childish), Aritra (nice guy), Ariq, Shams (best mental support), Sudipta Rudra Roy (really good friend)', 'Close friends'),

-- Work Experience
('work', 'current_role', 'Software Engineer at a tech company', 'Current job'),
('work', 'internship', 'MaxFoundation - worked on child health dashboard app and UI design', 'Internship experience'),
('work', 'projects', 'Covid Cross (full-stack COVID-19 tracking app), Speechie (translator with voice integration), A Random Game (real-time data visualization dashboard)', 'Notable projects'),

-- Social Media
('social', 'instagram', '@afr.z.x_', 'Instagram handle'),
('social', 'github', 'https://github.com/Afraz-2005', 'GitHub profile'),
('social', 'spotify', 'https://open.spotify.com/user/4q658sqj5vm493wmw8yc2d666?si=2fc3a9b0720f4093', 'Spotify profile'),
('social', 'email', 'your.mahbirafraz2007@gmail.com', 'Email address'),

-- Personality
('personality', 'description', 'Creative, passionate, and dedicated to his craft. Loves combining technology with artistic expression. Enjoys sharing his journey through social media. Has a good sense of humor and likes to keep conversations light and engaging', 'Personality description'),
('personality', 'interests', 'Web development, UI/UX design, problem solving, learning new technologies, gaming, creating digital experiences, music, guitar playing', 'General interests'),
('personality', 'future_goals', 'Wants to become a software engineer in the future', 'Future aspirations')

ON CONFLICT (category, key_name) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create a function to update personal info
CREATE OR REPLACE FUNCTION update_personal_info(
  p_category TEXT,
  p_key_name TEXT,
  p_value TEXT,
  p_description TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO personal_info (category, key_name, value, description)
  VALUES (p_category, p_key_name, p_value, p_description)
  ON CONFLICT (category, key_name) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql; 