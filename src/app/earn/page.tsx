'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Navigation } from "@/components/layout/Navigation"
import { useAuth } from "@/hooks/useAuth"
import { 
  Coins,
  Zap,
  Calendar,
  Users,
  BookOpen,
  Trophy,
  Target,
  Gift,
  Clock,
  TrendingUp,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Plus,
  Activity,
  Heart,
  Share2,
  Flame,
  Crown,
  Medal,
  Coffee,
  Camera,
  Code,
  Music
} from "lucide-react"

const earningSources = [
  {
    id: 1,
    title: "Class Attendance",
    description: "Attend your enrolled classes regularly and earn tokens for each session",
    baseReward: "25-50",
    frequency: "Daily",
    difficulty: "Easy",
    icon: BookOpen,
    color: "bg-indigo-500",
    category: "Academic",
    examples: ["Regular class attendance: +25 tokens", "Perfect attendance week: +50 bonus", "90%+ semester rate: +500 milestone bonus"],
    totalEarned: 2625,
    timesCompleted: 105
  },
  {
    id: 2,
    title: "Attend Events",
    description: "Join campus events, workshops, and seminars to earn tokens",
    baseReward: "50-300",
    frequency: "Daily",
    difficulty: "Easy",
    icon: Calendar,
    color: "bg-blue-500",
    category: "Events",
    examples: ["Workshop attendance: +150 tokens", "Seminar participation: +100 tokens", "Competition entry: +200 tokens"],
    totalEarned: 1250,
    timesCompleted: 12
  },
  {
    id: 3,
    title: "Join Clubs & Societies",
    description: "Become an active member of student organizations",
    baseReward: "100-500",
    frequency: "One-time",
    difficulty: "Easy",
    icon: Users,
    color: "bg-green-500",
    category: "Social",
    examples: ["New membership: +200 tokens", "Committee role: +500 tokens", "Leadership position: +1000 tokens"],
    totalEarned: 800,
    timesCompleted: 4
  },
  {
    id: 4,
    title: "Academic Achievements",
    description: "Excel in your studies and get rewarded for academic success",
    baseReward: "200-1000",
    frequency: "Semester",
    difficulty: "Medium",
    icon: BookOpen,
    color: "bg-purple-500",
    category: "Academic",
    examples: ["Assignment submission: +50 tokens", "Quiz completion: +25 tokens", "Project excellence: +500 tokens"],
    totalEarned: 2100,
    timesCompleted: 8
  },
  {
    id: 5,
    title: "Competition Victories",
    description: "Win competitions and contests to earn big rewards",
    baseReward: "500-2000",
    frequency: "Event-based",
    difficulty: "Hard",
    icon: Trophy,
    color: "bg-yellow-500",
    category: "Competition",
    examples: ["1st place: +2000 tokens", "2nd place: +1500 tokens", "3rd place: +1000 tokens", "Participation: +500 tokens"],
    totalEarned: 3500,
    timesCompleted: 3
  },
  {
    id: 6,
    title: "Community Service", 
    description: "Volunteer for campus and community service projects",
    baseReward: "100-400",
    frequency: "Weekly",
    difficulty: "Medium",
    icon: Heart,
    color: "bg-red-500",
    category: "Service",
    examples: ["Campus cleanup: +150 tokens", "Tutoring session: +200 tokens", "Event volunteering: +300 tokens"],
    totalEarned: 900,
    timesCompleted: 6
  },
  {
    id: 7,
    title: "Content Creation",
    description: "Create and share content about campus life and activities",
    baseReward: "75-250",
    frequency: "Daily",
    difficulty: "Medium",
    icon: Camera,
    color: "bg-pink-500",
    category: "Creative",
    examples: ["Blog post: +150 tokens", "Photo feature: +100 tokens", "Video content: +250 tokens"],
    totalEarned: 600,
    timesCompleted: 8
  }
]

const dailyTasks = [
  {
    id: 1,
    title: "Attend Today's Classes",
    description: "Complete attendance for all scheduled classes today",
    reward: 75,
    completed: false,
    streak: 0,
    icon: BookOpen
  },
  {
    id: 2,
    title: "Check in at Campus",
    description: "Daily campus check-in to maintain your streak",
    reward: 25,
    completed: true,
    streak: 7,
    icon: CheckCircle
  },
  {
    id: 3,
    title: "Attend One Event",
    description: "Join any campus event or activity today",
    reward: 100,
    completed: false,
    streak: 0,
    icon: Calendar
  },
  {
    id: 4,
    title: "Interact with Community",
    description: "Comment or react on club posts",
    reward: 50,
    completed: true,
    streak: 3,
    icon: Users
  },
  {
    id: 5,
    title: "Study Session",
    description: "Log a study session in the library or study hall",
    reward: 75,
    completed: false,
    streak: 0,
    icon: BookOpen
  }
]

const weeklyChallenge = {
  title: "Social Butterfly Challenge",
  description: "Join 3 different clubs and attend 5 events this week",
  progress: 60,
  reward: 1000,
  daysLeft: 3,
  participants: 234,
  requirements: [
    { task: "Join 3 clubs", completed: 2, total: 3 },
    { task: "Attend 5 events", completed: 3, total: 5 },
    { task: "Make 10 new connections", completed: 7, total: 10 }
  ]
}

const achievements = [
  {
    id: 1,
    title: "Early Bird",
    description: "Attend 5 morning events",
    progress: 80,
    reward: 500,
    icon: Clock,
    rarity: "common"
  },
  {
    id: 2,
    title: "Social Connector",
    description: "Join 10 different clubs",
    progress: 40,
    reward: 1000,
    icon: Users,
    rarity: "rare"
  },
  {
    id: 3,
    title: "Academic Excellence",
    description: "Maintain 90%+ attendance for a semester",
    progress: 95,
    reward: 2000,
    icon: Crown,
    rarity: "epic"
  }
]

const tokenStats = {
  totalEarned: 8750,
  thisMonth: 1250,
  thisWeek: 300,
  currentStreak: 7,
  longestStreak: 15,
  rank: 23,
  nextMilestone: 10000
}

export default function EarnTokensPage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = React.useState<'earn' | 'tasks' | 'challenges' | 'achievements'>('earn')

  const completeDailyTask = (taskId: number) => {
    // TODO: Implement complete daily task logic
    console.log(`Completing daily task ${taskId}`)
  }

  const joinChallenge = () => {
    // TODO: Implement join challenge logic
    console.log('Joining weekly challenge')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading earn page...</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Earn Campus Coins</h1>
          <p className="text-muted-foreground">Participate in campus activities and earn tokens for your achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{tokenStats.totalEarned.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{tokenStats.thisMonth.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{tokenStats.currentStreak}</div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">#{tokenStats.rank}</div>
                  <p className="text-xs text-muted-foreground">Campus Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-muted rounded-lg">
          {[
            { key: 'earn', label: 'Ways to Earn', icon: Coins },
            { key: 'tasks', label: 'Daily Tasks', icon: CheckCircle },
            { key: 'challenges', label: 'Challenges', icon: Target },
            { key: 'achievements', label: 'Achievements', icon: Award }
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

        {/* Tab Content */}
        {activeTab === 'earn' && (
          <div className="grid gap-6 lg:grid-cols-2">
            {earningSources.map((source) => {
              const Icon = source.icon
              return (
                <Card key={source.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl ${source.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{source.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{source.category}</Badge>
                            <Badge variant="outline" size="sm">{source.difficulty}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {source.baseReward} <Coins className="h-4 w-4 inline text-yellow-500" />
                        </div>
                        <div className="text-xs text-muted-foreground">{source.frequency}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{source.description}</CardDescription>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Examples:</h4>
                      {source.examples.map((example, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-center space-x-2">
                          <ArrowRight className="h-3 w-3" />
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        <div>Total earned: <span className="font-semibold text-primary">{source.totalEarned} tokens</span></div>
                        <div>Completed {source.timesCompleted} times</div>
                      </div>
                      <Button size="sm" className="flex items-center space-x-1">
                        <span>Start Earning</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Daily Tasks</span>
                </CardTitle>
                <CardDescription>Complete daily tasks to maintain your streak and earn bonus tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyTasks.map((task) => {
                  const Icon = task.icon
                  return (
                    <div key={task.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                      task.completed ? 'bg-green-50 border-green-200' : 'hover:bg-muted/50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${task.completed ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          {task.streak > 0 && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              <span className="text-xs text-orange-600">{task.streak} day streak</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Coins className="h-3 w-3 text-yellow-500" />
                          <span>+{task.reward}</span>
                        </Badge>
                        {task.completed ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Button size="sm" onClick={() => completeDailyTask(task.id)}>
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>{weeklyChallenge.title}</span>
                    <Badge variant="default">Weekly</Badge>
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary flex items-center space-x-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span>{weeklyChallenge.reward}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{weeklyChallenge.daysLeft} days left</div>
                  </div>
                </div>
                <CardDescription>{weeklyChallenge.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {weeklyChallenge.requirements.map((req, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{req.task}</span>
                        <span className="text-muted-foreground">{req.completed}/{req.total}</span>
                      </div>
                      <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${(req.completed / req.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      Progress: {weeklyChallenge.progress}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {weeklyChallenge.participants} participants
                    </div>
                  </div>
                  <Button onClick={joinChallenge} className="flex items-center space-x-1">
                    <Plus className="h-3 w-3" />
                    <span>Join Challenge</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              const getRarityColor = (rarity: string) => {
                switch (rarity) {
                  case 'common': return 'border-gray-300 text-gray-600'
                  case 'rare': return 'border-blue-300 text-blue-600'
                  case 'epic': return 'border-purple-300 text-purple-600'
                  case 'legendary': return 'border-yellow-300 text-yellow-600'
                  default: return 'border-gray-300 text-gray-600'
                }
              }

              return (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-muted rounded-xl">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{achievement.description}</CardDescription>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="text-muted-foreground">{achievement.progress}%</span>
                      </div>
                      <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Coins className="h-3 w-3 text-yellow-500" />
                        <span>+{achievement.reward}</span>
                      </Badge>
                      {achievement.progress === 100 && (
                        <Badge variant="default" className="bg-green-500">
                          <Medal className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}