'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Coins, 
  ShoppingCart, 
  QrCode,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Settings,
  Plus,
  Edit,
  Eye,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { dbHelpers, type VendorProduct, type Transaction } from '@/lib/supabase';

// Mock vendor data
const mockVendorData = {
  vendorInfo: {
    name: 'Campus Café',
    description: 'Your favorite campus coffee shop accepting CampusCoins',
    category: 'Food & Beverages',
    verified: true,
    totalSales: 15420.50,
    totalOrders: 847,
    rating: 4.8,
    commission: 5 // 5% commission on CampusCoin transactions
  },
  recentOrders: [
    { 
      id: 'order_1', 
      customer: 'John Doe', 
      items: 'Coffee + Croissant', 
      amount: 25, 
      status: 'completed',
      timestamp: '2024-01-07T10:30:00Z'
    },
    { 
      id: 'order_2', 
      customer: 'Jane Smith', 
      items: 'Latte + Muffin', 
      amount: 20, 
      status: 'completed',
      timestamp: '2024-01-07T09:45:00Z'
    },
    { 
      id: 'order_3', 
      customer: 'Mike Johnson', 
      items: 'Espresso + Sandwich', 
      amount: 30, 
      status: 'pending',
      timestamp: '2024-01-07T09:15:00Z'
    },
    { 
      id: 'order_4', 
      customer: 'Sarah Wilson', 
      items: 'Cappuccino + Cookie', 
      amount: 18, 
      status: 'completed',
      timestamp: '2024-01-07T08:50:00Z'
    }
  ],
  salesData: [
    { date: '2024-01-01', tokens: 450, orders: 23 },
    { date: '2024-01-02', tokens: 620, orders: 31 },
    { date: '2024-01-03', tokens: 580, orders: 29 },
    { date: '2024-01-04', tokens: 720, orders: 35 },
    { date: '2024-01-05', tokens: 680, orders: 33 },
    { date: '2024-01-06', tokens: 840, orders: 42 },
    { date: '2024-01-07', tokens: 920, orders: 48 }
  ]
};

// Simple UI Components
function SimpleCard({ children, className = '', ...props }: any) {
  return (
    <div className={`bg-background rounded-2xl p-6 shadow-neumorphic ${className}`} {...props}>
      {children}
    </div>
  );
}

function SimpleButton({ children, variant = 'primary', size = 'md', className = '', ...props }: any) {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-neumorphic hover:shadow-neumorphic-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-neumorphic hover:shadow-neumorphic-lg',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-neumorphic',
    success: 'bg-success text-white hover:bg-success/90 shadow-neumorphic hover:shadow-neumorphic-lg',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
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

function StatsCard({ title, value, icon: Icon, change, changeType, prefix = '', suffix = '' }: any) {
  return (
    <SimpleCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text/60 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-text mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-success' : 'text-accent'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </SimpleCard>
  );
}

function ProductModal({ isOpen, onClose, product, onSave }: any) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    is_available: true,
    image: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        is_available: true,
        image: ''
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-neumorphic-lg"
      >
        <h2 className="text-2xl font-bold text-text mb-6">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Price (CampusCoins)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
                min="0"
                step="0.1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
                required
              >
                <option value="">Select Category</option>
                <option value="food">Food & Beverages</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="services">Services</option>
                <option value="merchandise">Merchandise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Image URL (optional)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full p-3 bg-background rounded-xl border-0 shadow-neumorphic-inset focus:shadow-neumorphic focus:outline-none transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.is_available}
              onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
              className="rounded"
            />
            <label htmlFor="available" className="text-text">Available for purchase</label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <SimpleButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </SimpleButton>
            <SimpleButton type="submit">
              {product ? 'Update Product' : 'Add Product'}
            </SimpleButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function VendorDashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<VendorProduct | null>(null);

  useEffect(() => {
    // Load vendor products
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await dbHelpers.getVendorProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSaveProduct = (productData: any) => {
    // In a real app, this would save to the database
    if (selectedProduct) {
      // Update existing product
      setProducts(prev => prev.map(product => 
        product.id === selectedProduct.id ? { ...product, ...productData } : product
      ));
    } else {
      // Create new product
      const newProduct: VendorProduct = {
        id: 'prod_' + Date.now(),
        ...productData,
        vendor_id: user?.id || 'vendor1',
        vendor_name: mockVendorData.vendorInfo.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProducts(prev => [newProduct, ...prev]);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== productId));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'qr-code', label: 'QR Payment', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">{mockVendorData.vendorInfo.name}</h1>
              <p className="text-text/60">{mockVendorData.vendorInfo.description}</p>
            </div>
            {mockVendorData.vendorInfo.verified && (
              <div className="flex items-center space-x-1 bg-success/10 text-success px-3 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <SimpleCard className="p-2">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-neumorphic'
                      : 'text-text/60 hover:text-text hover:bg-background hover:shadow-neumorphic-inset'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </SimpleCard>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Sales"
                value={mockVendorData.vendorInfo.totalSales}
                prefix="$"
                icon={DollarSign}
                change="+12% from last month"
                changeType="positive"
              />
              <StatsCard
                title="Total Orders"
                value={mockVendorData.vendorInfo.totalOrders}
                icon={ShoppingCart}
                change="+8% from last month"
                changeType="positive"
              />
              <StatsCard
                title="CampusCoin Earnings"
                value="2,350"
                icon={Coins}
                change="+15% from last month"
                changeType="positive"
              />
              <StatsCard
                title="Customer Rating"
                value={mockVendorData.vendorInfo.rating}
                suffix="/5"
                icon={Users}
                change="95% positive reviews"
                changeType="positive"
              />
            </div>

            {/* Sales Chart */}
            <SimpleCard>
              <h3 className="text-lg font-semibold text-text mb-4">Daily Sales & Orders</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockVendorData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e5ec" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#e0e5ec',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tokens" 
                    stroke="#3a3d98" 
                    fill="#3a3d98" 
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Tokens Earned"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#00c6ff" 
                    strokeWidth={2}
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </SimpleCard>

            {/* Recent Orders */}
            <SimpleCard>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text">Recent Orders</h3>
                <SimpleButton size="sm" onClick={() => setActiveTab('orders')}>
                  View All
                </SimpleButton>
              </div>
              <div className="space-y-4">
                {mockVendorData.recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-xl shadow-neumorphic-inset">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-text">{order.customer}</p>
                        <p className="text-sm text-text/60">{order.items}</p>
                        <p className="text-xs text-text/50">{new Date(order.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text">{order.amount} CC</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-yellow-500/20 text-yellow-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SimpleCard>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text">Products</h2>
              <SimpleButton 
                onClick={() => {
                  setSelectedProduct(null);
                  setIsProductModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </SimpleButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <SimpleCard key={product.id}>
                  <div className="space-y-4">
                    {product.image && (
                      <div className="aspect-video bg-background rounded-xl shadow-neumorphic-inset overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-text">{product.name}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1 text-text/60 hover:text-primary transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-text/70">{product.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">{product.price} CC</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.is_available ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
                        }`}>
                          {product.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-text/60">
                        <span>Category: {product.category}</span>
                      </div>
                    </div>
                  </div>
                </SimpleCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* QR Payment Tab */}
        {activeTab === 'qr-code' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-text">QR Code Payment</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* QR Code Display */}
              <SimpleCard className="text-center">
                <h3 className="text-lg font-semibold text-text mb-6">Payment QR Code</h3>
                <div className="w-64 h-64 mx-auto bg-background rounded-2xl shadow-neumorphic-inset flex items-center justify-center mb-6">
                  <div className="w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-white" />
                  </div>
                </div>
                <p className="text-text/60 text-sm mb-4">
                  Students can scan this QR code to pay with CampusCoins
                </p>
                <SimpleButton>
                  Generate New QR Code
                </SimpleButton>
              </SimpleCard>

              {/* Payment Instructions */}
              <SimpleCard>
                <h3 className="text-lg font-semibold text-text mb-4">How It Works</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Display QR Code</h4>
                      <p className="text-sm text-text/60">Show the QR code to customers at checkout</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Customer Scans</h4>
                      <p className="text-sm text-text/60">Customer scans with their campus app</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Instant Payment</h4>
                      <p className="text-sm text-text/60">CampusCoins are transferred instantly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold text-sm">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-medium text-text">Confirmation</h4>
                      <p className="text-sm text-text/60">Both parties receive transaction confirmation</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/10 rounded-xl">
                  <p className="text-sm text-primary font-medium">
                    💡 Tip: You earn a {mockVendorData.vendorInfo.commission}% bonus on all CampusCoin transactions!
                  </p>
                </div>
              </SimpleCard>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}