import React from "react";
import { TrendingUp, DollarSign, Percent, Clock } from "lucide-react";

interface DEXRoute {
  exchange: string;
  srcAmount: string;
  destAmount: string;
  percent: number;
  gasEstimate?: string;
  priceImpact?: number;
  data?: any;
}

interface DEXResultsProps {
  routes: DEXRoute[];
  totalDestAmount: string;
  gasCost: string;
  gasUSD?: string;
  loading: boolean;
}

export const DEXResults: React.FC<DEXResultsProps> = ({
  routes,
  totalDestAmount,
  gasCost,
  gasUSD,
  loading,
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
          <div className="text-2xl font-bold text-green-600">
            {formatTokenAmount(totalDestAmount)}
          </div>
          <div className="text-sm text-gray-500">Total Output</div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {routes.map((route, index) => {
          const dexStyle = getDEXStyle(route.exchange);

          return (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${dexStyle.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-sm`}
                  >
                    <span className="text-sm">{dexStyle.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {route.exchange}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Percent className="h-3 w-3" />
                        <span>{route.percent.toFixed(1)}% of trade</span>
                      </span>
                      {route.priceImpact && route.priceImpact > 0 && (
                        <span className="text-orange-600">
                          {route.priceImpact.toFixed(2)}% impact
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
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Est. Gas Cost</span>
          </div>
          <div className="text-right">
            <span className="font-medium">{formatGasCost(gasCost)} ETH</span>
            {gasUSD && parseFloat(gasUSD) > 0 && (
              <div className="text-sm text-gray-500">
                ${formatNumber(gasUSD)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Est. Time</span>
          </div>
          <span className="font-medium text-sm">~15 seconds</span>
        </div>
      </div>
    </div>
  );
};
