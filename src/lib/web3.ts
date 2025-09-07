import { mainnet, sepolia, hardhat } from 'wagmi/chains';

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  [hardhat.id]: {
    campusCoin: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    campusBadgeNFT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    campusEconomyManager: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  },
  [sepolia.id]: {
    campusCoin: process.env.NEXT_PUBLIC_SEPOLIA_CAMPUS_COIN || '',
    campusBadgeNFT: process.env.NEXT_PUBLIC_SEPOLIA_BADGE_NFT || '',
    campusEconomyManager: process.env.NEXT_PUBLIC_SEPOLIA_ECONOMY_MANAGER || ''
  },
  [mainnet.id]: {
    campusCoin: process.env.NEXT_PUBLIC_MAINNET_CAMPUS_COIN || '',
    campusBadgeNFT: process.env.NEXT_PUBLIC_MAINNET_BADGE_NFT || '',
    campusEconomyManager: process.env.NEXT_PUBLIC_MAINNET_ECONOMY_MANAGER || ''
  }
} as const;

// Default chain
export const defaultChain = hardhat;

// Contract ABIs (simplified - in production, import from build artifacts)
export const CAMPUS_COIN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function getUserStats(address user) view returns (uint256 balance, uint256 earned, uint256 spent, uint256 net)',
  'function distributeReward(address user, string rewardCode, string evidence)',
  'function redeem(uint256 amount, string vendor, string product)',
  'function getRewardInfo(string rewardCode) view returns (bool isValid, uint256 amount, uint256 maxClaims)',
  'function getUserClaimCount(address user, string rewardCode) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event RewardClaimed(address indexed user, string rewardCode, uint256 amount, string evidence)',
  'event TokensRedeemed(address indexed user, uint256 amount, string vendor, string product)'
] as const;

export const CAMPUS_BADGE_NFT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function getUserBadges(address user) view returns (uint256[])',
  'function getBadgeMetadata(uint256 tokenId) view returns (string name, string description, string category, uint256 mintedAt, string achievementCode, string[] attributeKeys)',
  'function getBadgeAttribute(uint256 tokenId, string attributeKey) view returns (string)',
  'function hasAchievement(address user, string achievementCode) view returns (bool)',
  'function mintBadge(address recipient, string achievementCode, string tokenURI, string name, string description, string category, string[] attributeKeys, string[] attributeValues)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event BadgeMinted(address indexed recipient, uint256 indexed tokenId, string achievementCode, string name)'
] as const;

export const CAMPUS_ECONOMY_MANAGER_ABI = [
  'function registerStudent(address student, string studentId)',
  'function getStudentInfo(address student) view returns (bool isRegistered, string studentId, uint256 tokenBalance, uint256 totalEarned, uint256 totalSpent, uint256 badgeCount)',
  'function claimReward(string rewardCode, string evidence)',
  'function purchaseProduct(string productId)',
  'function transferTokens(address to, uint256 amount, string memo)',
  'function getRewardRule(string rewardCode) view returns (uint256 tokenAmount, bool hasBadge, string badgeName, bool isActive, uint256 maxClaimsPerUser, uint256 totalClaimed, uint256 cooldownPeriod)',
  'function getUserClaimCount(address user, string rewardCode) view returns (uint256)',
  'function getActiveRewardCodes() view returns (string[])',
  'function getActiveProductIds() view returns (string[])',
  'event StudentRegistered(address indexed student, string studentId)',
  'event RewardClaimed(address indexed student, string rewardCode, uint256 tokens, bool badgeAwarded)',
  'event ProductPurchased(address indexed student, string productId, uint256 price)',
  'event TokensTransferred(address indexed from, address indexed to, uint256 amount)'
] as const;