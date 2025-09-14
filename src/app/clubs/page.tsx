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
  Users, 
  Search,
  Filter,
  Star,
  Heart,
  Share2,
  Plus,
  BookOpen,
  Code,
  Palette,
  Music,
  Dumbbell,
  Camera,
  Coffee,
  Trophy,
  Globe,
  Calendar,
  MapPin,
  Clock,
  UserPlus,
  Crown,
  Award,
  Activity
} from "lucide-react"

const clubCategories = [
  { name: "All", icon: Star, color: "bg-gray-100 text-gray-800", count: 28 },
  { name: "Academic", icon: BookOpen, color: "bg-blue-100 text-blue-800", count: 8 },
  { name: "Technology", icon: Code, color: "bg-indigo-100 text-indigo-800", count: 5 },
  { name: "Arts & Culture", icon: Palette, color: "bg-pink-100 text-pink-800", count: 4 },
  { name: "Music & Dance", icon: Music, color: "bg-purple-100 text-purple-800", count: 3 },
  { name: "Sports", icon: Dumbbell, color: "bg-green-100 text-green-800", count: 6 },
  { name: "Social Service", icon: Users, color: "bg-yellow-100 text-yellow-800", count: 2 }
]

const featuredClubs = [
  {
    id: 1,
    name: "Computer Science Society",
    description: "A community for CS students to share knowledge, work on projects, and prepare for careers in tech. We organize hackathons, coding workshops, and industry talks.",
    category: "Technology",
    members: 245,
    founded: "2018",
    meetingSchedule: "Wednesdays, 6:00 PM",
    location: "CS Building, Room 301",
    tags: ["Programming", "Hackathons", "Networking", "Career"],
    president: "Alex Chen",
    isJoined: false,
    isFeatured: true,
    upcomingEvents: 3,
    recentActivity: "Posted: Spring Hackathon Registration Open",
    socialLinks: {
      website: "https://cs-society.edu",
      discord: "https://discord.gg/cs-society"
    },
    achievements: ["Best Tech Club 2023", "Most Active Community"]
  },
  {
    id: 2,
    name: "Photography Club",
    description: "Capture life through your lens! Join fellow photographers to learn techniques, share work, and participate in photo walks around campus and city.",
    category: "Arts & Culture",
    members: 128,
    founded: "2019",
    meetingSchedule: "Fridays, 4:00 PM",
    location: "Art Building, Studio 2B",
    tags: ["Photography", "Creative", "Workshops", "Exhibition"],
    president: "Sarah Wilson",
    isJoined: true,
    isFeatured: true,
    upcomingEvents: 2,
    recentActivity: "Shared: Campus Spring Exhibition Photos",
    socialLinks: {
      instagram: "@campusphotography",
      website: "https://photography.club.edu"
    },
    achievements: ["Excellence in Arts 2023"]
  },
  {
    id: 3,
    name: "Debate Society",
    description: "Sharpen your argumentative skills and critical thinking. We participate in inter-collegiate debates and host weekly practice sessions.",
    category: "Academic",
    members: 89,
    founded: "2015",
    meetingSchedule: "Tuesdays, 7:00 PM",
    location: "Library, Conference Room A",
    tags: ["Debate", "Public Speaking", "Critical Thinking", "Competition"],
    president: "Marcus Johnson",
    isJoined: false,
    isFeatured: false,
    upcomingEvents: 1,
    recentActivity: "Won: Regional Debate Championship",
    socialLinks: {
      facebook: "Campus Debate Society"
    },
    achievements: ["Regional Champions 2023", "Best Speakers Award"]
  },
  {
    id: 4,
    name: "Environmental Action Group",
    description: "Making campus and community more sustainable. Join us for clean-up drives, awareness campaigns, and green initiatives.",
    category: "Social Service",
    members: 156,
    founded: "2017",
    meetingSchedule: "Saturdays, 10:00 AM",
    location: "Student Union, Green Room",
    tags: ["Environment", "Sustainability", "Community", "Activism"],
    president: "Emma Davis",
    isJoined: true,
    isFeatured: true,
    upcomingEvents: 4,
    recentActivity: "Organized: Campus Clean-Up Drive",
    socialLinks: {
      instagram: "@campusgreen",
      website: "https://green.campus.edu"
    },
    achievements: ["Campus Sustainability Award 2023"]
  },
  {
    id: 5,
    name: "Music Society",
    description: "For all music lovers! Whether you play instruments, sing, or just love music, join our jam sessions, concerts, and music appreciation events.",
    category: "Music & Dance",
    members: 97,
    founded: "2016",
    meetingSchedule: "Thursdays, 6:30 PM",
    location: "Music Building, Main Hall",
    tags: ["Music", "Instruments", "Concerts", "Jam Sessions"],
    president: "Lisa Rodriguez",
    isJoined: false,
    isFeatured: false,
    upcomingEvents: 2,
    recentActivity: "Announced: Spring Concert Auditions",
    socialLinks: {
      youtube: "Campus Music Society",
      instagram: "@campusmusic"
    },
    achievements: ["Best Performance 2023"]
  },
  {
    id: 6,
    name: "Basketball Club",
    description: "Play competitive basketball and represent the campus in tournaments. All skill levels welcome for practice sessions and friendly matches.",
    category: "Sports",
    members: 67,
    founded: "2020",
    meetingSchedule: "Mon/Wed/Fri, 5:00 PM",
    location: "Sports Complex, Court 1",
    tags: ["Basketball", "Sports", "Tournament", "Fitness"],
    president: "Jordan Smith",
    isJoined: false,
    isFeatured: false,
    upcomingEvents: 1,
    recentActivity: "Victory: Inter-College Championship",
    socialLinks: {
      instagram: "@campusbasketball"
    },
    achievements: ["Inter-College Champions 2023"]
  }
]

export default function ClubsPage() {
  const { user, loading } = useAuth()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [filteredClubs, setFilteredClubs] = React.useState(featuredClubs)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  React.useEffect(() => {
    let filtered = featuredClubs

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(club => club.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredClubs(filtered)
  }, [searchTerm, selectedCategory])

  const handleJoinClub = (clubId: number) => {
    // TODO: Implement join club logic
    console.log(`Joining club ${clubId}`)
  }

  const handleFavoriteClub = (clubId: number) => {
    // TODO: Implement favorite club logic
    console.log(`Toggling favorite for club ${clubId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading clubs...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Clubs & Societies</h1>
              <p className="text-muted-foreground">Find your community and connect with like-minded students</p>
            </div>
            {user?.role === 'admin' && (
              <Button variant="primary" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Club</span>
              </Button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clubs, interests, or activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <div className="grid grid-cols-2 gap-0.5 h-4 w-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <div className="space-y-1 h-4 w-4">
                  <div className="h-1 bg-current rounded"></div>
                  <div className="h-1 bg-current rounded"></div>
                  <div className="h-1 bg-current rounded"></div>
                </div>
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
                {clubCategories.map((category) => {
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

            {/* My Clubs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Clubs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {featuredClubs.filter(club => club.isJoined).map((club) => (
                  <div key={club.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{club.name}</p>
                      <p className="text-xs text-muted-foreground">{club.members} members</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All My Clubs
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Clubs</span>
                  <span className="font-bold">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Your Memberships</span>
                  <span className="font-bold text-primary">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Most Active</span>
                  <span className="font-bold text-secondary">Tech</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clubs List */}
          <div className="space-y-6 lg:col-span-9">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredClubs.length} clubs found
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              <select className="border rounded-md px-3 py-1 text-sm">
                <option>Sort by Members</option>
                <option>Sort by Name</option>
                <option>Sort by Activity</option>
                <option>Sort by Founded</option>
              </select>
            </div>

            {/* Clubs Grid/List */}
            <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2' : 'space-y-4'}>
              {filteredClubs.map((club) => (
                <Card key={club.id} className={`hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                  <CardHeader className={`${viewMode === 'list' ? 'flex-1' : ''} pb-4`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{club.category}</Badge>
                          {club.isFeatured && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {club.isJoined && (
                            <Badge variant="default">
                              <Users className="h-3 w-3 mr-1" />
                              Member
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl leading-tight mb-2">
                          {club.name}
                        </CardTitle>
                        <CardDescription className={`text-sm ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                          {club.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFavoriteClub(club.id)}
                        className="shrink-0"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className={`space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    {/* Club Info */}
                    <div className={`grid gap-2 text-sm text-muted-foreground ${viewMode === 'list' ? 'grid-cols-2' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>{club.members} members</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{club.meetingSchedule}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>{club.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>Founded {club.founded}</span>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Recent Activity</p>
                      <p className="text-sm">{club.recentActivity}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {club.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="outline" size="sm" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {club.tags.length > 4 && (
                        <Badge variant="outline" size="sm" className="text-xs">
                          +{club.tags.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Achievements */}
                    {club.achievements.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">
                          {club.achievements[0]}
                          {club.achievements.length > 1 && ` +${club.achievements.length - 1} more`}
                        </span>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Crown className="h-3 w-3 text-amber-500" />
                          <span className="text-xs text-muted-foreground">{club.president}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-muted-foreground">
                            {club.upcomingEvents} events
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        {club.isJoined ? (
                          <Badge variant="default">Joined</Badge>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleJoinClub(club.id)}
                            className="flex items-center space-x-1"
                          >
                            <UserPlus className="h-3 w-3" />
                            <span>Join</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {filteredClubs.length > 0 && (
              <div className="text-center pt-6">
                <Button variant="outline" size="lg">
                  Load More Clubs
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredClubs.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No clubs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or category filters
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
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