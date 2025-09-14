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
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Filter,
  Zap,
  BookOpen,
  Code,
  Palette,
  Music,
  Dumbbell,
  Camera,
  Coffee,
  Trophy,
  Star,
  Heart,
  Share2,
  Plus
} from "lucide-react"

const eventCategories = [
  { name: "All", icon: Star, color: "bg-gray-100 text-gray-800", count: 48 },
  { name: "Academic", icon: BookOpen, color: "bg-blue-100 text-blue-800", count: 12 },
  { name: "Tech", icon: Code, color: "bg-indigo-100 text-indigo-800", count: 8 },
  { name: "Arts", icon: Palette, color: "bg-pink-100 text-pink-800", count: 5 },
  { name: "Music", icon: Music, color: "bg-purple-100 text-purple-800", count: 3 },
  { name: "Sports", icon: Dumbbell, color: "bg-green-100 text-green-800", count: 7 },
  { name: "Social", icon: Users, color: "bg-yellow-100 text-yellow-800", count: 13 }
]

const upcomingEvents = [
  {
    id: 1,
    title: "AI & Machine Learning Workshop Series",
    description: "Hands-on workshop covering the fundamentals of AI/ML with real-world applications and Python coding exercises.",
    date: "2024-01-20",
    time: "2:00 PM - 5:00 PM",
    location: "Tech Lab 205, Engineering Building",
    category: "Tech",
    xpReward: 150,
    attendees: 45,
    maxAttendees: 60,
    organizer: "Computer Science Club",
    difficulty: "Intermediate",
    tags: ["Python", "AI", "Workshop", "Hands-on"],
    image: "/api/placeholder/400/200",
    isJoined: false,
    isFavorite: false
  },
  {
    id: 2,
    title: "Photography Exhibition Opening",
    description: "Showcase of student photography work from the past semester, featuring various themes and techniques.",
    date: "2024-01-18",
    time: "6:00 PM - 9:00 PM",
    location: "Art Gallery, Creative Arts Building",
    category: "Arts",
    xpReward: 100,
    attendees: 23,
    maxAttendees: 100,
    organizer: "Photography Club",
    difficulty: "Beginner",
    tags: ["Photography", "Exhibition", "Art", "Networking"],
    image: "/api/placeholder/400/200",
    isJoined: true,
    isFavorite: true
  },
  {
    id: 3,
    title: "Campus Coding Competition 2024",
    description: "Annual coding competition with exciting challenges and prizes. Teams of up to 3 members welcome.",
    date: "2024-01-25",
    time: "10:00 AM - 6:00 PM",
    location: "Computer Science Building, Main Hall",
    category: "Tech",
    xpReward: 300,
    attendees: 78,
    maxAttendees: 120,
    organizer: "ACM Student Chapter",
    difficulty: "Advanced",
    tags: ["Competition", "Coding", "Team", "Prizes"],
    image: "/api/placeholder/400/200",
    isJoined: false,
    isFavorite: false
  },
  {
    id: 4,
    title: "Yoga & Wellness Session",
    description: "Relaxing yoga session followed by mindfulness meditation and wellness tips for students.",
    date: "2024-01-19",
    time: "5:00 PM - 6:30 PM",
    location: "Campus Green (Weather permitting) / Gym",
    category: "Sports",
    xpReward: 75,
    attendees: 32,
    maxAttendees: 40,
    organizer: "Wellness Committee",
    difficulty: "Beginner",
    tags: ["Yoga", "Wellness", "Meditation", "Health"],
    image: "/api/placeholder/400/200",
    isJoined: false,
    isFavorite: true
  },
  {
    id: 5,
    title: "Coffee & Code: Open Source Contributions",
    description: "Informal meetup to discuss open source projects and contribute to community repositories.",
    date: "2024-01-22",
    time: "7:00 PM - 9:00 PM",
    location: "Student Union, Cafe Area",
    category: "Tech",
    xpReward: 80,
    attendees: 18,
    maxAttendees: 25,
    organizer: "Open Source Society",
    difficulty: "Intermediate",
    tags: ["Open Source", "Networking", "Coffee", "Casual"],
    image: "/api/placeholder/400/200",
    isJoined: false,
    isFavorite: false
  },
  {
    id: 6,
    title: "Music Jam Session",
    description: "Bring your instruments or just your voice! Open jam session for all skill levels and genres.",
    date: "2024-01-21",
    time: "7:30 PM - 10:00 PM",
    location: "Music Room, Student Activities Center",
    category: "Music",
    xpReward: 90,
    attendees: 15,
    maxAttendees: 30,
    organizer: "Music Club",
    difficulty: "All Levels",
    tags: ["Music", "Jam", "Instruments", "Creative"],
    image: "/api/placeholder/400/200",
    isJoined: true,
    isFavorite: false
  }
]

export default function EventsPage() {
  const { user, loading } = useAuth()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [filteredEvents, setFilteredEvents] = React.useState(upcomingEvents)

  React.useEffect(() => {
    let filtered = upcomingEvents

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredEvents(filtered)
  }, [searchTerm, selectedCategory])

  const handleJoinEvent = (eventId: number) => {
    // TODO: Implement join event logic
    console.log(`Joining event ${eventId}`)
  }

  const handleFavoriteEvent = (eventId: number) => {
    // TODO: Implement favorite event logic
    console.log(`Toggling favorite for event ${eventId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading events...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Campus Events</h1>
              <p className="text-muted-foreground">Discover and join exciting events happening on campus</p>
            </div>
            {user?.role === 'admin' && (
              <Button variant="primary" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Event</span>
              </Button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </Button>
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
                {eventCategories.map((category) => {
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
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="outline" size="sm">
                        {category.count}
                      </Badge>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Events</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Your Events</span>
                  <span className="font-bold text-primary">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">XP Available</span>
                  <span className="font-bold text-secondary">850</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <div className="space-y-6 lg:col-span-9">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredEvents.length} events found
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              <select className="border rounded-md px-3 py-1 text-sm">
                <option>Sort by Date</option>
                <option>Sort by XP Reward</option>
                <option>Sort by Popularity</option>
              </select>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{event.category}</Badge>
                          <Badge variant="outline" size="sm">{event.difficulty}</Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight mb-2">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {event.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFavoriteEvent(event.id)}
                        className="shrink-0"
                      >
                        <Heart className={`h-4 w-4 ${event.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Event Details */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees}/{event.maxAttendees} attending</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" size="sm" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 3 && (
                        <Badge variant="outline" size="sm" className="text-xs">
                          +{event.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span>+{event.xpReward} XP</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          by {event.organizer}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        {event.isJoined ? (
                          <Badge variant="default">Joined</Badge>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleJoinEvent(event.id)}
                            disabled={event.attendees >= event.maxAttendees}
                          >
                            {event.attendees >= event.maxAttendees ? 'Full' : 'Join'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {filteredEvents.length > 0 && (
              <div className="text-center pt-6">
                <Button variant="outline" size="lg">
                  Load More Events
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
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