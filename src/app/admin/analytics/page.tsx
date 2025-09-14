'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Navigation } from "@/components/layout/Navigation"
import { useAuth } from "@/hooks/useAuth"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Coins,
  Award,
  Activity,
  Eye,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star,
  Target,
  Zap,
  Trophy,
  Heart,
  ShoppingBag,
  BookOpen,
  Music,
  Code,
  Palette,
  Dumbbell,
  Shield
} from "lucide-react"

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '1y', label: 'Last year' }
]

const overviewStats = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    color: 'text-blue-500',
    description: 'Active registered users'
  },
  {
    title: 'Active Events',
    value: '156',
    change: '+23%',
    changeType: 'positive',
    icon: Calendar,
    color: 'text-green-500',
    description: 'Events this month'
  },
  {
    title: 'Tokens Circulating',
    value: '1.2M',
    change: '+8%',
    changeType: 'positive',
    icon: Coins,
    color: 'text-yellow-500',
    description: 'Total tokens in circulation'
  },
  {
    title: 'Badges Earned',
    value: '45,678',
    change: '+15%',
    changeType: 'positive',
    icon: Award,
    color: 'text-purple-500',
    description: 'Total badges earned'
  },
  {
    title: 'Engagement Rate',
    value: '78%',
    change: '-2%',
    changeType: 'negative',
    icon: Activity,
    color: 'text-orange-500',
    description: 'Daily active users'
  },
  {
    title: 'Token Velocity',
    value: '4.2x',
    change: '+18%',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'text-indigo-500',
    description: 'Average monthly transactions per user'
  }
]

const categoryStats = [
  { name: 'Academic', count: 1245, percentage: 28, color: 'bg-blue-500', icon: BookOpen },
  { name: 'Social', count: 987, percentage: 22, color: 'bg-green-500', icon: Users },
  { name: 'Tech', count: 756, percentage: 17, color: 'bg-purple-500', icon: Code },
  { name: 'Sports', count: 634, percentage: 14, color: 'bg-orange-500', icon: Dumbbell },
  { name: 'Arts', count: 523, percentage: 12, color: 'bg-pink-500', icon: Palette },
  { name: 'Music', count: 298, percentage: 7, color: 'bg-indigo-500', icon: Music }
]

const topEvents = [
  { name: 'AI Workshop Series', attendees: 234, rating: 4.9, category: 'Tech' },
  { name: 'Campus Music Festival', attendees: 567, rating: 4.8, category: 'Music' },
  { name: 'Coding Competition', attendees: 189, rating: 4.7, category: 'Tech' },
  { name: 'Art Exhibition Opening', attendees: 145, rating: 4.6, category: 'Arts' },
  { name: 'Basketball Tournament', attendees: 298, rating: 4.8, category: 'Sports' }
]

const topUsers = [
  { name: 'Emma Davis', xp: 7890, level: 18, badges: 34, activity: 'High' },
  { name: 'Alex Chen', xp: 5420, level: 15, badges: 23, activity: 'High' },
  { name: 'Sarah Wilson', xp: 4890, level: 14, badges: 19, activity: 'Medium' },
  { name: 'Marcus Johnson', xp: 4250, level: 13, badges: 17, activity: 'Medium' },
  { name: 'Lisa Rodriguez', xp: 3850, level: 12, badges: 15, activity: 'Low' }
]

const recentActivity = [
  {
    type: 'user_joined',
    description: '23 new users joined today',
    time: '2 hours ago',
    icon: Users,
    color: 'text-green-500'
  },
  {
    type: 'event_created',
    description: 'Photography Workshop was created',
    time: '4 hours ago',
    icon: Calendar,
    color: 'text-blue-500'
  },
  {
    type: 'badge_earned',
    description: '45 badges were earned today',
    time: '6 hours ago',
    icon: Award,
    color: 'text-purple-500'
  },
  {
    type: 'token_transaction',
    description: '1,234 tokens were spent in marketplace',
    time: '8 hours ago',
    icon: Coins,
    color: 'text-yellow-500'
  },
  {
    type: 'competition_completed',
    description: 'Coding Competition concluded successfully',
    time: '1 day ago',
    icon: Trophy,
    color: 'text-orange-500'
  }
]

const monthlyGrowth = [
  { month: 'Jan', users: 1200, events: 45, tokens: 89000 },
  { month: 'Feb', users: 1450, events: 52, tokens: 125000 },
  { month: 'Mar', users: 1680, events: 61, tokens: 156000 },
  { month: 'Apr', users: 1950, events: 78, tokens: 198000 },
  { month: 'May', users: 2234, events: 89, tokens: 234000 },
  { month: 'Jun', users: 2567, events: 103, tokens: 289000 },
  { month: 'Jul', users: 2847, events: 126, tokens: 345000 }
]

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth()
  const [selectedTimeRange, setSelectedTimeRange] = React.useState('30d')
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    console.log('Exporting analytics data...')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Monitor platform performance and user engagement</p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                className="border rounded-md px-3 py-2 text-sm"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {overviewStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-muted`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center space-x-1 text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="font-medium">{stat.change}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-12 mb-8">
          {/* Growth Chart */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Platform Growth</span>
              </CardTitle>
              <CardDescription>Monthly user registration and activity trends</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simplified chart representation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Users</span>
                  <span>Events</span>
                  <span>Token Volume</span>
                </div>
                {monthlyGrowth.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{data.month}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-secondary/20 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.users / 3000) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{data.users}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-secondary/20 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.events / 150) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{data.events}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-secondary/20 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.tokens / 400000) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{(data.tokens / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Event Categories</CardTitle>
              <CardDescription>Distribution by participation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryStats.map((category, index) => {
                const Icon = category.icon
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">{category.count}</span>
                      </div>
                      <div className="mt-1 bg-secondary/20 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${category.color}`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium">{category.percentage}%</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Top Events */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Top Events</span>
              </CardTitle>
              <CardDescription>Most popular events by attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{event.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" size="sm">{event.category}</Badge>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{event.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary">#{index + 1}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Users */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Top Users</span>
              </CardTitle>
              <CardDescription>Most active users by XP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{user.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>Level {user.level}</span>
                        <span>•</span>
                        <span>{user.xp} XP</span>
                        <span>•</span>
                        <span>{user.badges} badges</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">#{index + 1}</div>
                    <Badge 
                      variant="outline" 
                      size="sm"
                      className={`text-xs ${
                        user.activity === 'High' ? 'border-green-300 text-green-700' :
                        user.activity === 'Medium' ? 'border-yellow-300 text-yellow-700' :
                        'border-red-300 text-red-700'
                      }`}
                    >
                      {user.activity}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className="p-1 bg-muted rounded-lg">
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center space-x-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start space-x-2 h-auto p-4">
                  <Users className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Manage Users</div>
                    <div className="text-xs text-muted-foreground">View and edit user accounts</div>
                  </div>
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start space-x-2 h-auto p-4">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Create Event</div>
                  <div className="text-xs text-muted-foreground">Add new campus event</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start space-x-2 h-auto p-4">
                <Award className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Manage Badges</div>
                  <div className="text-xs text-muted-foreground">Create and edit badges</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start space-x-2 h-auto p-4">
                <ShoppingBag className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Marketplace</div>
                  <div className="text-xs text-muted-foreground">Manage rewards and items</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}