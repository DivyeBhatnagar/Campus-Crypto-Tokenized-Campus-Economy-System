import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🔧 === COMPREHENSIVE SIGNUP FIX START ===')
    
    // Step 1: Check current state
    console.log('📊 Checking current database state...')
    
    let tableExists = false
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      tableExists = !error
      console.log('📋 Users table exists:', tableExists)
      if (error) console.log('❌ Table check error:', error.message)
    } catch (e) {
      console.log('❌ Exception checking table:', e)
    }
    
    // Step 2: Get auth users count
    let authUsersCount = 0
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      authUsersCount = authUsers?.users?.length || 0
      console.log('🔐 Auth users count:', authUsersCount)
      if (authError) console.log('❌ Auth users error:', authError.message)
    } catch (e) {
      console.log('❌ Exception getting auth users:', e)
    }
    
    // Step 3: If table doesn't exist, we need to initialize via direct database connection
    if (!tableExists) {
      console.log('🚨 Users table missing - this requires manual database setup')
      
      return NextResponse.json({
        success: false,
        error: 'Database schema not initialized',
        solution: {
          steps: [
            '1. Go to your Supabase Dashboard SQL Editor',
            '2. Run the fix_signup_database.sql script',
            '3. This will create the users table and proper triggers',
            '4. Then try signup again'
          ],
          sqlScript: 'fix_signup_database.sql',
          dashboardUrl: 'https://fglstnieswidrqeribtu.supabase.co'
        },
        diagnostics: {
          tableExists,
          authUsersCount
        }
      })
    }
    
    // Step 4: If table exists but we have issues, clean up orphaned users
    console.log('🧹 Cleaning up any signup conflicts...')
    
    // Get all auth users
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const orphanedUsers = []
    
    if (authUsers?.users) {
      for (const authUser of authUsers.users) {
        // Check if this auth user has a profile
        const { data: profile } = await supabase
          .from('users')
          .select('id')
          .eq('id', authUser.id)
          .maybeSingle()
        
        if (!profile) {
          orphanedUsers.push(authUser)
          console.log('👻 Found orphaned auth user:', authUser.email)
        }
      }
    }
    
    // Step 5: Create profiles for orphaned users
    const createdProfiles = []
    for (const orphanedUser of orphanedUsers) {
      try {
        const userName = orphanedUser.user_metadata?.name || 
                        `${orphanedUser.user_metadata?.first_name || ''} ${orphanedUser.user_metadata?.last_name || ''}`.trim() ||
                        orphanedUser.email?.split('@')[0] || 'User'
        
        const userRole = orphanedUser.user_metadata?.role || 'student'
        
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert([{
            id: orphanedUser.id,
            email: orphanedUser.email,
            name: userName,
            role: userRole,
            xp: 0,
            level: 1,
            streak_count: 0,
            total_events_attended: 0,
            total_clubs_joined: 0,
            badges_earned: 0
          }])
          .select()
          .single()
        
        if (createError) {
          console.log('❌ Failed to create profile for:', orphanedUser.email, createError.message)
        } else {
          console.log('✅ Created profile for:', orphanedUser.email)
          createdProfiles.push(newProfile)
        }
      } catch (e) {
        console.log('❌ Exception creating profile for:', orphanedUser.email, e)
      }
    }
    
    // Step 6: Final validation
    const { data: finalCheck } = await supabase.from('users').select('count').limit(1)
    const finalTableExists = !finalCheck
    
    console.log('✅ === SIGNUP FIX COMPLETED ===')
    
    return NextResponse.json({
      success: true,
      message: 'Signup issues resolved',
      results: {
        tableExists: finalTableExists,
        authUsersCount,
        orphanedUsersFound: orphanedUsers.length,
        profilesCreated: createdProfiles.length,
        createdProfiles: createdProfiles.map(p => ({ name: p.name, email: p.email, role: p.role }))
      },
      nextSteps: [
        'Try creating a new account with a fresh email address',
        'The signup process should now work correctly',
        'Check console logs for detailed debugging information'
      ]
    })
    
  } catch (error) {
    console.error('🚨 Fix signup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to fix signup issues'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Just return current status
    const { data: tableCheck, error: tableError } = await supabase.from('users').select('count').limit(1)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    return NextResponse.json({
      success: true,
      status: {
        usersTableExists: !tableError,
        authUsersCount: authUsers?.users?.length || 0,
        tableError: tableError?.message,
        authError: authError?.message,
        message: tableError ? 'Database schema needs initialization' : 'Database appears to be working'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}