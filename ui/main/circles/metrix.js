import 'dotenv/config';
import { gnosis } from 'viem/chains';
import {
  createComethPaymasterClient,
  createSafeSmartAccount,
  createSmartAccountClient,
  ENTRYPOINT_ADDRESS_V07,
} from '@cometh/connect-sdk-4337';
import {
  bytesToBigInt,
  http,
  createPublicClient,
  createWalletClient,
  parseAbi,
  encodeFunctionData,
  fallback,
  parseEther,
  toBytes,
  isAddress
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';


export const config = {
  circlesRpcUrl: 'https://rpc.aboutcircles.com/',
  pathfinderUrl: 'https://pathfinder.aboutcircles.com',
  v1HubAddress: '0x29b9a7fbb8995b2423a71cc17cf9810798f6c543',
  v2HubAddress: '0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8',
  nameRegistryAddress: '0xA27566fD89162cC3D40Cb59c87AAaA49B85F3474',
  migrationAddress: '0xD44B8dcFBaDfC78EA64c55B705BFc68199B56376',
  profileServiceUrl: 'https://rpc.aboutcircles.com/profiles/',
  baseGroupMintPolicy: '0xcCa27c26CF7BAC2a9928f42201d48220F0e3a549',
};

const PUBLIC_CONNECT_4337_COMETH_API_KEY = process.env.PUBLIC_CONNECT_4337_COMETH_API_KEY;
const PUBLIC_COMETH_API_KEY = process.env.PUBLIC_COMETH_API_KEY;
export const RPC_URL_GATEWAY =  process.env.RPC_URL_GATEWAY || '';
export const RPC_URL_ANKR = process.env.RPC_URL_ANKR || '';
export const RPC_URL_CIRCLES = config.circlesRpcUrl;
export const RPC_URL_GNOSIS = 'https://rpc.gnosischain.com/';

export const publicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: gnosis,
  transport: fallback(
    [http(RPC_URL_GATEWAY), http(RPC_URL_ANKR), http(RPC_URL_GNOSIS), http(RPC_URL_CIRCLES)],
    {
      rank: false,
    },
  ),
});

export const cometh4337SignerConfig = {
  webAuthnOptions: {
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  },
  // passKeyName: PASSKEY_NAME,
  disableEoaFallback: false,
};

export const cometh4337Params = {
  apiKeyLegacy: PUBLIC_COMETH_API_KEY,
  apiKey4337: PUBLIC_CONNECT_4337_COMETH_API_KEY,
  publicClient: publicClient,
  chain: gnosis,
  CHAIN_ID: '100',
  bundlerUrl: `https://bundler.cometh.io/100?apikey=${PUBLIC_CONNECT_4337_COMETH_API_KEY}`,
  paymasterUrl: `https://paymaster.cometh.io/100?apikey=${PUBLIC_CONNECT_4337_COMETH_API_KEY}`,
};

export async function getCometh4337Wallet(
  address,
  signer
) {
  const { apiKey4337, chain, bundlerUrl, paymasterUrl } = cometh4337Params;

  const account = privateKeyToAccount(process.env.PRIVATE_KEY);

  const smartAccount = await createSafeSmartAccount({
    apiKey: apiKey4337,
    chain: chain,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    smartAccountAddress: address,
    comethSignerConfig: cometh4337SignerConfig,
    clientTimeout: 180_000,
    signer: account,
    publicClient: publicClient,
  });

  const paymasterClient = await createComethPaymasterClient({
    transport: http(paymasterUrl),
    chain: chain,
    publicClient: publicClient,
  });

  const smartAccountClient = await createSmartAccountClient({
    account: smartAccount,
    client: publicClient,
    chain: chain,
    paymaster: paymasterClient,
    bundlerTransport: http(bundlerUrl, { retryCount: 10, retryDelay: 200, timeout: 180_000 }),
    userOperation: {
      estimateFeesPerGas: async () => {
        return await paymasterClient.getUserOperationGasPrice();
      },
    },
  });
  return {
    smartAccountClient,
    smartAccount,
    walletAddress: smartAccount.address ?? '',
  };
};

export async function mint(userAddress, metriFee) {
  const txData = await personalMint(userAddress, metriFee);
  const { smartAccountClient } = await getCometh4337Wallet(userAddress);
  const userOpHash = await smartAccountClient.sendUserOperation({
    calls: txData.map((tx) => ({
      to: tx.to,
      data: tx.data,
      value: BigInt(tx.value),
    })),
  });
  return userOpHash;
};


async function personalMint(userAddress, metriFee) {
  const userTokenId = bytesToBigInt(toBytes(userAddress));

  const transactions = [
    {
      data: encodeFunctionData({
        abi: parseAbi([`function personalMint()`]),
        functionName: 'personalMint',
      }),
      value: 0n,
      to: config.v2HubAddress,
    },
    {
      data: encodeFunctionData({
        abi: parseAbi([
          `function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes memory _data)`,
        ]),
        functionName: 'safeTransferFrom',
        args: [
          userAddress,
          "0xf6f2A96CE7EabF3E00fDdF2bA0c4789623680046", // CRC Auto Mint group owner address
          userTokenId,
          parseEther(metriFee.toString()),
          '0x',
        ],
      }),
      value: 0n,
      to: config.v2HubAddress,
    },
  ];

  return transactions;
};
