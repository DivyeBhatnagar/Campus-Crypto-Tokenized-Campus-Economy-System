import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🚀 === INITIALIZING DATABASE SCHEMA ===')
    
    // Step 1: Create users table with correct structure
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'vendor')),
        avatar_url TEXT,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        streak_count INTEGER DEFAULT 0,
        total_events_attended INTEGER DEFAULT 0,
        total_clubs_joined INTEGER DEFAULT 0,
        badges_earned INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    console.log('📋 Creating users table...')
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createUsersTable })
    if (createError) {
      console.error('❌ Error creating users table:', createError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create users table',
        details: createError.message 
      })
    }
    
    // Step 2: Enable RLS
    console.log('🔒 Enabling Row Level Security...')
    const enableRLS = `ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`
    await supabase.rpc('exec_sql', { sql: enableRLS })
    
    // Step 3: Create policies
    console.log('📝 Creating security policies...')
    const policies = [
      `DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;`,
      `DROP POLICY IF EXISTS "Users can update own profile" ON public.users;`,
      `DROP POLICY IF EXISTS "Allow public insert for new users" ON public.users;`,
      `CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);`,
      `CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);`,
      `CREATE POLICY "Allow public insert for new users" ON public.users FOR INSERT WITH CHECK (true);`
    ]
    
    for (const policy of policies) {
      await supabase.rpc('exec_sql', { sql: policy })
    }
    
    // Step 4: Create indexes
    console.log('⚡ Creating indexes...')
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);`,
      `CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users(xp DESC);`
    ]
    
    for (const index of indexes) {
      await supabase.rpc('exec_sql', { sql: index })
    }
    
    // Step 5: Test the setup
    console.log('🧪 Testing database setup...')
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database test failed:', testError)
      return NextResponse.json({ 
        success: false, 
        error: 'Database test failed',
        details: testError.message 
      })
    }
    
    console.log('✅ Database initialization completed successfully!')
    
    return NextResponse.json({
      success: true,
      message: 'Database schema initialized successfully',
      steps: [
        'Users table created',
        'Row Level Security enabled',
        'Security policies created',
        'Indexes created',
        'Database tested'
      ]
    })
    
  } catch (error) {
    console.error('🚨 Database initialization error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to initialize database schema'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Check current database state
    const { data: tableExists, error: tableError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    return NextResponse.json({
      success: true,
      status: {
        usersTableExists: !tableError,
        authUsersCount: authUsers?.users?.length || 0,
        tableError: tableError?.message,
        authError: authError?.message
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}