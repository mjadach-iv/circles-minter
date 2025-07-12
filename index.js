import { Sdk } from '@circles-sdk/sdk';
import { ethers } from 'ethers';
import { mint as metrixMint, config as chainConfig } from './metrix.js';
import { privateKeyCheck } from './missingPrivateKey.js';

let PRIVATE_KEY = process.env.PRIVATE_KEY;

main();

async function main() {
    await privateKeyCheck();

    console.log('Starting Circles minting process...');
    
    while (true) {
        try {
            await mint();
        } catch (error) {
            console.error('An error occurred during the minting process:', error);
        }
        console.log('Waiting for 24 hours before next mint...');
        await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000)); // Wait for a second before exiting
    }
}

async function mint() {
    // Set up ethers.js provider and signer (replace with your private key or use a wallet provider)
    const provider = new ethers.JsonRpcProvider(chainConfig.circlesRpcUrl);
    if (!PRIVATE_KEY) throw new Error('Set PRIVATE_KEY in your environment');
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    // Initialize the Circles SDK
    const sdk = new Sdk(signer, chainConfig);

    // Get the signer address
    const signerAddress = await signer.getAddress();
    console.log('Owner/signer address:', signerAddress);

    // Get all safes for the signer
    const safesRez = await fetch(`https://safe-client.safe.global/v2/owners/${signerAddress}/safes`)
    const safesAllNetworks = await safesRez.json();
    let safes = safesAllNetworks[100];

    if (!safes || safes.length === 0) {
        const safesRez = await fetch(`https://safe-transaction.prod.hoprnet.link/api/v1/owners/${signerAddress}/safes/`);
        const safesJson = await safesRez.json();
        safes = safesJson.safes;
    }

    if (!safes || safes.length === 0) {
        console.log('No safes found for the signer address');
        return;
    }

    // Get only registered metri accounts
    let avatars = [];
    for (const safe of safes) {
        try {
            const avatar = await sdk.getAvatar(safe);
            avatars.push(avatar);
        } catch (error) {
            console.error(`Error fetching avatar for safe ${safe}:`, error);
            // If the metri safe is not registered, it will throw an error
        }
    }

    for (const avatar of avatars) {
        const profile = await avatar.getProfile()
        console.log(`Avatar found: ${profile.name}, address: ${avatar.address}`);

        // Check how much you can mint
        const mintable = await avatar.getMintableAmount();
        console.log(`Mintable amount: ${mintable.toString()} CRC`);

        if (mintable > 0n) {
            const normalFee = 0.0833288 * 3 * mintable;
            const fee = Number((normalFee/2).toFixed(10));
            console.log(`If you minted with metri the fee would be ${normalFee} CRC, but you only will pay 50% of that: ${fee} CRC`);
            const rez = await metrixMint(avatar.address, fee);
            console.log(`Minting successful for '${profile.name}': https://gnosisscan.io/tx/${rez}`);
        } else {
            console.log('No Circles available to mint at this time.');
        }
    }

}
