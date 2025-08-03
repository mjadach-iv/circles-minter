import { Sdk } from '@circles-sdk/sdk';
import { ethers } from 'ethers';
import { mint as metrixMint, config as chainConfig } from '../../../src/metrix.js';
import { privateKeyCheck } from './missingPrivateKey.js';
import Store from 'electron-store';
import { decryptJson, decryptString } from '../functions.js';

const store = new Store();

main();
async function main() {
    while (true) {
        const autoMinting = store.get('auto-minting');
        if (!autoMinting || !autoMinting.value) {
            await new Promise(resolve => setTimeout(resolve, 60 * 1000)); // Wait for 1 minute before checking again
            continue;
        }

        if (autoMinting.value && autoMinting.next) {
            const now = Date.now();
            const waitMs = autoMinting.next - now;
            if (waitMs > 60 * 1000) { // If wait time is more than 1 minute
                await new Promise(resolve => setTimeout(resolve, 60 * 1000)); // Wait until the next mint time
                continue;
            } else {
                console.log(`Waiting for ${waitMs / 1000} seconds until next mint...`);
                await new Promise(resolve => setTimeout(resolve, waitMs)); // Wait until the next mint time
                await mintNow();
            }
        }
    }
}

export async function mintNow() {
    console.log('Calling function mintNow()',
        process.env.RPC_URL_GATEWAY,
        process.env.RPC_URL_ANKR,
        process.env.PUBLIC_CONNECT_4337_COMETH_API_KEY,
        process.env.PUBLIC_COMETH_API_KEY,
        process.env.ENCRYPT_SECRET
    );
    try {
        const db = store.get('db');
        const secret = store.get('uiSecret');
        const json = db ? decryptJson(db) : null;
        const privateKeys = [];
        for(let item of json?.accounts || []) {
            if (item.encryptedPrivateKey) {
                const key = await decryptString(item.encryptedPrivateKey, secret);
                privateKeys.push(key);
            }
        }
        for (const privateKey of privateKeys) {
            console.log('Minting with private key :', privateKey);
            await mint(privateKey);
        }
        return true;
    } catch (error) {
        console.error('An error occurred during the minting process:', error);
        return false;
    }
}

async function mint(PRIVATE_KEY) {

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
            console.log(`If you minted with metri the fee would be ${normalFee} CRC, but you will save ${fee} CRC on this minting!`);
            const rez = await metrixMint(avatar.address, fee, PRIVATE_KEY);
            console.log(`Minting successful for '${profile.name}': https://gnosisscan.io/tx/${rez}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before next mint
        } else {
            console.log('No Circles available to mint at this time.');
        }
    }

}
