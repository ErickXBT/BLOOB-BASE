export interface TokenInfo {
  symbol: string;
  name: string;
  address: string; // "native" = ETH
  decimals: number;
  logo: string;
}

export const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";

export const BASE_TOKENS: TokenInfo[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "native",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    logo: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    decimals: 6,
    logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png",
  },
  {
    symbol: "cbBTC",
    name: "Coinbase BTC",
    address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
    decimals: 8,
    logo: "https://assets.coingecko.com/coins/images/40143/small/cbbtc.webp",
  },
  {
    symbol: "cbETH",
    name: "Coinbase ETH",
    address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/27008/small/cbeth.png",
  },
  {
    symbol: "AERO",
    name: "Aerodrome",
    address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/31745/small/token.png",
  },
];

export function encodePath(tokens: string[], fees: number[]): string {
  let result = tokens[0].toLowerCase();
  for (let i = 0; i < fees.length; i++) {
    result += fees[i].toString(16).padStart(6, "0");
    result += tokens[i + 1].toLowerCase().slice(2);
  }
  return result;
}

export function getTokenByAddress(address: string): TokenInfo | undefined {
  if (address === "native") return BASE_TOKENS[0];
  return BASE_TOKENS.find(
    (t) => t.address.toLowerCase() === address.toLowerCase(),
  );
}
