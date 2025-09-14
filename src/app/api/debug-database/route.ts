import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 === DATABASE DEBUG START ===')
    
    // Test 1: Check auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    console.log('🔐 Auth users count:', authUsers?.users?.length || 0)
    if (authError) console.error('❌ Auth users error:', authError)
    
    // Test 2: Check public users table
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .limit(10)
    
    console.log('👥 Public users count:', publicUsers?.length || 0)
    if (publicError) console.error('❌ Public users error:', publicError)
    
    // Test 3: Check table structure
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'users' })
      .select()
    
    console.log('📋 Table columns:', columns)
    if (columnsError) console.error('❌ Columns error:', columnsError)
    
    // Test 4: Check triggers
    const { data: triggers, error: triggersError } = await supabase
      .from('pg_trigger')
      .select('tgname, tgenabled')
      .like('tgname', '%user%')
    
    console.log('⚡ Triggers:', triggers)
    if (triggersError) console.error('❌ Triggers error:', triggersError)
    
    return NextResponse.json({
      success: true,
      diagnostics: {
        authUsersCount: authUsers?.users?.length || 0,
        publicUsersCount: publicUsers?.length || 0,
        authUsers: authUsers?.users?.slice(0, 3)?.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          email_confirmed_at: u.email_confirmed_at
        })) || [],
        publicUsers: publicUsers?.slice(0, 3) || [],
        tableExists: !publicError,
        authError: authError?.message,
        publicError: publicError?.message,
        triggersError: triggersError?.message
      }
    })
    
  } catch (error) {
    console.error('🚨 Database debug exception:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Database connection or query failed'
    }, { status: 500 })
  }
}