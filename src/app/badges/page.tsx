'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  Star, 
  Crown, 
  Zap,
  Filter,
  Search,
  Info
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { BadgeCollection, useNFTBadges } from '@/lib/nft-badges';

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
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-neumorphic',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
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

const achievementCategories = [
  {
    id: 'academic',
    name: 'Academic Excellence',
    icon: Trophy,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Achievements related to academic performance and learning'
  },
  {
    id: 'participation',
    name: 'Event Participation',
    icon: Star,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Badges earned through attending events and activities'
  },
  {
    id: 'leadership',
    name: 'Leadership',
    icon: Crown,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    description: 'Recognition for leadership qualities and initiative'
  },
  {
    id: 'service',
    name: 'Community Service',
    icon: Award,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    description: 'Badges for volunteer work and community contributions'
  },
  {
    id: 'competition',
    name: 'Competitions',
    icon: Zap,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    description: 'Achievements in various competitions and contests'
  }
];

const availableAchievements = [
  {
    code: 'EVENT_ATTENDANCE',
    name: 'Event Attendee',
    category: 'participation',
    description: 'Attend 5 campus events to earn this badge',
    requirement: 'Attend campus events',
    rarity: 'common',
    progress: 3,
    total: 5,
    unlocked: false
  },
  {
    code: 'ACADEMIC_EXCELLENCE',
    name: 'Academic Star',
    category: 'academic',
    description: 'Achieve GPA of 3.8 or higher for a semester',
    requirement: 'GPA ≥ 3.8',
    rarity: 'rare',
    progress: 0,
    total: 1,
    unlocked: false
  },
  {
    code: 'VOLUNTEER_HERO',
    name: 'Community Hero',
    category: 'service',
    description: 'Complete 50 hours of volunteer service',
    requirement: '50 hours of service',
    rarity: 'epic',
    progress: 25,
    total: 50,
    unlocked: false
  },
  {
    code: 'QUIZ_MASTER',
    name: 'Quiz Master',
    category: 'competition',
    description: 'Win 3 quiz competitions',
    requirement: 'Win quiz competitions',
    rarity: 'uncommon',
    progress: 1,
    total: 3,
    unlocked: false
  },
  {
    code: 'LEADERSHIP',
    name: 'Natural Leader',
    category: 'leadership',
    description: 'Lead a successful student initiative',
    requirement: 'Lead student project',
    rarity: 'legendary',
    progress: 0,
    total: 1,
    unlocked: false
  }
];

export default function BadgesPage() {
  const { user } = useAuth();
  const { badges, loading, mintBadge } = useNFTBadges(user?.id || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAchievements = availableAchievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const rarityColors = {
    common: { bg: 'bg-gray-500/10', text: 'text-gray-600', border: 'border-gray-400' },
    uncommon: { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-400' },
    rare: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-400' },
    epic: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-400' },
    legendary: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', border: 'border-yellow-400' }
  };

  const handleTestMintBadge = async (achievementCode: string) => {
    try {
      await mintBadge(achievementCode, user?.id || 'demo-user');
      alert('Badge minted successfully! Check your collection.');
    } catch (error) {
      console.error('Error minting badge:', error);
      alert('Error minting badge. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text mb-2">NFT Badge System</h1>
          <p className="text-text/60">Collect unique achievement badges as NFTs</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <SimpleCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text/60 text-sm">Badges Earned</p>
                <p className="text-2xl font-bold text-text">{badges.length}</p>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
          </SimpleCard>
          
          <SimpleCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text/60 text-sm">Achievements</p>
                <p className="text-2xl font-bold text-text">{availableAchievements.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-secondary" />
            </div>
          </SimpleCard>
          
          <SimpleCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text/60 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-text">
                  {Math.round((badges.length / availableAchievements.length) * 100)}%
                </p>
              </div>
              <Star className="w-8 h-8 text-success" />
            </div>
          </SimpleCard>
          
          <SimpleCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text/60 text-sm">Rare Badges</p>
                <p className="text-2xl font-bold text-text">
                  {badges.filter(b => ['rare', 'epic', 'legendary'].includes(b.metadata.rarity)).length}
                </p>
              </div>
              <Crown className="w-8 h-8 text-accent" />
            </div>
          </SimpleCard>
        </motion.div>

        {/* My Badges Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <SimpleCard>
            <BadgeCollection badges={badges} />
          </SimpleCard>
        </motion.div>

        {/* Achievement Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <SimpleCard>
            <h3 className="text-lg font-semibold text-text mb-4">Achievement Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {achievementCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className={`p-4 rounded-xl text-center cursor-pointer transition-all duration-200 ${
                      selectedCategory === category.id 
                        ? 'shadow-neumorphic-inset' 
                        : 'shadow-neumorphic hover:shadow-neumorphic-lg'
                    } ${category.bgColor}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
                    <h4 className="font-medium text-text text-sm">{category.name}</h4>
                    <p className="text-xs text-text/60 mt-1">{category.description}</p>
                  </div>
                );
              })}
            </div>
          </SimpleCard>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-text">Available Achievements</h2>
              <div className="flex space-x-2">
                <SimpleButton
                  variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </SimpleButton>
                <SimpleButton
                  variant="outline"
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </SimpleButton>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text/50" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200 text-text placeholder-text/50"
              />
            </div>
          </div>
        </motion.div>

        {/* Available Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAchievements.map((achievement, index) => {
            const category = achievementCategories.find(c => c.id === achievement.category);
            const rarity = rarityColors[achievement.rarity as keyof typeof rarityColors];
            const progressPercent = (achievement.progress / achievement.total) * 100;
            const isEarned = badges.some(b => b.metadata.achievement_code === achievement.code);
            
            return (
              <motion.div
                key={achievement.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <SimpleCard className={`border-2 ${rarity.border} ${isEarned ? 'opacity-60' : ''}`}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {category && (
                          <div className={`p-2 rounded-lg ${category.bgColor}`}>
                            <category.icon className={`w-5 h-5 ${category.color}`} />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-text">{achievement.name}</h3>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${rarity.bg} ${rarity.text}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                      
                      {isEarned && (
                        <div className="flex items-center space-x-1 text-success">
                          <Award className="w-4 h-4" />
                          <span className="text-xs">Earned</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-text/70">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text/60">Progress</span>
                        <span className="text-text">{achievement.progress}/{achievement.total}</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2 shadow-neumorphic-inset">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-text/60">
                        <Info className="w-4 h-4 inline mr-1" />
                        {achievement.requirement}
                      </div>
                      
                      {!isEarned && (
                        <SimpleButton
                          size="sm"
                          onClick={() => handleTestMintBadge(achievement.code)}
                          disabled={progressPercent < 100}
                        >
                          {progressPercent >= 100 ? 'Claim Badge' : 'In Progress'}
                        </SimpleButton>
                      )}
                    </div>
                  </div>
                </SimpleCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}