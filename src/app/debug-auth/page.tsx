'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { supabase, authHelpers } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function DebugAuthPage() {
  const { user, signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [debugResult, setDebugResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCheckUser = async () => {
    setLoading(true)
    try {
      console.log('🔍 Checking user status for:', email)
      const result = await authHelpers.debugUserStatus(email)
      setDebugResult(result)
    } catch (error) {
      console.error('Error checking user:', error)
      setDebugResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading(false)
  }

  const handleTestSignup = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing signup for:', email)
      const result = await signUp(email, password, { 
        name: name || 'Test User', 
        role: 'student' 
      })
      setDebugResult(result)
    } catch (error) {
      console.error('Error testing signup:', error)
      setDebugResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading(false)
  }

  const handleTestSignin = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing signin for:', email)
      const result = await signIn(email, password)
      setDebugResult(result)
    } catch (error) {
      console.error('Error testing signin:', error)
      setDebugResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading(false)
  }

  const handleResetUser = async () => {
    setLoading(true)
    try {
      console.log('🔄 Requesting user reset for:', email)
      const response = await fetch('/api/fix-authentication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, action: 'reset_user' }),
      })
      const result = await response.json()
      setDebugResult(result)
    } catch (error) {
      console.error('Error resetting user:', error)
      setDebugResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading(false)
  }

  const handleCheckConnection = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing database connection...')
      const result = await authHelpers.testConnection()
      setDebugResult(result)
    } catch (error) {
      console.error('Error testing connection:', error)
      setDebugResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading(false)
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug Tool</CardTitle>
          <CardDescription>
            Debug and troubleshoot authentication issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name (for signup)</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Test User"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleCheckUser} disabled={loading || !email}>
              Check User Status
            </Button>
            <Button onClick={handleTestSignup} disabled={loading || !email || !password}>
              Test Signup
            </Button>
            <Button onClick={handleTestSignin} disabled={loading || !email || !password}>
              Test Signin
            </Button>
            <Button onClick={handleResetUser} disabled={loading || !email} variant="destructive">
              Reset User (Public Profile Only)
            </Button>
            <Button onClick={handleCheckConnection} disabled={loading}>
              Test Database Connection
            </Button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Debug Results</h3>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-auto max-h-60">
                {JSON.stringify(debugResult, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Current User Status</h3>
            <div className="bg-muted p-4 rounded-lg">
              {user ? (
                <div>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </div>
              ) : (
                <p>No user currently signed in</p>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Troubleshooting Steps</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p>1. Check if the Email provider is enabled in your Supabase Authentication settings</p>
              <p>2. Verify that "Confirm email" is disabled for development if needed</p>
              <p>3. Ensure your environment variables are correctly set:</p>
              <ul className="list-disc pl-5">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
              <p>4. Check that your database schema is properly set up by running the SQL script</p>
              <p>5. Verify that the auth trigger is working correctly</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}