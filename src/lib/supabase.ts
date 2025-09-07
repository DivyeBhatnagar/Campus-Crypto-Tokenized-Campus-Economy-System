'use client';

import { createClient } from '@supabase/supabase-js';

// These will be replaced with your actual Supabase URL and API key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-anon-key' &&
  supabaseUrl.includes('.supabase.co');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null; // Don't create client if not configured

// Database types for TypeScript
export interface User {
  id: string;
  email: string;
  student_id?: string;
  full_name?: string;
  wallet_address?: string;
  department?: string;
  year?: number;
  profile_image?: string;
  role: 'student' | 'admin' | 'vendor';
  campus_coin_balance: number;
  total_earned: number;
  total_spent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_hash?: string;
  type: 'earn' | 'spend' | 'transfer' | 'reward' | 'penalty';
  category: string;
  amount: number;
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
  from_user_id?: string;
  to_user_id?: string;
  reward_rule_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface RewardRule {
  id: string;
  name: string;
  code: string;
  category: string;
  token_reward: number;
  description: string;
  nft_badge_enabled: boolean;
  nft_badge_name?: string;
  nft_badge_description?: string;
  nft_badge_image?: string;
  max_claims_per_user: number;
  cooldown_period: number;
  total_claims: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  vendor_id: string;
  vendor_name: string;
  category: string;
  image?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Authentication helper functions
export const authHelpers = {
  async signUp(email: string, password: string, userData: any) {
    if (!supabase) {
      // Mock successful signup for demo purposes
      return {
        data: {
          user: { id: 'demo-user-' + Date.now(), email },
          session: { access_token: 'demo-token' }
        },
        error: null
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
        data: userData
      }
    });
    
    // If signup successful and user exists, create user profile
    if (data.user && !error) {
      const profileData = {
        id: data.user.id,
        email: data.user.email!,
        full_name: userData.full_name || '',
        student_id: userData.student_id || '',
        department: userData.department || '',
        year: userData.year || null,
        role: userData.role || 'student',
        campus_coin_balance: userData.campus_coin_balance || 0,
        total_earned: userData.total_earned || 0,
        total_spent: userData.total_spent || 0,
        is_active: userData.is_active !== undefined ? userData.is_active : true
      };
      
      // Insert user profile into users table
      const { error: profileError } = await supabase
        .from('users')
        .insert(profileData);
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't return error as auth was successful
      }
    }
    
    return { data, error };
  },

  async signIn(email: string, password: string) {
    if (!supabase) {
      // Mock successful signin for demo purposes
      return {
        data: {
          user: { id: 'demo-user-' + Date.now(), email },
          session: { access_token: 'demo-token' }
        },
        error: null
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    if (!supabase) {
      // Mock successful signout
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    if (!supabase) {
      // Return null for demo
      return null;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getProfile(userId: string) {
    if (!supabase) {
      // Mock profile data
      return {
        data: {
          id: userId,
          email: 'demo@campus.edu',
          full_name: 'Demo Student',
          student_id: 'STU001',
          department: 'computer_science',
          year: 2,
          role: 'student',
          campus_coin_balance: 150.50,
          total_earned: 200.00,
          total_spent: 49.50,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        error: null
      };
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    // If user profile doesn't exist, create one from auth user data
    if (error && error.code === 'PGRST116') {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const newProfile = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || 'User',
          student_id: user.user_metadata?.student_id || '',
          department: user.user_metadata?.department || '',
          year: user.user_metadata?.year || null,
          role: user.user_metadata?.role || 'student',
          campus_coin_balance: 0,
          total_earned: 0,
          total_spent: 0,
          is_active: true
        };
        
        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single();
        
        if (!insertError) {
          return { data: insertedData, error: null };
        }
      }
    }
    
    return { data, error };
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    if (!supabase) {
      // Mock successful update
      return {
        data: { ...updates, id: userId },
        error: null
      };
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  }
};

// Database helper functions
export const dbHelpers = {
  async getUserTransactions(userId: string, limit = 50) {
    if (!supabase) {
      // Mock transaction data
      const mockTransactions: Transaction[] = [
        {
          id: 'tx1',
          user_id: userId,
          type: 'earn',
          category: 'Event Attendance',
          amount: 25.0,
          description: 'Attended Tech Workshop',
          status: 'confirmed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'tx2',
          user_id: userId,
          type: 'spend',
          category: 'Food & Beverages',
          amount: -15.0,
          description: 'Cafeteria Purchase',
          status: 'confirmed',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      return { data: mockTransactions, error: null };
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async getRewardRules() {
    if (!supabase) {
      // Mock reward rules data
      const mockRules: RewardRule[] = [
        {
          id: 'rule1',
          name: 'Event Attendance',
          code: 'EVENT_ATTEND',
          category: 'participation',
          token_reward: 25,
          description: 'Attend campus events to earn tokens',
          nft_badge_enabled: false,
          max_claims_per_user: 10,
          cooldown_period: 24,
          total_claims: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return { data: mockRules, error: null };
    }
    
    const { data, error } = await supabase
      .from('reward_rules')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getVendorProducts() {
    if (!supabase) {
      // Mock vendor products data
      const mockProducts: VendorProduct[] = [
        {
          id: 'prod1',
          name: 'Coffee & Pastry',
          description: 'Fresh coffee with pastry',
          price: 15,
          vendor_id: 'vendor1',
          vendor_name: 'Campus Café',
          category: 'food',
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'prod2',
          name: 'Study Materials',
          description: 'Notebooks and stationery',
          price: 30,
          vendor_id: 'vendor2',
          vendor_name: 'Campus Bookstore',
          category: 'education',
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return { data: mockProducts, error: null };
    }
    
    const { data, error } = await supabase
      .from('vendor_products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) {
      // Mock successful transaction creation
      const mockTransaction: Transaction = {
        ...transaction,
        id: 'tx' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return { data: mockTransaction, error: null };
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    return { data, error };
  },

  async createRewardRule(rule: Omit<RewardRule, 'id' | 'created_at' | 'updated_at' | 'total_claims'>) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { data, error } = await supabase
      .from('reward_rules')
      .insert({ ...rule, total_claims: 0 })
      .select()
      .single();
    return { data, error };
  },

  async updateRewardRule(id: string, updates: Partial<RewardRule>) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { data, error } = await supabase
      .from('reward_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteRewardRule(id: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { error } = await supabase
      .from('reward_rules')
      .delete()
      .eq('id', id);
    return { error };
  },

  async createProduct(product: Omit<VendorProduct, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { data, error } = await supabase
      .from('vendor_products')
      .insert(product)
      .select()
      .single();
    return { data, error };
  },

  async updateProduct(id: string, updates: Partial<VendorProduct>) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { data, error } = await supabase
      .from('vendor_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteProduct(id: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { error } = await supabase
      .from('vendor_products')
      .delete()
      .eq('id', id);
    return { error };
  },

  async createOrder(order: Omit<any, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    return { data, error };
  },

  async getUserOrders(userId: string) {
    if (!supabase) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getVendorOrders(vendorId: string) {
    if (!supabase) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getAllUsers(limit = 100) {
    if (!supabase) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async getAllTransactions(limit = 100) {
    if (!supabase) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*, user:users(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async updateUserBalance(userId: string, newBalance: number) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } };
    }
    
    const { data, error } = await supabase
      .from('users')
      .update({ campus_coin_balance: newBalance })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  }
};