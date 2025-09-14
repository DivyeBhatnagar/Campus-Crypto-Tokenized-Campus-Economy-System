import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('🧪 === COMPREHENSIVE SUPABASE DIAGNOSTICS START ===')
    
    // Check environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('🌐 Raw Env URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔑 Raw Env Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing')
    console.log('🌐 Processed URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET')
    console.log('🔑 Processed Key:', supabaseKey ? `${supabaseKey.substring(0, 30)}...` : 'NOT SET')
    
    // Validate environment variables
    if (!supabaseUrl || !supabaseKey) {
      const error = `Missing environment variables: ${!supabaseUrl ? 'SUPABASE_URL ' : ''}${!supabaseKey ? 'SUPABASE_KEY' : ''}`
      console.error('🚨 Environment Error:', error)
      return NextResponse.json({
        success: false,
        error: 'Environment variables not configured',
        details: error,
        diagnostics: {
          step: 'Environment Check',
          urlPresent: !!supabaseUrl,
          keyPresent: !!supabaseKey,
          nodeEnv: process.env.NODE_ENV
        }
      }, { status: 500 })
    }
    
    // Validate URL format
    if (!supabaseUrl.startsWith('https://')) {
      console.error('🚨 Invalid URL format:', supabaseUrl)
      return NextResponse.json({
        success: false,
        error: 'Invalid Supabase URL format',
        details: `URL must start with https://, got: ${supabaseUrl}`,
        diagnostics: {
          step: 'URL Validation',
          url: supabaseUrl
        }
      }, { status: 500 })
    }
    
    // Test network connectivity first
    console.log('🌍 Testing network connectivity to Supabase...')
    try {
      const networkTest = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      console.log('✅ Network test response status:', networkTest.status)
      console.log('✅ Network test headers:', Object.fromEntries(networkTest.headers.entries()))
    } catch (networkError) {
      console.error('❌ Network test failed:', networkError)
      return NextResponse.json({
        success: false,
        error: 'Network connectivity failed',
        details: networkError instanceof Error ? networkError.message : 'Unknown network error',
        diagnostics: {
          step: 'Network Test',
          url: `${supabaseUrl}/rest/v1/`,
          errorType: networkError instanceof Error ? networkError.constructor.name : 'Unknown'
        }
      }, { status: 500 })
    }
    
    // Create Supabase client with detailed logging
    console.log('📊 Creating Supabase client...')
    let supabase
    try {
      supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
      console.log('✅ Supabase client created successfully')
      
      // Validate client methods
      if (!supabase || typeof supabase.from !== 'function') {
        throw new Error('Supabase client is malformed - missing from() method')
      }
      
      if (!supabase.auth || typeof supabase.auth.getUser !== 'function') {
        throw new Error('Supabase client is malformed - missing auth methods')
      }
      
      console.log('✅ Supabase client validation passed')
      
    } catch (clientError) {
      console.error('🚨 Client creation failed:', clientError)
      return NextResponse.json({
        success: false,
        error: 'Failed to initialize Supabase client',
        details: clientError instanceof Error ? clientError.message : 'Unknown client error',
        diagnostics: {
          step: 'Client Creation',
          errorType: clientError instanceof Error ? clientError.constructor.name : 'Unknown'
        }
      }, { status: 500 })
    }
    
    // Test database connection with timeout
    console.log('📊 Testing database connection with timeout...')
    try {
      const dbTestPromise = supabase
        .from('users')
        .select('count')
        .limit(1)
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout (10s)')), 10000)
      )
      
      const { data: testData, error: testError } = await Promise.race([
        dbTestPromise,
        timeoutPromise
      ]) as any
      
      if (testError) {
        console.error('❌ Database connection failed:', testError)
        return NextResponse.json({
          success: false,
          error: 'Database connection failed',
          details: testError.message,
          diagnostics: {
            step: 'Database Connection',
            errorCode: testError.code,
            errorHint: testError.hint,
            errorDetails: testError.details
          }
        }, { status: 500 })
      }
      
      console.log('✅ Database connection successful, response:', testData)
      
    } catch (dbError) {
      console.error('❌ Database connection exception:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Database connection exception',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error',
        diagnostics: {
          step: 'Database Connection',
          errorType: dbError instanceof Error ? dbError.constructor.name : 'Unknown'
        }
      }, { status: 500 })
    }
    
    // Test auth service
    console.log('🔐 Testing auth service...')
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('✅ Auth test completed, user:', user ? 'User present' : 'No user')
      if (authError) {
        console.log('⚠️ Auth test error (expected for unauthenticated):', authError.message)
      }
    } catch (authException) {
      console.error('❌ Auth service exception:', authException)
      return NextResponse.json({
        success: false,
        error: 'Auth service failed',
        details: authException instanceof Error ? authException.message : 'Unknown auth error',
        diagnostics: {
          step: 'Auth Service Test',
          errorType: authException instanceof Error ? authException.constructor.name : 'Unknown'
        }
      }, { status: 500 })
    }
    
    // Success response with comprehensive diagnostics
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      diagnostics: {
        environmentVariables: {
          supabaseUrl: !!supabaseUrl,
          supabaseKey: !!supabaseKey,
          nodeEnv: process.env.NODE_ENV
        },
        networkConnectivity: true,
        clientInitialization: true,
        databaseConnection: true,
        authService: true
      },
      environment: {
        supabaseUrl: `${supabaseUrl.substring(0, 40)}...`,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    }
    
    console.log('🎉 === ALL DIAGNOSTICS PASSED ===')
    console.log('📊 Final result:', result)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('🚨 === CRITICAL DIAGNOSTICS FAILURE ===')
    console.error('💬 Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('🔍 Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('🆔 Error type:', error instanceof Error ? error.constructor.name : typeof error)
    
    return NextResponse.json({
      success: false,
      error: 'Critical diagnostics failure',
      details: error instanceof Error ? error.message : 'Unknown error',
      diagnostics: {
        step: 'Critical Failure',
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}