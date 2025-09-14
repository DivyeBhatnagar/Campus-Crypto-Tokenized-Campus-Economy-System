'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Navigation } from "@/components/layout/Navigation"
import { useAuth } from "@/hooks/useAuth"
import { 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Coins,
  Award,
  Target,
  Flame,
  Star,
  BookOpen,
  User,
  MapPin,
  Zap,
  Trophy,
  Gift,
  Bell,
  Eye
} from "lucide-react"

const currentSemesterClasses = [
  {
    id: 1,
    name: "Computer Science 101",
    code: "CS101",
    instructor: "Dr. Smith",
    schedule: "Mon/Wed/Fri 9:00 AM",
    location: "Tech Building, Room 205",
    totalClasses: 45,
    attendedClasses: 42,
    missedClasses: 3,
    attendanceRate: 93.3,
    tokensPerClass: 25,
    totalTokensEarned: 1050,
    nextClass: "2024-02-15T09:00:00",
    recentAttendance: [true, true, false, true, true, true, true], // Last 7 classes
    milestoneReached: "90% Club"
  },
  {
    id: 2,
    name: "Mathematics 201",
    code: "MATH201",
    instructor: "Prof. Johnson",
    schedule: "Tue/Thu 2:00 PM",
    location: "Science Building, Room 301",
    totalClasses: 30,
    attendedClasses: 28,
    missedClasses: 2,
    attendanceRate: 93.3,
    tokensPerClass: 25,
    totalTokensEarned: 700,
    nextClass: "2024-02-15T14:00:00",
    recentAttendance: [true, true, true, false, true, true, true],
    milestoneReached: "90% Club"
  },
  {
    id: 3,
    name: "Physics 102",
    code: "PHY102",
    instructor: "Dr. Wilson",
    schedule: "Mon/Wed 11:00 AM",
    location: "Science Building, Room 105",
    totalClasses: 40,
    attendedClasses: 35,
    missedClasses: 5,
    attendanceRate: 87.5,
    tokensPerClass: 25,
    totalTokensEarned: 875,
    nextClass: "2024-02-15T11:00:00",
    recentAttendance: [true, false, true, true, false, true, true],
    milestoneReached: null
  }
]

const attendanceStats = {
  overallRate: 91.2,
  totalClasses: 115,
  attendedClasses: 105,
  missedClasses: 10,
  currentStreak: 8,
  longestStreak: 15,
  totalTokensEarned: 2625,
  milestoneBonus: 500,
  weeklyGoal: 95
}

const attendanceMilestones = [
  { threshold: 80, reward: 100, badge: "Consistent Student", achieved: true },
  { threshold: 85, reward: 200, badge: "Dedicated Learner", achieved: true },
  { threshold: 90, reward: 500, badge: "90% Club", achieved: true },
  { threshold: 95, reward: 1000, badge: "Excellence Award", achieved: false },
  { threshold: 98, reward: 2000, badge: "Perfect Attendance", achieved: false }
]

const todaysClasses = [
  {
    id: 1,
    name: "Computer Science 101",
    time: "9:00 AM",
    location: "Tech Building, Room 205",
    status: "attended",
    tokensEarned: 25,
    bonusTokens: 5
  },
  {
    id: 2,
    name: "Physics 102", 
    time: "11:00 AM",
    location: "Science Building, Room 105",
    status: "upcoming",
    tokensEarned: 0,
    bonusTokens: 0
  },
  {
    id: 3,
    name: "Mathematics 201",
    time: "2:00 PM", 
    location: "Science Building, Room 301",
    status: "upcoming",
    tokensEarned: 0,
    bonusTokens: 0
  }
]

export default function AttendancePage() {
  const { user, loading } = useAuth()
  const [selectedClass, setSelectedClass] = React.useState<number | null>(null)

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600 bg-green-50"
    if (rate >= 90) return "text-blue-600 bg-blue-50"
    if (rate >= 80) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'attended': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'missed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'upcoming': return <Clock className="h-4 w-4 text-blue-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading attendance...</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Class Attendance</h1>
          <p className="text-muted-foreground">Track your attendance and earn tokens for every class you attend</p>
        </div>

        {/* Overall Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{attendanceStats.overallRate}%</div>
                  <p className="text-xs text-muted-foreground">Overall Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{attendanceStats.currentStreak}</div>
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{attendanceStats.totalTokensEarned}</div>
                  <p className="text-xs text-muted-foreground">Tokens Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{attendanceStats.milestoneBonus}</div>
                  <p className="text-xs text-muted-foreground">Milestone Bonus</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-8">
            {/* Today's Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Today's Classes</span>
                </CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(classItem.status)}
                      <div>
                        <h3 className="font-medium">{classItem.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{classItem.time}</span>
                          <MapPin className="h-3 w-3" />
                          <span>{classItem.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {classItem.status === 'attended' ? (
                        <div className="space-y-1">
                          <Badge variant="default" className="bg-green-500">Attended</Badge>
                          <div className="text-sm flex items-center space-x-1">
                            <Coins className="h-3 w-3 text-yellow-500" />
                            <span>+{classItem.tokensEarned + classItem.bonusTokens}</span>
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline">Upcoming</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Class List */}
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>Track attendance for all your enrolled classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSemesterClasses.map((classData) => (
                  <div key={classData.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{classData.name}</h3>
                        <p className="text-sm text-muted-foreground">{classData.code} • {classData.instructor}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span>{classData.schedule}</span>
                          <span>{classData.location}</span>
                        </div>
                      </div>
                      <Badge className={getAttendanceColor(classData.attendanceRate)}>
                        {classData.attendanceRate}%
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{classData.attendedClasses}</div>
                        <div className="text-xs text-muted-foreground">Attended</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{classData.missedClasses}</div>
                        <div className="text-xs text-muted-foreground">Missed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">{classData.totalTokensEarned}</div>
                        <div className="text-xs text-muted-foreground">Tokens Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{classData.tokensPerClass}</div>
                        <div className="text-xs text-muted-foreground">Per Class</div>
                      </div>
                    </div>

                    {/* Recent Attendance Pattern */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Last 7 Classes:</div>
                      <div className="flex space-x-1">
                        {classData.recentAttendance.map((attended, index) => (
                          <div
                            key={index}
                            className={`h-6 w-6 rounded-full flex items-center justify-center ${
                              attended ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}
                          >
                            {attended ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {classData.milestoneReached && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg flex items-center space-x-2">
                        <Award className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-700">
                          🎉 Milestone Achieved: {classData.milestoneReached}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Attendance Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Milestones</span>
                </CardTitle>
                <CardDescription>Bonus rewards for high attendance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {attendanceMilestones.map((milestone, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    milestone.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{milestone.threshold}% Attendance</div>
                        <div className="text-xs text-muted-foreground">{milestone.badge}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-sm">
                          <Coins className="h-3 w-3 text-yellow-500" />
                          <span>+{milestone.reward}</span>
                        </div>
                        {milestone.achieved && (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Weekly Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-primary">{attendanceStats.weeklyGoal}%</div>
                  <div className="text-sm text-muted-foreground">Target Attendance</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{attendanceStats.overallRate}%</span>
                  </div>
                  <div className="h-2 bg-secondary/20 rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((attendanceStats.overallRate / attendanceStats.weeklyGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                {attendanceStats.overallRate >= attendanceStats.weeklyGoal && (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg text-center">
                    <Trophy className="h-4 w-4 text-green-500 mx-auto mb-1" />
                    <div className="text-sm font-medium text-green-700">Goal Achieved!</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  View Detailed Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Attendance Reminders
                </Button>
                <Link href="/earn">
                  <Button variant="outline" className="w-full justify-start">
                    <Gift className="h-4 w-4 mr-2" />
                    More Ways to Earn
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}