'use client';

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, hardhat, mainnet } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';

// Configure chains
const chains = [hardhat, sepolia, mainnet] as const;

// Configure RainbowKit
const config = getDefaultConfig({
  appName: 'Tokenized Campus Economy',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your_project_id_here',
  chains,
  ssr: true
});

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: {
              colors: {
                accentColor: '#3a3d98',
                accentColorForeground: 'white',
                actionButtonBorder: '#e0e5ec',
                actionButtonBorderMobile: '#e0e5ec',
                actionButtonSecondaryBackground: '#e0e5ec',
                closeButton: '#1e1e2f',
                closeButtonBackground: '#e0e5ec',
                connectButtonBackground: '#e0e5ec',
                connectButtonBackgroundError: '#ff6b6b',
                connectButtonInnerBackground: '#e0e5ec',
                connectButtonText: '#1e1e2f',
                connectButtonTextError: 'white',
                connectionIndicator: '#4CAF50',
                downloadBottomCardBackground: '#e0e5ec',
                downloadTopCardBackground: '#e0e5ec',
                error: '#ff6b6b',
                generalBorder: '#c5cad1',
                generalBorderDim: '#e0e5ec',
                menuItemBackground: '#e0e5ec',
                modalBackdrop: 'rgba(30, 30, 47, 0.7)',
                modalBackground: '#e0e5ec',
                modalBorder: '#c5cad1',
                modalText: '#1e1e2f',
                modalTextDim: '#666',
                modalTextSecondary: '#888',
                profileAction: '#e0e5ec',
                profileActionHover: '#d0d5dc',
                profileForeground: '#e0e5ec',
                selectedOptionBorder: '#3a3d98',
                standby: '#00c6ff'
              }
            }
          }}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}