'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { useAuth } from '@/hooks/useAuth'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  User,
  Shield
} from "lucide-react"

const passwordRequirements = [
  { text: "At least 8 characters", regex: /.{8,}/ },
  { text: "One uppercase letter", regex: /[A-Z]/ },
  { text: "One lowercase letter", regex: /[a-z]/ },
  { text: "One number", regex: /\d/ },
  { text: "One special character", regex: /[^A-Za-z0-9]/ }
]

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, signInWithOAuth } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "admin",
    acceptTerms: false
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [step, setStep] = React.useState(1)
  const [debugInfo, setDebugInfo] = React.useState({
    supabaseConnected: false,
    connectionDetails: null as any,
    environmentValid: false,
    environmentDetails: null as any,
    directConnectionTest: null as any,
    userExists: null,
    profileCreated: false,
    signupAttempted: false,
    lastError: null
  })

  // Debug current state
  React.useEffect(() => {
    console.log('Current step:', step)
    console.log('Form data:', formData)
    
    // Test Supabase connection on component mount
    if (step === 1) {
      const testConnection = async () => {
        try {
          console.log('🧪 === COMPREHENSIVE CONNECTION TESTING START ===')
          
          // Test 1: Environment validation
          console.log('🌐 Step 1: Validating environment variables...')
          try {
            const envResponse = await fetch('/api/validate-env')
            const envResult = await envResponse.json()
            console.log('📊 Environment validation result:', envResult)
            
            setDebugInfo(prev => ({ 
              ...prev, 
              environmentValid: envResult.success,
              environmentDetails: envResult
            }))
            
            if (!envResult.success) {
              console.error('❌ Environment validation failed:', envResult.recommendations)
              return
            }
          } catch (envError) {
            console.error('🚨 Environment validation exception:', envError)
            setDebugInfo(prev => ({ 
              ...prev, 
              environmentValid: false,
              environmentDetails: { error: 'Failed to validate environment' }
            }))
            return
          }
          
          // Test 2: Direct Supabase connection
          console.log('🔌 Step 2: Testing direct Supabase connection...')
          try {
            const directResponse = await fetch('/api/debug-supabase')
            const directResult = await directResponse.json()
            console.log('📊 Direct connection result:', directResult)
            
            setDebugInfo(prev => ({ 
              ...prev, 
              directConnectionTest: directResult
            }))
            
            if (!directResult.success) {
              console.error('❌ Direct connection failed:', directResult.details)
              // Still continue to test the main endpoint
            }
          } catch (directError) {
            console.error('🚨 Direct connection exception:', directError)
            setDebugInfo(prev => ({ 
              ...prev, 
              directConnectionTest: { error: 'Failed to test direct connection' }
            }))
          }
          
          // Test 3: Main Supabase endpoint
          console.log('📊 Step 3: Testing main Supabase endpoint...')
          const response = await fetch('/api/test-supabase', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          console.log('📊 API Response status:', response.status)
          console.log('📊 API Response ok:', response.ok)
          
          if (!response.ok) {
            console.error('❌ API request failed with status:', response.status)
            const errorText = await response.text()
            console.error('❌ Error response:', errorText)
            
            setDebugInfo(prev => ({ 
              ...prev, 
              supabaseConnected: false,
              connectionDetails: {
                success: false,
                error: `API request failed (${response.status})`,
                details: errorText
              }
            }))
            return
          }
          
          const result = await response.json()
          console.log('📊 === MAIN ENDPOINT TEST RESULT ===')
          console.log('✅ API Response:', result)
          
          setDebugInfo(prev => ({ 
            ...prev, 
            supabaseConnected: result.success && result.diagnostics?.databaseConnection,
            connectionDetails: result
          }))
          
          if (!result.success) {
            console.error('❌ Main endpoint test failed:')
            console.error('💬 Error:', result.error)
            console.error('📋 Details:', result.details)
            console.error('🔍 Diagnostics:', result.diagnostics)
          } else {
            console.log('✅ === ALL CONNECTION TESTS SUCCESSFUL ===')
            console.log('📊 Environment variables:', result.diagnostics.environmentVariables)
            console.log('🌍 Network connectivity:', result.diagnostics.networkConnectivity)
            console.log('📊 Database connection:', result.diagnostics.databaseConnection)
          }
          
        } catch (err) {
          console.error('🚨 === COMPREHENSIVE CONNECTION TEST EXCEPTION ===')
          console.error('💬 Exception message:', err)
          console.error('🆔 Exception type:', err instanceof Error ? err.constructor.name : typeof err)
          
          if (err instanceof Error) {
            console.error('🔍 Stack trace:', err.stack)
          }
          
          setDebugInfo(prev => ({ 
            ...prev, 
            supabaseConnected: false,
            connectionDetails: { 
              success: false,
              error: 'Comprehensive connection test failed',
              details: err instanceof Error ? err.message : 'Unknown frontend error',
              step: 'Frontend Request'
            }
          }))
        }
      }
      testConnection()
    }
  }, [step, formData])

  const handleChange = (field: string, value: string | boolean) => {
    console.log(`Field '${field}' changed to:`, value)
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      console.log('Updated form data:', newData)
      return newData
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    console.log('🚀 === COMPREHENSIVE SIGNUP DEBUG START ===')
    console.log('📧 Email:', formData.email)
    console.log('🔐 Password length:', formData.password?.length || 0)
    console.log('👤 Full name:', `${formData.firstName} ${formData.lastName}`)
    console.log('🎩 Role:', formData.role)
    console.log('✅ Accept terms:', formData.acceptTerms)
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      console.error('❌ Password mismatch validation failed')
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const failedRequirements = passwordRequirements.filter(req => !req.regex.test(formData.password))
    if (failedRequirements.length > 0) {
      console.error('❌ Password requirements validation failed:', failedRequirements.map(r => r.label))
      setError("Password does not meet all requirements")
      setIsLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      console.error('❌ Terms acceptance validation failed')
      setError("Please accept the Terms of Service and Privacy Policy")
      setIsLoading(false)
      return
    }
    
    console.log('✅ All form validations passed')

    try {
      console.log('🚀 Calling signUp function...')
      setDebugInfo(prev => ({ ...prev, signupAttempted: true, lastError: null }))
      
      const { error } = await signUp(formData.email, formData.password, {
        name: `${formData.firstName} ${formData.lastName}`,
        role: formData.role
      })
      
      console.log('📊 === SIGNUP FUNCTION RESULT ===')
      console.log('❌ Has error:', !!error)
      
      if (error) {
        console.error('🚨 === SIGNUP ERROR DETAILS ===')
        console.error('💬 Error message:', error.message)
        console.error('🔢 Error code:', error.code || 'NO_CODE')
        console.error('📊 Error status:', error.status || 'NO_STATUS')
        console.error('🔍 Full error object:', error)
        
        // Enhanced error diagnostics
        let userFriendlyMessage = error.message || "Something went wrong. Please try again."
        
        if (error.message?.includes('email address not authorized')) {
          console.error('🔴 ERROR TYPE: Email provider disabled')
          userFriendlyMessage = "Email signup is currently disabled. Please contact support or try OAuth login."
        } else if (error.message?.includes('Invalid login credentials')) {
          console.error('🔴 ERROR TYPE: Invalid credentials format')
          userFriendlyMessage = "Invalid email or password format. Please check and try again."
        } else if (error.message?.includes('User already registered') || error.message?.includes('user with this email already exists')) {
          console.error('🔴 ERROR TYPE: User already exists')
          userFriendlyMessage = (
            <div className="space-y-2">
              <p>An account with this email already exists.</p>
              <div className="flex space-x-2 mt-3">
                <Link href="/login">
                  <Button variant="primary" size="sm">
                    Sign In Instead
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, email: '' }))
                    setError('')
                    setStep(1)
                  }}
                >
                  Try Different Email
                </Button>
              </div>
            </div>
          )
        } else if (error.message?.includes('weak password')) {
          console.error('🔴 ERROR TYPE: Weak password')
          userFriendlyMessage = "Password is too weak. Please choose a stronger password."
        } else if (error.message?.includes('network')) {
          console.error('🔴 ERROR TYPE: Network issue')
          userFriendlyMessage = "Network connection issue. Please check your internet and try again."
        } else if (error.message?.includes('configuration')) {
          console.error('🔴 ERROR TYPE: Configuration issue')
          userFriendlyMessage = "System configuration issue. Please contact support."
        }
        
        setError(userFriendlyMessage)
        setDebugInfo(prev => ({ ...prev, lastError: error.message }))
      } else {
        console.log('✅ === SIGNUP SUCCESSFUL ===')
        console.log('🎯 Redirecting to dashboard...')
        setDebugInfo(prev => ({ ...prev, profileCreated: true }))
        
        // Small delay to ensure everything is processed
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (err: any) {
      console.error('🚨 === SIGNUP EXCEPTION ===')
      console.error('💬 Exception message:', err?.message || 'Unknown error')
      console.error('🆔 Exception type:', err instanceof Error ? err.constructor.name : typeof err)
      console.error('🔍 Full exception:', err)
      
      setError(err.message || "Something went wrong. Please try again.")
      setDebugInfo(prev => ({ ...prev, lastError: err.message }))
    } finally {
      setIsLoading(false)
      console.log('🏁 === SIGNUP DEBUG END ===')
    }
  }

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    try {
      console.log(`Starting ${provider} OAuth signup...`)
      setError("")
      const { error } = await signInWithOAuth(provider)
      if (error) {
        console.error(`${provider} OAuth error:`, error)
        setError(error.message || `Failed to sign up with ${provider}. Please try again.`)
      } else {
        console.log(`${provider} OAuth signup initiated successfully`)
      }
      // Note: OAuth will redirect to dashboard on success
    } catch (err: any) {
      console.error(`${provider} OAuth exception:`, err)
      setError(err.message || `Failed to sign up with ${provider}. Please try again.`)
    }
  }

  const getPasswordStrength = () => {
    const metRequirements = passwordRequirements.filter(req => req.regex.test(formData.password)).length
    if (metRequirements === 0) return { label: "", color: "", width: "0%" }
    if (metRequirements <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" }
    if (metRequirements <= 4) return { label: "Medium", color: "bg-orange-500", width: "66%" }
    return { label: "Strong", color: "bg-green-500", width: "100%" }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="neumorphic-card flex h-12 w-12 items-center justify-center rounded-xl bg-primary p-2">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Campus Coin</span>
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of 2</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 2) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 shadow-neumorphic-inset">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Signup Form */}
        <Card className="shadow-neumorphic-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join Campus Coin</CardTitle>
            <CardDescription>
              {step === 1 ? "Create your account to get started" : "Set up your security credentials"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      {typeof error === 'string' ? error : error}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <>
                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => {
                        console.log('First Name input changed:', e.target.value)
                        handleChange("firstName", e.target.value)
                      }}
                      required
                    />
                    <Input
                      label="Last Name"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => {
                        console.log('Last Name input changed:', e.target.value)
                        handleChange("lastName", e.target.value)
                      }}
                      required
                    />
                  </div>

                  <Input
                    label="University Email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    value={formData.email}
                    onChange={(e) => {
                      console.log('Email input changed:', e.target.value)
                      handleChange("email", e.target.value)
                    }}
                    icon={<Mail className="h-4 w-4" />}
                    required
                  />

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Account Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleChange("role", "student")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.role === "student" 
                            ? "border-primary bg-primary/5 shadow-neumorphic-pressed" 
                            : "border-border shadow-neumorphic-sm hover:shadow-neumorphic"
                        }`}
                      >
                        <User className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium text-foreground">Student</div>
                        <div className="text-xs text-muted-foreground">Access student features</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("role", "admin")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.role === "admin" 
                            ? "border-primary bg-primary/5 shadow-neumorphic-pressed" 
                            : "border-border shadow-neumorphic-sm hover:shadow-neumorphic"
                        }`}
                      >
                        <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium text-foreground">Admin</div>
                        <div className="text-xs text-muted-foreground">Manage platform</div>
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="button"
                    onClick={() => {
                      console.log('Continue button clicked, current form data:', formData)
                      console.log('Validation check:', {
                        firstName: !!formData.firstName,
                        lastName: !!formData.lastName,
                        email: !!formData.email,
                        firstNameValue: formData.firstName,
                        lastNameValue: formData.lastName,
                        emailValue: formData.email
                      })
                      console.log('Button should be disabled?', !formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim())
                      setStep(2)
                      console.log('Step set to 2')
                    }}
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    disabled={!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim()}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {/* Debug info for button state */}
                  <div className="text-xs text-foreground mt-4 p-3 bg-muted/10 border border-border rounded-lg">
                    <div className="font-semibold mb-2 text-foreground">🐛 DEBUG INFO:</div>
                    <div className="space-y-1">
                      <div>Button disabled = <span className="font-mono">{String(!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim())}</span></div>
                      <div>FirstName: "<span className="font-mono">{formData.firstName}</span>" (trimmed: "<span className="font-mono">{formData.firstName?.trim()}</span>") <span className="text-lg">{formData.firstName?.trim() ? '✓' : '✗'}</span></div>
                      <div>LastName: "<span className="font-mono">{formData.lastName}</span>" (trimmed: "<span className="font-mono">{formData.lastName?.trim()}</span>") <span className="text-lg">{formData.lastName?.trim() ? '✓' : '✗'}</span></div>
                      <div>Email: "<span className="font-mono">{formData.email}</span>" (trimmed: "<span className="font-mono">{formData.email?.trim()}</span>") <span className="text-lg">{formData.email?.trim() ? '✓' : '✗'}</span></div>
                    </div>
                  </div>
                  
                  {/* Enhanced Debug Panel */}
                  <div className="text-xs text-foreground mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-semibold mb-2 text-blue-900">🔍 COMPREHENSIVE SYSTEM STATUS:</div>
                    <div className="space-y-1 text-blue-800">
                      <div className="font-semibold">Connection Status:</div>
                      <div className="ml-2">Supabase Connected: <span className={debugInfo.supabaseConnected ? 'text-green-600' : 'text-red-600'}>{debugInfo.supabaseConnected ? '✓ Yes' : '✗ No'}</span></div>
                      
                      {/* Auto-Fix Button */}
                      {!debugInfo.supabaseConnected && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                          <div className="font-semibold text-red-800 mb-2">⚠️ Database Issues Detected</div>
                          <button
                            type="button"
                            onClick={async () => {
                              console.log('🔧 Running auto-fix...')
                              try {
                                const response = await fetch('/api/fix-signup', { method: 'POST' })
                                const result = await response.json()
                                console.log('🔧 Auto-fix result:', result)
                                
                                if (result.success) {
                                  alert('✅ Database issues resolved! Please try signing up again.')
                                  window.location.reload()
                                } else {
                                  alert(`❌ Auto-fix failed: ${result.error}\n\nPlease run the database script manually.`)
                                }
                              } catch (err) {
                                console.error('🚨 Auto-fix error:', err)
                                alert('❌ Auto-fix failed. Please check console for details.')
                              }
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          >
                            🔧 Auto-Fix Database Issues
                          </button>
                        </div>
                      )}
                      
                      {debugInfo.connectionDetails && (
                        <div className="ml-2 mt-2 p-2 bg-white rounded border text-xs">
                          <div className="font-semibold text-gray-700">🔍 Detailed Diagnostics:</div>
                          
                          {debugInfo.connectionDetails.success ? (
                            <div className="text-green-700 space-y-1">
                              <div className="font-semibold">✅ All Systems Operational:</div>
                              
                              {debugInfo.connectionDetails.diagnostics && (
                                <div className="ml-4 space-y-1">
                                  <div>✅ Environment Variables: {debugInfo.connectionDetails.diagnostics.environmentVariables?.supabaseUrl && debugInfo.connectionDetails.diagnostics.environmentVariables?.supabaseKey ? 'Set' : 'Missing'}</div>
                                  <div>✅ Network Connectivity: {debugInfo.connectionDetails.diagnostics.networkConnectivity ? 'Connected' : 'Failed'}</div>
                                  <div>✅ Client Initialization: {debugInfo.connectionDetails.diagnostics.clientInitialization ? 'Success' : 'Failed'}</div>
                                  <div>✅ Database Connection: {debugInfo.connectionDetails.diagnostics.databaseConnection ? 'Connected' : 'Failed'}</div>
                                  <div>✅ Auth Service: {debugInfo.connectionDetails.diagnostics.authService ? 'Working' : 'Failed'}</div>
                                  
                                  {debugInfo.connectionDetails.environment && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <div className="font-semibold">🌐 Environment Info:</div>
                                      <div>Node Env: {debugInfo.connectionDetails.environment.nodeEnv}</div>
                                      <div>Timestamp: {new Date(debugInfo.connectionDetails.environment.timestamp).toLocaleTimeString()}</div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-red-700 space-y-1">
                              <div className="font-semibold">❌ Connection Failed:</div>
                              <div className="ml-4">
                                <div>🚨 Error: {debugInfo.connectionDetails.error}</div>
                                {debugInfo.connectionDetails.details && (
                                  <div>💬 Details: {debugInfo.connectionDetails.details}</div>
                                )}
                                {debugInfo.connectionDetails.diagnostics && (
                                  <div>🔍 Failed at step: {debugInfo.connectionDetails.diagnostics.step}</div>
                                )}
                                
                                {/* Show specific diagnostic info for failed connection */}
                                {debugInfo.connectionDetails.diagnostics && (
                                  <div className="mt-2 pt-2 border-t border-red-200">
                                    <div className="font-semibold">🔍 Diagnostic Details:</div>
                                    {debugInfo.connectionDetails.diagnostics.environmentVariables && (
                                      <div>Environment: URL {debugInfo.connectionDetails.diagnostics.environmentVariables.supabaseUrl ? '✓' : '✗'}, Key {debugInfo.connectionDetails.diagnostics.environmentVariables.supabaseKey ? '✓' : '✗'}</div>
                                    )}
                                    {debugInfo.connectionDetails.diagnostics.errorType && (
                                      <div>Error Type: {debugInfo.connectionDetails.diagnostics.errorType}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-3 pt-2 border-t border-blue-200">
                        <div className="font-semibold">Signup Process Status:</div>
                        <div className="ml-2 space-y-1">
                          <div>User Exists Check: <span className={debugInfo.userExists === null ? 'text-gray-600' : debugInfo.userExists ? 'text-orange-600' : 'text-green-600'}>{debugInfo.userExists === null ? '⏳ Not checked' : debugInfo.userExists ? '⚠️ User exists' : '✓ Email available'}</span></div>
                          <div>Signup Attempted: <span className={debugInfo.signupAttempted ? 'text-blue-600' : 'text-gray-600'}>{debugInfo.signupAttempted ? '✓ Yes' : '⏳ Not yet'}</span></div>
                          <div>Profile Created: <span className={debugInfo.profileCreated ? 'text-green-600' : 'text-gray-600'}>{debugInfo.profileCreated ? '✓ Yes' : '⏳ Not yet'}</span></div>
                          {debugInfo.lastError && <div>Last Error: <span className="text-red-600 font-mono text-xs">{debugInfo.lastError}</span></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Password Setup */}
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      icon={<Lock className="h-4 w-4" />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Password Strength</span>
                        {passwordStrength.label && (
                          <Badge 
                            variant={passwordStrength.label === "Strong" ? "success" : passwordStrength.label === "Medium" ? "secondary" : "destructive"}
                            size="sm"
                          >
                            {passwordStrength.label}
                          </Badge>
                        )}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 shadow-neumorphic-inset">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Password Requirements:</span>
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => {
                          const isMet = req.regex.test(formData.password)
                          return (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className={`h-3 w-3 ${isMet ? "text-green-500" : "text-muted-foreground"}`} />
                              <span className={isMet ? "text-green-600" : "text-muted-foreground"}>
                                {req.text}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      icon={<Lock className="h-4 w-4" />}
                      error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords do not match" : ""}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                      className="neumorphic-input h-4 w-4 rounded border-0 text-primary focus:ring-primary"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:text-primary/80">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:text-primary/80">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline" 
                      size="lg" 
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="flex-1"
                      loading={isLoading}
                      disabled={isLoading || !formData.acceptTerms || !formData.password || !formData.confirmPassword}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                  
                  {/* Debug info for step 2 */}
                  <div className="text-xs text-foreground mt-4 p-3 bg-muted/10 border border-border rounded-lg">
                    <div className="font-semibold mb-2 text-foreground">🐛 STEP 2 DEBUG:</div>
                    <div className="space-y-1">
                      <div>Submit button disabled = <span className="font-mono">{String(isLoading || !formData.acceptTerms || !formData.password || !formData.confirmPassword)}</span></div>
                      <div>Loading: <span className={isLoading ? 'text-orange-600' : 'text-green-600'}>{isLoading ? '⏳ Yes' : '✓ No'}</span></div>
                      <div>Terms accepted: <span className={formData.acceptTerms ? 'text-green-600' : 'text-red-600'}>{formData.acceptTerms ? '✓ Yes' : '✗ No'}</span></div>
                      <div>Password: "<span className="font-mono">{formData.password ? '*'.repeat(formData.password.length) : ''}</span>" <span className={formData.password ? 'text-green-600' : 'text-red-600'}>{formData.password ? '✓' : '✗'}</span></div>
                      <div>Confirm Password: "<span className="font-mono">{formData.confirmPassword ? '*'.repeat(formData.confirmPassword.length) : ''}</span>" <span className={formData.confirmPassword ? 'text-green-600' : 'text-red-600'}>{formData.confirmPassword ? '✓' : '✗'}</span></div>
                      <div>Passwords match: <span className={formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}>{formData.password === formData.confirmPassword ? '✓ Yes' : '✗ No'}</span></div>
                    </div>
                  </div>
                </>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-6 flex items-center">
              <div className="flex-1 border-t border-border/40"></div>
              <div className="px-4 text-sm text-muted-foreground">Or continue with</div>
              <div className="flex-1 border-t border-border/40"></div>
            </div>

            {/* Social Signup Options */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleOAuthSignUp('google')}
                type="button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleOAuthSignUp('github')}
                type="button"
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}