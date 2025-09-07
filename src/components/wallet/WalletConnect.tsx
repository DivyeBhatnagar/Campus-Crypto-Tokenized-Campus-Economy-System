'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWeb3 } from '@/hooks/useWeb3';
import { Button } from '@/components/ui';
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletConnectProps {
  variant?: 'button' | 'full';
  showBalance?: boolean;
}

export function WalletConnect({ variant = 'button', showBalance = true }: WalletConnectProps) {
  const { 
    address, 
    isConnected, 
    isPending, 
    campusCoinBalance, 
    ethBalance,
    user,
    connectWallet, 
    disconnectWallet 
  } = useWeb3();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  };

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  if (variant === 'full') {
    return (
      <div className="space-y-4">
        {!isConnected ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-text/70">
                Connect your MetaMask wallet to start earning and spending CampusCoins
              </p>
            </div>
            
            <ConnectButton.Custom>
              {({ openConnectModal, connectModalOpen }) => (
                <Button 
                  onClick={openConnectModal}
                  size="lg"
                  disabled={isPending || connectModalOpen}
                  className="w-full"
                >
                  {isPending ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
            </ConnectButton.Custom>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-2xl p-6 shadow-neumorphic"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">Wallet Connected</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyAddress}
                  className="p-2 rounded-lg bg-background shadow-neumorphic-sm hover:shadow-neumorphic transition-all duration-200"
                  title="Copy Address"
                >
                  <Copy className="w-4 h-4 text-text/70" />
                </button>
                <button
                  onClick={openEtherscan}
                  className="p-2 rounded-lg bg-background shadow-neumorphic-sm hover:shadow-neumorphic transition-all duration-200"
                  title="View on Etherscan"
                >
                  <ExternalLink className="w-4 h-4 text-text/70" />
                </button>
                <button
                  onClick={disconnectWallet}
                  className="p-2 rounded-lg bg-background shadow-neumorphic-sm hover:shadow-neumorphic transition-all duration-200"
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4 text-accent" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text/70">Address:</span>
                <code className="text-sm text-text font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </code>
              </div>

              {showBalance && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-text/70">ETH Balance:</span>
                    <span className="text-text font-medium">
                      {ethBalance ? parseFloat(ethBalance).toFixed(4) : '0.0000'} ETH
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text/70">CampusCoins:</span>
                    <span className="text-primary font-semibold">
                      {campusCoinBalance.toFixed(2)} CAMPUS
                    </span>
                  </div>
                </>
              )}

              {user && (
                <div className="pt-3 border-t border-text/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text/70">Student ID:</span>
                    <span className="text-text">{user.studentId}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Button variant
  return (
    <ConnectButton.Custom>
      {({ 
        account, 
        chain, 
        openAccountModal, 
        openChainModal, 
        openConnectModal, 
        mounted 
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    disabled={isPending}
                    className="flex items-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="accent"
                    className="flex items-center space-x-2"
                  >
                    <span>Wrong network</span>
                  </Button>
                );
              }

              return (
                <div className="flex items-center space-x-2">
                  {showBalance && (
                    <div className="hidden sm:block text-sm text-text/70">
                      {campusCoinBalance.toFixed(2)} CAMPUS
                    </div>
                  )}
                  
                  <Button
                    onClick={openAccountModal}
                    variant="secondary"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>
                      {account.displayName}
                    </span>
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}