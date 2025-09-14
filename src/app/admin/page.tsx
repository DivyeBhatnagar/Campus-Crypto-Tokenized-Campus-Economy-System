'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Navigation } from "@/components/layout/Navigation"
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Award, 
  Settings, 
  Plus,
  ArrowRight,
  UserPlus,
  CalendarPlus,
  Bell,
  BarChart3,
  Shield,
  Crown,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  Coins,
  Activity
} from "lucide-react"

// Mock admin user
const mockAdmin = {
  id: "admin1",
  email: "admin@university.edu", 
  role: "admin" as const,
  name: "Admin",
  avatar: ""
}

const analyticsData = {
  totalUsers: 2847,
  activeToday: 342,
  totalEvents: 156,
  upcomingEvents: 23,
  totalClubs: 84,
  activeClubs: 67,
  tokensDistributed: 125420,
  badgesAwarded: 892
}

const recentUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@university.edu", joinDate: "2 hours ago", status: "active" },
  { id: 2, name: "Bob Chen", email: "bob@university.edu", joinDate: "5 hours ago", status: "pending" },
  { id: 3, name: "Carol Wilson", email: "carol@university.edu", joinDate: "1 day ago", status: "active" },
  { id: 4, name: "David Brown", email: "david@university.edu", joinDate: "2 days ago", status: "active" }
]

const pendingEvents = [
  { 
    id: 1, 
    title: "Photography Workshop", 
    organizer: "Photography Club", 
    date: "Dec 15, 2024",
    status: "pending_approval",
    attendees: 0 
  },
  { 
    id: 2, 
    title: "Coding Bootcamp", 
    organizer: "CS Society", 
    date: "Dec 18, 2024",
    status: "pending_approval",
    attendees: 0 
  },
  { 
    id: 3, 
    title: "Music Festival", 
    organizer: "Music Club", 
    date: "Dec 20, 2024",
    status: "pending_approval",
    attendees: 0 
  }
]

const recentActivity = [
  { type: "user_join", message: "15 new users joined today", time: "2 hours ago", icon: UserPlus },
  { type: "event_created", message: "AI Workshop created by Tech Club", time: "4 hours ago", icon: CalendarPlus },
  { type: "badge_awarded", message: "25 achievement badges awarded", time: "6 hours ago", icon: Award },
  { type: "announcement", message: "New semester guidelines posted", time: "1 day ago", icon: Bell }
]

const quickStats = [
  { label: "Total Students", value: analyticsData.totalUsers, change: "+12%", icon: Users, color: "text-blue-500" },
  { label: "Active Today", value: analyticsData.activeToday, change: "+8%", icon: Activity, color: "text-green-500" },
  { label: "Total Events", value: analyticsData.totalEvents, change: "+15%", icon: Calendar, color: "text-purple-500" },
  { label: "Tokens Distributed", value: `${(analyticsData.tokensDistributed / 1000).toFixed(0)}K`, change: "+22%", icon: Coins, color: "text-secondary" }
]

const managementActions = [
  { label: "Add User", href: "/admin/users/add", icon: UserPlus, color: "bg-blue-500", description: "Create new student or admin account" },
  { label: "Create Event", href: "/admin/events/create", icon: CalendarPlus, color: "bg-green-500", description: "Schedule new campus event" },
  { label: "Send Announcement", href: "/admin/announcements", icon: Bell, color: "bg-purple-500", description: "Post campus-wide announcement" },
  { label: "View Analytics", href: "/admin/analytics", icon: BarChart3, color: "bg-secondary", description: "Review engagement metrics" }
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation user={mockAdmin} />
      
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="h-6 w-6 text-secondary" />
            <h1 className="text-3xl font-bold text-foreground">Welcome, Admin 👑</h1>
          </div>
          <p className="text-muted-foreground">Manage your campus community and track engagement</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-8">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <Badge variant="secondary" size="sm">{stat.change}</Badge>
                          </div>
                        </div>
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Management Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Quick Management</span>
                </CardTitle>
                <CardDescription>Common administrative actions</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {managementActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.href}>
                      <Card className="cursor-pointer transition-all hover:shadow-neumorphic-lg hover:-translate-y-1" padding="sm">
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color} text-white`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{action.label}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Recent Users</span>
                  </CardTitle>
                  <Link href="/admin/users">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-xl shadow-neumorphic-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{user.joinDate}</div>
                          <Badge 
                            variant={user.status === 'active' ? 'success' : 'outline'}
                            size="sm"
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Event Approvals */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-secondary" />
                    <span>Pending Event Approvals</span>
                  </CardTitle>
                  <Badge variant="outline">{pendingEvents.length} pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 rounded-xl shadow-neumorphic-sm">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span>by {event.organizer}</span>
                          <span>•</span>
                          <span>{event.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* System Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  <span>System Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Clubs</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{analyticsData.totalClubs}</span>
                    <Badge variant="success" size="sm">{analyticsData.activeClubs} active</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Upcoming Events</span>
                  <span className="font-medium">{analyticsData.upcomingEvents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Badges Awarded</span>
                  <span className="font-medium">{analyticsData.badgesAwarded}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Token Supply</span>
                  <span className="font-medium">{analyticsData.tokensDistributed.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-xl shadow-neumorphic-sm">
                      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">{activity.message}</div>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-secondary" />
                  <span>Quick Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "User Management", href: "/admin/users" },
                  { label: "Event Management", href: "/admin/events" },
                  { label: "Club Management", href: "/admin/clubs" },
                  { label: "Analytics Dashboard", href: "/admin/analytics" },
                  { label: "System Settings", href: "/admin/settings" },
                  { label: "Backup & Security", href: "/admin/security" }
                ].map((link, index) => (
                  <Link key={index} href={link.href}>
                    <Button variant="ghost" className="w-full justify-start">
                      {link.label}
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
