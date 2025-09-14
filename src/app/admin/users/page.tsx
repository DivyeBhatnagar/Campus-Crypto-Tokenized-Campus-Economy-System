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
  MoreHorizontal,
  UserPlus,
  Edit3,
  Trash2,
  Ban,
  CheckCircle,
  AlertCircle,
  Eye,
  Mail,
  Shield,
  Crown,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Download,
  Settings,
  Activity,
  Award,
  Zap
} from "lucide-react"

const userRoles = [
  { value: 'all', label: 'All Roles', count: 2847 },
  { value: 'student', label: 'Students', count: 2456 },
  { value: 'admin', label: 'Administrators', count: 12 },
  { value: 'vendor', label: 'Vendors', count: 34 },
  { value: 'moderator', label: 'Moderators', count: 8 }
]

const userStatuses = [
  { value: 'all', label: 'All Status', count: 2847 },
  { value: 'active', label: 'Active', count: 2698 },
  { value: 'inactive', label: 'Inactive', count: 123 },
  { value: 'suspended', label: 'Suspended', count: 26 }
]

const usersData = [
  {
    id: 1,
    name: 'Alex Chen',
    email: 'alex.chen@campus.edu',
    role: 'student',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    xp: 5420,
    level: 15,
    badgesCount: 23,
    eventsAttended: 67,
    clubsJoined: 8,
    avatar: 'AC',
    major: 'Computer Science',
    year: 'Junior',
    totalSpent: 2340,
    rank: 2
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@campus.edu',
    role: 'student',
    status: 'active',
    joinDate: '2024-01-12',
    lastActive: '1 hour ago',
    xp: 4890,
    level: 14,
    badgesCount: 19,
    eventsAttended: 54,
    clubsJoined: 6,
    avatar: 'SW',
    major: 'Business Administration',
    year: 'Senior',
    totalSpent: 1890,
    rank: 3
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    email: 'marcus.johnson@campus.edu',
    role: 'student',
    status: 'active',
    joinDate: '2024-01-10',
    lastActive: '30 minutes ago',
    xp: 4250,
    level: 13,
    badgesCount: 17,
    eventsAttended: 45,
    clubsJoined: 5,
    avatar: 'MJ',
    major: 'Engineering',
    year: 'Sophomore',
    totalSpent: 1560,
    rank: 5
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma.davis@campus.edu',
    role: 'moderator',
    status: 'active',
    joinDate: '2023-09-15',
    lastActive: '15 minutes ago',
    xp: 7890,
    level: 18,
    badgesCount: 34,
    eventsAttended: 123,
    clubsJoined: 12,
    avatar: 'ED',
    major: 'Environmental Science',
    year: 'Graduate',
    totalSpent: 3450,
    rank: 1
  },
  {
    id: 5,
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@campus.edu',
    role: 'student',
    status: 'inactive',
    joinDate: '2024-01-08',
    lastActive: '3 days ago',
    xp: 2340,
    level: 8,
    badgesCount: 12,
    eventsAttended: 23,
    clubsJoined: 3,
    avatar: 'LR',
    major: 'Music',
    year: 'Freshman',
    totalSpent: 890,
    rank: 15
  },
  {
    id: 6,
    name: 'Jordan Smith',
    email: 'jordan.smith@campus.edu',
    role: 'vendor',
    status: 'active',
    joinDate: '2023-11-20',
    lastActive: '1 day ago',
    xp: 1200,
    level: 5,
    badgesCount: 6,
    eventsAttended: 12,
    clubsJoined: 1,
    avatar: 'JS',
    major: 'Business',
    year: 'Vendor',
    totalSpent: 0,
    rank: null
  },
  {
    id: 7,
    name: 'Priya Patel',
    email: 'priya.patel@campus.edu',
    role: 'admin',
    status: 'active',
    joinDate: '2023-08-01',
    lastActive: 'Online now',
    xp: 9850,
    level: 22,
    badgesCount: 45,
    eventsAttended: 200,
    clubsJoined: 15,
    avatar: 'PP',
    major: 'Administration',
    year: 'Staff',
    totalSpent: 0,
    rank: null
  },
  {
    id: 8,
    name: 'David Kim',
    email: 'david.kim@campus.edu',
    role: 'student',
    status: 'suspended',
    joinDate: '2024-01-05',
    lastActive: '1 week ago',
    xp: 1890,
    level: 6,
    badgesCount: 8,
    eventsAttended: 15,
    clubsJoined: 2,
    avatar: 'DK',
    major: 'Mathematics',
    year: 'Sophomore',
    totalSpent: 450,
    rank: 25
  }
]

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800'
    case 'moderator': return 'bg-purple-100 text-purple-800'
    case 'vendor': return 'bg-blue-100 text-blue-800'
    case 'student': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'inactive': return 'bg-yellow-100 text-yellow-800'
    case 'suspended': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function AdminUsersPage() {
  const { user, loading } = useAuth()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedRole, setSelectedRole] = React.useState("all")
  const [selectedStatus, setSelectedStatus] = React.useState("all")
  const [viewMode, setViewMode] = React.useState<'table' | 'cards'>('table')
  const [filteredUsers, setFilteredUsers] = React.useState(usersData)
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([])

  React.useEffect(() => {
    let filtered = usersData

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(user => user.status === selectedStatus)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.major.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }, [searchTerm, selectedRole, selectedStatus])

  const handleUserAction = (action: string, userId: number) => {
    console.log(`${action} user ${userId}`)
  }

  const handleBulkAction = (action: string) => {
    console.log(`${action} users:`, selectedUsers)
  }

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading users...</p>
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
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage all users, roles, and permissions</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="primary">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">2,847</div>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">2,698</div>
                    <p className="text-xs text-muted-foreground">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">+234</div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">26</div>
                    <p className="text-xs text-muted-foreground">Suspended</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or major..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select 
                className="border rounded-md px-3 py-2 text-sm"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {userRoles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label} ({role.count})
                  </option>
                ))}
              </select>
              <select 
                className="border rounded-md px-3 py-2 text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {userStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label} ({status.count})
                  </option>
                ))}
              </select>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedUsers.length} users selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('email')}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                    <Ban className="h-4 w-4 mr-1" />
                    Suspend
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        {viewMode === 'table' && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={selectAllUsers}
                          className="rounded"
                        />
                      </th>
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Level/XP</th>
                      <th className="text-left p-4 font-medium">Activity</th>
                      <th className="text-left p-4 font-medium">Last Active</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((userData) => (
                      <tr key={userData.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(userData.id)}
                            onChange={() => toggleUserSelection(userData.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                              {userData.avatar}
                            </div>
                            <div>
                              <div className="font-medium">{userData.name}</div>
                              <div className="text-sm text-muted-foreground">{userData.email}</div>
                              <div className="text-xs text-muted-foreground">{userData.major} • {userData.year}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={getRoleColor(userData.role)}>
                            {userData.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusColor(userData.status)}>
                            {userData.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-medium">Level {userData.level}</div>
                            <div className="text-muted-foreground">{userData.xp} XP</div>
                            {userData.rank && (
                              <div className="text-xs text-primary">Rank #{userData.rank}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-1">
                              <Award className="h-3 w-3 text-purple-500" />
                              <span>{userData.badgesCount} badges</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-blue-500" />
                              <span>{userData.eventsAttended} events</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3 text-green-500" />
                              <span>{userData.clubsJoined} clubs</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>{userData.lastActive}</div>
                            <div className="text-muted-foreground text-xs">
                              Joined {new Date(userData.joinDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleUserAction('view', userData.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleUserAction('edit', userData.id)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleUserAction('more', userData.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Cards */}
        {viewMode === 'cards' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((userData) => (
              <Card key={userData.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {userData.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{userData.name}</CardTitle>
                        <CardDescription className="text-sm">{userData.email}</CardDescription>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className={getRoleColor(userData.role)} size="sm">
                            {userData.role}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(userData.status)} size="sm">
                            {userData.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(userData.id)}
                      onChange={() => toggleUserSelection(userData.id)}
                      className="rounded"
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Level</div>
                      <div className="font-semibold">{userData.level}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">XP</div>
                      <div className="font-semibold">{userData.xp}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Badges</div>
                      <div className="font-semibold">{userData.badgesCount}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Events</div>
                      <div className="font-semibold">{userData.eventsAttended}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last active: {userData.lastActive}</span>
                      {userData.rank && (
                        <Badge variant="outline" size="sm" className="text-primary">
                          Rank #{userData.rank}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      {userData.major} • {userData.year}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleUserAction('view', userData.id)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUserAction('edit', userData.id)}>
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("")
              setSelectedRole("all")
              setSelectedStatus("all")
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {usersData.length} users
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}