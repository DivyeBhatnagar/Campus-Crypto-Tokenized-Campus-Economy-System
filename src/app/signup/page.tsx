'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { useAuth } from '@/hooks/useAuth'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap,
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

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const failedRequirements = passwordRequirements.filter(req => !req.regex.test(formData.password))
    if (failedRequirements.length > 0) {
      setError("Password does not meet all requirements")
      setIsLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError("Please accept the Terms of Service and Privacy Policy")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        name: `${formData.firstName} ${formData.lastName}`,
        role: formData.role
      })
      
      if (error) {
        let userFriendlyMessage = error.message || "Something went wrong. Please try again."
        
        if (error.message?.includes('User already registered') || error.message?.includes('user with this email already exists')) {
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
                  }}
                >
                  Try Different Email
                </Button>
              </div>
            </div>
          )
        }
        
        setError(userFriendlyMessage)
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    try {
      setError("")
      const { error } = await signInWithOAuth(provider)
      if (error) {
        setError(error.message || `Failed to sign up with ${provider}. Please try again.`)
      }
    } catch (err: any) {
      setError(err.message || `Failed to sign up with ${provider}. Please try again.`)
    }
  }

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

        {/* Signup Form */}
        <Card className="shadow-neumorphic-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join Campus Coin</CardTitle>
            <CardDescription>
              Create your account to get started
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

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                />
              </div>

              <Input
                label="University Email"
                type="email"
                placeholder="john.doe@university.edu"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
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

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full"
                loading={isLoading}
                disabled={isLoading || !formData.acceptTerms || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.email}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
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