import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🚀 === DIRECT SUPABASE CREDENTIAL TEST START ===')
    
    // Get credentials from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('🌐 URL:', supabaseUrl)
    console.log('🔑 Key present:', !!supabaseKey)
    console.log('🔑 Key length:', supabaseKey?.length || 0)
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing credentials',
        details: {
          urlPresent: !!supabaseUrl,
          keyPresent: !!supabaseKey
        }
      }, { status: 500 })
    }
    
    // Test 1: Direct HTTP request to Supabase REST API
    console.log('🧪 Testing direct HTTP request to Supabase...')
    
    try {
      const testUrl = `${supabaseUrl}/rest/v1/`
      console.log('📡 Request URL:', testUrl)
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      })
      
      console.log('📊 Response status:', response.status)
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log('❌ Response error text:', errorText)
        
        return NextResponse.json({
          success: false,
          error: 'HTTP request failed',
          details: {
            status: response.status,
            statusText: response.statusText,
            responseText: errorText,
            headers: Object.fromEntries(response.headers.entries())
          }
        }, { status: 500 })
      }
      
      console.log('✅ Direct HTTP request successful')
      
    } catch (httpError) {
      console.log('❌ Direct HTTP request failed:', httpError)
      return NextResponse.json({
        success: false,
        error: 'HTTP request exception',
        details: {
          message: httpError instanceof Error ? httpError.message : 'Unknown error',
          type: httpError instanceof Error ? httpError.constructor.name : typeof httpError
        }
      }, { status: 500 })
    }
    
    // Test 2: Try to create Supabase client manually
    console.log('🔧 Testing manual Supabase client creation...')
    
    try {
      const { createClient } = await import('@supabase/supabase-js')
      console.log('✅ Supabase package imported successfully')
      
      const client = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            'x-debug-source': 'campus-connect-debug'
          }
        }
      })
      
      console.log('✅ Client created, testing methods...')
      console.log('🔍 Client.from type:', typeof client.from)
      console.log('🔍 Client.auth type:', typeof client.auth)
      
      if (typeof client.from !== 'function') {
        throw new Error('Client.from is not a function')
      }
      
      // Test a simple query
      console.log('📊 Testing simple query...')
      const { data, error, count } = await client
        .from('users')
        .select('*', { count: 'exact', head: true })
      
      console.log('📊 Query result:', { 
        hasData: !!data, 
        hasError: !!error, 
        count,
        errorMessage: error?.message,
        errorCode: error?.code 
      })
      
      if (error) {
        // Don't treat this as a failure if it's just table not found
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.log('⚠️ Table does not exist, but connection is working')
          return NextResponse.json({
            success: true,
            message: 'Connection working, but users table needs to be created',
            details: {
              connectionWorking: true,
              tableExists: false,
              error: error.message
            }
          })
        } else {
          console.log('❌ Query failed:', error)
          return NextResponse.json({
            success: false,
            error: 'Database query failed',
            details: {
              connectionWorking: true,
              queryError: error.message,
              errorCode: error.code
            }
          }, { status: 500 })
        }
      }
      
      console.log('✅ All tests passed!')
      return NextResponse.json({
        success: true,
        message: 'All Supabase tests passed',
        details: {
          connectionWorking: true,
          tableExists: true,
          rowCount: count
        }
      })
      
    } catch (clientError) {
      console.log('❌ Client creation/test failed:', clientError)
      return NextResponse.json({
        success: false,
        error: 'Client creation failed',
        details: {
          message: clientError instanceof Error ? clientError.message : 'Unknown error',
          type: clientError instanceof Error ? clientError.constructor.name : typeof clientError,
          stack: clientError instanceof Error ? clientError.stack : undefined
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.log('🚨 Critical error in debug test:', error)
    return NextResponse.json({
      success: false,
      error: 'Critical debug test failure',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error,
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
}