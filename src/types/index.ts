// User types
export interface User {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  walletAddress: string;
  department?: string;
  year?: number;
  profileImage?: string;
  role: 'student' | 'admin' | 'vendor';
  campusCoinBalance: number;
  totalEarned: number;
  totalSpent: number;
  badges: Badge[];
  isActive: boolean;
  joinedAt: string;
  lastLogin: string;
}

// Badge types
export interface Badge {
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  metadata: {
    ruleCode: string;
    earnedFor: string;
    attributes: BadgeAttribute[];
  };
  earnedAt: string;
}

export interface BadgeAttribute {
  trait_type: string;
  value: string;
}

// Transaction types
export interface Transaction {
  id: string;
  hash: string;
  type: 'earn' | 'spend' | 'transfer' | 'reward' | 'penalty';
  category: string;
  amount: number;
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
  fromUser?: Partial<User>;
  toUser?: Partial<User>;
  rewardRule?: RewardRule;
  createdAt: string;
  blockTimestamp: string;
  metadata?: any;
}

// Reward types
export interface RewardRule {
  id: string;
  name: string;
  code: string;
  category: string;
  tokenReward: number;
  description: string;
  requirements: RewardRequirement[];
  nftBadge: {
    enabled: boolean;
    name?: string;
    description?: string;
    imageUrl?: string;
    attributes?: BadgeAttribute[];
  };
  maxClaimsPerUser: number;
  cooldownPeriod: number;
  totalClaims: number;
  isValid: boolean;
  tags: string[];
}

export interface RewardRequirement {
  condition: string;
  value: any;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
}

// Product types
export interface VendorProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  vendor: string;
  category: string;
  image?: string;
  availability: boolean;
}

// Analytics types
export interface Analytics {
  summary: {
    currentBalance: number;
    totalEarned: number;
    totalSpent: number;
    badgeCount: number;
    netBalance: number;
  };
  timeframe: {
    period: string;
    startDate: string;
    endDate: string;
  };
  earned: {
    total: number;
    transactions: number;
    byCategory: CategoryData[];
  };
  spent: {
    total: number;
    transactions: number;
    byCategory: CategoryData[];
  };
  recentActivity: Transaction[];
}

export interface CategoryData {
  _id: string;
  total: number;
  count: number;
}

// Event types
export interface CampusEvent {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  venue: string;
  isOnline: boolean;
  attendanceReward: number;
  participationReward: number;
  status: 'draft' | 'open' | 'ongoing' | 'completed' | 'cancelled';
  participantCount: number;
  isRegistrationOpen: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Pagination types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Contract types
export interface ContractAddresses {
  campusCoin: string;
  campusBadgeNFT: string;
  campusEconomyManager: string;
}

// Web3 types
export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
}

// Form types
export interface ClaimRewardForm {
  rewardCode: string;
  evidence?: string;
  metadata?: any;
}

export interface TransferTokensForm {
  toAddress: string;
  amount: number;
  description: string;
}

export interface RedeemTokensForm {
  productId: string;
  quantity: number;
  notes?: string;
}