import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import SafeApiKit from '@safe-global/api-kit';
import { Sdk, type Avatar } from '@circles-sdk/sdk';
import { ethers } from 'ethers';
import { config as chainConfig } from '../config/constants';
import { privateKeyToAccount } from 'viem/accounts';
import { type Address } from '../types/index';
import {encryptString} from '../crypto'


const safeService = new SafeApiKit({
    txServiceUrl: 'https://safe-client.safe.global', // or the network you want
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
    description?: string;
    image?: string;
    avatar?: Avatar;
};

type Account = {
    name: string;
    encryptedPrivateKey: string,
    publicKey: Address,
}

interface StoreState {
    loadingApp: boolean;
    accounts: Account[];
    balances: {
        [profileAddress: Address]: {
            balance: number | null;
            mintable: number | null;
            isFetching: boolean;
        };
    };
    avatars: {
        [profileAddress: Address]: Avatar;
    }
    minting: boolean;
    automaticMinting: boolean;
    mintableAmounts: {
        [profileAddress: Address]: string | null;
    };
    addAccount: (name: string, privateKey: Address) => void;
    removeAccount: (index: number) => void;
    fetchMetriSafes: (owner: Address) => Promise<void>;
    profiles: {
        [ownerAddress: Address]: Profile[];
    };
    getTotalBalance: (ownerAddress: Address) => Promise<void>;
    loadDB: ()=>{},
}


export const useStore = create<StoreState>()(
    devtools((set, get) => ({
        loadingApp: true,
        accounts: [],
        profiles: {},
        balances: {},
        minting: false,
        automaticMinting: false,
        mintableAmounts: {},
        addAccount: async (name: string, privateKey: Address) => {
            const account = privateKeyToAccount(privateKey as Address);
            const uiSecret = await window.electronAPI.getUiSecret();
            const encryptedPrivateKey = await encryptString(privateKey, uiSecret);
            const ownerAddress = account.address as Address;

            set((state) => ({
                accounts: [
                    ...state.accounts,
                    {
                        name,
                        encryptedPrivateKey: encryptedPrivateKey,
                        publicKey: ownerAddress
                    }
                ]
            }), false, 'addAccount');

            window.electronAPI.saveDb({
                accounts: get().accounts,
            });

            const profiles = await getProfiles(ownerAddress);

            set((state) => ({
                profiles: {
                    ...state.profiles,
                    [ownerAddress]: profiles
                }
            }), false, 'addProfiles');

        },
        removeAccount: (index: number) => {
            const ownerAddress = get().accounts[index].publicKey;
            set((state) => ({ accounts: state.accounts.filter((_, i) => i !== index) }), false, 'removeAccount');
            window.electronAPI.saveDb({
                accounts: get().accounts,
            });
            set((state) => {
                const newProfiles = { ...state.profiles };
                delete newProfiles[ownerAddress];
                return { profiles: newProfiles };
            }, false, 'removeProfiles');
        },
        loadDB: async () => {
            try{
                const db = await window.electronAPI.getDb();
                if (!db || !db.accounts) {
                    console.warn('No accounts found in the database');
                    set(() => ({ loadingApp: false }), false, 'loadAppState');
                    return;
                }

                set(() => ({
                    accounts: db.accounts
                }), false, 'loadAccounts');

                for (const account of db.accounts) {
                    const profiles = await getProfiles(account.publicKey);
                    set((state) => ({
                        profiles: {
                            ...state.profiles,
                            [account.publicKey]: profiles
                        }
                    }), false, 'loadProfiles');
                }

                set(() => ({ loadingApp: false }), false, 'loadAppState');
            } catch (error) {
                console.error('Error loading database:', error);
            }
        },
        getTotalBalance: async (profileAddress: Address) => {
            set((state) => ({
                balances: {
                    ...state.balances,
                    [profileAddress]: {
                        balance: state.balances?.[profileAddress]?.balance || null,
                        mintable: state.balances?.[profileAddress]?.mintable || null,
                        isFetching: true
                    }
                }
            }), false, 'setTotalBalance');

            //Manual
            // const rez = await fetch(chainConfig.circlesRpcUrl, {
            //     "headers": {
            //         "content-type": "application/json",
            //     },
            //     "body": `{\"jsonrpc\":\"2.0\",\"id\":${Math.random()},\"method\":\"circlesV2_getTotalBalance\",\"params\":[\"${profileAddress}\",true]}`,
            //     "method": "POST",
            // });
            // const json = await rez.json();
            // console.log(`Total balance for ${profileAddress}:`, json);

            const avatar = get().avatars[profileAddress];
            const balance = await avatar.getTotalBalance();
            const mintableAmount = await avatar.getMintableAmount();
            const mintable = mintableAmount - mintableAmount * (0.0833288 * 3 / 2);
            console.log(`Total balance for ${profileAddress}:`, balance);
            console.log(`Mintable amount for ${profileAddress}:`, mintableAmount, mintable);

            set((state) => ({
                balances: {
                    ...state.balances,
                    [profileAddress]: {
                        balance: balance || null,
                        mintable,
                        isFetching: false
                    }
            }}), false, 'setTotalBalance');
        },
    }))
);


async function getProfiles(ownerAddress: Address): Promise<Profile[]> {
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

    const profiles: Profile[] = [];

    for (const avatar of avatars) {
        const profile = await avatar.getProfile();

        useStore.setState((state) => ({
            avatars: {
                ...state.avatars,
                [avatar.address as Address]: avatar
            }
        }));

        console.log(`Profile for avatar ${avatar.address}:`, profile);
        if (profile) {
            console.log(`Avatar found: ${profile.name}, address: ${avatar.address}`);
            profiles.push({
                address: avatar.address as Address,
                name: profile.name,
                description: profile?.description,
                image: profile?.previewImageUrl,
            });
        }
    }

    return profiles;
}