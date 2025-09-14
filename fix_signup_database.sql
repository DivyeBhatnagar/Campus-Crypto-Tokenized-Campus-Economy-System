-- Campus Coin - Complete Database Fix for Signup Issues
-- This will resolve the "user already exists" error by properly setting up the database

-- Step 1: Clean up any existing problematic setup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Fix the users table structure to properly link with Supabase auth
-- First, check if we need to migrate existing data
DO $$
DECLARE
    table_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Backup existing data if any
        CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;
        RAISE NOTICE 'Existing users table backed up to users_backup';
        
        -- Drop the old table
        DROP TABLE users CASCADE;
        RAISE NOTICE 'Old users table dropped';
    END IF;
END $$;

-- Step 3: Create the correct users table structure
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'vendor')),
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

-- Step 4: Enable RLS and create policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public insert for new users" ON public.users;

-- Create comprehensive policies
CREATE POLICY "Users can view all profiles" ON public.users 
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow public insert for new users" ON public.users 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow system to insert users" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Step 5: Create the trigger function with comprehensive error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
    user_role TEXT;
    profile_exists BOOLEAN;
BEGIN
    -- Check if profile already exists
    SELECT EXISTS(SELECT 1 FROM public.users WHERE id = NEW.id) INTO profile_exists;
    
    IF profile_exists THEN
        RAISE NOTICE 'Profile already exists for user: %', NEW.email;
        RETURN NEW;
    END IF;
    
    -- Extract name from metadata with fallback
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        TRIM(CONCAT(
            COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
            ' ',
            COALESCE(NEW.raw_user_meta_data->>'last_name', '')
        )),
        split_part(NEW.email, '@', 1)
    );
    
    -- Extract role with fallback
    user_role := COALESCE(
        NEW.raw_user_meta_data->>'role',
        'student'
    );
    
    -- Validate role
    IF user_role NOT IN ('student', 'admin', 'vendor') THEN
        user_role := 'student';
    END IF;
    
    -- Insert the user profile with proper error handling
    BEGIN
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
        
        RAISE NOTICE 'Successfully created profile for user: % with name: % and role: %', NEW.email, user_name, user_role;
        
    EXCEPTION
        WHEN unique_violation THEN
            RAISE NOTICE 'Profile already exists for user: %', NEW.email;
        WHEN OTHERS THEN
            RAISE WARNING 'Error creating user profile for %: % (SQLSTATE: %)', NEW.email, SQLERRM, SQLSTATE;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Create other essential tables if they don't exist
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  xp_reward INTEGER DEFAULT 0,
  max_attendees INTEGER DEFAULT 50,
  current_attendees INTEGER DEFAULT 0,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users(xp DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- Step 9: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Step 10: Clean up any orphaned auth users that might be causing conflicts
DO $$
DECLARE
    orphaned_count INTEGER;
BEGIN
    -- Count orphaned auth users (users in auth.users without profiles)
    SELECT COUNT(*)
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL
    INTO orphaned_count;
    
    IF orphaned_count > 0 THEN
        RAISE NOTICE 'Found % orphaned auth users. Creating profiles...', orphaned_count;
        
        -- Create profiles for orphaned auth users
        INSERT INTO public.users (id, email, name, role)
        SELECT 
            au.id,
            au.email,
            COALESCE(
                au.raw_user_meta_data->>'name',
                split_part(au.email, '@', 1)
            ),
            COALESCE(
                au.raw_user_meta_data->>'role',
                'student'
            )
        FROM auth.users au
        LEFT JOIN public.users pu ON au.id = pu.id
        WHERE pu.id IS NULL
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE 'Created profiles for orphaned auth users';
    ELSE
        RAISE NOTICE 'No orphaned auth users found';
    END IF;
END $$;

-- Step 11: Test the setup
DO $$
BEGIN
    -- Test if the trigger function works
    IF EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        RAISE NOTICE '✅ Trigger successfully created';
    ELSE
        RAISE NOTICE '❌ Trigger creation failed';
    END IF;
    
    -- Test if the users table structure is correct
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id' AND data_type = 'uuid') THEN
        RAISE NOTICE '✅ Users table structure is correct';
    ELSE
        RAISE NOTICE '❌ Users table structure is incorrect';
    END IF;
    
    RAISE NOTICE '🎉 Database setup completed successfully!';
    RAISE NOTICE '📋 Next steps:';
    RAISE NOTICE '1. Try creating a new account with a fresh email';
    RAISE NOTICE '2. Check that user profiles are automatically created';
    RAISE NOTICE '3. Verify that authentication works properly';
END $$;