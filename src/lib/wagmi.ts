
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'MoChad',
  projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect Project ID
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});
