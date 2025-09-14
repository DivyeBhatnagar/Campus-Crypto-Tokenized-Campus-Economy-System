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
  User,
  Edit3,
  Save,
  Camera,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Award,
  Trophy,
  Users,
  Zap,
  Star,
  Crown,
  Shield,
  Settings,
  Bell,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Code,
  Palette,
  Music,
  Dumbbell,
  Heart,
  Gift,
  TrendingUp,
  Activity,
  Clock
} from "lucide-react"

const socialIcons = {
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  website: Globe
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [isEditing, setIsEditing] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'profile' | 'achievements' | 'activity' | 'settings'>('profile')
  
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Computer Science student passionate about AI and machine learning. Active member of several campus organizations.',
    location: 'Campus Dormitory B, Room 205',
    phone: '+1 (555) 123-4567',
    major: 'Computer Science',
    year: 'Junior',
    graduationYear: '2025',
    interests: ['Programming', 'AI/ML', 'Photography', 'Music', 'Gaming'],
    social: {
      github: 'https://github.com/student',
      twitter: 'https://twitter.com/student',
      instagram: 'https://instagram.com/student',
      linkedin: 'https://linkedin.com/in/student',
      website: 'https://student.dev'
    }
  })

  const [privacySettings, setPrivacySettings] = React.useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showStats: true,
    showBadges: true,
    showActivity: true
  })

  const userStats = {
    totalXP: 8750,
    level: 12,
    rank: 23,
    badgesEarned: 18,
    eventsAttended: 45,
    clubsJoined: 6,
    streak: 15,
    hoursStudied: 284,
    projectsCompleted: 12
  }

  const recentActivity = [
    {
      id: 1,
      type: 'badge',
      title: 'Earned "Academic Excellence" badge',
      description: 'Maintained 90%+ attendance for the semester',
      date: '2 days ago',
      icon: Award,
      color: 'text-purple-500'
    },
    {
      id: 2,
      type: 'event',
      title: 'Attended AI Workshop Series',
      description: 'Participated in hands-on machine learning session',
      date: '3 days ago',
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      id: 3,
      type: 'club',
      title: 'Joined Photography Club',
      description: 'Became a member of the campus photography community',
      date: '1 week ago',
      icon: Users,
      color: 'text-green-500'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Reached Level 12',
      description: 'Gained enough XP to level up!',
      date: '1 week ago',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      id: 5,
      type: 'competition',
      title: 'Won 2nd Place in Coding Competition',
      description: 'Excellent performance in algorithm challenges',
      date: '2 weeks ago',
      icon: Trophy,
      color: 'text-orange-500'
    }
  ]

  const achievements = [
    { name: 'Academic Excellence', rarity: 'epic', date: '2 days ago' },
    { name: 'Social Butterfly', rarity: 'rare', date: '1 week ago' },
    { name: 'Code Master', rarity: 'legendary', date: '2 weeks ago' },
    { name: 'Event Explorer', rarity: 'common', date: '3 weeks ago' },
    { name: 'Community Champion', rarity: 'epic', date: '1 month ago' }
  ]

  const handleSave = () => {
    // TODO: Implement save profile logic
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: 'Computer Science student passionate about AI and machine learning. Active member of several campus organizations.',
      location: 'Campus Dormitory B, Room 205',
      phone: '+1 (555) 123-4567',
      major: 'Computer Science',
      year: 'Junior',
      graduationYear: '2025',
      interests: ['Programming', 'AI/ML', 'Photography', 'Music', 'Gaming'],
      social: {
        github: 'https://github.com/student',
        twitter: 'https://twitter.com/student',
        instagram: 'https://instagram.com/student',
        linkedin: 'https://linkedin.com/in/student',
        website: 'https://student.dev'
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">Manage your account information and privacy settings</p>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-muted rounded-lg">
          {[
            { key: 'profile', label: 'Profile', icon: User },
            { key: 'achievements', label: 'Achievements', icon: Award },
            { key: 'activity', label: 'Activity', icon: Activity },
            { key: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Main Profile Info */}
            <div className="space-y-6 lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture & Basic Info */}
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                        {formData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {isEditing && (
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="absolute -bottom-2 -right-2"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                          {isEditing ? (
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-lg font-semibold">{formData.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          {isEditing ? (
                            <Input
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-lg">{formData.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="mt-1 w-full p-3 border rounded-md resize-none h-20"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="mt-1 text-muted-foreground">{formData.bio}</p>
                    )}
                  </div>

                  {/* Academic Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Major</label>
                      {isEditing ? (
                        <Input
                          value={formData.major}
                          onChange={(e) => setFormData({...formData, major: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1">{formData.major}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Academic Year</label>
                      {isEditing ? (
                        <select 
                          value={formData.year}
                          onChange={(e) => setFormData({...formData, year: e.target.value})}
                          className="mt-1 w-full p-2 border rounded-md"
                        >
                          <option value="Freshman">Freshman</option>
                          <option value="Sophomore">Sophomore</option>
                          <option value="Junior">Junior</option>
                          <option value="Senior">Senior</option>
                          <option value="Graduate">Graduate</option>
                        </select>
                      ) : (
                        <p className="mt-1">{formData.year}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      {isEditing ? (
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1">{formData.location}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      {isEditing ? (
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1">{formData.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Interests</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Connect your social profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(formData.social).map(([platform, url]) => {
                    const Icon = socialIcons[platform as keyof typeof socialIcons]
                    return (
                      <div key={platform} className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-muted-foreground capitalize">
                            {platform}
                          </label>
                          {isEditing ? (
                            <Input
                              value={url}
                              onChange={(e) => setFormData({
                                ...formData, 
                                social: {...formData.social, [platform]: e.target.value}
                              })}
                              className="mt-1"
                              placeholder={`Your ${platform} URL`}
                            />
                          ) : (
                            <p className="mt-1 text-sm">{url}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6 lg:col-span-4">
              {/* Level & XP */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span>Level & Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">Level {userStats.level}</div>
                    <div className="text-sm text-muted-foreground">{userStats.totalXP} XP</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Level {userStats.level + 1}</span>
                      <span>75%</span>
                    </div>
                    <div className="h-2 bg-secondary/20 rounded-full">
                      <div className="h-full bg-primary rounded-full w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{userStats.rank}</div>
                      <div className="text-xs text-muted-foreground">Campus Rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">{userStats.badgesEarned}</div>
                      <div className="text-xs text-muted-foreground">Badges</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{userStats.eventsAttended}</div>
                      <div className="text-xs text-muted-foreground">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{userStats.clubsJoined}</div>
                      <div className="text-xs text-muted-foreground">Clubs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                      <Award className="h-4 w-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground">{achievement.date}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        size="sm"
                        className={`text-xs ${
                          achievement.rarity === 'legendary' ? 'border-yellow-300 text-yellow-700' :
                          achievement.rarity === 'epic' ? 'border-purple-300 text-purple-700' :
                          achievement.rarity === 'rare' ? 'border-blue-300 text-blue-700' :
                          'border-gray-300 text-gray-700'
                        }`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  ))}
                  <Link href="/badges">
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Badges
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab === 'achievements' && (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Achievements Coming Soon</h3>
            <p className="text-muted-foreground">Detailed achievements view will be available soon</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon
              return (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(privacySettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrivacySettings({
                        ...privacySettings,
                        [key]: typeof value === 'boolean' ? !value : value
                      })}
                    >
                      {typeof value === 'boolean' ? (value ? 'On' : 'Off') : value}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}