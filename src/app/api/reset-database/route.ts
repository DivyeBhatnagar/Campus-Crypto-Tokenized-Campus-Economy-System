import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🧹 === DATABASE RESET START ===')
    
    // Step 1: Clear all users from public table
    console.log('🗑️ Clearing public users table...')
    const { error: clearUsersError } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all users
    
    if (clearUsersError && !clearUsersError.message.includes('relation "users" does not exist')) {
      console.error('❌ Error clearing users:', clearUsersError)
    } else {
      console.log('✅ Public users table cleared')
    }
    
    // Step 2: Get all auth users and delete them
    console.log('🔐 Getting auth users...')
    const { data: authUsers, error: authListError } = await supabase.auth.admin.listUsers()
    
    if (authListError) {
      console.error('❌ Error listing auth users:', authListError)
    } else if (authUsers?.users?.length > 0) {
      console.log(`🗑️ Deleting ${authUsers.users.length} auth users...`)
      
      for (const user of authUsers.users) {
        try {
          const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
          if (deleteError) {
            console.error(`❌ Error deleting user ${user.email}:`, deleteError)
          } else {
            console.log(`✅ Deleted auth user: ${user.email}`)
          }
        } catch (e) {
          console.error(`❌ Exception deleting user ${user.email}:`, e)
        }
      }
    } else {
      console.log('ℹ️ No auth users to delete')
    }
    
    // Step 3: Verify cleanup
    console.log('🔍 Verifying cleanup...')
    const { data: remainingAuthUsers } = await supabase.auth.admin.listUsers()
    const { data: remainingPublicUsers, error: publicCheckError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    console.log('✅ === DATABASE RESET COMPLETED ===')
    
    return NextResponse.json({
      success: true,
      message: 'Database reset completed',
      results: {
        authUsersRemaining: remainingAuthUsers?.users?.length || 0,
        publicUsersTableExists: !publicCheckError,
        publicUsersError: publicCheckError?.message
      },
      nextSteps: [
        'Database is now clean',
        'Try creating a new account with any email',
        'The signup process should work without "user exists" errors'
      ]
    })
    
  } catch (error) {
    console.error('🚨 Database reset error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to reset database'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Show current database state
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    return NextResponse.json({
      success: true,
      currentState: {
        authUsersCount: authUsers?.users?.length || 0,
        publicUsersTableExists: !publicError,
        publicError: publicError?.message,
        authUsers: authUsers?.users?.slice(0, 5)?.map(u => ({
          email: u.email,
          created_at: u.created_at,
          confirmed: !!u.email_confirmed_at
        })) || []
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}