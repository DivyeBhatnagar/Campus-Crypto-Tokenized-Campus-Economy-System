'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { 
  CONTRACT_ADDRESSES, 
  CAMPUS_COIN_ABI, 
  CAMPUS_BADGE_NFT_ABI,
  CAMPUS_ECONOMY_MANAGER_ABI 
} from '@/lib/web3';
import { User, Badge, RewardRule } from '@/types';

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Get contract addresses for current chain
  const contracts = CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[1337]; // fallback to hardhat

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address
  });

  // Get Campus Coin balance
  const { data: campusCoinBalance, refetch: refetchBalance } = useReadContract({
    address: contracts.campusCoin as `0x${string}`,
    abi: CAMPUS_COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  // Get user stats from Campus Coin
  const { data: userStats, refetch: refetchUserStats } = useReadContract({
    address: contracts.campusCoin as `0x${string}`,
    abi: CAMPUS_COIN_ABI,
    functionName: 'getUserStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  // Get user badges
  const { data: userBadgeIds } = useReadContract({
    address: contracts.campusBadgeNFT as `0x${string}`,
    abi: CAMPUS_BADGE_NFT_ABI,
    functionName: 'getUserBadges',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  // Contract write functions
  const { writeContract: writeEconomyManager, isPending: isTransactionPending } = useWriteContract();

  const connectWallet = async () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setUser(null);
  };

  const claimReward = async (rewardCode: string, evidence: string = '') => {
    if (!address || !contracts.campusEconomyManager) return;

    try {
      setLoading(true);
      writeEconomyManager({
        address: contracts.campusEconomyManager as `0x${string}`,
        abi: CAMPUS_ECONOMY_MANAGER_ABI,
        functionName: 'claimReward',
        args: [rewardCode, evidence]
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const purchaseProduct = async (productId: string) => {
    if (!address || !contracts.campusEconomyManager) return;

    try {
      setLoading(true);
      writeEconomyManager({
        address: contracts.campusEconomyManager as `0x${string}`,
        abi: CAMPUS_ECONOMY_MANAGER_ABI,
        functionName: 'purchaseProduct',
        args: [productId]
      });
    } catch (error) {
      console.error('Error purchasing product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const transferTokens = async (toAddress: string, amount: number, memo: string = '') => {
    if (!address || !contracts.campusEconomyManager) return;

    try {
      setLoading(true);
      writeEconomyManager({
        address: contracts.campusEconomyManager as `0x${string}`,
        abi: CAMPUS_ECONOMY_MANAGER_ABI,
        functionName: 'transferTokens',
        args: [toAddress as `0x${string}`, parseEther(amount.toString()), memo]
      });
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data when wallet connects
  useEffect(() => {
    if (address && isConnected) {
      fetchUserData();
    }
  }, [address, isConnected, userStats, userBadgeIds]);

  const fetchUserData = async () => {
    if (!address) return;

    try {
      setLoading(true);
      
      // This would typically fetch from your backend API
      // For now, we'll use mock data combined with blockchain data
      const mockUser: User = {
        id: address,
        studentId: 'STU' + address.slice(-6).toUpperCase(),
        fullName: 'Student Name',
        email: 'student@campus.edu',
        walletAddress: address,
        role: 'student',
        campusCoinBalance: userStats ? Number(formatEther(userStats[0] as bigint)) : 0,
        totalEarned: userStats ? Number(formatEther(userStats[1] as bigint)) : 0,
        totalSpent: userStats ? Number(formatEther(userStats[2] as bigint)) : 0,
        badges: [], // Would fetch badge metadata
        isActive: true,
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setUser(mockUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    refetchBalance();
    refetchUserStats();
    if (address) {
      fetchUserData();
    }
  };

  return {
    // Connection state
    address,
    isConnected,
    isPending,
    chainId,
    
    // Balances
    ethBalance: ethBalance?.formatted,
    campusCoinBalance: campusCoinBalance ? Number(formatEther(campusCoinBalance as bigint)) : 0,
    
    // User data
    user,
    loading,
    
    // Actions
    connectWallet,
    disconnectWallet,
    claimReward,
    purchaseProduct,
    transferTokens,
    refreshData,
    
    // Transaction state
    isTransactionPending,
    
    // Contract addresses
    contracts
  };
}