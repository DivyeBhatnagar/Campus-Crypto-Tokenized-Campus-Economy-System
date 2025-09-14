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
  ShoppingBag,
  Coins,
  Search,
  Filter,
  Star,
  Heart,
  Share2,
  Gift,
  Coffee,
  Book,
  Shirt,
  Laptop,
  Headphones,
  Gamepad2,
  Camera,
  Pizza,
  Ticket,
  Award,
  Crown,
  Zap,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Wallet,
  TrendingUp
} from "lucide-react"

const categories = [
  { name: "All", icon: Star, color: "bg-gray-100 text-gray-800", count: 45 },
  { name: "Food & Drinks", icon: Coffee, color: "bg-orange-100 text-orange-800", count: 12 },
  { name: "Apparel", icon: Shirt, color: "bg-blue-100 text-blue-800", count: 8 },
  { name: "Tech & Electronics", icon: Laptop, color: "bg-purple-100 text-purple-800", count: 6 },
  { name: "Books & Supplies", icon: Book, color: "bg-green-100 text-green-800", count: 9 },
  { name: "Entertainment", icon: Ticket, color: "bg-pink-100 text-pink-800", count: 7 },
  { name: "Services", icon: Award, color: "bg-yellow-100 text-yellow-800", count: 3 }
]

const marketplaceItems = [
  {
    id: 1,
    name: "Premium Coffee Voucher",
    description: "Enjoy a free premium coffee from the campus café. Valid for any specialty drink including lattes, cappuccinos, and seasonal specials.",
    price: 150,
    originalPrice: 200,
    category: "Food & Drinks",
    vendor: "Campus Café",
    rating: 4.9,
    reviews: 156,
    image: "/api/placeholder/300/200",
    inStock: true,
    stockCount: 25,
    discount: 25,
    popular: true,
    timesSold: 340,
    validUntil: "2024-06-30",
    tags: ["Coffee", "Voucher", "Popular"]
  },
  {
    id: 2,
    name: "Campus Hoodie - Limited Edition",
    description: "Official campus hoodie with the new minimalist design. Made from premium cotton blend for maximum comfort.",
    price: 800,
    originalPrice: 1000,
    category: "Apparel",
    vendor: "Campus Store",
    rating: 4.7,
    reviews: 89,
    image: "/api/placeholder/300/200",
    inStock: true,
    stockCount: 15,
    discount: 20,
    popular: false,
    timesSold: 67,
    validUntil: "Limited Stock",
    tags: ["Clothing", "Limited Edition", "Premium"]
  },
  {
    id: 3,
    name: "Wireless Bluetooth Earbuds",
    description: "High-quality wireless earbuds with noise cancellation and 24-hour battery life. Perfect for studying and commuting.",
    price: 1200,
    originalPrice: 1500,
    category: "Tech & Electronics",
    vendor: "Tech Hub",
    rating: 4.8,
    reviews: 203,
    image: "/api/placeholder/300/200",
    inStock: true,
    stockCount: 8,
    discount: 20,
    popular: true,
    timesSold: 124,
    validUntil: "Physical Item",
    tags: ["Electronics", "Audio", "Study"]
  },
  {
    id: 4,
    name: "Digital Course Bundle",
    description: "Access to premium online courses including web development, data science, and digital marketing. 6-month access included.",
    price: 500,
    originalPrice: 800,
    category: "Books & Supplies",
    vendor: "Learning Center",
    rating: 4.6,
    reviews: 78,
    image: "/api/placeholder/300/200",
    inStock: true,
    stockCount: 50,
    discount: 37,
    popular: true,
    timesSold: 189,
    validUntil: "6 months",
    tags: ["Education", "Digital", "Bundle"]
  },
  {
    id: 5,
    name: "Movie Theater Tickets (2x)",
    description: "Two tickets to the campus movie theater. Valid for any regular screening including new releases and classics.",
    price: 300,
    originalPrice: 400,
    category: "Entertainment",
    vendor: "Campus Cinema",
    rating: 4.5,
    reviews: 145,
    image: "/api/placeholder/300/200",
    inStock: true,
    stockCount: 30,
    discount: 25,
    popular: false,
    timesSold: 267,
    validUntil: "2024-12-31",
    tags: ["Entertainment", "Cinema", "Date"]
  },
  {
    id: 6,
    name: "Free Pizza Meal",
    description: "Large pizza with choice of toppings from the campus food court. Includes a drink and dessert.",
    price: 400,
    originalPrice: 500,
    category: "Food & Drinks",
    vendor: "Food Court",
    rating: 4.4,
    reviews: 298,
    image: "/api/placeholder/300/200",
    inStock: true,
    stockCount: 20,
    discount: 20,
    popular: true,
    timesSold: 445,
    validUntil: "Same day use",
    tags: ["Food", "Pizza", "Meal"]
  },
  {
    id: 7,
    name: "Gaming Mouse - RGB",
    description: "Professional gaming mouse with customizable RGB lighting and programmable buttons. Perfect for gaming and productivity.",
    price: 600,
    originalPrice: 750,
    category: "Tech & Electronics",
    vendor: "Gaming Zone",
    rating: 4.9,
    reviews: 67,
    image: "/api/placeholder/300/200",
    inStock: false,
    stockCount: 0,
    discount: 20,
    popular: false,
    timesSold: 45,
    validUntil: "Out of Stock",
    tags: ["Gaming", "RGB", "Professional"]
  },
  {
    id: 8,
    name: "Priority Class Registration",
    description: "Get priority access to class registration for next semester. Register before general enrollment opens.",
    price: 1000,
    originalPrice: 1000,
    category: "Services",
    vendor: "Registrar Office",
    rating: 5.0,
    reviews: 23,
    image: "/api/placeholder/300/200",
    inStock: true,
    stockCount: 5,
    discount: 0,
    popular: true,
    timesSold: 12,
    validUntil: "Next semester",
    tags: ["Service", "Priority", "Registration"]
  }
]

const userWallet = {
  balance: 2450,
  totalSpent: 1800,
  totalSaved: 340,
  purchaseHistory: 23,
  favoriteItems: 8
}

const recentPurchases = [
  { item: "Coffee Voucher", date: "2 days ago", tokens: 150 },
  { item: "Study Guide Bundle", date: "1 week ago", tokens: 300 },
  { item: "Campus T-Shirt", date: "2 weeks ago", tokens: 450 }
]

export default function MarketplacePage() {
  const { user, loading } = useAuth()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [filteredItems, setFilteredItems] = React.useState(marketplaceItems)
  const [cart, setCart] = React.useState<number[]>([])

  React.useEffect(() => {
    let filtered = marketplaceItems

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredItems(filtered)
  }, [searchTerm, selectedCategory])

  const handlePurchase = (itemId: number) => {
    // TODO: Implement purchase logic
    console.log(`Purchasing item ${itemId}`)
  }

  const addToCart = (itemId: number) => {
    setCart(prev => [...prev, itemId])
  }

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(id => id !== itemId))
  }

  const isInCart = (itemId: number) => cart.includes(itemId)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading marketplace...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Campus Marketplace</h1>
              <p className="text-muted-foreground">Redeem your Campus Coins for amazing rewards and services</p>
            </div>
            <div className="flex items-center space-x-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-lg font-bold">{userWallet.balance}</div>
                    <div className="text-xs text-muted-foreground">Coins Available</div>
                  </div>
                </div>
              </Card>
              {cart.length > 0 && (
                <Button variant="primary" className="relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({cart.length})
                  <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                    {cart.length}
                  </Badge>
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for rewards, vouchers, or services..."
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
              <select className="border rounded-md px-3 py-2 text-sm">
                <option>Sort by Price</option>
                <option>Sort by Popularity</option>
                <option>Sort by Rating</option>
                <option>Sort by Discount</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-3">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
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

            {/* Wallet Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <span>Your Wallet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available Balance</span>
                  <span className="font-bold text-lg flex items-center space-x-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span>{userWallet.balance}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                  <span className="font-semibold">{userWallet.totalSpent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Saved</span>
                  <span className="font-semibold text-green-600">{userWallet.totalSaved}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Link href="/earn">Earn More Coins</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Purchases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Purchases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentPurchases.map((purchase, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{purchase.item}</div>
                      <div className="text-muted-foreground text-xs">{purchase.date}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span>{purchase.tokens}</span>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full">View All</Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-9">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredItems.length} items found
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Most popular items first</span>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                    {item.discount > 0 && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        -{item.discount}%
                      </Badge>
                    )}
                    {item.popular && (
                      <Badge variant="default" className="absolute top-2 right-2">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2"
                      onClick={() => {/* TODO: Add to favorites */}}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight line-clamp-2">
                          {item.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" size="sm">{item.category}</Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                            <span>({item.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm line-clamp-2 mt-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold flex items-center space-x-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span>{item.price}</span>
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Vendor & Stock */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>by {item.vendor}</span>
                      <div className="flex items-center space-x-1">
                        {item.inStock ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{item.stockCount} left</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            <span>Out of stock</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" size="sm" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Valid Until */}
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Valid until: {item.validUntil}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        className="flex-1"
                        disabled={!item.inStock || userWallet.balance < item.price}
                        onClick={() => handlePurchase(item.id)}
                      >
                        {!item.inStock ? 'Out of Stock' : 
                         userWallet.balance < item.price ? 'Not Enough Coins' : 
                         'Buy Now'}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => isInCart(item.id) ? removeFromCart(item.id) : addToCart(item.id)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart className={`h-4 w-4 ${isInCart(item.id) ? 'text-primary' : ''}`} />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {filteredItems.length > 0 && (
              <div className="text-center pt-6">
                <Button variant="outline" size="lg">
                  Load More Items
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
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