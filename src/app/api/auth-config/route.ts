import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // This is a simplified check. In a real scenario, you'd need admin privileges
    // to check the actual auth configuration.
    
    // Check if we can access the users table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    // Check if we can access the events table
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('count')
      .limit(1)
    
    return NextResponse.json({
      success: true,
      database: {
        usersTable: !error,
        eventsTable: !eventError,
        usersTableError: error?.message,
        eventsTableError: eventError?.message
      },
      timestamp: new Date().toISOString(),
      message: 'Auth configuration check completed'
    })
  } catch (error) {
    console.error('Auth config check error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}