import React from "react";
import {
  TrendingUp,
  DollarSign,
  Percent,
  Clock,
  ArrowRight,
} from "lucide-react";

interface DEXRoute {
  exchange: string;
  srcAmount: string;
  destAmount: string;
  percent: number;
  gasEstimate?: string;
  priceImpact?: number;
  data?: any;
  selected?: boolean;
  estimatedTime?: string;
  totalCostUSD?: string;
}

interface DEXResultsProps {
  routes: DEXRoute[];
  totalDestAmount: string;
  gasCost: string;
  gasUSD?: string;
  loading: boolean;
  onRouteSelect?: (routeIndex: number) => void;
  selectedRoute?: number;
  slippageTolerance?: number;
  onSwap?: () => void; // ADD THIS FOR SWAP FUNCTIONALITY
}

export const DEXResults: React.FC<DEXResultsProps> = ({
  routes,
  gasCost,
  gasUSD,
  loading,
  onRouteSelect,
  selectedRoute = 0, // Default to first route
  slippageTolerance,
  onSwap,
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Enter swap details to see DEX routes</p>
      </div>
    );
  }

  // GET SELECTED ROUTE DATA
  const currentRoute = routes[selectedRoute] || routes[0];

  // Enhanced DEX styling function
  const getDEXStyle = (exchangeName: string) => {
    const styles: Record<string, { gradient: string; icon: string }> = {
      "Uniswap V2": { gradient: "from-pink-500 to-purple-500", icon: "🦄" },
      "Uniswap V3": { gradient: "from-pink-500 to-purple-600", icon: "🦄" },
      UniswapV2: { gradient: "from-pink-500 to-purple-500", icon: "🦄" },
      UniswapV3: { gradient: "from-pink-500 to-purple-600", icon: "🦄" },
      SushiSwap: { gradient: "from-blue-500 to-teal-500", icon: "🍣" },
      Curve: { gradient: "from-yellow-400 to-orange-500", icon: "⚡" },
      CurveV2: { gradient: "from-yellow-500 to-orange-600", icon: "⚡" },
      "Curve Finance": {
        gradient: "from-yellow-400 to-orange-500",
        icon: "⚡",
      },
      Balancer: { gradient: "from-gray-600 to-gray-800", icon: "⚖️" },
      BalancerV2: { gradient: "from-gray-600 to-gray-800", icon: "⚖️" },
      "0x": { gradient: "from-indigo-500 to-blue-600", icon: "⚡" },
      Kyber: { gradient: "from-green-500 to-emerald-600", icon: "💎" },
      DODO: { gradient: "from-yellow-400 to-yellow-600", icon: "🦤" },
      OneInch: { gradient: "from-red-500 to-pink-500", icon: "1️⃣" },
      "1inch": { gradient: "from-red-500 to-pink-500", icon: "1️⃣" },
      default: { gradient: "from-purple-500 to-pink-500", icon: "⚡" },
    };

    return styles[exchangeName] || styles.default;
  };

  // Fixed formatting functions
  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(n) || n === 0) return "0";
    if (n < 0.0001) return "< 0.0001";
    return n.toFixed(6);
  };

  const formatGasCost = (gasCost: string) => {
    const gasInWei = parseFloat(gasCost);
    if (isNaN(gasInWei) || gasInWei === 0) return "0";

    // Convert wei to ETH (1 ETH = 10^18 wei)
    const gasInETH = gasInWei / Math.pow(10, 18);

    if (gasInETH < 0.0001) return "< 0.0001";
    return gasInETH.toFixed(6);
  };

  const formatTokenAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num) || num === 0) return "0";

    // If it's a very large number, it's likely in wei/smallest unit
    if (num > 1000000) {
      // Convert from wei to token (assuming 18 decimals)
      const converted = num / Math.pow(10, 18);
      if (converted < 0.0001) return "< 0.0001";
      return converted.toFixed(6);
    }

    return formatNumber(num);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">DEX Routes</h3>
        <div className="text-right">
          {/* CHANGED: Show selected route output instead of total */}
          <div className="text-2xl font-bold text-green-600">
            {formatTokenAmount(currentRoute.destAmount)}
          </div>
          <div className="text-sm text-gray-500">Selected Output</div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {routes.map((route, index) => {
          const dexStyle = getDEXStyle(route.exchange);

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedRoute === index
                  ? "bg-blue-50 border-blue-200 shadow-md ring-2 ring-blue-100"
                  : "bg-gray-50 border-gray-100 hover:bg-gray-100 hover:border-gray-200"
              }`}
              onClick={() => onRouteSelect?.(index)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {/* Selection indicator */}
                  <div className="relative">
                    {selectedRoute === index && (
                      <div className="absolute -left-1 -top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                    )}
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${
                        dexStyle.gradient
                      } rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                        selectedRoute === index ? "ring-2 ring-blue-200" : ""
                      }`}
                    >
                      <span className="text-sm">{dexStyle.icon}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium text-gray-900">
                        {route.exchange}
                      </div>
                      {selectedRoute === index && (
                        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>

                    {/* Enhanced route information grid */}
                    <div className="text-sm text-gray-500 grid grid-cols-2 gap-2 mt-2">
                      <span className="flex items-center space-x-1">
                        <Percent className="h-3 w-3" />
                        <span>{route.percent.toFixed(1)}% of trade</span>
                      </span>

                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{route.estimatedTime || "~15s"}</span>
                      </span>

                      {route.priceImpact && route.priceImpact >= 0 && (
                        <span
                          className={`flex items-center space-x-1 ${
                            route.priceImpact < 0.1
                              ? "text-green-600"
                              : route.priceImpact < 1
                              ? "text-yellow-600"
                              : route.priceImpact < 3
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          <span>Impact: {route.priceImpact.toFixed(2)}%</span>
                        </span>
                      )}

                      {route.gasEstimate && (
                        <span className="text-gray-600 text-xs">
                          Gas: ~$
                          {route.totalCostUSD ||
                            formatGasCost(route.gasEstimate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {formatTokenAmount(route.destAmount)}
                  </div>
                  <div className="text-sm text-gray-500">Output</div>

                  {/* Minimum received with slippage */}
                  {slippageTolerance && (
                    <div className="text-xs text-gray-400 mt-1">
                      Min:{" "}
                      {formatTokenAmount(
                        (
                          parseFloat(route.destAmount) *
                          (1 - slippageTolerance / 100)
                        ).toString()
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Price comparison indicator */}
              {routes.length > 1 && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    {index === 0 ? (
                      <span className="px-2 py-1 text-green-700 bg-green-100 rounded-full font-medium">
                        Best Rate
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        {(
                          ((parseFloat(routes[0].destAmount) -
                            parseFloat(route.destAmount)) /
                            parseFloat(routes[0].destAmount)) *
                          100
                        ).toFixed(2)}
                        % less
                      </span>
                    )}
                  </div>

                  {selectedRoute === index && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <span>✓</span>
                      <span>Active Route</span>
                    </div>
                  )}
                </div>
              )}

              {/* High impact warning */}
              {route.priceImpact && route.priceImpact > 1 && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                  <div className="flex items-center space-x-1 text-orange-700">
                    <span>⚠️</span>
                    <span className="font-medium">High Price Impact</span>
                  </div>
                  <p className="text-orange-600 mt-1">
                    This trade may significantly move the price. Consider
                    smaller amounts.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CHANGED: Selected Route Details Section */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Route Details
          </h4>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>via</span>
            <span className="font-medium text-gray-900">
              {currentRoute.exchange}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Gas Cost</span>
            </div>
            <div className="text-right">
              <span className="font-medium">
                {formatGasCost(currentRoute.gasEstimate || gasCost)} ETH
              </span>
              <div className="text-xs text-gray-500">
                ${currentRoute.totalCostUSD || gasUSD || "0"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Est. Time</span>
            </div>
            <span className="font-medium">
              {currentRoute.estimatedTime || "~15s"}
            </span>
          </div>
        </div>

        {/* Price Impact Warning for Selected Route */}
        {currentRoute.priceImpact && currentRoute.priceImpact > 0.5 && (
          <div
            className={`p-3 rounded-lg ${
              currentRoute.priceImpact > 1
                ? "bg-orange-50 border border-orange-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{currentRoute.priceImpact > 1 ? "⚠️" : "💡"}</span>
              <span
                className={`text-sm font-medium ${
                  currentRoute.priceImpact > 1
                    ? "text-orange-800"
                    : "text-yellow-800"
                }`}
              >
                {currentRoute.priceImpact.toFixed(2)}% Price Impact
              </span>
            </div>
          </div>
        )}

        {/* SWAP BUTTON */}
        <button
          onClick={onSwap}
          disabled={!currentRoute || !currentRoute.destAmount}
          className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span>
            {currentRoute?.destAmount ? "Execute Swap" : "Select Route to Swap"}
          </span>
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Additional swap info */}
        <div className="text-center text-xs text-gray-500 mt-2">
          You will receive at least{" "}
          <span className="font-medium text-gray-700">
            {slippageTolerance
              ? formatTokenAmount(
                  (
                    parseFloat(currentRoute.destAmount || "0") *
                    (1 - slippageTolerance / 100)
                  ).toString()
                )
              : formatTokenAmount(currentRoute.destAmount || "0")}
          </span>{" "}
          tokens or the transaction will revert
        </div>
      </div>
    </div>
  );
};
