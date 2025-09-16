import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId } from "wagmi";
import { TokenSelector } from "./components/TokenSelector";
import { DEXResults } from "./components/DEXResults";
import { useVelora } from "./hooks/useVelora";
import { ArrowDownUp, Settings, AlertCircle } from "lucide-react";

interface Token {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
}

function SwapInterface() {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");
  const [routes, setRoutes] = useState<any[]>([]);
  const [totalOutput, setTotalOutput] = useState("0");
  const [gasCost, setGasCost] = useState("0");
  const [gasUSD, setGasUSD] = useState("0");

  // ADD THESE NEW STATE VARIABLES
  const [selectedRoute, setSelectedRoute] = useState<number>(0);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);

  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { getSwapQuote, loading, error } = useVelora();

  const handleGetQuote = async () => {
    if (!fromToken || !toToken || !amount || !isConnected) return;

    const result = await getSwapQuote(
      fromToken.address,
      toToken.address,
      amount,
      fromToken.decimals, // Pass source token decimals
      toToken.decimals // Pass destination token decimals
    );
    if (result) {
      setRoutes(result.routes);
      setTotalOutput(result.quote.destAmount);
      setGasCost(result.quote.gasCost);
      setGasUSD(result.quote.gasUSD || "0");
      // Reset selected route when new results come in
      setSelectedRoute(0);
    }
  };

  // ADD THESE HANDLER FUNCTIONS
  const handleRouteSelect = (routeIndex: number) => {
    setSelectedRoute(routeIndex);
  };

  const handleSlippageChange = (slippage: number) => {
    setSlippageTolerance(slippage);
  };

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const getChainName = (chainId: number) => {
    const chains: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon",
      42161: "Arbitrum",
      10: "Optimism",
      8453: "Base",
    };
    return chains[chainId] || `Chain ${chainId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Velora DEX Aggregator
          </h1>
          <p className="text-gray-600">
            Find the best rates across multiple DEXs
          </p>
          {chainId && (
            <div className="mt-2 text-sm text-blue-600 font-medium">
              Connected to {getChainName(chainId)}
            </div>
          )}
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Swap Tokens</h2>
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-400" />
                <ConnectButton />
              </div>
            </div>

            {!isConnected ? (
              <div className="text-center py-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Connect your wallet to start trading
                  </p>
                  <ConnectButton />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <TokenSelector
                  selectedToken={fromToken}
                  onSelectToken={setFromToken}
                  label="From"
                />

                <div className="flex justify-center">
                  <button
                    onClick={swapTokens}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ArrowDownUp className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <TokenSelector
                  selectedToken={toToken}
                  onSelectToken={setToToken}
                  label="To"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* ADD SLIPPAGE TOLERANCE CONTROLS */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Slippage Tolerance
                    </label>
                    <span className="text-sm text-gray-600">
                      {slippageTolerance.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {[0.1, 0.5, 1.0, 3.0].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleSlippageChange(value)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          slippageTolerance === value
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {value}%
                      </button>
                    ))}
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="50"
                      className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded"
                      placeholder="Custom"
                      onChange={(e) =>
                        handleSlippageChange(parseFloat(e.target.value) || 0.5)
                      }
                    />
                  </div>
                  {slippageTolerance > 3 && (
                    <div className="mt-2 text-sm text-orange-600 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>
                        High slippage may result in unfavorable trades
                      </span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <button
                  onClick={handleGetQuote}
                  disabled={!fromToken || !toToken || !amount || loading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {loading ? "Finding Best Route..." : "Get Quote"}
                </button>

                {address && (
                  <div className="text-sm text-gray-500 text-center">
                    Connected: {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                )}
              </div>
            )}
          </div>

          <DEXResults
            routes={routes}
            totalDestAmount={totalOutput}
            gasCost={gasCost}
            gasUSD={gasUSD}
            loading={loading}
            selectedRoute={selectedRoute}
            onRouteSelect={handleRouteSelect}
            slippageTolerance={slippageTolerance}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return <SwapInterface />;
}

export default App;
