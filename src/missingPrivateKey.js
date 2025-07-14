import { isHex } from 'viem';
import { privateKeyToAccount, generatePrivateKey  } from 'viem/accounts';

export async function privateKeyCheck() {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    let isValid = true;

    if (!isHex(PRIVATE_KEY)) {
        isValid = false; // Reset to null if invalid;
    }

    try {
        privateKeyToAccount(PRIVATE_KEY)
    } catch (error) {
        isValid = false; // Reset to null if invalid;
    }

    if (!isValid) {
        await missingPrivateKey();
        return; // Exit if no private key is set
    }
}



export async function missingPrivateKey() {
    console.error('\nYou did not provide a valid PRIVATE_KEY as environment variable.');
    console.log('If you don\'t have or know how to generate a new a private key, you can use the following automatically generated one just for you:\n');

    // Generate a random private key
    const privateKey = generatePrivateKey();
    // Derive the account from the private key
    const account = privateKeyToAccount(privateKey);

    // Print the generated private key and address
    console.log('=== NEWLY GENERATED ACCOUNT ===\nPrivate Key:', privateKey);
    console.log('Owner address:', account.address);

    console.log('\nYou need to add the new owner address to the Metri application in the settings and then re-run this program while providing the PRIVATE_KEY environment variable.');
    console.log('\nIMPORTANT: Save the private key in a secure place, so no one else can access it. If you lose it, can still access your account using the passkey you used to crete your Metri account.\n\n');

    // Sleep for 1 year (365 days)
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const oneDay = 24 * 60 * 60 * 1000;
    for (let i = 0; i < 365; i++) {
        await sleep(oneDay);
    }
}
