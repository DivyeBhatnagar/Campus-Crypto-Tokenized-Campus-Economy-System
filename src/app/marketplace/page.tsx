'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star,
  MapPin,
  Clock,
  Coins,
  Tag,
  Grid,
  List,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dbHelpers, VendorProduct } from '@/lib/supabase';

// Simple UI components
function SimpleCard({ children, className = '', ...props }: any) {
  return (
    <div className={`bg-background rounded-2xl p-6 shadow-neumorphic ${className}`} {...props}>
      {children}
    </div>
  );
}

function SimpleButton({ children, variant = 'primary', size = 'md', className = '', ...props }: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}) {
  const variants = {
    primary: 'bg-primary text-white shadow-neumorphic hover:shadow-neumorphic-lg',
    secondary: 'bg-secondary text-white shadow-neumorphic hover:shadow-neumorphic-lg',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
    success: 'bg-success text-white shadow-neumorphic hover:shadow-neumorphic-lg',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`rounded-xl font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function SimpleInput({ placeholder, value, onChange, className = '', icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text/50" />
      )}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200 text-text placeholder-text/50 ${className}`}
        {...props}
      />
    </div>
  );
}

function ProductCard({ product }: { product: VendorProduct }) {
  const [purchasing, setPurchasing] = useState(false);
  
  const handlePurchase = async () => {
    setPurchasing(true);
    // Simulate purchase process
    setTimeout(() => {
      setPurchasing(false);
    }, 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <SimpleCard className="h-full flex flex-col overflow-hidden hover:shadow-neumorphic-lg transition-all duration-300">
        {/* Product Image */}
        <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl mb-4 flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="text-center">
              <ShoppingCart className="w-12 h-12 text-text/30 mx-auto mb-2" />
              <p className="text-text/30 text-sm">No image</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-text text-lg">{product.name}</h3>
            <div className="flex items-center gap-1 text-sm text-text/60">
              <Tag className="w-4 h-4" />
              <span className="capitalize">{product.category}</span>
            </div>
          </div>

          <p className="text-text/70 text-sm mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-text/50" />
            <span className="text-text/60 text-sm">{product.vendor_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{product.price}</span>
              <span className="text-text/60">CAMPUS</span>
            </div>
            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
              product.is_available 
                ? 'bg-success/10 text-success' 
                : 'bg-accent/10 text-accent'
            }`}>
              {product.is_available ? 'Available' : 'Out of Stock'}
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <div className="mt-4 pt-4 border-t border-text/10">
          <SimpleButton
            className="w-full flex items-center justify-center gap-2"
            disabled={!product.is_available || purchasing}
            onClick={handlePurchase}
            variant={product.is_available ? 'primary' : 'outline'}
          >
            {purchasing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : product.is_available ? (
              <>
                <ShoppingCart className="w-4 h-4" />
                Purchase
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Unavailable
              </>
            )}
          </SimpleButton>
        </div>
      </SimpleCard>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for demonstration
  const mockProducts: VendorProduct[] = [
    {
      id: '1',
      name: 'Campus Coffee',
      description: 'Premium blend coffee from the campus café. Perfect for those long study sessions.',
      price: 15,
      vendor_id: 'cafe-1',
      vendor_name: 'Campus Café',
      category: 'food',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Library Book Rental',
      description: 'Rent textbooks for a semester. Save money on expensive course materials.',
      price: 50,
      vendor_id: 'library-1',
      vendor_name: 'Campus Library',
      category: 'education',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Gym Day Pass',
      description: 'Access to all gym facilities for one day. Stay fit and healthy!',
      price: 10,
      vendor_id: 'gym-1',
      vendor_name: 'Campus Gym',
      category: 'wellness',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Campus Merch T-Shirt',
      description: 'Show your school pride with this comfortable cotton t-shirt.',
      price: 25,
      vendor_id: 'store-1',
      vendor_name: 'Campus Store',
      category: 'merchandise',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Healthy Lunch Box',
      description: 'Nutritious meal prepared by the campus nutrition team.',
      price: 20,
      vendor_id: 'canteen-1',
      vendor_name: 'Campus Canteen',
      category: 'food',
      is_available: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Study Room Booking',
      description: 'Reserve a quiet study room for 2 hours. Perfect for group projects.',
      price: 8,
      vendor_id: 'library-1',
      vendor_name: 'Campus Library',
      category: 'education',
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // For now, use mock data. Later replace with actual Supabase call
      // const { data, error } = await dbHelpers.getVendorProducts();
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(mockProducts); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'food', 'education', 'wellness', 'merchandise'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-2">Campus Marketplace</h1>
          <p className="text-text/70">
            Discover and purchase items using your Campus Coins
          </p>
        </motion.div>

        {/* Balance & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <SimpleCard className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold text-text">
                    Your Balance: {profile?.campus_coin_balance?.toFixed(2) || '0.00'} CAMPUS
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <SimpleInput
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  icon={Search}
                  className="w-full md:w-64"
                />
                
                <div className="flex items-center gap-2">
                  <SimpleButton
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </SimpleButton>
                  <SimpleButton
                    variant={viewMode === 'list' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </SimpleButton>
                </div>
              </div>
            </div>
          </SimpleCard>

          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto">
            {categories.map((category) => (
              <SimpleButton
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SimpleButton>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text/70">Loading marketplace...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-text/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-2">No products found</h3>
              <p className="text-text/70">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No products are currently available in the marketplace'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Popular Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <SimpleCard>
            <h2 className="text-2xl font-semibold text-text mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Food & Beverages', count: '15 items', color: 'bg-accent/10 text-accent' },
                { name: 'Study Materials', count: '8 items', color: 'bg-primary/10 text-primary' },
                { name: 'Wellness', count: '6 items', color: 'bg-success/10 text-success' },
                { name: 'Merchandise', count: '12 items', color: 'bg-secondary/10 text-secondary' }
              ].map((category, index) => (
                <div key={index} className={`p-4 rounded-xl ${category.color} text-center`}>
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm opacity-70">{category.count}</p>
                </div>
              ))}
            </div>
          </SimpleCard>
        </motion.div>
      </div>
    </div>
  );
}