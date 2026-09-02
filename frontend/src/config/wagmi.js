import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Somnia Shannon Testnet Custom Chain
export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Shannon Testnet',
  nativeCurrency: {
    name: 'Somnia Testnet Token',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network', 'https://api.infra.testnet.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network', 'https://api.infra.testnet.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://shannon-explorer.somnia.network',
    },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: 'Tendon Protocol',
  projectId: 'tendon-somnia-dreamdex-hackathon',
  chains: [somniaTestnet],
  ssr: false,
});
