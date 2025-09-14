import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🔍 === ENVIRONMENT VALIDATION START ===')
  
  try {
    // Collect all environment information
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      walletConnectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
    }
    
    console.log('🌐 Environment variables:', {
      NODE_ENV: envInfo.nodeEnv,
      SUPABASE_URL_PRESENT: !!envInfo.supabaseUrl,
      SUPABASE_URL_LENGTH: envInfo.supabaseUrl?.length || 0,
      SUPABASE_URL_STARTS_HTTPS: envInfo.supabaseUrl?.startsWith('https://'),
      SUPABASE_KEY_PRESENT: !!envInfo.supabaseKey,
      SUPABASE_KEY_LENGTH: envInfo.supabaseKey?.length || 0
    })
    
    // Validate Supabase URL format
    const urlValidation = {
      present: !!envInfo.supabaseUrl,
      format: 'unknown',
      domain: 'unknown',
      isSupabaseUrl: false
    }
    
    if (envInfo.supabaseUrl) {
      try {
        const url = new URL(envInfo.supabaseUrl)
        urlValidation.format = 'valid'
        urlValidation.domain = url.hostname
        urlValidation.isSupabaseUrl = url.hostname.includes('supabase.co')
      } catch {
        urlValidation.format = 'invalid'
      }
    }
    
    // Validate Supabase key format (should be JWT)
    const keyValidation = {
      present: !!envInfo.supabaseKey,
      format: 'unknown',
      isJWT: false,
      parts: 0
    }
    
    if (envInfo.supabaseKey) {
      const parts = envInfo.supabaseKey.split('.')
      keyValidation.parts = parts.length
      keyValidation.isJWT = parts.length === 3
      keyValidation.format = keyValidation.isJWT ? 'valid-jwt' : 'invalid-jwt'
    }
    
    // Check if all required variables are present
    const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
    const missingVars = requiredVars.filter(varName => !process.env[varName])
    
    const validation = {
      allRequired: missingVars.length === 0,
      missing: missingVars,
      url: urlValidation,
      key: keyValidation,
      timestamp: new Date().toISOString()
    }
    
    console.log('📊 Validation result:', validation)
    
    return NextResponse.json({
      success: validation.allRequired && urlValidation.format === 'valid' && keyValidation.isJWT,
      validation,
      environment: {
        nodeEnv: envInfo.nodeEnv,
        supabaseUrlSample: envInfo.supabaseUrl ? `${envInfo.supabaseUrl.substring(0, 30)}...` : 'NOT_SET',
        supabaseKeySample: envInfo.supabaseKey ? `${envInfo.supabaseKey.substring(0, 20)}...` : 'NOT_SET'
      },
      recommendations: [
        ...(!validation.allRequired ? [`Missing variables: ${missingVars.join(', ')}`] : []),
        ...(urlValidation.format !== 'valid' ? ['Fix Supabase URL format'] : []),
        ...(!keyValidation.isJWT ? ['Check Supabase API key format (should be JWT)'] : []),
        ...(!urlValidation.isSupabaseUrl ? ['Verify Supabase URL domain'] : [])
      ]
    })
    
  } catch (error) {
    console.error('🚨 Environment validation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Environment validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}