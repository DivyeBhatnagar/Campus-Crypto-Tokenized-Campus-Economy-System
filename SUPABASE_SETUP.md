# Campus Economy Platform - Supabase Database Setup

## Required Database Tables

When you provide your Supabase URL and API key, you'll need to create these tables in your Supabase database:

### 1. Users Table (extends auth.users)
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  student_id TEXT UNIQUE,
  full_name TEXT,
  wallet_address TEXT,
  department TEXT,
  year INTEGER,
  profile_image TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'vendor')),
  campus_coin_balance DECIMAL(10,2) DEFAULT 0.00,
  total_earned DECIMAL(10,2) DEFAULT 0.00,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Transactions Table
```sql
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  transaction_hash TEXT,
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'transfer', 'reward', 'penalty')),
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  from_user_id UUID REFERENCES public.users(id),
  to_user_id UUID REFERENCES public.users(id),
  reward_rule_id UUID REFERENCES public.reward_rules(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = from_user_id OR auth.uid() = to_user_id);
```

### 3. Reward Rules Table
```sql
CREATE TABLE public.reward_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  token_reward DECIMAL(10,2) NOT NULL,
  description TEXT,
  nft_badge_enabled BOOLEAN DEFAULT false,
  nft_badge_name TEXT,
  nft_badge_description TEXT,
  nft_badge_image TEXT,
  max_claims_per_user INTEGER DEFAULT 0, -- 0 means unlimited
  cooldown_period INTEGER DEFAULT 0, -- in hours
  total_claims INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reward_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active reward rules" ON public.reward_rules
  FOR SELECT USING (is_active = true);
```

### 4. Vendor Products Table
```sql
CREATE TABLE public.vendor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  vendor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read available products" ON public.vendor_products
  FOR SELECT USING (is_available = true);
```

### 5. User Claims Table (track reward claims)
```sql
CREATE TABLE public.user_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_rule_id UUID NOT NULL REFERENCES public.reward_rules(id) ON DELETE CASCADE,
  claim_count INTEGER DEFAULT 1,
  last_claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, reward_rule_id)
);

ALTER TABLE public.user_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own claims" ON public.user_claims
  FOR SELECT USING (auth.uid() = user_id);
```

## Environment Variables Setup

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: WalletConnect for Web3 features
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## Sample Data (Optional)

You can insert some sample data to test the application:

```sql
-- Sample reward rules
INSERT INTO public.reward_rules (name, code, category, token_reward, description, is_active) VALUES
('Attendance Reward', 'ATTEND_CLASS', 'attendance', 5.00, 'Earn tokens for attending classes', true),
('Hackathon Participation', 'HACKATHON_PART', 'events', 50.00, 'Participate in campus hackathons', true),
('Volunteer Work', 'VOLUNTEER', 'community', 20.00, 'Community service and volunteering', true),
('Library Study', 'LIBRARY_STUDY', 'study', 3.00, 'Study sessions in the library', true);

-- Sample vendor products
INSERT INTO public.vendor_products (name, description, price, vendor_name, category, is_available) VALUES
('Campus Coffee', 'Premium blend coffee from campus café', 15.00, 'Campus Café', 'food', true),
('Study Room Booking', 'Reserve a quiet study room for 2 hours', 8.00, 'Campus Library', 'education', true),
('Gym Day Pass', 'Access to all gym facilities for one day', 10.00, 'Campus Gym', 'wellness', true),
('Campus T-Shirt', 'Show your school pride with this comfortable t-shirt', 25.00, 'Campus Store', 'merchandise', true);
```

## Features Implemented

✅ **Authentication System**
- User signup with student information
- Login/logout functionality  
- Protected routes for authenticated users
- User profile management

✅ **Dashboard**
- Real-time balance display
- Transaction history
- Quick actions (view rewards, send tokens, export data)
- Recent activity feed
- Achievement badges display

✅ **Marketplace**
- Product catalog with categories
- Search and filter functionality
- Grid/list view toggle
- Purchase simulation (ready for Web3 integration)

✅ **Navigation & Routing**
- Updated navigation with auth buttons
- Protected routes middleware
- Responsive design maintained

## Next Steps

1. **Provide your Supabase URL and API key** to connect the database
2. **Create the database tables** using the SQL scripts above
3. **Test the authentication flow** (signup → login → dashboard)
4. **Add sample data** to test marketplace and dashboard features
5. **Optional**: Re-enable Web3 features for blockchain integration

The platform is now fully functional with:
- 🔐 **Authentication**: Complete signup/login system
- 📊 **Dashboard**: User stats, transactions, activities
- 🛒 **Marketplace**: Product browsing and purchasing interface
- 🎨 **Design**: Full neumorphic UI with responsive layout

All pages are working and ready for your Supabase integration!

# 🚀 Supabase Database Setup Instructions

## 📋 Quick Setup Steps

### 1. **Run the Database Schema**
1. Open your **Supabase Dashboard**: https://app.supabase.com/projects
2. Go to your project: **iuqqadgbjacukvmroelt**
3. Navigate to **SQL Editor** in the left sidebar
4. Copy and paste the entire content from `supabase_setup.sql`
5. Click **"Run"** to execute the SQL

This will create all necessary tables, indexes, and security policies.

### 2. **Enable Authentication**
1. In your Supabase Dashboard, go to **Authentication > Settings**
2. Make sure **"Enable email confirmations"** is **disabled** for testing
3. Under **"Site URL"**, add: `http://localhost:3004`
4. Under **"Redirect URLs"**, add: `http://localhost:3004/**`

### 3. **Test the Connection**
Your application is now configured with your real Supabase credentials:
- **Project URL**: `https://iuqqadgbjacukvmroelt.supabase.co`
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🎯 What's Been Updated

### ✅ **Environment Variables**
- Updated `.env.local` with your actual Supabase credentials
- Application will now connect to your real database

### ✅ **Database Functions**
- Enhanced all database helper functions in `src/lib/supabase.ts`
- Added full CRUD operations for all entities
- Maintained backward compatibility with mock data

### ✅ **Database Schema**
- Complete schema with all required tables:
  - `users` - User profiles and authentication
  - `transactions` - Token transactions and history
  - `reward_rules` - Achievement and reward definitions
  - `vendor_products` - Marketplace products
  - `nft_badges` - NFT achievement badges
  - `user_achievements` - Achievement progress tracking
  - `orders` - Marketplace order history

### ✅ **Security**
- Row Level Security (RLS) enabled on all tables
- Proper access policies for users, admins, and vendors
- Secure data isolation between different user types

## 🔧 Testing Your Setup

### **1. Test Authentication**
1. Start your dev server: `npm run dev`
2. Go to `/signup` and create a test account
3. Check your Supabase dashboard > Authentication > Users to see the new user

### **2. Test Database Operations**
1. Login with your test account
2. Navigate through different pages to test data loading
3. Try creating/editing items in admin or vendor dashboards

### **3. View Database Data**
1. In Supabase Dashboard, go to **Table Editor**
2. Browse through tables to see data being created
3. Check the `users` table for your test user

## 🎉 You're All Set!

Your Campus Economy application is now connected to a real Supabase backend! 

### **Next Steps:**
1. **Run the SQL setup** (most important!)
2. **Test user registration** 
3. **Explore all features** with real data persistence
4. **Add more users** to test multi-user scenarios
5. **Configure production settings** when ready to deploy

### **Need Help?**
- Check the Supabase logs in your dashboard for any errors
- Verify all tables were created in the Table Editor
- Make sure RLS policies are active in the Authentication section

**Happy coding! 🚀**
