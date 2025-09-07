// NFT Badge System with IPFS Integration
'use client';

import React, { useState, useEffect } from 'react';

// Mock IPFS client for demo purposes (replace with actual IPFS when ready)
const mockIPFS = {
  async add(content: any) {
    // Simulate IPFS upload
    return {
      path: 'QmTestHash' + Math.random().toString(36).substr(2, 9),
      cid: {
        toString: () => 'QmTestHash' + Math.random().toString(36).substr(2, 9)
      }
    };
  },
  async cat(hash: string) {
    // Simulate IPFS retrieval
    return new Uint8Array([]);
  }
};

// Badge metadata interface
export interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  achievement_code: string;
  created_at: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// NFT Badge interface
export interface NFTBadge {
  id: string;
  tokenId: number;
  owner: string;
  metadata: BadgeMetadata;
  ipfsHash: string;
  transactionHash?: string;
  mintedAt: string;
  category: string;
}

// Badge template for different achievements
const badgeTemplates: Record<string, Partial<BadgeMetadata>> = {
  EVENT_ATTENDANCE: {
    name: 'Event Attendee',
    description: 'Awarded for attending campus events',
    rarity: 'common',
    attributes: [
      { trait_type: 'Category', value: 'Participation' },
      { trait_type: 'Type', value: 'Event' },
      { trait_type: 'Difficulty', value: 'Easy' }
    ]
  },
  ACADEMIC_EXCELLENCE: {
    name: 'Academic Star',
    description: 'Awarded for outstanding academic performance',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Category', value: 'Academic' },
      { trait_type: 'Type', value: 'Achievement' },
      { trait_type: 'Difficulty', value: 'Hard' }
    ]
  },
  VOLUNTEER_HERO: {
    name: 'Community Hero',
    description: 'Awarded for exceptional volunteer service',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Category', value: 'Service' },
      { trait_type: 'Type', value: 'Volunteer' },
      { trait_type: 'Difficulty', value: 'Very Hard' }
    ]
  },
  QUIZ_MASTER: {
    name: 'Quiz Master',
    description: 'Awarded for quiz competition excellence',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Category', value: 'Competition' },
      { trait_type: 'Type', value: 'Quiz' },
      { trait_type: 'Difficulty', value: 'Medium' }
    ]
  },
  LEADERSHIP: {
    name: 'Natural Leader',
    description: 'Awarded for exceptional leadership qualities',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Category', value: 'Leadership' },
      { trait_type: 'Type', value: 'Special' },
      { trait_type: 'Difficulty', value: 'Legendary' }
    ]
  }
};

// Generate SVG badge image
export function generateBadgeImage(metadata: BadgeMetadata): string {
  const colors = {
    common: '#6B7280',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };

  const color = colors[metadata.rarity];
  
  const svg = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="badgeGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.6" />
        </radialGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      
      <!-- Badge Circle -->
      <circle cx="100" cy="100" r="90" fill="url(#badgeGradient)" filter="url(#shadow)" stroke="${color}" stroke-width="3"/>
      
      <!-- Inner Circle -->
      <circle cx="100" cy="100" r="70" fill="none" stroke="white" stroke-width="2" opacity="0.8"/>
      
      <!-- Achievement Icon (simplified star) -->
      <polygon points="100,40 110,70 140,70 118,88 128,118 100,100 72,118 82,88 60,70 90,70" fill="white" opacity="0.9"/>
      
      <!-- Achievement Name -->
      <text x="100" y="150" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">
        ${metadata.name}
      </text>
      
      <!-- Rarity Indicator -->
      <text x="100" y="170" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" opacity="0.8">
        ${metadata.rarity.toUpperCase()}
      </text>
      
      <!-- Border decoration -->
      <circle cx="100" cy="100" r="95" fill="none" stroke="${color}" stroke-width="1" opacity="0.5" stroke-dasharray="5,5"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// IPFS Helper Functions
export class IPFSBadgeManager {
  private ipfs: any;

  constructor() {
    this.ipfs = mockIPFS; // Use mock for demo, replace with real IPFS client
  }

  async uploadBadgeMetadata(metadata: BadgeMetadata): Promise<string> {
    try {
      // Generate badge image
      const imageData = generateBadgeImage(metadata);
      
      // Upload image to IPFS (in real implementation)
      const imageUpload = await this.ipfs.add(imageData);
      const imageHash = imageUpload.cid.toString();

      // Update metadata with IPFS image URL
      const updatedMetadata = {
        ...metadata,
        image: `ipfs://${imageHash}`
      };

      // Upload metadata to IPFS
      const metadataUpload = await this.ipfs.add(JSON.stringify(updatedMetadata));
      const metadataHash = metadataUpload.cid.toString();

      return metadataHash;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload badge metadata to IPFS');
    }
  }

  async getBadgeMetadata(ipfsHash: string): Promise<BadgeMetadata> {
    try {
      // In real implementation, fetch from IPFS
      // const data = await this.ipfs.cat(ipfsHash);
      // return JSON.parse(new TextDecoder().decode(data));
      
      // Mock data for demo
      return {
        name: 'Sample Badge',
        description: 'A sample achievement badge',
        image: generateBadgeImage({
          name: 'Sample Badge',
          description: 'A sample achievement badge',
          image: '',
          attributes: [],
          achievement_code: 'SAMPLE',
          created_at: new Date().toISOString(),
          rarity: 'common'
        }),
        attributes: [
          { trait_type: 'Category', value: 'Sample' },
          { trait_type: 'Rarity', value: 'Common' }
        ],
        achievement_code: 'SAMPLE',
        created_at: new Date().toISOString(),
        rarity: 'common'
      };
    } catch (error) {
      console.error('Error fetching from IPFS:', error);
      throw new Error('Failed to fetch badge metadata from IPFS');
    }
  }

  async createBadgeForAchievement(
    achievementCode: string, 
    recipient: string,
    customAttributes: Array<{ trait_type: string; value: string | number }> = []
  ): Promise<{ metadata: BadgeMetadata; ipfsHash: string }> {
    const template = badgeTemplates[achievementCode];
    
    if (!template) {
      throw new Error(`No badge template found for achievement: ${achievementCode}`);
    }

    const metadata: BadgeMetadata = {
      name: template.name!,
      description: template.description!,
      image: '', // Will be set during upload
      attributes: [
        ...template.attributes!,
        ...customAttributes,
        { trait_type: 'Recipient', value: recipient },
        { trait_type: 'Minted', value: new Date().toISOString() }
      ],
      achievement_code: achievementCode,
      created_at: new Date().toISOString(),
      rarity: template.rarity || 'common'
    };

    const ipfsHash = await this.uploadBadgeMetadata(metadata);

    return { metadata, ipfsHash };
  }
}

// Badge Collection Component
export function BadgeCollection({ badges }: { badges: NFTBadge[] }) {
  const [selectedBadge, setSelectedBadge] = useState<NFTBadge | null>(null);

  const rarityColors = {
    common: 'border-gray-400',
    uncommon: 'border-green-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500'
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text">My NFT Badges</h3>
      
      {badges.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-background shadow-neumorphic-inset flex items-center justify-center">
            <span className="text-2xl">🏆</span>
          </div>
          <p className="text-text/60">No badges earned yet</p>
          <p className="text-text/40 text-sm">Complete achievements to earn NFT badges!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-3 bg-background rounded-2xl shadow-neumorphic cursor-pointer transition-all duration-200 hover:shadow-neumorphic-lg border-2 ${rarityColors[badge.metadata.rarity]}`}
              onClick={() => setSelectedBadge(badge)}
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-3 shadow-neumorphic-inset">
                <img 
                  src={badge.metadata.image} 
                  alt={badge.metadata.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center">
                <p className="font-medium text-text text-sm truncate">{badge.metadata.name}</p>
                <p className="text-xs text-text/60 capitalize">{badge.metadata.rarity}</p>
              </div>
              
              <div className="absolute top-2 right-2 bg-background/80 rounded-full p-1">
                <span className="text-xs font-bold text-primary">#{badge.tokenId}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md shadow-neumorphic-lg">
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-neumorphic-inset mb-4">
                <img 
                  src={selectedBadge.metadata.image} 
                  alt={selectedBadge.metadata.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-text">{selectedBadge.metadata.name}</h3>
              <p className="text-text/60 text-sm">{selectedBadge.metadata.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-text mb-2">Attributes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedBadge.metadata.attributes.map((attr, index) => (
                    <div key={index} className="bg-background rounded-xl p-2 shadow-neumorphic-inset">
                      <p className="text-xs text-text/60">{attr.trait_type}</p>
                      <p className="text-sm font-medium text-text">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-text mb-2">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text/60">Token ID:</span>
                    <span className="text-text">#{selectedBadge.tokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Rarity:</span>
                    <span className={`text-text capitalize font-medium`}>
                      {selectedBadge.metadata.rarity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Minted:</span>
                    <span className="text-text">
                      {new Date(selectedBadge.mintedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-medium shadow-neumorphic hover:shadow-neumorphic-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for managing NFT badges
export function useNFTBadges(userId: string) {
  const [badges, setBadges] = useState<NFTBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [ipfsManager] = useState(() => new IPFSBadgeManager());

  useEffect(() => {
    loadUserBadges();
  }, [userId]);

  const loadUserBadges = async () => {
    try {
      // In a real implementation, fetch from blockchain/database
      // For demo, create some mock badges
      const mockBadges: NFTBadge[] = [
        {
          id: 'badge_1',
          tokenId: 1001,
          owner: userId,
          metadata: {
            name: 'Event Attendee',
            description: 'Awarded for attending campus events',
            image: generateBadgeImage({
              name: 'Event Attendee',
              description: 'Awarded for attending campus events',
              image: '',
              attributes: [],
              achievement_code: 'EVENT_ATTENDANCE',
              created_at: new Date().toISOString(),
              rarity: 'common'
            }),
            attributes: [
              { trait_type: 'Category', value: 'Participation' },
              { trait_type: 'Type', value: 'Event' },
              { trait_type: 'Rarity', value: 'Common' }
            ],
            achievement_code: 'EVENT_ATTENDANCE',
            created_at: new Date().toISOString(),
            rarity: 'common'
          },
          ipfsHash: 'QmTestHash1',
          mintedAt: new Date().toISOString(),
          category: 'participation'
        },
        {
          id: 'badge_2',
          tokenId: 1002,
          owner: userId,
          metadata: {
            name: 'Quiz Master',
            description: 'Awarded for quiz competition excellence',
            image: generateBadgeImage({
              name: 'Quiz Master',
              description: 'Awarded for quiz competition excellence',
              image: '',
              attributes: [],
              achievement_code: 'QUIZ_MASTER',
              created_at: new Date().toISOString(),
              rarity: 'uncommon'
            }),
            attributes: [
              { trait_type: 'Category', value: 'Competition' },
              { trait_type: 'Type', value: 'Quiz' },
              { trait_type: 'Rarity', value: 'Uncommon' }
            ],
            achievement_code: 'QUIZ_MASTER',
            created_at: new Date().toISOString(),
            rarity: 'uncommon'
          },
          ipfsHash: 'QmTestHash2',
          mintedAt: new Date().toISOString(),
          category: 'academic'
        }
      ];

      setBadges(mockBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const mintBadge = async (
    achievementCode: string, 
    recipient: string,
    customAttributes: Array<{ trait_type: string; value: string | number }> = []
  ) => {
    try {
      // Create badge metadata and upload to IPFS
      const { metadata, ipfsHash } = await ipfsManager.createBadgeForAchievement(
        achievementCode, 
        recipient, 
        customAttributes
      );

      // In a real implementation, call smart contract to mint NFT
      // const contract = new ethers.Contract(badgeContractAddress, badgeABI, signer);
      // const tx = await contract.mintBadge(recipient, achievementCode, `ipfs://${ipfsHash}`);
      // await tx.wait();

      // For demo, simulate successful minting
      const newBadge: NFTBadge = {
        id: 'badge_' + Date.now(),
        tokenId: Math.floor(Math.random() * 10000) + 1000,
        owner: recipient,
        metadata: {
          ...metadata,
          image: generateBadgeImage(metadata)
        },
        ipfsHash,
        mintedAt: new Date().toISOString(),
        category: achievementCode.toLowerCase().split('_')[0]
      };

      setBadges(prev => [newBadge, ...prev]);
      return newBadge;
    } catch (error) {
      console.error('Error minting badge:', error);
      throw error;
    }
  };

  return {
    badges,
    loading,
    mintBadge,
    refreshBadges: loadUserBadges
  };
}

export default {
  IPFSBadgeManager,
  BadgeCollection,
  useNFTBadges,
  generateBadgeImage,
  badgeTemplates
};