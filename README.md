# 🏫 Tokenized Campus Economy System

A comprehensive blockchain-powered campus economy platform that enables students to earn, spend, and trade CampusCoins while collecting NFT achievement badges.

![Campus Economy](https://img.shields.io/badge/Campus-Economy-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Ethereum](https://img.shields.io/badge/Ethereum-Smart%20Contracts-purple)

## 🎯 Project Overview

The Tokenized Campus Economy System revolutionizes campus life by creating a blockchain-based token economy where students can:

- **Earn CampusCoins** for positive campus activities
- **Redeem tokens** at campus vendors and services
- **Collect NFT badges** for achievements
- **Participate** in a transparent, incentive-driven ecosystem

## ✨ Key Features

### 🔐 **Multi-Role Authentication System**
- **Students**: Dashboard, marketplace, badge collection
- **Admins**: Analytics, reward management, user oversight
- **Vendors**: Product management, sales analytics, QR payments

### 💰 **Campus Token Economy**
- **ERC-20 CampusCoin** smart contract integration
- **Reward distribution** for academic and social achievements
- **Token redemption** at participating campus vendors
- **Transaction history** and balance tracking

### 🏆 **NFT Achievement Badges**
- **IPFS-powered** metadata storage
- **Blockchain-verified** achievement tokens
- **Rarity system** (Common, Uncommon, Rare, Epic, Legendary)
- **SVG badge generation** with dynamic designs

### 📊 **Advanced Analytics**
- **Interactive charts** with Recharts
- **Real-time statistics** and reporting
- **User behavior analytics**
- **Transaction monitoring**

### 🎨 **Neumorphic UI Design**
- **Responsive design** for all devices
- **Consistent design system** with custom color palette
- **Smooth animations** with Framer Motion
- **Accessibility-focused** interface

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart and data visualization

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Primary database
- **Row Level Security** - Data protection

### **Blockchain & Web3**
- **Ethereum** - Smart contract platform
- **Solidity** - Smart contract programming
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection interface
- **IPFS** - Decentralized storage for NFT metadata

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**
- **npm or yarn**
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd College
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# WalletConnect Project ID (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── badges/            # NFT badges page
│   ├── dashboard/         # Student dashboard
│   ├── login/             # Authentication
│   ├── marketplace/       # Token marketplace
│   ├── signup/            # User registration
│   └── vendor/            # Vendor dashboard
├── components/            # Reusable UI components
│   └── providers/         # Context providers
├── hooks/                 # Custom React hooks
│   └── useAuth.tsx        # Authentication hook
├── lib/                   # Utility libraries
│   ├── nft-badges.tsx     # NFT badge system
│   ├── supabase.ts        # Database client
│   └── web3.ts            # Blockchain integration
└── styles/                # Global styles
    └── globals.css        # TailwindCSS configuration
```

## 🎮 Application Pages

### **🏠 Landing Page (`/`)**
- Hero section with neumorphic design
- Feature showcase
- Call-to-action buttons

### **📊 Student Dashboard (`/dashboard`)**
- Campus Coin balance and statistics
- Transaction history
- Quick action buttons
- Achievement progress

### **🛒 Marketplace (`/marketplace`)**
- Product catalog from campus vendors
- Search and filtering capabilities
- Token-based purchasing system
- Vendor information

### **🏆 NFT Badges (`/badges`)**
- Badge collection display
- Achievement tracking
- Badge minting functionality
- Rarity-based categorization

### **⚙️ Admin Dashboard (`/admin`)**
- User management and analytics
- Reward rule configuration
- System-wide statistics
- Transaction monitoring

### **🏪 Vendor Dashboard (`/vendor`)**
- Product management
- Sales analytics
- QR code payment system
- Order tracking

## 🔧 Configuration

### **Supabase Setup**

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Set up database tables** using the provided schema
3. **Configure Row Level Security** policies
4. **Update environment variables** in `.env.local`

### **Smart Contract Deployment**

1. **Deploy CampusCoin contract** to your chosen network
2. **Deploy NFT Badge contract** for achievements
3. **Update contract addresses** in `src/lib/web3.ts`
4. **Configure Web3Provider** in the app layout

### **IPFS Configuration**

1. **Set up IPFS node** or use a service like Pinata
2. **Configure IPFS client** in `src/lib/nft-badges.tsx`
3. **Update metadata upload** functionality

## 📊 Database Schema

### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  student_id VARCHAR UNIQUE,
  wallet_address VARCHAR,
  department VARCHAR,
  year INTEGER,
  role VARCHAR DEFAULT 'student',
  campus_coin_balance DECIMAL DEFAULT 0,
  total_earned DECIMAL DEFAULT 0,
  total_spent DECIMAL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Transactions Table**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  transaction_hash VARCHAR,
  type VARCHAR NOT NULL, -- 'earn', 'spend', 'transfer'
  category VARCHAR,
  amount DECIMAL NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Reward Rules Table**
```sql
CREATE TABLE reward_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  code VARCHAR UNIQUE NOT NULL,
  category VARCHAR,
  token_reward DECIMAL NOT NULL,
  description TEXT,
  nft_badge_enabled BOOLEAN DEFAULT false,
  max_claims_per_user INTEGER DEFAULT 1,
  cooldown_period INTEGER DEFAULT 24, -- hours
  total_claims INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Security Features

- **Authentication**: Supabase Auth with JWT tokens
- **Data Protection**: Row Level Security policies
- **Input Validation**: TypeScript and form validation
- **Smart Contract Security**: Audited contract patterns
- **IPFS Integration**: Decentralized metadata storage

## 🎨 Design System

### **Color Palette**
```css
:root {
  --color-background: #e0e5ec;
  --color-primary: #3a3d98;
  --color-secondary: #00c6ff;
  --color-accent: #ff6b6b;
  --color-success: #4CAF50;
  --color-text: #1e1e2f;
}
```

### **Neumorphic Effects**
- **Soft shadows** for depth
- **Inset effects** for inputs
- **Elevated cards** for important content
- **Consistent spacing** and proportions

## 📱 Mobile Responsiveness

- **Mobile-first** design approach
- **Responsive navigation** with mobile menu
- **Touch-friendly** interface elements
- **Optimized performance** on mobile devices

## 🔄 Development Workflow

### **Available Scripts**

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### **Code Quality**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for consistent formatting
- **Husky** for pre-commit hooks

## 🚀 Deployment

### **Vercel Deployment** (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy with automatic builds

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Supabase** for the backend infrastructure
- **TailwindCSS** for the utility-first CSS framework
- **Ethereum Foundation** for blockchain technology
- **IPFS** for decentralized storage solutions

## 📞 Support

For support, email [your-email@domain.com] or join our Discord server.

---

**Built with ❤️ for the campus community**