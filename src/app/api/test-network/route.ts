import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🌐 === NETWORK CONNECTIVITY TEST START ===')
    
    // Test basic internet connectivity
    const tests = []
    
    // Test 1: Basic HTTP request
    try {
      const response = await fetch('https://httpbin.org/json', {
        method: 'GET',
        headers: { 'User-Agent': 'Campus-Connect-Debug' }
      })
      tests.push({
        test: 'Basic HTTP',
        url: 'https://httpbin.org/json',
        status: response.status,
        success: response.ok
      })
      console.log('✅ Basic HTTP test passed')
    } catch (error) {
      tests.push({
        test: 'Basic HTTP',
        url: 'https://httpbin.org/json',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ Basic HTTP test failed:', error)
    }
    
    // Test 2: Supabase domain connectivity
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl) {
      try {
        const supabaseDomain = new URL(supabaseUrl).origin
        const response = await fetch(`${supabaseDomain}/rest/v1/`, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Campus-Connect-Debug'
          }
        })
        tests.push({
          test: 'Supabase Domain',
          url: `${supabaseDomain}/rest/v1/`,
          status: response.status,
          success: response.status < 500,
          headers: Object.fromEntries(response.headers.entries())
        })
        console.log('✅ Supabase domain test passed')
      } catch (error) {
        tests.push({
          test: 'Supabase Domain',
          url: supabaseUrl,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        console.log('❌ Supabase domain test failed:', error)
      }
    } else {
      tests.push({
        test: 'Supabase Domain',
        success: false,
        error: 'No Supabase URL configured'
      })
    }
    
    // Test 3: DNS resolution
    try {
      const dnsTest = await fetch('https://1.1.1.1/dns-query?name=supabase.co&type=A', {
        headers: {
          'Accept': 'application/dns-json'
        }
      })
      const dnsResult = await dnsTest.json()
      tests.push({
        test: 'DNS Resolution',
        target: 'supabase.co',
        success: dnsResult.Status === 0,
        answers: dnsResult.Answer?.length || 0
      })
      console.log('✅ DNS test passed')
    } catch (error) {
      tests.push({
        test: 'DNS Resolution',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ DNS test failed:', error)
    }
    
    const allPassed = tests.every(test => test.success)
    
    console.log('🏁 === NETWORK CONNECTIVITY TEST COMPLETE ===')
    console.log('📊 Results:', tests)
    
    return NextResponse.json({
      success: allPassed,
      timestamp: new Date().toISOString(),
      tests,
      summary: {
        total: tests.length,
        passed: tests.filter(t => t.success).length,
        failed: tests.filter(t => !t.success).length
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    })
    
  } catch (error) {
    console.error('🚨 Network test exception:', error)
    return NextResponse.json({
      success: false,
      error: 'Network test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}