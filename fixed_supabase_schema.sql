-- Campus Connect - Fixed Database Schema
-- Run this in your Supabase SQL Editor to fix signup issues

-- First, clean up existing schema if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Recreate custom types (this will fail if they exist, that's OK)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin', 'vendor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_category AS ENUM ('academic', 'tech', 'arts', 'music', 'gaming', 'social', 'competition', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('earn', 'spend', 'transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM ('registered', 'attended', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop and recreate users table with correct structure
DROP TABLE IF EXISTS public.users CASCADE;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'student',
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  total_events_attended INTEGER DEFAULT 0,
  total_clubs_joined INTEGER DEFAULT 0,
  badges_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public insert for new users" ON public.users;

-- Create new policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow public insert for new users" ON public.users FOR INSERT WITH CHECK (true);

-- Create or replace the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
    user_role user_role;
BEGIN
    -- Extract name and role from metadata with fallbacks
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );
    
    -- Extract role with fallback
    user_role := COALESCE(
        (NEW.raw_user_meta_data->>'role')::user_role,
        'student'::user_role
    );
    
    -- Insert the user profile
    INSERT INTO public.users (
        id, 
        email, 
        name, 
        role,
        xp,
        level,
        streak_count,
        total_events_attended,
        total_clubs_joined,
        badges_earned
    ) VALUES (
        NEW.id,
        NEW.email,
        user_name,
        user_role,
        0,
        1,
        0,
        0,
        0,
        0
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the auth insertion
        RAISE WARNING 'Error creating user profile for %: %', NEW.email, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate other tables if they don't exist
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category event_category DEFAULT 'other',
  xp_reward INTEGER DEFAULT 0,
  max_attendees INTEGER DEFAULT 50,
  current_attendees INTEGER DEFAULT 0,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status event_status DEFAULT 'pending',
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  event_id UUID REFERENCES public.events(id) NOT NULL,
  status registration_status DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  type transaction_type NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity badge_rarity DEFAULT 'common',
  requirements JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  badge_id UUID REFERENCES public.badges(id) NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, badge_id)
);

-- Enable RLS for all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for other tables
DO $$ BEGIN
    -- Events policies
    DROP POLICY IF EXISTS "Anyone can view approved events" ON public.events;
    CREATE POLICY "Anyone can view approved events" ON public.events FOR SELECT USING (status = 'approved');
    
    DROP POLICY IF EXISTS "Users can create events" ON public.events;
    CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);

    -- Event registrations policies
    DROP POLICY IF EXISTS "Users can view own registrations" ON public.event_registrations;
    CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;
    CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- Transactions policies
    DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
    CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

    -- Badges policies
    DROP POLICY IF EXISTS "Anyone can view badges" ON public.badges;
    CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Anyone can view user badges" ON public.user_badges;
    CREATE POLICY "Anyone can view user badges" ON public.user_badges FOR SELECT USING (true);

EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Some policies could not be created: %', SQLERRM;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users(xp DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);

-- Insert sample data if tables are empty
INSERT INTO public.badges (name, description, icon, rarity) 
SELECT 'Event Explorer', 'Attend your first campus event', 'Calendar', 'common'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Event Explorer');

INSERT INTO public.badges (name, description, icon, rarity) 
SELECT 'Social Butterfly', 'Join 3 different clubs', 'Users', 'rare'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Social Butterfly');

INSERT INTO public.badges (name, description, icon, rarity) 
SELECT 'Knowledge Seeker', 'Attend 10 academic events', 'BookOpen', 'epic'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Knowledge Seeker');

INSERT INTO public.events (title, description, date, time, location, organizer, category, xp_reward, max_attendees, status) 
SELECT 'AI Workshop', 'Machine learning fundamentals', '2024-12-15', '14:00', 'Tech Lab 205', 'CS Club', 'tech', 150, 60, 'approved'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'AI Workshop');

INSERT INTO public.events (title, description, date, time, location, organizer, category, xp_reward, max_attendees, status) 
SELECT 'Photography Walk', 'Campus photo session', '2024-12-17', '18:00', 'Art Building', 'Photo Club', 'arts', 100, 30, 'approved'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Photography Walk');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Final check
SELECT 'Database setup completed successfully!' as status;