import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useChainId } from "wagmi";

interface Token {
  symbol: string;
  address: string;
  decimals: number;
  logoURI?: string;
  name: string;
}

interface TokenSelectorProps {
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  label: string;
}

const POPULAR_TOKENS: Record<number, Token[]> = {
  1: [
    // Ethereum - Fixed addresses
    {
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      name: "Ethereum",
    },
    {
      symbol: "USDC",
      address: "0xA0b86A33E6085017B6F2863Da0E5E238b2Bb31c4",
      decimals: 6,
      name: "USD Coin",
    }, // Fixed USDC address
    {
      symbol: "USDT",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
      name: "Tether USD",
    },
    {
      symbol: "DAI",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      name: "Dai Stablecoin",
    },
    {
      symbol: "WBTC",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      decimals: 8,
      name: "Wrapped Bitcoin",
    },
    {
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
      name: "Wrapped Ether",
    },
  ],
  137: [
    // Polygon
    {
      symbol: "MATIC",
      address: "0x0000000000000000000000000000000000001010",
      decimals: 18,
      name: "Polygon",
    },
    {
      symbol: "USDC",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      name: "USD Coin",
    },
    {
      symbol: "WETH",
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
      name: "Wrapped Ethereum",
    },
    {
      symbol: "DAI",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      decimals: 18,
      name: "Dai Stablecoin",
    },
  ],
  42161: [
    // Arbitrum
    {
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18,
      name: "Ethereum",
    },
    {
      symbol: "USDC",
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: 6,
      name: "USD Coin",
    },
    {
      symbol: "ARB",
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      decimals: 18,
      name: "Arbitrum",
    },
    {
      symbol: "WETH",
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      decimals: 18,
      name: "Wrapped Ether",
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
        <div className="flex items-center space-x-2">
          {selectedToken ? (
            <>
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <span className="font-medium">{selectedToken.symbol}</span>
              <span className="text-gray-500 text-sm">
                {selectedToken.name}
              </span>
            </>
          ) : (
            <span className="text-gray-500">Select a token</span>
          )}
        </div>
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredTokens.map((token) => (
              <button
                key={token.address}
                onClick={() => {
                  onSelectToken(token);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-gray-500">{token.name}</div>
                  <div className="text-xs text-gray-400">
                    Decimals: {token.decimals}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
