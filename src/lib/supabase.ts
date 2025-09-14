'use client';

import { createClient } from '@supabase/supabase-js'

// Safely get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Log the configuration for debugging
console.log('🌐 Supabase URL loaded:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET')
console.log('🔑 Supabase Key loaded:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : 'NOT SET')

// Create Supabase client with validation
let supabase: any = null

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🚨 Supabase configuration missing!')
    console.error('URL present:', !!supabaseUrl)
    console.error('Key present:', !!supabaseAnonKey)
    throw new Error('Supabase environment variables are not configured')
  }
  
  if (!supabaseUrl.startsWith('https://')) {
    console.error('🚨 Invalid Supabase URL format:', supabaseUrl)
    throw new Error('Invalid Supabase URL format')
  }
  
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase client created successfully')
  
  // Test the client immediately
  if (typeof supabase.from !== 'function') {
    console.error('🚨 Supabase client malformed - from() method missing')
    throw new Error('Supabase client is malformed')
  }
  
  console.log('✅ Supabase client validation passed')
  
} catch (error) {
  console.error('🚨 Failed to create Supabase client:', error)
  
  // Create a mock client for development/fallback
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    }),
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: { message: 'Supabase not configured' } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  }
  console.log('⚠️ Using mock Supabase client')
}

export { supabase }

// Types for our database
export type User = {
  id: string
  email: string
  name: string
  role: 'student' | 'admin' | 'vendor'
  avatar_url?: string
  xp: number
  level: number
  streak_count: number
  total_events_attended: number
  total_clubs_joined: number
  badges_earned: number
  created_at: string
  updated_at: string
}

export type Event = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  category: string
  xp_reward: number
  max_attendees: number
  current_attendees: number
  image_url?: string
  tags: string[]
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  created_at: string
  updated_at: string
}

export type Club = {
  id: string
  name: string
  description: string
  category: string
  image_url?: string
  member_count: number
  admin_user_id: string
  created_at: string
  updated_at: string
}

export type Transaction = {
  id: string
  user_id: string
  type: 'earn' | 'spend' | 'transfer'
  amount: number
  description: string
  event_id?: string
  marketplace_item_id?: string
  created_at: string
}

export type Badge = {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requirements: Record<string, any>
  created_at: string
}

export type UserBadge = {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  metadata?: Record<string, any>
}

export type EventRegistration = {
  id: string
  user_id: string
  event_id: string
  status: 'registered' | 'attended' | 'cancelled'
  registered_at: string
}

export type ClubMember = {
  id: string
  user_id: string
  club_id: string
  role: 'member' | 'admin'
  joined_at: string
}

// Auth helpers
export const authHelpers = {
  signUp: async (email: string, password: string, userData: Partial<User>) => {
    console.log('🚀 === SIGNUP DEBUG START ===')  
    console.log('📧 Email:', email)
    console.log('🔐 Password length:', password?.length || 0)
    console.log('👤 User data:', userData)
    console.log('🌐 Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'NOT SET')
    console.log('🔑 Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET')
    
    // Enhanced debugging - check auth provider status
    console.log('🔍 Checking auth provider status...')
    try {
      const { data: providers, error: providersError } = await supabase.auth.getSupportedProviders()
      console.log('🔐 Supported providers:', providers, 'Error:', providersError)
    } catch (e) {
      console.log('⚠️ Could not check providers:', e)
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: undefined  // Disable email confirmation
      }
    })
    
    console.log('📊 === SIGNUP RESULT ===')  
    console.log('✅ Has data:', !!data)
    console.log('👤 Has user:', !!data?.user)
    console.log('🎟️ Has session:', !!data?.session)
    console.log('📧 User email:', data?.user?.email)
    console.log('✉️ Email confirmed:', !!data?.user?.email_confirmed_at)
    console.log('📝 User metadata:', data?.user?.user_metadata)
    console.log('🆔 User ID:', data?.user?.id)
    
    if (error) {
      console.log('🚨 === SIGNUP ERROR ===')  
      console.log('💬 Error message:', error.message)
      console.log('🔢 Error code:', error.code)
      console.log('📊 Error status:', error.status)
      console.log('📊 Error details:', error.details)
      console.log('🔍 Full error:', error)
      
      // Enhanced error diagnostics
      if (error.message?.includes('email')) {
        console.log('📧 Email-related error detected')
      }
      if (error.message?.includes('password')) {
        console.log('🔐 Password-related error detected')
      }
      if (error.message?.includes('provider')) {
        console.log(' Provider-related error detected')
      }
    }
    
    console.log('🏁 === SIGNUP DEBUG END ===')  
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    console.log('🔐 === SIGNIN DEBUG START ===')
    console.log('📧 Email:', email)
    console.log('🔐 Password length:', password?.length || 0)
    
    // Check if user exists in auth system
    try {
      console.log('🔍 Checking if user exists in auth system...')
      const { data: { user }, error: getUserError } = await supabase.auth.getUser()
      console.log('👤 Current auth user:', user, 'Error:', getUserError)
    } catch (e) {
      console.log('⚠️ Could not get current user:', e)
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    console.log('📊 === SIGNIN RESULT ===')
    console.log('✅ Has data:', !!data)
    console.log('👤 Has user:', !!data?.user)
    console.log('🎟️ Has session:', !!data?.session)
    console.log('📧 User email:', data?.user?.email)
    console.log('✉️ Email confirmed:', !!data?.user?.email_confirmed_at)
    console.log('🆔 User ID:', data?.user?.id)
    
    if (error) {
      console.log('🚨 === SIGNIN ERROR ===')
      console.log('💬 Error message:', error.message)
      console.log('🔢 Error code:', error.code)
      console.log('📊 Error status:', error.status)
      console.log('🔍 Full error:', error)
      
      // Enhanced error diagnostics
      if (error.message?.includes('Invalid login credentials')) {
        console.log('🔐 Invalid credentials - check if user exists in auth.users')
      }
      if (error.message?.includes('Email not confirmed')) {
        console.log('📧 Email not confirmed - might need to disable confirmation for dev')
      }
    }
    
    console.log('🏁 === SIGNIN DEBUG END ===')
    return { data, error }
  },

  signInWithOAuth: async (provider: 'google' | 'github') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Debug function to check if user exists in auth.users
  checkUserExists: async (email: string) => {
    try {
      console.log('🔍 === CHECKING USER EXISTS START ===')
      console.log('📧 Email to check:', email)
      
      // Method 1: Check public users table first
      console.log('📄 Checking public users table...')
      const { data: publicUser, error: publicError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('email', email)
        .maybeSingle()
      
      console.log('📊 Public users result:')
      console.log('- User found:', !!publicUser)
      console.log('- User data:', publicUser)
      console.log('- Error:', publicError?.message || 'None')
      console.log('- Error code:', publicError?.code || 'None')
      
      // If we found a user in public table, they definitely exist
      if (publicUser) {
        console.log('🏁 === RESULT: USER EXISTS (found in public table) ===')
        return { 
          exists: true, 
          reason: 'Found in public users table',
          hasPublicProfile: true,
          userData: publicUser
        }
      }
      
      // If table doesn't exist, user definitely doesn't exist
      if (publicError?.message?.includes('relation "users" does not exist')) {
        console.log('🏁 === RESULT: USER DOES NOT EXIST (table missing) ===')
        return { 
          exists: false, 
          reason: 'Users table does not exist',
          hasPublicProfile: false,
          tableExists: false
        }
      }
      
      // Method 2: Try auth check with dummy password (only if public table check was clean)
      console.log('🔑 Testing auth with dummy password...')
      const { data: dummyData, error: dummyError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-check-12345-very-unlikely-to-match'
      })
      
      console.log('📊 Dummy login result:')
      console.log('- Has user:', !!dummyData?.user)
      console.log('- Error message:', dummyError?.message || 'None')
      console.log('- Error code:', dummyError?.code || 'None')
      
      // Analyze auth results
      let exists = false
      let reason = 'User does not exist'
      
      if (dummyError) {
        if (dummyError.message?.includes('Invalid login credentials') || 
            dummyError.message?.includes('Invalid email or password')) {
          exists = true
          reason = 'Auth user exists (invalid password response)'
        } else if (dummyError.message?.includes('Email not confirmed')) {
          exists = true
          reason = 'Auth user exists (unconfirmed email)'
        } else if (dummyError.message?.includes('User not found') || 
                   dummyError.message?.includes('user with this email not found') ||
                   dummyError.message?.includes('No user found')) {
          exists = false
          reason = 'Auth user does not exist'
        } else {
          // Unknown error - assume user doesn't exist to be safe
          exists = false
          reason = `Unknown auth error: ${dummyError.message}`
        }
      } else if (dummyData?.user) {
        // Very unlikely with dummy password, but handle it
        exists = true
        reason = 'Auth user exists (dummy login succeeded)'
      }
      
      console.log('🏁 === FINAL RESULT ===')
      console.log('✅ User exists:', exists)
      console.log('📝 Reason:', reason)
      console.log('👤 Public profile:', !!publicUser)
      
      return { 
        exists, 
        reason,
        hasPublicProfile: !!publicUser,
        authError: dummyError?.message,
        publicError: publicError?.message,
        tableExists: true
      }
    } catch (err) {
      console.log('⚠️ === CHECK USER EXISTS EXCEPTION ===')
      console.log('⚠️ Exception:', err)
      return { 
        exists: false, 
        reason: 'Exception occurred during check',
        error: err instanceof Error ? err.message : 'Unknown exception',
        hasPublicProfile: false
      }
    }
  },

  // Enhanced debug function to check user existence
  debugUserStatus: async (email: string) => {
    try {
      console.log('🔍 === USER STATUS DEBUG ===')
      console.log('📧 Checking status for email:', email)
      
      // Check auth.users table directly (requires admin privileges)
      console.log('🔐 Checking auth system...')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log('🎟️ Current session:', sessionData, 'Error:', sessionError)
      
      // Check public.users table
      console.log('📄 Checking public users table...')
      const { data: publicUsers, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
      console.log('📊 Public users found:', publicUsers, 'Error:', publicError)
      
      // Try to sign in with dummy password to check if user exists
      console.log('🧪 Testing user existence with dummy password...')
      const { error: dummyError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-12345'
      })
      
      if (dummyError) {
        if (dummyError.message?.includes('Invalid login credentials')) {
          console.log('✅ User exists in auth system (invalid password response)')
        } else if (dummyError.message?.includes('Email not confirmed')) {
          console.log('✅ User exists but email not confirmed')
        } else {
          console.log('❓ Auth error:', dummyError.message)
        }
      }
      
      return { 
        session: sessionData?.session, 
        publicUsers, 
        authError: dummyError?.message 
      }
    } catch (error) {
      console.error('🚨 User status debug error:', error)
      return { error }
    }
  },

  // Test database connection
  testConnection: async () => {
    try {
      console.log('🧪 Testing Supabase connection...')
      const { data, error } = await supabase.from('users').select('count').limit(1)
      if (error) {
        console.log('❌ Database connection failed:', error)
        return { connected: false, error }
      }
      console.log('✅ Database connection successful')
      return { connected: true, error: null }
    } catch (err) {
      console.log('⚠️ Exception testing connection:', err)
      return { connected: false, error: err }
    }
  }
}

// Database helpers
export const dbHelpers = {
  // User operations
  createUserProfile: async (userId: string, userData: Partial<User>) => {
    console.log('🏠 === CREATE USER PROFILE START ===')
    console.log('🆔 User ID:', userId)
    console.log('📄 User data to save:', userData)
    
    try {
      // First, check if profile already exists
      console.log('🔍 Checking if profile already exists...')
      const { data: existingProfile, error: checkError } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', userId)
        .maybeSingle()
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing profile:', checkError)
        return { data: null, error: checkError }
      }
      
      if (existingProfile) {
        console.log('✅ Profile already exists:', existingProfile.name)
        return { data: existingProfile, error: null }
      }
      
      console.log('🏠 Creating new profile...')
      const profileData = { 
        id: userId, 
        ...userData,
        xp: userData.xp || 0,
        level: userData.level || 1,
        streak_count: userData.streak_count || 0,
        total_events_attended: userData.total_events_attended || 0,
        total_clubs_joined: userData.total_clubs_joined || 0,
        badges_earned: userData.badges_earned || 0
      }
      
      console.log('📝 Final profile data:', profileData)
      
      const { data, error } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single()
      
      console.log('📊 === CREATE PROFILE RESULT ===')
      console.log('✅ Success:', !!data)
      console.log('👤 Created profile:', data?.name || 'No name')
      
      if (error) {
        console.error('❌ Profile creation error:')
        console.error('- Message:', error.message)
        console.error('- Code:', error.code)
        console.error('- Details:', error.details)
        console.error('- Hint:', error.hint)
        
        // Check for specific error types
        if (error.code === '23505') { // Unique violation
          console.log('⚠️ Duplicate profile detected, fetching existing...')
          const { data: existingData } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()
          return { data: existingData, error: null }
        }
        
        if (error.message?.includes('relation "users" does not exist')) {
          console.error('🔴 CRITICAL: Users table does not exist!')
          return { 
            data: null, 
            error: { 
              ...error, 
              message: 'Database table "users" does not exist. Please run the database setup script.' 
            }
          }
        }
        
        return { data: null, error }
      }
      
      console.log('🎉 Profile created successfully!')
      return { data, error: null }
    } catch (err) {
      console.error('⚠️ Exception creating user profile:', err)
      return { 
        data: null, 
        error: { 
          message: err instanceof Error ? err.message : 'Unknown error',
          code: 'EXCEPTION'
        }
      }
    }
  },

  getUserProfile: async (userId: string) => {
    console.log('🔍 === GET PROFILE DEBUG START ===')
    console.log('🆔 Looking for user ID:', userId)
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      console.log('📊 === GET PROFILE RESULT ===')
      console.log('✅ Has data:', !!data)
      console.log('👤 Profile found:', data?.name || 'no name')
      
      if (error) {
        console.log('🚨 === PROFILE LOOKUP ERROR ===')
        console.log('💬 Error message:', error.message)
        console.log('🔢 Error code:', error.code)
        console.log('📊 Error details:', error.details)
        
        // Check if it's a "no rows" error (expected for new users)
        if (error.message?.includes('No rows') || error.code === 'PGRST116') {
          console.log('ℹ️ No profile found for user:', userId, '- this is normal for new users')
        }
      }
      
      console.log('🏁 === GET PROFILE DEBUG END ===')
      return { data, error }
    } catch (err) {
      console.error('⚠️ Exception getting user profile:', err)
      return { data: null, error: err }
    }
  },

  updateUserProfile: async (userId: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Event operations
  getEvents: async (filters?: { category?: string; status?: string }) => {
    let query = supabase.from('events').select('*')
    
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    const { data, error } = await query.order('date', { ascending: true })
    return { data, error }
  },

  createEvent: async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()
    return { data, error }
  },

  // Registration operations
  registerForEvent: async (userId: string, eventId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{ user_id: userId, event_id: eventId, status: 'registered' }])
      .select()
      .single()
    return { data, error }
  },

  getUserRegistrations: async (userId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events (*)
      `)
      .eq('user_id', userId)
    return { data, error }
  },

  // Leaderboard operations
  getLeaderboard: async (limit = 10) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, xp, level, badges_earned, streak_count, total_events_attended')
      .order('xp', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  // Transaction operations
  addTransaction: async (transactionData: Omit<Transaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single()
    return { data, error }
  },

  getUserTransactions: async (userId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}
