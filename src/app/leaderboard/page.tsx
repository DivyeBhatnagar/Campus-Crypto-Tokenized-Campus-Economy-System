'use client'

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Navigation } from "@/components/layout/Navigation"
import { 
  Trophy, Medal, Crown, Star, TrendingUp, Calendar, Users, Award, Coins, Target, Filter, Flame
} from "lucide-react"

const mockUser = {
  id: "1", email: "divye@university.edu", role: "student" as const, name: "Divye", xp: 2847, level: 12
}

const leaderboardData = [
  { rank: 1, name: "Alex Chen", avatar: "AC", xp: 5420, level: 18, badges: 15, streak: 28, trend: "up" },
  { rank: 2, name: "Sarah Wilson", avatar: "SW", xp: 4890, level: 16, badges: 12, streak: 15, trend: "up" },
  { rank: 3, name: "Marcus Johnson", avatar: "MJ", xp: 4250, level: 15, badges: 11, streak: 22, trend: "stable" },
  { rank: 4, name: "Emily Davis", avatar: "ED", xp: 3980, level: 14, badges: 9, streak: 12, trend: "up" },
  { rank: 5, name: "Divye", avatar: "DV", xp: 2847, level: 12, badges: 7, streak: 5, trend: "up" }
]

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = React.useState<"week" | "month" | "all">("week")
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    return <div className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={mockUser} />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Leaderboard 🏆</h1>
          <p className="text-muted-foreground">See how you rank against your fellow students</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time Period:</span>
                  {(["week", "month", "all"] as const).map((period) => (
                    <Button
                      key={period}
                      variant={timeFilter === period ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setTimeFilter(period)}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-secondary" />
                  <span>Top Students</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboardData.map((student) => (
                  <div 
                    key={student.rank} 
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      student.name === mockUser.name 
                        ? "bg-primary/5 border border-primary/20 shadow-neumorphic-lg" 
                        : "shadow-neumorphic-sm hover:shadow-neumorphic"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10">
                        {getRankIcon(student.rank)}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted font-medium">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{student.name}</div>
                        <div className="text-sm text-muted-foreground">Level {student.level}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{student.xp.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="text-lg font-bold">{student.streak}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Streak</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{student.badges} badges</Badge>
                        {getTrendIcon(student.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Rank</span>
                  <Badge variant="primary">#5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">XP This Week</span>
                  <span className="font-medium">+425 XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Badges Earned</span>
                  <span className="font-medium">7</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Event Explorer", icon: Calendar, rarity: "common" },
                  { name: "Social Butterfly", icon: Users, rarity: "rare" }
                ].map((achievement, index) => {
                  const Icon = achievement.icon
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-xl shadow-neumorphic-sm">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">{achievement.name}</div>
                        <Badge variant="outline" size="sm">{achievement.rarity}</Badge>
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