import { isHex } from 'viem';
import { privateKeyToAccount  } from 'viem/accounts';

export async function privateKeyCheck(PRIVATE_KEY) {
    let isValid = true;

    if (!isHex(PRIVATE_KEY)) {
        isValid = false; // Reset to null if invalid;
    }

    try {
        privateKeyToAccount(PRIVATE_KEY)
    } catch (error) {
        isValid = false; // Reset to null if invalid;
    }

    return isValid; 
}