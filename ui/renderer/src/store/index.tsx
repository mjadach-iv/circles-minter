import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import SafeApiKit from '@safe-global/api-kit';
import { Sdk, type Avatar} from '@circles-sdk/sdk';
import { ethers } from 'ethers';
import { config as chainConfig } from '../config';
import { privateKeyToAccount } from 'viem/accounts';
import { type Address } from '@/types/index';

const safeService = new SafeApiKit({
  //  txServiceUrl: 'https://safe-client.safe.global', // or the network you want
     txServiceUrl: 'https://safe-transaction-mainnet.safe.global',
    chainId: 100n
});

const provider = new ethers.JsonRpcProvider(chainConfig.circlesRpcUrl);
const signer = new ethers.Wallet('0x010c2a92e8e6ea4898fa1e5c20f07de857b6def4c2ffd337228a61ee5fbb2ebe', provider);

// Initialize the Circles SDK
//@ts-ignore
const sdk = new Sdk(signer, chainConfig);

type Profile = {
    name: string;
    address: Address;
};

type Account = {
    name: string; 
    privateKey: Address, 
    publicKey: Address,
}

interface StoreState {
    accounts: Account[];
    addAccount: (name: string, privateKey: Address) => void;
    removeAccount: (index: number) => void;
    fetchMetriSafes: (owner: Address) => Promise<void>;
    profiles: {
        [ownerAddress: Address]: Profile[];
    };
}


export const useStore = create<StoreState>()(
  devtools((set) => ({
    accounts: [],
    profiles: {},
    addAccount: async (name: string, privateKey: Address) => {
        const account = privateKeyToAccount(privateKey as Address);
        const ownerAddress = account.address as Address;

        set((state) => ({ accounts: [...state.accounts, { name, privateKey, publicKey: ownerAddress }] }), false, 'addAccount');

        const rez: { [chainId: number]: Address[] } = await safeService.getSafesByOwner(ownerAddress);
        const safes: Address[] = rez[100];
        let avatars: Avatar[] = [];

        for (const safe of safes) {
            try {
                const avatar = await sdk.getAvatar(safe as Address);
                avatars.push(avatar);
            } catch (error) {
                console.error(`Error fetching avatar for safe ${safe}:`, error);
                // If the metri safe is not registered, it will throw an error
            }
        }

        const profiles: {name: string, address: Address}[] = [];

        for (const avatar of avatars) {
            const profile = await avatar.getProfile()
            if (profile) {
                console.log(`Avatar found: ${profile.name}, address: ${avatar.address}`);
                profiles.push({address: avatar.address as Address, name: profile.name});
            }
        }

        set((state) => ({
            profiles: {
                ...state.profiles,
                [ownerAddress]: profiles
            }
        }), false, 'addProfiles');

    },
    removeAccount: (index: number) =>
      set((state) => ({ accounts: state.accounts.filter((_, i) => i !== index) }), false, 'removeAccount'),
  }))
);

