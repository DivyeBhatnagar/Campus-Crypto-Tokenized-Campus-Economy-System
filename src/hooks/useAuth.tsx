'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, User, authHelpers, dbHelpers } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signUp: (email: string, password: string, userData: { name: string; role: 'student' | 'admin' | 'vendor' }) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signInWithOAuth: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('🔍 === USEAUTH INITIALIZATION DEBUG ===')
      console.log('⏳ Getting initial session...')
      
      try {
        const { session } = await authHelpers.getSession()
        console.log('🌐 Session result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          userId: session?.user?.id
        })
        
        if (session?.user) {
          console.log('✅ Found active session for user:', session.user.email)
          setSupabaseUser(session.user)
          console.log('📄 Loading user profile for ID:', session.user.id)
          await loadUserProfile(session.user.id)
        } else {
          console.log('⚠️ No active session found')
        }
      } catch (error) {
        console.error('🚨 Error getting initial session:', error)
      }
      
      console.log('⚙️ Setting loading to false')
      setLoading(false)
      console.log('🏁 === USEAUTH INITIALIZATION COMPLETE ===')
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change event:', event)
      console.log('📄 Auth state change session:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email
      })
      
      if (session?.user) {
        console.log('✅ Setting supabase user from auth change:', session.user.email)
        setSupabaseUser(session.user)
        await loadUserProfile(session.user.id)
      } else {
        console.log('🚫 Clearing user state from auth change')
        setSupabaseUser(null)
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('📄 === LOAD USER PROFILE DEBUG ===')
      console.log('🆔 Loading profile for user ID:', userId)
      
      const { data: profile, error } = await dbHelpers.getUserProfile(userId)
      
      console.log('📈 Profile load result:', {
        hasProfile: !!profile,
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.code
      })
      
      if (error) {
        console.error('🚨 Error loading user profile:', error)
        // If profile doesn't exist, this is expected for new users
        if (error.message?.includes('No rows') || error.code === 'PGRST116') {
          console.log('⚠️ Profile not found for user:', userId, '- this is normal for new users')
          return
        }
        return
      }
      
      if (profile) {
        console.log('✅ Successfully loaded user profile:')
        console.log('👤 Name:', profile.name)
        console.log('🎩 Role:', profile.role)
        console.log(' YYS XP:', profile.xp)
        console.log('🏆 Level:', profile.level)
        setUser(profile)
      } else {
        console.log('⚠️ No profile data returned')
      }
    } catch (error) {
      console.error('🚨 Exception while loading user profile:', error)
    }
  }

  const ensureUserProfile = async (userId: string, userData: { name: string; role: 'student' | 'admin' | 'vendor'; email: string }) => {
    try {
      console.log('🏗️ === ENSURE PROFILE DEBUG START ===')
      console.log('🆔 User ID:', userId)
      console.log('📊 User data:', userData)
      
      // Wait a moment for database trigger to potentially create profile
      console.log('⏱️ Waiting for potential database trigger...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // First try to load existing profile
      console.log('🔍 Checking for existing profile...')
      const { data: existingProfile } = await dbHelpers.getUserProfile(userId)
      if (existingProfile) {
        console.log('✅ Found existing profile for user:', userId)
        console.log('👤 Profile name:', existingProfile.name)
        console.log('🎩 Profile role:', existingProfile.role)
        setUser(existingProfile)
        return
      }
      
      // Profile doesn't exist, create it manually
      console.log('🏗️ Creating user profile manually...')
      const { data: newProfile, error: createError } = await dbHelpers.createUserProfile(userId, {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        xp: 0,
        level: 1,
        streak_count: 0,
        total_events_attended: 0,
        total_clubs_joined: 0,
        badges_earned: 0
      })
      
      if (createError) {
        console.error('🚨 Error creating user profile:', createError)
        console.error('💬 Error message:', createError.message)
        console.error('🔢 Error code:', createError.code)
        
        // Enhanced error handling
        if (createError.message?.includes('duplicate key')) {
          console.log('ℹ️ Profile already exists (race condition), trying to fetch it...')
          const { data: retryProfile } = await dbHelpers.getUserProfile(userId)
          if (retryProfile) {
            console.log('✅ Retrieved existing profile on retry')
            setUser(retryProfile)
            return
          }
        }
        
        // Still set user state even if profile creation fails to avoid login loop
        console.warn('⚠️ Setting fallback user state due to profile creation failure')
        setUser({
          id: userId,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          xp: 0,
          level: 1,
          streak_count: 0,
          total_events_attended: 0,
          total_clubs_joined: 0,
          badges_earned: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as User)
        return
      }
      
      if (newProfile) {
        console.log('✅ Successfully created profile:')
        console.log('👤 Profile name:', newProfile.name)
        console.log('🎩 Profile role:', newProfile.role)
        console.log('🆔 Profile ID:', newProfile.id)
        setUser(newProfile)
      }
      
      console.log('🏁 === ENSURE PROFILE DEBUG END ===')
    } catch (error) {
      console.error('⚠️ === ENSURE PROFILE EXCEPTION ===')
      console.error('💬 Error:', error)
      
      // Set fallback user state to prevent login issues
      console.warn('⚠️ Setting fallback user state due to exception')
      setUser({
        id: userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        xp: 0,
        level: 1,
        streak_count: 0,
        total_events_attended: 0,
        total_clubs_joined: 0,
        badges_earned: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as User)
    }
  }

  const signUp = async (email: string, password: string, userData: { name: string; role: 'student' | 'admin' | 'vendor' }) => {
    try {
      console.log('🚀 === USEAUTH SIGNUP DEBUG START ===')
      console.log('📧 Email:', email)
      console.log('👤 User data:', userData)
      
      // Test connection first
      console.log('🧪 Testing Supabase connection...')
      const connectionTest = await authHelpers.testConnection()
      if (!connectionTest.connected) {
        console.error('🚨 Database connection failed:', connectionTest.error)
        return { error: { message: 'Database connection failed. Please check your Supabase configuration.' } }
      }
      console.log('✅ Database connection successful')
      
      // TEMPORARILY DISABLE user existence check - causing false positives
      console.log('⚠️ SKIPPING user existence check due to false positive issues')
      
      const { data, error } = await authHelpers.signUp(email, password, userData)
      
      console.log('📊 === USEAUTH SIGNUP RESULT ===')
      console.log('✅ Auth signup completed, has data:', !!data)
      console.log('👤 Has user:', !!data?.user)
      console.log('🎟️ Has session:', !!data?.session)
      
      if (error) {
        console.error('🚨 === USEAUTH SIGNUP ERROR ===')
        console.error('💬 Error message:', error.message)
        console.error('🔢 Error code:', error.code || 'NO_CODE')
        console.error('📊 Error status:', error.status || 'NO_STATUS')
        console.error('🔍 Full error object:', error)
        
        // Enhanced error diagnostics
        if (error.message?.includes('email already in use')) {
          console.error('🔴 User already exists')
        }
        if (error.message?.includes('password')) {
          console.error('🔴 Password requirements not met')
        }
        if (error.message?.includes('network')) {
          console.error('🔴 Network connection issue')
        }
        if (error.message?.includes('provider')) {
          console.error(' Provider not enabled - check Supabase auth settings')
        }
        
        return { error }
      }
      
      // Always ensure we have a user and create profile
      if (data.user) {
        console.log('✅ === USER CREATED SUCCESSFULLY ===')
        console.log('📧 User email:', data.user.email)
        console.log('🆔 User ID:', data.user.id)
        console.log('✉️ Email confirmed:', !!data.user.email_confirmed_at)
        console.log('📝 User metadata:', data.user.user_metadata)
        
        setSupabaseUser(data.user)
        
        // Create profile immediately
        console.log('🏗️ Creating user profile...')
        await ensureUserProfile(data.user.id, {
          name: userData.name,
          role: userData.role,
          email: data.user.email!
        })
        
        console.log('✅ Profile creation process completed')
        
        // Test if we can immediately sign in with the same credentials
        console.log('🧪 Testing immediate sign in with created credentials...')
        const testSignIn = await authHelpers.signIn(email, password)
        if (testSignIn.error) {
          console.warn('⚠️ Warning: Cannot immediately sign in with created credentials:')
          console.warn('💬 Message:', testSignIn.error.message)
          console.warn('🔢 Code:', testSignIn.error.code)
          
          // This is actually expected in some configurations
          console.log('ℹ️ This might be normal depending on your auth settings')
        } else {
          console.log('✅ Credentials verified: Can sign in immediately after signup')
        }
        
        console.log('🏁 === USEAUTH SIGNUP SUCCESS ===')
        return { error: null }
      }
      
      console.error('🚨 No user returned from signup')
      return { error: { message: 'Failed to create user account - no user returned' } }
    } catch (error) {
      console.error('⚠️ === USEAUTH SIGNUP EXCEPTION ===')
      console.error('💬 Exception message:', error)
      console.error('🔍 Full exception:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 === USEAUTH SIGNIN DEBUG START ===')
      console.log('📧 Email:', email)
      
      // Debug user status before signing in
      console.log('🔍 Debugging user status...')
      await authHelpers.debugUserStatus(email)
      
      const { data, error } = await authHelpers.signIn(email, password)
      
      console.log('🔑 authHelpers.signIn result:', {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error,
        userEmail: data?.user?.email,
        userConfirmed: data?.user?.email_confirmed_at,
        userRole: data?.user?.user_metadata?.role
      })
      
      if (error) {
        console.error('🚨 Sign in error details:', {
          message: error.message,
          code: error.code || 'NO_CODE',
          status: error.status || 'NO_STATUS'
        })
        
        // Enhanced error handling
        if (error.message?.includes('Invalid login credentials')) {
          console.error('🔐 Invalid credentials - user may not exist or password is wrong')
          // Try to check if user exists
          try {
            const exists = await authHelpers.checkUserExists(email)
            console.log('🔍 User existence check:', exists)
          } catch (checkError) {
            console.error('⚠️ Error checking user existence:', checkError)
          }
        }
        
        return { error }
      }
      
      if (data.user && data.session) {
        console.log('✅ Sign in successful, user:', data.user.email)
        setSupabaseUser(data.user)
        
        // Load user profile after successful sign in
        await loadUserProfile(data.user.id)
        console.log('✅ Profile loading completed after sign in')
        return { error: null }
      }
      
      console.error('🚨 No user or session returned from sign in')
      return { error: { message: 'Sign in failed - no user returned' } }
    } catch (error) {
      console.error('🚨 Sign in exception:', error)
      return { error }
    }
  }

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      const { error } = await authHelpers.signInWithOAuth(provider)
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await authHelpers.signOut()
      if (!error) {
        setUser(null)
        setSupabaseUser(null)
      }
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'No user logged in' }
    
    try {
      const { data, error } = await dbHelpers.updateUserProfile(user.id, updates)
      if (error) return { error }
      
      setUser(data)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    supabaseUser,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}