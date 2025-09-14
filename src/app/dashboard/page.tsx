'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Navigation } from "@/components/layout/Navigation"
import { useAuth } from "@/hooks/useAuth"
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Trophy, 
  Coins, 
  Award, 
  Plus,
  ArrowRight,
  Flame,
  Star,
  Target,
  BookOpen,
  Coffee,
  Music,
  Gamepad2,
  Camera,
  Zap,
  Clock,
  MapPin,
  BarChart3,
  Activity,
  Crown,
  Medal,
  Gift,
  ShoppingCart,
  Book,
  Music4,
  Palette,
  Dumbbell
} from "lucide-react"

const quickActions = [
  { label: "Mark Attendance", href: "/attendance", icon: BookOpen, color: "bg-indigo-500" },
  { label: "Join Study Group", href: "/clubs/study-groups", icon: BookOpen, color: "bg-blue-500" },
  { label: "Browse Events", href: "/events", icon: Calendar, color: "bg-green-500" },
  { label: "Find Clubs", href: "/clubs", icon: Users, color: "bg-purple-500" },
  { label: "View Marketplace", href: "/marketplace", icon: ShoppingCart, color: "bg-orange-500" }
]

const leaderboardPreview = [
  { rank: 1, name: "Alex Chen", xp: 5420, avatar: "AC", change: "+2 today" },
  { rank: 2, name: "Sarah Wilson", xp: 4890, avatar: "SW", change: "+15 today" },
  { rank: 3, name: "Marcus Johnson", xp: 4250, avatar: "MJ", change: "+8 today" }
]

// Enhanced campus buzz with more variety
const campusBuzz = [
  {
    id: 1,
    title: "New Gaming Lounge Opens Next Week!",
    type: "announcement",
    time: "2 hours ago",
    icon: Gamepad2,
    category: "Entertainment"
  },
  {
    id: 2,
    title: "Photography Exhibition Now Open",
    type: "event",
    time: "4 hours ago",
    icon: Camera,
    category: "Arts"
  },
  {
    id: 3,
    title: "Free Coffee Hours in Student Union",
    type: "offer",
    time: "6 hours ago",
    icon: Coffee,
    category: "Food & Drink"
  },
  {
    id: 4,
    title: "Campus Music Festival Lineup Released",
    type: "event",
    time: "1 day ago",
    icon: Music4,
    category: "Music"
  }
]

// Stats for the additional cards
const additionalStats = [
  { label: "Study Hours", value: "12.5", change: "+2.3", icon: Book, color: "text-blue-500" },
  { label: "Campus Coins", value: "1,250", change: "+150", icon: Coins, color: "text-yellow-500" },
  { label: "Friends Made", value: "24", change: "+3", icon: Users, color: "text-green-500" },
  { label: "Achievements", value: "18", change: "+2", icon: Medal, color: "text-purple-500" }
]

// Event categories with icons and colors
const eventCategories = [
  { name: "Academic", icon: Book, color: "bg-blue-100 text-blue-800", count: 12 },
  { name: "Tech", icon: Activity, color: "bg-indigo-100 text-indigo-800", count: 8 },
  { name: "Arts", icon: Palette, color: "bg-pink-100 text-pink-800", count: 5 },
  { name: "Music", icon: Music4, color: "bg-purple-100 text-purple-800", count: 3 },
  { name: "Sports", icon: Dumbbell, color: "bg-green-100 text-green-800", count: 7 },
  { name: "Social", icon: Users, color: "bg-yellow-100 text-yellow-800", count: 15 }
]

export default function StudentDashboard() {
  const { user, loading } = useAuth()

  // Comprehensive debugging as per user preference
  React.useEffect(() => {
    console.log('🏠 === DASHBOARD DEBUG START ===')
    console.log('⏳ Loading state:', loading)
    console.log('👤 User state:', user)
    console.log('🔍 User exists:', !!user)
    console.log('📧 User email:', user?.email)
    console.log('🎩 User role:', user?.role)
    console.log('🆔 User ID:', user?.id)
    console.log('🏠 === DASHBOARD DEBUG END ===')
  }, [user, loading])

  // Show loading spinner while fetching user data
  if (loading) {
    console.log('⏳ Dashboard showing loading state - user loading:', loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          {/* Debug panel as per user preference */}
          <div className="mt-4 p-4 bg-muted/20 rounded-lg text-left max-w-md mx-auto">
            <h3 className="font-semibold mb-2">🔍 Debug Info:</h3>
            <div className="text-sm space-y-1">
              <div>Loading: {loading ? '✗' : '✓'}</div>
              <div>User: {user ? '✓' : '✗'}</div>
              <div>User ID: {user?.id || 'None'}</div>
              <div>User Email: {user?.email || 'None'}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to login if no user
  if (!user) {
    console.log('🚫 No user found, redirecting to login')
    window.location.href = '/login'
    return null
  }

  console.log('✅ Dashboard rendering with user:', user.email)

  const xpForNextLevel = 3000
  const xpProgress = Math.round((user.xp / xpForNextLevel) * 100)

  const upcomingEvents = [
    {
      id: 1,
      title: "AI Workshop Series",
      date: "Tomorrow, 2:00 PM",
      location: "Tech Lab 205",
      xpReward: 150,
      attendees: 45,
      type: "workshop",
      category: "Tech"
    },
    {
      id: 2,
      title: "Photography Club Meetup",
      date: "Thu, 6:00 PM",
      location: "Art Building",
      xpReward: 100,
      attendees: 23,
      type: "club",
      category: "Arts"
    },
    {
      id: 3,
      title: "Campus Coding Competition",
      date: "Sat, 10:00 AM",
      location: "Computer Science Building",
      xpReward: 300,
      attendees: 78,
      type: "competition",
      category: "Tech"
    },
    {
      id: 4,
      title: "Yoga & Wellness Session",
      date: "Fri, 5:00 PM",
      location: "Campus Green",
      xpReward: 75,
      attendees: 32,
      type: "wellness",
      category: "Sports"
    }
  ]

  const recentBadges = [
    { id: 1, name: "Event Explorer", icon: Calendar, color: "text-blue-500", rarity: "common", description: "Attended your first event" },
    { id: 2, name: "Social Butterfly", icon: Users, color: "text-green-500", rarity: "rare", description: "Joined 3 different clubs" },
    { id: 3, name: "Knowledge Seeker", icon: BookOpen, color: "text-purple-500", rarity: "epic", description: "Attended 10 academic events" },
    { id: 4, name: "Campus Champion", icon: Trophy, color: "text-yellow-500", rarity: "legendary", description: "Reached Level 10" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              Hey {user.name} 👋
            </h1>
            <Badge variant="secondary" size="lg">
              Level {user.level}
            </Badge>
          </div>
          <p className="text-muted-foreground">Ready to connect and earn some XP today?</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-8">
            {/* XP & Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-secondary" />
                      <span>Your Progress</span>
                    </CardTitle>
                    <CardDescription>
                      {xpForNextLevel - user.xp} XP until Level {user.level + 1}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" size="lg">{user.xp} XP</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Level {user.level}</span>
                    <span>Level {user.level + 1}</span>
                  </div>
                  <div className="relative h-3 bg-secondary/20 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {xpProgress}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 XP</span>
                    <span>{xpForNextLevel} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                    <div>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">Attendance Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold">{user.streak_count}</div>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">{user.total_events_attended}</div>
                      <p className="text-xs text-muted-foreground">Events Attended</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">{user.total_clubs_joined}</div>
                      <p className="text-xs text-muted-foreground">Clubs Joined</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold">{user.badges_earned}</div>
                      <p className="text-xs text-muted-foreground">Badges Earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              {additionalStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                        <div>
                          <div className="text-lg font-bold">{stat.value}</div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-muted-foreground">{stat.label}</span>
                            <span className="text-xs text-green-500">↑ {stat.change}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Event Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Event Categories</span>
                </CardTitle>
                <CardDescription>Browse events by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {eventCategories.map((category, index) => {
                    const Icon = category.icon
                    return (
                      <Link key={index} href={`/events?category=${category.name.toLowerCase()}`}>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className={`p-2 rounded-md ${category.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{category.name}</div>
                            <div className="text-xs text-muted-foreground">{category.count} events</div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Upcoming Events</span>
                  </CardTitle>
                  <Link href="/events">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        <Badge variant="secondary" className="ml-2">
                          {event.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span>+{event.xpReward} XP</span>
                      </Badge>
                      <Button size="sm">Join</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:col-span-4">
            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-secondary" />
                  <span>Recent Badges</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentBadges.map((badge) => {
                  const Icon = badge.icon
                  return (
                    <div key={badge.id} className="flex items-center space-x-3 p-3 rounded-xl border hover:shadow-md transition-shadow">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${badge.color} bg-muted`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{badge.name}</div>
                        <div className="text-xs text-muted-foreground">{badge.description}</div>
                        <Badge 
                          variant={badge.rarity === 'legendary' ? 'default' : badge.rarity === 'epic' ? 'destructive' : badge.rarity === 'rare' ? 'secondary' : 'outline'} 
                          size="sm"
                          className="mt-1"
                        >
                          {badge.rarity}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
                <Link href="/badges">
                  <Button variant="ghost" className="w-full mt-2">
                    View All Badges
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.href}>
                      <Button variant="ghost" className="h-auto p-4 flex-col space-y-2 w-full hover:shadow-md transition-shadow">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-center">{action.label}</span>
                      </Button>
                    </Link>
                  )
                })}
              </CardContent>
            </Card>

            {/* Leaderboard Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-secondary" />
                    <span>Top Students</span>
                  </CardTitle>
                  <Link href="/leaderboard">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboardPreview.map((student) => (
                  <div key={student.rank} className="flex items-center justify-between p-3 rounded-xl border hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        #{student.rank}
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.xp} XP</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-500">{student.change}</div>
                      <div className="flex justify-end">
                        {student.rank === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Campus Buzz */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-secondary" />
                  <span>Campus Buzz</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {campusBuzz.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="flex items-start space-x-3 p-3 rounded-xl border hover:shadow-md transition-shadow">
                      <div className={`p-2 rounded-lg bg-muted`}>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="font-medium text-foreground text-sm">{item.title}</div>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}