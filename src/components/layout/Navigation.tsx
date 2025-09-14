'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useAuth } from '@/hooks/useAuth'
import { 
  Home, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Trophy, 
  User, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  Coins,
  ShoppingBag,
  Award
} from "lucide-react"

const Navigation = () => {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navigationItems = React.useMemo(() => {
    const baseItems = [
      { href: "/", label: "Home", icon: Home },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/events", label: "Events", icon: Calendar },
      { href: "/clubs", label: "Clubs & Societies", icon: Users },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ]

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { href: "/earn", label: "Earn Tokens", icon: Coins },
        { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
        { href: "/badges", label: "Badges", icon: Award },
      ]
    }

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { href: "/admin", label: "Admin Panel", icon: LayoutDashboard },
        { href: "/admin/users", label: "User Management", icon: Users },
        { href: "/admin/analytics", label: "Analytics", icon: Trophy },
      ]
    }

    return baseItems
  }, [user?.role])

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-18 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <div className="neumorphic-card flex h-11 w-11 items-center justify-center rounded-xl bg-primary p-2 shrink-0">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="hidden font-bold text-foreground sm:inline-block text-lg">
            Campus Coin
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "primary" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2 h-10 px-3 py-2"
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="hidden lg:inline whitespace-nowrap">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === 'student' && user.xp !== undefined && (
                  <div className="hidden lg:flex items-center space-x-2">
                    <Badge variant="secondary" size="sm">
                      Level {user.level || 1}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {user.xp} XP
                    </Badge>
                  </div>
                )}
                
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 h-10 px-3">
                    <User className="h-5 w-5 shrink-0" />
                    <span className="hidden lg:inline whitespace-nowrap">{user.name || user.email}</span>
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 h-10 px-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="hidden lg:inline whitespace-nowrap">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-10">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" className="h-10">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          {user && user.role === 'student' && user.xp !== undefined && (
            <div className="flex items-center space-x-2 mr-3">
              <Badge variant="secondary" size="sm">
                L{user.level || 1}
              </Badge>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="h-11 w-11 shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur md:hidden">
          <div className="container py-4 space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant={isActive(item.href) ? "primary" : "ghost"}
                    className="w-full justify-start space-x-3 h-12"
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
            
            <hr className="border-border/40" />
            
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block"
                >
                  <Button variant="ghost" className="w-full justify-start space-x-3 h-12">
                    <User className="h-5 w-5 shrink-0" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start space-x-3 h-12 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" 
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block"
                >
                  <Button variant="ghost" className="w-full h-12">Login</Button>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block"
                >
                  <Button variant="primary" className="w-full h-12">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export { Navigation }