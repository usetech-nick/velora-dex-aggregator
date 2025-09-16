import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useChainId } from "wagmi";

interface Token {
  symbol: string;
  address: string;
  decimals: number;
  logoURI?: string;
  name: string;
  emoji?: string;
}

interface TokenSelectorProps {
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  label: string;
}

const POPULAR_TOKENS: Record<number, Token[]> = {
  1: [
    // Ethereum Mainnet - Most liquid tokens
    {
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      name: "Ethereum",
      emoji: "💎",
    },
    {
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
      name: "Wrapped Ether",
      emoji: "🔹",
    },
    {
      symbol: "USDC",
      address: "0xA0b86A33E6085017B6F2863Da0E5E238b2Bb31c4",
      decimals: 6,
      name: "USD Coin",
      emoji: "💵",
    },
    {
      symbol: "USDT",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
      name: "Tether USD",
      emoji: "💰",
    },
    {
      symbol: "DAI",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      name: "Dai Stablecoin",
      emoji: "🏦",
    },
    {
      symbol: "WBTC",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      decimals: 8,
      name: "Wrapped Bitcoin",
      emoji: "₿",
    },
    {
      symbol: "UNI",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      decimals: 18,
      name: "Uniswap",
      emoji: "🦄",
    },
    {
      symbol: "LINK",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      decimals: 18,
      name: "Chainlink",
      emoji: "🔗",
    },
    {
      symbol: "PEPE",
      address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
      decimals: 18,
      name: "Pepe",
      emoji: "🐸",
    },
    {
      symbol: "SHIB",
      address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
      decimals: 18,
      name: "Shiba Inu",
      emoji: "🐕",
    },
    {
      symbol: "AAVE",
      address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      decimals: 18,
      name: "Aave",
      emoji: "👻",
    },
    {
      symbol: "CRV",
      address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
      decimals: 18,
      name: "Curve DAO",
      emoji: "🌀",
    },
  ],
  137: [
    // Polygon - High liquidity tokens
    {
      symbol: "MATIC",
      address: "0x0000000000000000000000000000000000001010",
      decimals: 18,
      name: "Polygon",
      emoji: "🔷",
    },
    {
      symbol: "WMATIC",
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      decimals: 18,
      name: "Wrapped MATIC",
      emoji: "💜",
    },
    {
      symbol: "USDC",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      name: "USD Coin",
      emoji: "💵",
    },
    {
      symbol: "USDT",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
      name: "Tether USD",
      emoji: "💰",
    },
    {
      symbol: "WETH",
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
      name: "Wrapped Ethereum",
      emoji: "💎",
    },
    {
      symbol: "WBTC",
      address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      decimals: 8,
      name: "Wrapped Bitcoin",
      emoji: "₿",
    },
    {
      symbol: "DAI",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      decimals: 18,
      name: "Dai Stablecoin",
      emoji: "🏦",
    },
    {
      symbol: "AAVE",
      address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      decimals: 18,
      name: "Aave",
      emoji: "👻",
    },
  ],
  42161: [
    // Arbitrum - High liquidity tokens
    {
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      name: "Ethereum",
      emoji: "💎",
    },
    {
      symbol: "WETH",
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      decimals: 18,
      name: "Wrapped Ether",
      emoji: "🔹",
    },
    {
      symbol: "USDC",
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: 6,
      name: "USD Coin",
      emoji: "💵",
    },
    {
      symbol: "USDC.e",
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      decimals: 6,
      name: "USD Coin (Bridged)",
      emoji: "💴",
    },
    {
      symbol: "USDT",
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      decimals: 6,
      name: "Tether USD",
      emoji: "💰",
    },
    {
      symbol: "ARB",
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      decimals: 18,
      name: "Arbitrum",
      emoji: "🏛️",
    },
    {
      symbol: "WBTC",
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      decimals: 8,
      name: "Wrapped Bitcoin",
      emoji: "₿",
    },
    {
      symbol: "LINK",
      address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
      decimals: 18,
      name: "Chainlink",
      emoji: "🔗",
    },
    {
      symbol: "UNI",
      address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
      decimals: 18,
      name: "Uniswap",
      emoji: "🦄",
    },
  ],
  10: [
    // Optimism - High liquidity tokens
    {
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      name: "Ethereum",
      emoji: "💎",
    },
    {
      symbol: "WETH",
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      name: "Wrapped Ether",
      emoji: "🔹",
    },
    {
      symbol: "USDC",
      address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      decimals: 6,
      name: "USD Coin",
      emoji: "💵",
    },
    {
      symbol: "USDT",
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      decimals: 6,
      name: "Tether USD",
      emoji: "💰",
    },
    {
      symbol: "OP",
      address: "0x4200000000000000000000000000000000000042",
      decimals: 18,
      name: "Optimism",
      emoji: "🔴",
    },
    {
      symbol: "WBTC",
      address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
      decimals: 8,
      name: "Wrapped Bitcoin",
      emoji: "₿",
    },
  ],
  8453: [
    // Base - High liquidity tokens
    {
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      name: "Ethereum",
      emoji: "💎",
    },
    {
      symbol: "WETH",
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      name: "Wrapped Ether",
      emoji: "🔹",
    },
    {
      symbol: "USDC",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
      name: "USD Coin",
      emoji: "💵",
    },
    {
      symbol: "DAI",
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      decimals: 18,
      name: "Dai Stablecoin",
      emoji: "🏦",
    },
    {
      symbol: "DEGEN",
      address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
      decimals: 18,
      name: "Degen",
      emoji: "🎭",
    },
  ],
};

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onSelectToken,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const chainId = useChainId();

  const tokens = POPULAR_TOKENS[chainId || 1] || POPULAR_TOKENS[1];

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {selectedToken ? (
            <>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
                {selectedToken.emoji || "💎"}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  {selectedToken.symbol}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {selectedToken.name}
                </div>
              </div>
            </>
          ) : (
            <span className="text-gray-500">Select a token</span>
          )}
        </div>
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Popular tokens header */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Popular Tokens
              </span>
            </div>

            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onSelectToken(token);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg shadow-sm">
                    {token.emoji || "💎"}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 group-hover:text-blue-700">
                        {token.symbol}
                      </span>
                      {/* Liquidity indicator for popular tokens */}
                      {["ETH", "WETH", "USDC", "USDT", "DAI", "WBTC"].includes(
                        token.symbol
                      ) && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          High Liquidity
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {token.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {token.decimals} decimals
                    </div>
                  </div>

                  {/* Volume indicator for most popular pairs */}
                  {["ETH", "USDC", "USDT"].includes(token.symbol) && (
                    <div className="text-right">
                      <div className="text-xs text-green-600 font-medium">
                        🔥 Hot
                      </div>
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <div className="text-sm">No tokens found</div>
                <div className="text-xs text-gray-400">
                  Try searching with a different term
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
