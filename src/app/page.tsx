'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coins, Shield, Users, Trophy } from 'lucide-react';

// Temporary simple components without Web3 dependencies
function SimpleButton({ children, variant = 'primary', size = 'md', className = '', ...props }: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-neumorphic',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-neumorphic',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function SimpleCard({ children, className = '', variant = 'default', ...props }: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
  [key: string]: any;
}) {
  const baseClasses = 'bg-background rounded-2xl p-6';
  const variants = {
    default: 'shadow-neumorphic',
    elevated: 'shadow-neumorphic-lg',
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

function SimpleNavigation() {
  return (
    <nav className="bg-background shadow-neumorphic">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-text">Campus Economy</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-text hover:text-primary transition-colors">Home</a>
            <Link href="/dashboard" className="text-text hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/marketplace" className="text-text hover:text-primary transition-colors">Marketplace</Link>
            <Link href="/badges" className="text-text hover:text-primary transition-colors">NFT Badges</Link>
            <Link href="/admin" className="text-text hover:text-primary transition-colors">Admin</Link>
            <Link href="/vendor" className="text-text hover:text-primary transition-colors">Vendor</Link>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <SimpleButton size="sm" variant="outline">
                  Login
                </SimpleButton>
              </Link>
              <Link href="/signup">
                <SimpleButton size="sm">
                  Sign Up
                </SimpleButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function SimpleFooter() {
  return (
    <footer className="bg-background border-t border-text/10 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Coins className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-text">Campus Economy</span>
            </div>
            <p className="text-text/70">
              Revolutionizing campus life with blockchain technology.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-text mb-4">Platform</h4>
            <ul className="space-y-2 text-text/70">
              <li><a href="#" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Marketplace</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Rewards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text mb-4">Community</h4>
            <ul className="space-y-2 text-text/70">
              <li><a href="#" className="hover:text-primary transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text mb-4">Connect</h4>
            <ul className="space-y-2 text-text/70">
              <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-text/10 mt-8 pt-8 text-center text-text/70">
          <p>&copy; 2024 Campus Economy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const features = [
    {
      icon: <Coins className="w-8 h-8" />,
      title: 'Earn Tokens',
      description: 'Get CampusCoins for attending events, volunteering, and academic achievements'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Blockchain',
      description: 'Built on Ethereum with smart contracts ensuring transparency and security'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Campus Community',
      description: 'Connect with students, faculty, and vendors in a unified token economy'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'NFT Badges',
      description: 'Collect unique achievement badges as NFTs for special accomplishments'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SimpleNavigation />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-text mb-6"
            >
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tokenized
              </span>
              <br />
              Campus Economy
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-text/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Revolutionize campus life with blockchain technology. Earn CampusCoins for positive contributions, 
              redeem rewards, and build a thriving token-based community.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/signup">
                <SimpleButton size="lg" className="min-w-[200px]">
                  Get Started
                </SimpleButton>
              </Link>
              <SimpleButton variant="secondary" size="lg" className="min-w-[200px]">
                Learn More
              </SimpleButton>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 blur-xl"></div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-text/80 max-w-2xl mx-auto">
              Experience the future of campus economics with cutting-edge blockchain technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <SimpleCard className="h-full text-center hover:shadow-neumorphic-lg transition-all duration-300">
                  <div className="text-primary mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text/70">
                    {feature.description}
                  </p>
                </SimpleCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">10K+</h3>
              <p className="text-text/80">Active Students</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-secondary mb-2">50K+</h3>
              <p className="text-text/80">Tokens Distributed</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-success mb-2">500+</h3>
              <p className="text-text/80">Campus Events</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <SimpleCard className="text-center max-w-2xl mx-auto" variant="elevated">
              <h2 className="text-3xl font-bold text-text mb-4">
                Ready to Join the Revolution?
              </h2>
              <p className="text-text/80 mb-8">
                Connect your wallet and start earning tokens for your campus contributions today!
              </p>
              <Link href="/signup">
                <SimpleButton size="lg" className="w-full sm:w-auto">
                  Get Started Now
                </SimpleButton>
              </Link>
            </SimpleCard>
          </motion.div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
}