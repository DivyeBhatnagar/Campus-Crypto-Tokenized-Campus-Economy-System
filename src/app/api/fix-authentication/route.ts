import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    console.log('🔧 === AUTHENTICATION FIX START ===')
    
    // Get the request body
    const body = await request.json()
    const { email, action } = body
    
    console.log('🔧 Action:', action, 'Email:', email)
    
    if (action === 'check_user') {
      // Check if user exists in auth system
      console.log('🔍 Checking auth user...')
      
      // Note: This is a simplified check. In reality, you'd need admin privileges
      // to directly query auth.users table. This is just for demonstration.
      
      // Check public users table
      const { data: publicUser, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      console.log('📄 Public user check:', publicUser, publicError)
      
      return NextResponse.json({
        success: true,
        message: 'User check completed',
        publicUser,
        publicError
      })
    }
    
    if (action === 'reset_user') {
      console.log('🔄 Resetting user authentication...')
      
      // This would normally require admin privileges to work directly with auth.users
      // For now, we'll just log what would need to be done
      
      console.log('ℹ️ In a real implementation, this would:')
      console.log('  1. Remove user from auth.users (requires admin)')
      console.log('  2. Remove user from public.users')
      console.log('  3. Allow re-registration')
      
      // For demo purposes, let's just remove from public.users
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', email)
      
      console.log('🗑️ Public user deletion result:', deleteError)
      
      return NextResponse.json({
        success: true,
        message: 'User reset simulation completed',
        deleted: !deleteError
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Unknown action'
    })
  } catch (error) {
    console.error('🚨 Authentication fix error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Authentication fix endpoint',
    timestamp: new Date().toISOString()
  })
}