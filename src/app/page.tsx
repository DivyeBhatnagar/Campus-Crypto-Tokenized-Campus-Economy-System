'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Navigation } from "@/components/layout/Navigation"
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Trophy, 
  Coins, 
  Award, 
  ShoppingBag,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react"

const features = [
  {
    icon: Trophy,
    title: "Gamified Experience",
    description: "Earn XP, unlock badges, and climb the leaderboard by participating in campus activities.",
    color: "text-amber-500"
  },
  {
    icon: Users,
    title: "Connect & Collaborate",
    description: "Join clubs, create study groups, and build meaningful connections with fellow students.",
    color: "text-blue-500"
  },
  {
    icon: Calendar,
    title: "Campus Events",
    description: "Discover and participate in events, workshops, and activities happening on campus.",
    color: "text-green-500"
  },
  {
    icon: Coins,
    title: "Token Economy",
    description: "Earn Campus Coins for participation and redeem them for exclusive rewards and benefits.",
    color: "text-primary"
  },
  {
    icon: Award,
    title: "Achievement System",
    description: "Collect NFT badges as proof of your accomplishments and showcase your skills.",
    color: "text-purple-500"
  },
  {
    icon: ShoppingBag,
    title: "Campus Marketplace",
    description: "Redeem your earned tokens for merchandise, discounts, and exclusive campus perks.",
    color: "text-secondary"
  }
]

const stats = [
  { label: "Active Students", value: "2,500+", icon: Users },
  { label: "Campus Events", value: "150+", icon: Calendar },
  { label: "Clubs & Societies", value: "80+", icon: GraduationCap },
  { label: "Rewards Distributed", value: "$25K+", icon: Trophy }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex">
              <Badge variant="secondary" size="lg" className="px-4 py-2">
                <Zap className="mr-2 h-4 w-4" />
                New Platform Launch
              </Badge>
            </div>
            
            <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              🚀 Connect. Engage.{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Level Up
              </span>{" "}
              Your Campus Experience.
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground sm:text-2xl lg:text-xl lg:leading-8">
              Join Campus Coin, the next-gen gamified campus ecosystem where students, clubs, and admins interact seamlessly on a decentralized, reward-driven platform.
            </p>
            
            <div className="mb-10 space-y-3 text-lg text-muted-foreground">
              <div className="flex items-center justify-center gap-3">
                <span>💎</span>
                <span>Earn tokens for participation</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span>🤝</span>
                <span>Build your network across clubs and societies</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span>🌐</span>
                <span>Unlock exclusive perks and experiences</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="xl" variant="primary" className="w-full sm:w-auto">
                  Get Started for Free →
                </Button>
              </Link>
              <Link href="/login">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center" hover>
                  <CardContent className="pt-6">
                    <Icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need for campus life
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover features designed to enhance your college experience and help you succeed.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="relative group" hover>
                  <CardHeader>
                    <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-neumorphic-sm ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How Campus Coin Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in three simple steps and transform your campus experience.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Sign up with your student email and customize your profile to start your journey.",
                icon: Users
              },
              {
                step: "02", 
                title: "Participate & Earn",
                description: "Join events, clubs, and activities to earn XP, tokens, and unlock achievements.",
                icon: Target
              },
              {
                step: "03",
                title: "Redeem Rewards",
                description: "Use your earned tokens in the marketplace for exclusive campus perks and merchandise.",
                icon: Star
              }
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="text-center relative" hover>
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-neumorphic">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="mb-2 text-sm font-semibold text-primary">Step {step.step}</div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0" padding="xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
                Ready to transform your campus experience?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of students who are already using Campus Coin to make the most of their college journey.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/signup">
                  <Button size="xl" variant="primary" className="w-full sm:w-auto">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="neumorphic-card flex h-8 w-8 items-center justify-center rounded-lg bg-primary p-1">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">Campus Coin</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting students, clubs, and administrators for a better campus experience.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Campus Coin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}