'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Hash, GraduationCap, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Simple UI components for signup page (reusing from login)
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

function SimpleSelect({ label, value, onChange, error, icon: Icon, options, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text/50" />
        )}
        <select
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200 text-text appearance-none`}
          {...props}
        >
          <option value="">Select {label}</option>
          {options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: '',
    department: '',
    year: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const router = useRouter();

  const departments = [
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business Administration' },
    { value: 'arts', label: 'Liberal Arts' },
    { value: 'sciences', label: 'Natural Sciences' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'law', label: 'Law' },
    { value: 'education', label: 'Education' }
  ];

  const years = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
    { value: '5', label: '5th Year' },
    { value: 'graduate', label: 'Graduate' }
  ];

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.studentId) {
      newErrors.studentId = 'Student ID is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const userData = {
        full_name: formData.fullName,
        student_id: formData.studentId,
        department: formData.department,
        year: parseInt(formData.year) || null,
        role: 'student',
        campus_coin_balance: 0,
        total_earned: 0,
        total_spent: 0,
        is_active: true
      };

      const { data, error } = await signUp(formData.email, formData.password, userData);
      
      if (error) {
        setErrors({ submit: error.message });
      } else {
        // If signup successful and user exists (either real or demo), redirect to dashboard
        if (data.user) {
          router.push('/dashboard');
        } else {
          // Fallback - should not happen with proper signup
          router.push('/login?message=Account created successfully. Please log in.');
        }
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred during signup' });
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
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-neumorphic"
          >
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-text mb-2">Join Campus Economy</h1>
          <p className="text-text/70">Create your account to start earning tokens</p>
        </div>

        {/* Signup Form */}
        <SimpleCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SimpleInput
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                error={errors.fullName}
                icon={User}
                placeholder="Enter your full name"
                required
              />

              <SimpleInput
                label="Student ID"
                value={formData.studentId}
                onChange={handleChange('studentId')}
                error={errors.studentId}
                icon={Hash}
                placeholder="Enter your student ID"
                required
              />
            </div>

            <SimpleInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              icon={Mail}
              placeholder="Enter your email"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SimpleSelect
                label="Department"
                value={formData.department}
                onChange={handleChange('department')}
                error={errors.department}
                icon={GraduationCap}
                options={departments}
                required
              />

              <SimpleSelect
                label="Year"
                value={formData.year}
                onChange={handleChange('year')}
                error={errors.year}
                icon={GraduationCap}
                options={years}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SimpleInput
                label="Password"
                value={formData.password}
                onChange={handleChange('password')}
                error={errors.password}
                icon={Lock}
                placeholder="Create a password"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
              />

              <SimpleInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={errors.confirmPassword}
                icon={Lock}
                placeholder="Confirm your password"
                showPasswordToggle
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                required
              />
            </div>

            {errors.submit && (
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                <p className="text-accent text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.submit}
                </p>
              </div>
            )}

            <SimpleButton type="submit" loading={isLoading}>
              Create Account
            </SimpleButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text/70">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in here
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