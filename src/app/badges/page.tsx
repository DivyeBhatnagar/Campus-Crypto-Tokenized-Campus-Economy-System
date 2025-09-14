'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Navigation } from "@/components/layout/Navigation"
import { useAuth } from "@/hooks/useAuth"
import { 
  Award,
  Search,
  Filter,
  Star,
  Crown,
  Medal,
  Trophy,
  Shield,
  Zap,
  Calendar,
  Users,
  BookOpen,
  Code,
  Palette,
  Music,
  Dumbbell,
  Heart,
  Target,
  Flame,
  Globe,
  Camera,
  Coffee,
  Gift,
  Lock,
  CheckCircle,
  Clock,
  TrendingUp,
  Share2,
  Eye,
  Download
} from "lucide-react"

const badgeCategories = [
  { name: "All", icon: Star, color: "bg-gray-100 text-gray-800", count: 42 },
  { name: "Academic", icon: BookOpen, color: "bg-blue-100 text-blue-800", count: 8 },
  { name: "Social", icon: Users, color: "bg-green-100 text-green-800", count: 6 },
  { name: "Leadership", icon: Crown, color: "bg-purple-100 text-purple-800", count: 4 },
  { name: "Tech", icon: Code, color: "bg-indigo-100 text-indigo-800", count: 5 },
  { name: "Arts", icon: Palette, color: "bg-pink-100 text-pink-800", count: 4 },
  { name: "Sports", icon: Dumbbell, color: "bg-orange-100 text-orange-800", count: 3 },
  { name: "Service", icon: Heart, color: "bg-red-100 text-red-800", count: 2 },
  { name: "Special", icon: Gift, color: "bg-yellow-100 text-yellow-800", count: 10 }
]

const userBadges = [
  {
    id: 1,
    name: "Perfect Attendance",
    description: "Achieve 98%+ attendance rate for an entire semester. True dedication to learning!",
    category: "Academic",
    rarity: "legendary",
    earnedDate: null,
    requirement: "98%+ semester attendance",
    progress: 92,
    icon: BookOpen,
    color: "text-indigo-500",
    backgroundColor: "bg-indigo-100",
    xpReward: 2000,
    isEarned: false,
    totalEarned: 2,
    metadata: null
  },
  {
    id: 2,
    name: "90% Club",
    description: "Maintain 90%+ attendance rate. Join the elite group of dedicated students!",
    category: "Academic",
    rarity: "epic",
    earnedDate: "2024-01-25",
    requirement: "90%+ attendance rate",
    progress: 100,
    icon: Trophy,
    color: "text-purple-500",
    backgroundColor: "bg-purple-100",
    xpReward: 1000,
    isEarned: true,
    totalEarned: 45,
    metadata: {
      tokenId: "CC090",
      blockchainTx: "0x9876...5432",
      ipfsHash: "QmA...B"
    }
  },
  {
    id: 3,
    name: "Attendance Streak Master",
    description: "Attend classes for 30 consecutive days without missing a single session.",
    category: "Academic",
    rarity: "rare",
    earnedDate: "2024-01-20",
    requirement: "30-day attendance streak",
    progress: 100,
    icon: Flame,
    color: "text-orange-500",
    backgroundColor: "bg-orange-100",
    xpReward: 750,
    isEarned: true,
    totalEarned: 67,
    metadata: {
      tokenId: "CC030",
      blockchainTx: "0x8765...4321",
      ipfsHash: "QmB...C"
    }
  },
  {
    id: 4,
    name: "Early Bird",
    description: "Arrive on time for classes consistently. Never miss the morning lectures!",
    category: "Academic",
    rarity: "common",
    earnedDate: "2024-01-18",
    requirement: "On-time arrival for 20 classes",
    progress: 100,
    icon: Clock,
    color: "text-blue-500",
    backgroundColor: "bg-blue-100",
    xpReward: 300,
    isEarned: true,
    totalEarned: 234,
    metadata: {
      tokenId: "CC020",
      blockchainTx: "0x7654...3210",
      ipfsHash: "QmC...D"
    }
  },
  {
    id: 5,
    name: "First Steps",
    description: "Welcome to Campus Coin! Complete your first activity and start your journey.",
    category: "Special",
    rarity: "common",
    earnedDate: "2024-01-15",
    requirement: "Complete profile setup",
    progress: 100,
    icon: CheckCircle,
    color: "text-green-500",
    backgroundColor: "bg-green-100",
    xpReward: 50,
    isEarned: true,
    totalEarned: 1247,
    metadata: {
      tokenId: "CC001",
      blockchainTx: "0x1234...5678",
      ipfsHash: "QmX...Y"
    }
  },
  {
    id: 6,
    name: "Social Butterfly",
    description: "A true connector! Join 5 different clubs and become part of the campus community.",
    category: "Social",
    rarity: "rare",
    earnedDate: "2024-01-20",
    requirement: "Join 5 clubs",
    progress: 100,
    icon: Users,
    color: "text-blue-500",
    backgroundColor: "bg-blue-100",
    xpReward: 200,
    isEarned: true,
    totalEarned: 89,
    metadata: {
      tokenId: "CC015",
      blockchainTx: "0x2345...6789",
      ipfsHash: "QmY...Z"
    }
  },
  {
    id: 7,
    name: "Academic Excellence",
    description: "Outstanding academic performance! Maintain 90%+ attendance for a full semester.",
    category: "Academic",
    rarity: "epic",
    earnedDate: "2024-01-25",
    requirement: "90%+ attendance for 1 semester",
    progress: 100,
    icon: BookOpen,
    color: "text-purple-500",
    backgroundColor: "bg-purple-100",
    xpReward: 500,
    isEarned: true,
    totalEarned: 23,
    metadata: {
      tokenId: "CC027",
      blockchainTx: "0x3456...7890",
      ipfsHash: "QmZ...A"
    }
  },
  {
    id: 8,
    name: "Code Master",
    description: "Programming excellence! Win first place in the campus coding competition.",
    category: "Tech",
    rarity: "legendary",
    earnedDate: null,
    requirement: "Win coding competition",
    progress: 75,
    icon: Code,
    color: "text-indigo-500",
    backgroundColor: "bg-indigo-100",
    xpReward: 1000,
    isEarned: false,
    totalEarned: 3,
    metadata: null
  },
  {
    id: 5,
    name: "Community Champion",
    description: "Make a difference! Complete 50 hours of community service.",
    category: "Service",
    rarity: "epic",
    earnedDate: null,
    requirement: "50 hours community service",
    progress: 64,
    icon: Heart,
    color: "text-red-500",
    backgroundColor: "bg-red-100",
    xpReward: 750,
    isEarned: false,
    totalEarned: 12,
    metadata: null
  },
  {
    id: 6,
    name: "Event Explorer",
    description: "Adventure seeker! Attend 25 different campus events.",
    category: "Social",
    rarity: "common",
    earnedDate: "2024-01-18",
    requirement: "Attend 25 events",
    progress: 100,
    icon: Calendar,
    color: "text-green-500",
    backgroundColor: "bg-green-100",
    xpReward: 150,
    isEarned: true,
    totalEarned: 456,
    metadata: {
      tokenId: "CC008",
      blockchainTx: "0x4567...8901",
      ipfsHash: "QmA...B"
    }
  },
  {
    id: 7,
    name: "Leadership Star",
    description: "Born to lead! Hold a leadership position in any student organization.",
    category: "Leadership",
    rarity: "rare",
    earnedDate: null,
    requirement: "Hold leadership position",
    progress: 30,
    icon: Crown,
    color: "text-yellow-500",
    backgroundColor: "bg-yellow-100",
    xpReward: 400,
    isEarned: false,
    totalEarned: 67,
    metadata: null
  },
  {
    id: 8,
    name: "Fitness Enthusiast",
    description: "Stay active and healthy! Participate in 10 sports activities.",
    category: "Sports",
    rarity: "common",
    earnedDate: null,
    requirement: "Participate in 10 sports activities",
    progress: 40,
    icon: Dumbbell,
    color: "text-orange-500",
    backgroundColor: "bg-orange-100",
    xpReward: 200,
    isEarned: false,
    totalEarned: 234,
    metadata: null
  }
]

const rarityColors = {
  common: "border-gray-300 text-gray-700 bg-gray-50",
  rare: "border-blue-300 text-blue-700 bg-blue-50",
  epic: "border-purple-300 text-purple-700 bg-purple-50",
  legendary: "border-yellow-300 text-yellow-700 bg-yellow-50 shadow-yellow-100"
}

const stats = {
  totalBadges: userBadges.length,
  earnedBadges: userBadges.filter(badge => badge.isEarned).length,
  totalXP: userBadges.filter(badge => badge.isEarned).reduce((sum, badge) => sum + badge.xpReward, 0),
  rareCount: userBadges.filter(badge => badge.isEarned && badge.rarity !== 'common').length,
  completionRate: Math.round((userBadges.filter(badge => badge.isEarned).length / userBadges.length) * 100)
}

export default function BadgesPage() {
  const { user, loading } = useAuth()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [selectedRarity, setSelectedRarity] = React.useState("All")
  const [showEarnedOnly, setShowEarnedOnly] = React.useState(false)
  const [filteredBadges, setFilteredBadges] = React.useState(userBadges)

  React.useEffect(() => {
    let filtered = userBadges

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(badge => badge.category === selectedCategory)
    }

    // Filter by rarity
    if (selectedRarity !== "All") {
      filtered = filtered.filter(badge => badge.rarity === selectedRarity.toLowerCase())
    }

    // Filter by earned status
    if (showEarnedOnly) {
      filtered = filtered.filter(badge => badge.isEarned)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(badge => 
        badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredBadges(filtered)
  }, [searchTerm, selectedCategory, selectedRarity, showEarnedOnly])

  const handleShareBadge = (badgeId: number) => {
    console.log(`Sharing badge ${badgeId}`)
  }

  const handleDownloadBadge = (badgeId: number) => {
    console.log(`Downloading badge ${badgeId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading badges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">NFT Badge Collection</h1>
          <p className="text-muted-foreground">Showcase your achievements with blockchain-verified badges stored on IPFS</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats.earnedBadges}/{stats.totalBadges}</div>
                  <p className="text-xs text-muted-foreground">Badges Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalXP}</div>
                  <p className="text-xs text-muted-foreground">XP from Badges</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.rareCount}</div>
                  <p className="text-xs text-muted-foreground">Rare+ Badges</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">#23</div>
                  <p className="text-xs text-muted-foreground">Campus Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search badges by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select 
                className="border rounded-md px-3 py-2 text-sm"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
              >
                <option value="All">All Rarities</option>
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
              </select>
              <Button
                variant={showEarnedOnly ? "primary" : "outline"}
                size="sm"
                onClick={() => setShowEarnedOnly(!showEarnedOnly)}
              >
                {showEarnedOnly ? "Earned Only" : "Show All"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Categories Sidebar */}
          <div className="space-y-6 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {badgeCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      <Badge variant="outline" size="sm">
                        {category.count}
                      </Badge>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userBadges
                  .filter(badge => badge.isEarned)
                  .sort((a, b) => new Date(b.earnedDate!).getTime() - new Date(a.earnedDate!).getTime())
                  .slice(0, 3)
                  .map((badge) => {
                    const Icon = badge.icon
                    return (
                      <div key={badge.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                        <div className={`h-8 w-8 ${badge.backgroundColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`h-4 w-4 ${badge.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{badge.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(badge.earnedDate!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </CardContent>
            </Card>
          </div>

          {/* Badges Grid */}
          <div className="space-y-6 lg:col-span-9">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredBadges.length} badges found
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              <select className="border rounded-md px-3 py-1 text-sm">
                <option>Sort by Date Earned</option>
                <option>Sort by Rarity</option>
                <option>Sort by XP Value</option>
                <option>Sort by Progress</option>
              </select>
            </div>

            {/* Badges Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBadges.map((badge) => {
                const Icon = badge.icon
                return (
                  <Card key={badge.id} className={`relative hover:shadow-lg transition-all duration-300 ${
                    badge.isEarned ? `border-2 ${rarityColors[badge.rarity as keyof typeof rarityColors]}` : 'opacity-75'
                  }`}>
                    {!badge.isEarned && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <Badge variant="outline">Locked</Badge>
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 ${badge.backgroundColor} rounded-xl`}>
                            <Icon className={`h-6 w-6 ${badge.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{badge.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" size="sm">{badge.category}</Badge>
                              <Badge 
                                variant="outline" 
                                size="sm"
                                className={rarityColors[badge.rarity as keyof typeof rarityColors]}
                              >
                                {badge.rarity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {badge.isEarned && (
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleShareBadge(badge.id)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDownloadBadge(badge.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm">
                        {badge.description}
                      </CardDescription>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="text-muted-foreground">{badge.progress}%</span>
                        </div>
                        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              badge.isEarned ? 'bg-green-500' : 'bg-primary'
                            }`}
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                      </div>

                      {/* Badge Info */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span>+{badge.xpReward} XP</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{badge.totalEarned} earned</span>
                        </div>
                      </div>

                      {/* Earned Date & Blockchain Info */}
                      {badge.isEarned && badge.earnedDate && (
                        <div className="pt-2 border-t space-y-2">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Earned on {new Date(badge.earnedDate).toLocaleDateString()}</span>
                          </div>
                          {badge.metadata && (
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center space-x-1 text-muted-foreground">
                                <Shield className="h-3 w-3" />
                                <span>Token ID: {badge.metadata.tokenId}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-muted-foreground">
                                <Globe className="h-3 w-3" />
                                <span>IPFS: {badge.metadata.ipfsHash}</span>
                              </div>
                              <Button variant="ghost" size="sm" className="mt-2 text-xs h-6">
                                <Eye className="h-3 w-3 mr-1" />
                                View on Blockchain
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* No Results */}
            {filteredBadges.length === 0 && (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No badges found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                  setSelectedRarity("All")
                  setShowEarnedOnly(false)
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}