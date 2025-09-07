'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase, User as AppUser, authHelpers } from '@/lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  profile: AppUser | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (updates: Partial<AppUser>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only initialize if supabase is available
    if (!supabase) {
      setLoading(false);
      return;
    }
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await authHelpers.getProfile(userId);
      if (error) {
        console.error('Error loading profile:', {
          message: error.message || 'Unknown error',
          code: error.code || 'NO_CODE',
          details: error.details || 'No details available',
          hint: (error as any).hint || 'No hint available',
          userId: userId
        });
        // Set default profile for demo mode or when profile doesn't exist
        if (!supabase || error.code === 'PGRST116') {
          setProfile({
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
          });
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error loading profile:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        userId: userId
      });
      // Set fallback profile on unexpected errors
      setProfile({
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
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      return await authHelpers.signUp(email, password, userData);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      return await authHelpers.signIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      return await authHelpers.signOut();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      const result = await authHelpers.updateProfile(user.id, updates);
      if (result.data) {
        setProfile(result.data);
      }
      return result;
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}