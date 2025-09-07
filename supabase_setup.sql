-- Campus Economy Database Schema
-- Run this SQL in your Supabase SQL Editor to set up all required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Disable email confirmations (run this first)
-- Go to Authentication > Settings in Supabase Dashboard and:
-- 1. Set "Enable email confirmations" to OFF
-- 2. Set "Enable phone confirmations" to OFF  
-- 3. Add "http://localhost:3005" to Site URL
-- 4. Add "http://localhost:3005/**" to Redirect URLs

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  student_id VARCHAR UNIQUE,
  wallet_address VARCHAR,
  department VARCHAR,
  year INTEGER,
  profile_image VARCHAR,
  role VARCHAR DEFAULT 'student' CHECK (role IN ('student', 'admin', 'vendor')),
  campus_coin_balance DECIMAL DEFAULT 0,
  total_earned DECIMAL DEFAULT 0,
  total_spent DECIMAL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transaction_hash VARCHAR,
  type VARCHAR NOT NULL CHECK (type IN ('earn', 'spend', 'transfer', 'reward', 'penalty')),
  category VARCHAR,
  amount DECIMAL NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  reward_rule_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reward_rules table
CREATE TABLE IF NOT EXISTS reward_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  code VARCHAR UNIQUE NOT NULL,
  category VARCHAR,
  token_reward DECIMAL NOT NULL,
  description TEXT,
  nft_badge_enabled BOOLEAN DEFAULT false,
  nft_badge_name VARCHAR,
  nft_badge_description VARCHAR,
  nft_badge_image VARCHAR,
  max_claims_per_user INTEGER DEFAULT 1,
  cooldown_period INTEGER DEFAULT 24, -- hours
  total_claims INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor_products table
CREATE TABLE IF NOT EXISTS vendor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vendor_name VARCHAR,
  category VARCHAR,
  image VARCHAR,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nft_badges table
CREATE TABLE IF NOT EXISTS nft_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id INTEGER UNIQUE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_code VARCHAR,
  name VARCHAR NOT NULL,
  description TEXT,
  image VARCHAR,
  metadata JSONB,
  ipfs_hash VARCHAR,
  transaction_hash VARCHAR,
  rarity VARCHAR DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  category VARCHAR,
  attributes JSONB,
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table for tracking progress
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_code VARCHAR NOT NULL,
  progress INTEGER DEFAULT 0,
  total_required INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_code)
);

-- Create orders table for marketplace transactions
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES users(id),
  product_id UUID REFERENCES vendor_products(id),
  product_name VARCHAR NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_method VARCHAR DEFAULT 'campus_coins',
  transaction_id UUID REFERENCES transactions(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_reward_rules_code ON reward_rules(code);
CREATE INDEX IF NOT EXISTS idx_reward_rules_active ON reward_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor_id ON vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_available ON vendor_products(is_available);
CREATE INDEX IF NOT EXISTS idx_nft_badges_owner_id ON nft_badges(owner_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reward_rules_updated_at BEFORE UPDATE ON reward_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_products_updated_at BEFORE UPDATE ON vendor_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nft_badges_updated_at BEFORE UPDATE ON nft_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default reward rules
INSERT INTO reward_rules (name, code, category, token_reward, description, nft_badge_enabled, max_claims_per_user, cooldown_period) VALUES
('Event Attendance', 'EVENT_ATTEND', 'participation', 25, 'Attend campus events to earn tokens', false, 10, 24),
('Academic Excellence', 'ACADEMIC_STAR', 'academic', 100, 'Achieve outstanding academic performance', true, 1, 168),
('Community Service', 'VOLUNTEER_HERO', 'service', 50, 'Complete volunteer service hours', true, 1, 168),
('Quiz Competition', 'QUIZ_MASTER', 'competition', 30, 'Win quiz competitions', true, 3, 24),
('Leadership Initiative', 'NATURAL_LEADER', 'leadership', 200, 'Lead successful student initiatives', true, 1, 720),
('Study Group Participation', 'STUDY_BUDDY', 'academic', 15, 'Participate in study groups', false, 5, 24),
('Campus Club Member', 'CLUB_MEMBER', 'social', 20, 'Join and participate in campus clubs', false, 3, 168),
('Sustainability Champion', 'ECO_WARRIOR', 'environment', 40, 'Participate in sustainability initiatives', true, 2, 168);

-- Insert sample vendor products
INSERT INTO vendor_products (name, description, price, vendor_id, vendor_name, category, is_available) VALUES
('Coffee & Pastry Combo', 'Fresh brewed coffee with a delicious pastry', 15, (SELECT id FROM users WHERE role = 'vendor' LIMIT 1), 'Campus Café', 'food', true),
('Study Materials Bundle', 'Notebooks, pens, and highlighters', 30, (SELECT id FROM users WHERE role = 'vendor' LIMIT 1), 'Campus Bookstore', 'education', true),
('Gym Day Pass', 'Single day access to campus fitness center', 25, (SELECT id FROM users WHERE role = 'vendor' LIMIT 1), 'Campus Fitness', 'fitness', true),
('Library Private Study Room', '2-hour private study room rental', 20, (SELECT id FROM users WHERE role = 'vendor' LIMIT 1), 'Campus Library', 'education', true),
('Campus T-Shirt', 'Official campus merchandise t-shirt', 45, (SELECT id FROM users WHERE role = 'vendor' LIMIT 1), 'Campus Store', 'merchandise', true),
('Lunch Voucher', 'Meal voucher for campus dining hall', 35, (SELECT id FROM users WHERE role = 'vendor' LIMIT 1), 'Campus Dining', 'food', true),
('Printing Credits', '100 pages of printing credits', 10, (SELECT id FROM users WHERE role = 'vendor' LIMIT 1), 'Campus Print Shop', 'services', true),
('Event Ticket', 'Admission to campus cultural events', 50, (SELECT id FROM users WHERE role = 'vendor' LIMIT 1), 'Campus Events', 'entertainment', true);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Anyone can read reward rules
CREATE POLICY "Anyone can view reward rules" ON reward_rules FOR SELECT USING (true);

-- Anyone can read available vendor products
CREATE POLICY "Anyone can view available products" ON vendor_products FOR SELECT USING (is_available = true);

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can view their own badges
CREATE POLICY "Users can view own badges" ON nft_badges FOR SELECT USING (auth.uid()::text = owner_id::text);

-- Users can view their own achievements
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id::text);

-- Admin policies (you'll need to update these based on your admin user setup)
CREATE POLICY "Admins can manage all data" ON users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage transactions" ON transactions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage reward rules" ON reward_rules FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  )
);

-- Vendor policies
CREATE POLICY "Vendors can manage own products" ON vendor_products FOR ALL USING (
  auth.uid()::text = vendor_id::text OR
  EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  )
);

CREATE POLICY "Vendors can view orders for their products" ON orders FOR SELECT USING (
  auth.uid()::text = vendor_id::text OR 
  auth.uid()::text = user_id::text OR
  EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  )
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;