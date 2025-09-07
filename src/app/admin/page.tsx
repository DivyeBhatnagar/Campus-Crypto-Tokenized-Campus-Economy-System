'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Coins, 
  Award, 
  TrendingUp, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Pie
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { dbHelpers, type RewardRule, type User, type Transaction } from '@/lib/supabase';

// Mock admin data
const mockAdminData = {
  stats: {
    totalUsers: 1247,
    totalTokensDistributed: 125000,
    activeRewards: 12,
    totalTransactions: 3456
  },
  recentActivity: [
    { id: 1, user: 'John Doe', action: 'Earned 25 tokens', reward: 'Event Attendance', time: '2 mins ago' },
    { id: 2, user: 'Jane Smith', action: 'Redeemed 50 tokens', product: 'Coffee Voucher', time: '5 mins ago' },
    { id: 3, user: 'Mike Johnson', action: 'Earned 15 tokens', reward: 'Quiz Completion', time: '8 mins ago' },
    { id: 4, user: 'Sarah Wilson', action: 'Earned 30 tokens', reward: 'Volunteer Work', time: '12 mins ago' },
  ],
  userGrowth: [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 180 },
    { month: 'Mar', users: 250 },
    { month: 'Apr', users: 320 },
    { month: 'May', users: 450 },
    { month: 'Jun', users: 620 },
  ],
  tokenDistribution: [
    { name: 'Event Attendance', value: 35, count: 450 },
    { name: 'Academic Achievement', value: 25, count: 320 },
    { name: 'Volunteer Work', value: 20, count: 260 },
    { name: 'Quiz Completion', value: 15, count: 195 },
    { name: 'Other', value: 5, count: 75 }
  ],
  dailyTransactions: [
    { date: '2024-01-01', earnings: 1200, spendings: 800 },
    { date: '2024-01-02', earnings: 1500, spendings: 900 },
    { date: '2024-01-03', earnings: 1100, spendings: 1200 },
    { date: '2024-01-04', earnings: 1800, spendings: 600 },
    { date: '2024-01-05', earnings: 1600, spendings: 1100 },
    { date: '2024-01-06', earnings: 2000, spendings: 1300 },
    { date: '2024-01-07', earnings: 1400, spendings: 1000 }
  ]
};

const COLORS = ['#3a3d98', '#00c6ff', '#4CAF50', '#ff6b6b', '#ffa726'];

// Simple UI Components
function SimpleCard({ children, className = '', ...props }: any) {
  return (
    <div className={`bg-background rounded-2xl p-6 shadow-neumorphic ${className}`} {...props}>
      {children}
    </div>
  );
}

function SimpleButton({ children, variant = 'primary', size = 'md', className = '', ...props }: any) {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-neumorphic hover:shadow-neumorphic-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-neumorphic hover:shadow-neumorphic-lg',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-neumorphic',
    danger: 'bg-accent text-white hover:bg-accent/90 shadow-neumorphic hover:shadow-neumorphic-lg',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function StatsCard({ title, value, icon: Icon, change, changeType }: any) {
  return (
    <SimpleCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text/60 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-text mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-success' : 'text-accent'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </SimpleCard>
  );
}

function RewardRuleModal({ isOpen, onClose, rule, onSave }: any) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    token_reward: 0,
    description: '',
    max_claims_per_user: 1,
    cooldown_period: 24,
    is_active: true,
    nft_badge_enabled: false,
    nft_badge_name: '',
    nft_badge_description: ''
  });

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    } else {
      setFormData({
        name: '',
        code: '',
        category: '',
        token_reward: 0,
        description: '',
        max_claims_per_user: 1,
        cooldown_period: 24,
        is_active: true,
        nft_badge_enabled: false,
        nft_badge_name: '',
        nft_badge_description: ''
      });
    }
  }, [rule, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-neumorphic-lg"
      >
        <h2 className="text-2xl font-bold text-text mb-6">
          {rule ? 'Edit Reward Rule' : 'Create New Reward Rule'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Rule Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Rule Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
                required
              >
                <option value="">Select Category</option>
                <option value="academic">Academic</option>
                <option value="social">Social</option>
                <option value="volunteer">Volunteer</option>
                <option value="event">Event</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Token Reward</label>
              <input
                type="number"
                value={formData.token_reward}
                onChange={(e) => setFormData({...formData, token_reward: Number(e.target.value)})}
                className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Max Claims Per User</label>
              <input
                type="number"
                value={formData.max_claims_per_user}
                onChange={(e) => setFormData({...formData, max_claims_per_user: Number(e.target.value)})}
                className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Cooldown (hours)</label>
              <input
                type="number"
                value={formData.cooldown_period}
                onChange={(e) => setFormData({...formData, cooldown_period: Number(e.target.value)})}
                className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
                min="0"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="rounded"
              />
              <span className="text-text">Active</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.nft_badge_enabled}
                onChange={(e) => setFormData({...formData, nft_badge_enabled: e.target.checked})}
                className="rounded"
              />
              <span className="text-text">NFT Badge</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <SimpleButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </SimpleButton>
            <SimpleButton type="submit">
              {rule ? 'Update Rule' : 'Create Rule'}
            </SimpleButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [rewardRules, setRewardRules] = useState<RewardRule[]>([]);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<RewardRule | null>(null);

  useEffect(() => {
    // Load reward rules
    loadRewardRules();
  }, []);

  const loadRewardRules = async () => {
    try {
      const { data } = await dbHelpers.getRewardRules();
      setRewardRules(data || []);
    } catch (error) {
      console.error('Error loading reward rules:', error);
    }
  };

  const handleSaveRule = (ruleData: any) => {
    // In a real app, this would save to the database
    if (selectedRule) {
      // Update existing rule
      setRewardRules(prev => prev.map(rule => 
        rule.id === selectedRule.id ? { ...rule, ...ruleData } : rule
      ));
    } else {
      // Create new rule
      const newRule: RewardRule = {
        id: 'rule_' + Date.now(),
        ...ruleData,
        total_claims: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setRewardRules(prev => [newRule, ...prev]);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this reward rule?')) {
      setRewardRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'rewards', label: 'Reward Rules', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Admin Dashboard</h1>
          <p className="text-text/60">Manage your campus token economy</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <SimpleCard className="p-2">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-neumorphic'
                      : 'text-text/60 hover:text-text hover:bg-background hover:shadow-neumorphic-inset'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </SimpleCard>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Users"
                value={mockAdminData.stats.totalUsers.toLocaleString()}
                icon={Users}
                change="+12% from last month"
                changeType="positive"
              />
              <StatsCard
                title="Tokens Distributed"
                value={mockAdminData.stats.totalTokensDistributed.toLocaleString()}
                icon={Coins}
                change="+8% from last month"
                changeType="positive"
              />
              <StatsCard
                title="Active Rewards"
                value={mockAdminData.stats.activeRewards}
                icon={Award}
                change="2 new this month"
                changeType="positive"
              />
              <StatsCard
                title="Total Transactions"
                value={mockAdminData.stats.totalTransactions.toLocaleString()}
                icon={Activity}
                change="+15% from last month"
                changeType="positive"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <SimpleCard>
                <h3 className="text-lg font-semibold text-text mb-4">User Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockAdminData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e5ec" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#e0e5ec',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3a3d98" 
                      fill="#3a3d98" 
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </SimpleCard>

              {/* Token Distribution */}
              <SimpleCard>
                <h3 className="text-lg font-semibold text-text mb-4">Token Distribution by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={mockAdminData.tokenDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockAdminData.tokenDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#e0e5ec',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </SimpleCard>
            </div>

            {/* Recent Activity */}
            <SimpleCard>
              <h3 className="text-lg font-semibold text-text mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mockAdminData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-background rounded-xl shadow-neumorphic-inset">
                    <div>
                      <p className="font-medium text-text">{activity.user}</p>
                      <p className="text-sm text-text/60">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text/60">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SimpleCard>
          </motion.div>
        )}

        {/* Reward Rules Tab */}
        {activeTab === 'rewards' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text">Reward Rules</h2>
              <SimpleButton 
                onClick={() => {
                  setSelectedRule(null);
                  setIsRuleModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Rule
              </SimpleButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {rewardRules.map((rule) => (
                <SimpleCard key={rule.id}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-text">{rule.name}</h3>
                        <p className="text-sm text-text/60">{rule.code}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRule(rule);
                            setIsRuleModalOpen(true);
                          }}
                          className="p-2 text-text/60 hover:text-primary transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-2 text-text/60 hover:text-accent transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-text/70">{rule.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{rule.token_reward} Tokens</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule.is_active ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
                      }`}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-text/60">
                      <span>Claims: {rule.total_claims}</span>
                      <span>Max: {rule.max_claims_per_user}/user</span>
                    </div>
                  </div>
                </SimpleCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-text">Analytics</h2>
            
            {/* Daily Transactions Chart */}
            <SimpleCard>
              <h3 className="text-lg font-semibold text-text mb-4">Daily Token Transactions</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockAdminData.dailyTransactions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e5ec" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#e0e5ec',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="earnings" fill="#4CAF50" name="Earnings" />
                  <Bar dataKey="spendings" fill="#ff6b6b" name="Spendings" />
                </BarChart>
              </ResponsiveContainer>
            </SimpleCard>
          </motion.div>
        )}
      </div>

      {/* Reward Rule Modal */}
      <RewardRuleModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        rule={selectedRule}
        onSave={handleSaveRule}
      />
    </div>
  );
}