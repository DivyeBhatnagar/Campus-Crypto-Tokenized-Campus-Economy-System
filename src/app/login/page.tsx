'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Simple UI components for login page
function SimpleInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  icon: Icon, 
  showPasswordToggle = false,
  onTogglePassword,
  showPassword = false,
  ...props 
}: any) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text/50" />
        )}
        <input
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-10' : 'pr-4'} py-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200 text-text placeholder-text/50`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/50 hover:text-text transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-accent flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}

function SimpleButton({ children, loading = false, className = '', ...props }: any) {
  return (
    <button
      className={`w-full bg-primary text-white py-3 px-6 rounded-xl font-medium shadow-neumorphic hover:shadow-neumorphic-lg focus:shadow-neumorphic-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

function SimpleCard({ children, className = '', ...props }: any) {
  return (
    <div className={`bg-background rounded-2xl p-8 shadow-neumorphic ${className}`} {...props}>
      {children}
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setErrors({ submit: error.message });
      } else {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred during login' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-neumorphic"
          >
            <LogIn className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-text mb-2">Welcome Back</h1>
          <p className="text-text/70">Sign in to your Campus Economy account</p>
        </div>

        {/* Login Form */}
        <SimpleCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <SimpleInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              error={errors.email}
              icon={Mail}
              placeholder="Enter your email"
              required
            />

            <SimpleInput
              label="Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
              placeholder="Enter your password"
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              required
            />

            {errors.submit && (
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                <p className="text-accent text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.submit}
                </p>
              </div>
            )}

            <SimpleButton type="submit" loading={isLoading}>
              Sign In
            </SimpleButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text/70">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link 
              href="/" 
              className="text-text/50 hover:text-text transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </SimpleCard>
      </motion.div>
    </div>
  );
}