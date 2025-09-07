'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Trophy, 
  TrendingUp, 
  Activity, 
  Eye,
  Send,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dbHelpers, Transaction } from '@/lib/supabase';

// Simple UI components for dashboard
function SimpleCard({ children, className = '', ...props }: any) {
  return (
    <div className={`bg-background rounded-2xl p-6 shadow-neumorphic ${className}`} {...props}>
      {children}
    </div>
  );
}

function SimpleButton({ children, variant = 'primary', size = 'md', className = '', ...props }: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}) {
  const variants = {
    primary: 'bg-primary text-white shadow-neumorphic hover:shadow-neumorphic-lg',
    secondary: 'bg-secondary text-white shadow-neumorphic hover:shadow-neumorphic-lg',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`rounded-xl font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function StatsCard({ title, value, icon: Icon, trend, trendValue, color = 'primary' }: {
  title: string;
  value: string;
  icon: any;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'success' | 'accent';
}) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    success: 'text-success bg-success/10',
    accent: 'text-accent bg-accent/10'
  };

  return (
    <SimpleCard className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-success' : 'text-accent'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-text mb-1">{value}</h3>
        <p className="text-text/70 text-sm">{title}</p>
      </div>
    </SimpleCard>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isPositive = transaction.type === 'earn' || transaction.type === 'reward';
  
  return (
    <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}`}>
          {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
        <div>
          <p className="font-medium text-text">{transaction.description}</p>
          <p className="text-sm text-text/60">{new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${isPositive ? 'text-success' : 'text-accent'}`}>
          {isPositive ? '+' : '-'}{transaction.amount} CAMPUS
        </p>
        <p className="text-sm text-text/60 capitalize">{transaction.status}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    
    setLoadingTransactions(true);
    try {
      const { data, error } = await dbHelpers.getUserTransactions(user.id);
      if (!error && data) {
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-text mb-4">Please log in to access your dashboard</p>
          <a href="/login" className="text-primary hover:text-primary/80 font-medium">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Create a fallback profile if profile is not loaded yet
  const displayProfile = profile || {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
    student_id: user.user_metadata?.student_id || 'N/A',
    department: user.user_metadata?.department || 'N/A',
    year: user.user_metadata?.year || null,
    role: user.user_metadata?.role || 'student',
    campus_coin_balance: 0,
    total_earned: 0,
    total_spent: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-2">
            Welcome back, {displayProfile.full_name}!
          </h1>
          <p className="text-text/70">
            Here's what's happening with your campus economy account today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Campus Coins"
            value={`${displayProfile.campus_coin_balance.toFixed(2)}`}
            icon={Coins}
            color="primary"
            trend="up"
            trendValue="+12.5%"
          />
          <StatsCard
            title="Total Earned"
            value={`${displayProfile.total_earned.toFixed(2)}`}
            icon={TrendingUp}
            color="success"
            trend="up"
            trendValue="+8.2%"
          />
          <StatsCard
            title="Total Spent"
            value={`${displayProfile.total_spent.toFixed(2)}`}
            icon={Activity}
            color="secondary"
            trend="up"
            trendValue="+5.1%"
          />
          <StatsCard
            title="NFT Badges"
            value="5"
            icon={Trophy}
            color="accent"
            trend="up"
            trendValue="+2"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SimpleCard>
              <h2 className="text-xl font-semibold text-text mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <SimpleButton className="w-full flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5" />
                  View Rewards
                </SimpleButton>
                <SimpleButton variant="secondary" className="w-full flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Tokens
                </SimpleButton>
                <SimpleButton variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Data
                </SimpleButton>
              </div>
            </SimpleCard>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <SimpleCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text">Recent Transactions</h2>
                <SimpleButton size="sm" variant="outline">
                  View All
                </SimpleButton>
              </div>
              
              {loadingTransactions ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-text/70">Loading transactions...</p>
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-text/30 mx-auto mb-4" />
                  <p className="text-text/70">No transactions yet</p>
                  <p className="text-text/50 text-sm">Start earning tokens to see your transaction history</p>
                </div>
              )}
            </SimpleCard>
          </motion.div>
        </div>

        {/* Recent Activity & Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Recent Activity */}
          <SimpleCard>
            <h2 className="text-xl font-semibold text-text mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-xl">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div>
                  <p className="text-text font-medium">Attendance Reward</p>
                  <p className="text-text/60 text-sm">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="text-text font-medium">Hackathon Participation</p>
                  <p className="text-text/60 text-sm">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-xl">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <div>
                  <p className="text-text font-medium">Canteen Purchase</p>
                  <p className="text-text/60 text-sm">3 days ago</p>
                </div>
              </div>
            </div>
          </SimpleCard>

          {/* Achievements */}
          <SimpleCard>
            <h2 className="text-xl font-semibold text-text mb-6">Latest Achievements</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-text">First Purchase</p>
                  <p className="text-text/60 text-sm">Made your first campus purchase</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-success/10 to-secondary/10 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-success to-secondary rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-text">Regular Attendee</p>
                  <p className="text-text/60 text-sm">Attended 10 events this month</p>
                </div>
              </div>
            </div>
          </SimpleCard>
        </motion.div>
      </div>
    </div>
  );
}