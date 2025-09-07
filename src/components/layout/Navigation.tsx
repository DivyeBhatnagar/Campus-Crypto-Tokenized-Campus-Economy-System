'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { useWeb3 } from '@/hooks/useWeb3';
import { 
  Home, 
  Dashboard, 
  Coins, 
  Trophy, 
  Store, 
  Settings, 
  Menu, 
  X,
  BookOpen,
  BarChart
} from 'lucide-react';
import { Card } from '@/components/ui';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: Dashboard },
  { name: 'Earn Tokens', href: '/earn', icon: Coins },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Badges', href: '/badges', icon: Trophy },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
];

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Settings },
  { name: 'Manage Rewards', href: '/admin/rewards', icon: Coins },
  { name: 'User Management', href: '/admin/users', icon: BookOpen },
];

export function Navigation() {
  const pathname = usePathname();
  const { isConnected, user } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const navItems = isConnected 
    ? [...navigation, ...(isAdmin ? adminNavigation : [])]
    : [{ name: 'Home', href: '/', icon: Home }];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-text/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text">CampusToken</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-text/70 hover:text-text hover:bg-background/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connect & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <WalletConnect />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-background shadow-neumorphic-sm hover:shadow-neumorphic transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-text" />
              ) : (
                <Menu className="w-5 h-5 text-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-2"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-text/70 hover:text-text hover:bg-background/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-text/10">
              <WalletConnect variant="full" />
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text">CampusToken</span>
            </div>
            <p className="text-text/70 max-w-md">
              Revolutionizing campus life with blockchain technology. Earn tokens for positive contributions 
              and redeem them for real-world rewards.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-text mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/earn" className="text-text/70 hover:text-text transition-colors">Earn Tokens</Link></li>
              <li><Link href="/marketplace" className="text-text/70 hover:text-text transition-colors">Marketplace</Link></li>
              <li><Link href="/badges" className="text-text/70 hover:text-text transition-colors">NFT Badges</Link></li>
              <li><Link href="/analytics" className="text-text/70 hover:text-text transition-colors">Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-text mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-text/70 hover:text-text transition-colors">Help Center</Link></li>
              <li><Link href="/docs" className="text-text/70 hover:text-text transition-colors">Documentation</Link></li>
              <li><Link href="/contact" className="text-text/70 hover:text-text transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-text/70 hover:text-text transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-text/10 text-center">
          <p className="text-text/70">
            © 2024 Tokenized Campus Economy. Built with Next.js, Solidity, and lots of ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}