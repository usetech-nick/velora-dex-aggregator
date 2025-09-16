import { useState, useEffect } from "react";
import { constructSimpleSDK, SwapSide } from "@velora-dex/sdk";
import { useAccount, useChainId } from "wagmi";
import axios from "axios";

interface SwapQuote {
  priceRoute: any;
  destAmount: string;
  srcAmount: string;
  gasCost: string;
  gasUSD?: string;
}

interface DEXRoute {
  exchange: string;
  srcAmount: string;
  destAmount: string;
  percent: number;
  data?: any;
  gasEstimate?: string;
  priceImpact?: number;
  estimatedTime?: string;
  totalCostUSD?: string;
}

export const useVelora = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [sdk, setSDK] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chainId) {
      try {
        const veloraSDK = constructSimpleSDK({
          chainId,
          axios,
          version: "6.2",
        });
        setSDK(veloraSDK);
        setError(null);
      } catch (err) {
        setError("Failed to initialize Velora SDK");
        console.error("SDK initialization error:", err);
      }
    }
  }, [chainId]);

  // Helper function to extract DEX name from route data
  const extractDEXName = (route: any): string => {
    if (route.exchange) {
      return route.exchange;
    }

    if (route.swapExchanges && route.swapExchanges.length > 0) {
      return route.swapExchanges[0].exchange;
    }

    if (route.swaps && route.swaps.length > 0) {
      const swap = route.swaps[0];
      if (swap.swapExchanges && swap.swapExchanges.length > 0) {
        return swap.swapExchanges[0].exchange;
      }
    }

    if (route.data && route.data.exchange) {
      return route.data.exchange;
    }

    return "Unknown DEX";
  };

  const getSwapQuote = async (
    srcToken: string,
    destToken: string,
    amount: string,
    srcDecimals: number,
    destDecimals: number
  ): Promise<{ quote: SwapQuote; routes: DEXRoute[] } | null> => {
    if (!sdk || !address) {
      setError("SDK not initialized or wallet not connected");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the optimal route first
      const priceRoute = await sdk.swap.getRate({
        srcToken: srcToken.toLowerCase(),
        destToken: destToken.toLowerCase(),
        amount,
        userAddress: address,
        side: SwapSide.SELL,
        srcDecimals,
        destDecimals,
        options: {
          includeDEXS: [],
          excludeDEXS: [],
          includeContractMethods: [],
          excludeContractMethods: [],
        },
      });

      console.log("Full API Response:", priceRoute); // Debug log
      console.log("Best Route Array:", priceRoute.bestRoute); // Debug log

      // Create routes from the bestRoute array (each element is a hop in the optimal path)
      const routes: DEXRoute[] = [];

      if (priceRoute.bestRoute && Array.isArray(priceRoute.bestRoute)) {
        // Option 1: Show each hop as a separate route
        priceRoute.bestRoute.forEach((route: any, index: number) => {
          const dexName = extractDEXName(route);

          console.log(`Route ${index}:`, {
            route,
            extractedName: dexName,
            srcAmount: route.srcAmount,
            destAmount: route.destAmount,
            percent: route.percent,
          });

          routes.push({
            exchange: dexName,
            srcAmount: route.srcAmount || "0",
            destAmount: route.destAmount || "0",
            percent: parseFloat(route.percent || "0"),
            gasEstimate: route.gasUSD || "0",
            priceImpact: parseFloat(route.priceImpactPercent || "0"),
            estimatedTime: "~15s",
            totalCostUSD: route.gasCostUSD || "0",
            data: route,
          });
        });
      }

      // If no routes found from bestRoute, create a single route from the main response
      if (routes.length === 0) {
        console.log(
          "No bestRoute found, creating single route from main response"
        );

        routes.push({
          exchange: "Velora Optimal",
          srcAmount: priceRoute.srcAmount || amount,
          destAmount: priceRoute.destAmount || "0",
          percent: 100,
          gasEstimate: priceRoute.gasCost || "0",
          priceImpact: parseFloat(priceRoute.priceImpactPercent || "0"),
          estimatedTime: "~15s",
          totalCostUSD: priceRoute.gasCostUSD || "0",
          data: priceRoute,
        });
      }

      // Create additional mock routes for comparison (temporary for testing)
      const baseAmount = parseFloat(priceRoute.destAmount || amount || "0");
      if (baseAmount > 0) {
        routes.push(
          {
            exchange: "Uniswap V3",
            srcAmount: amount,
            destAmount: (baseAmount * 0.995).toString(),
            percent: 100,
            gasEstimate: "150000",
            priceImpact: 0.15,
            estimatedTime: "~12s",
            totalCostUSD: "8.50",
            data: null,
          },
          {
            exchange: "SushiSwap",
            srcAmount: amount,
            destAmount: (baseAmount * 0.988).toString(),
            percent: 100,
            gasEstimate: "180000",
            priceImpact: 0.25,
            estimatedTime: "~18s",
            totalCostUSD: "10.20",
            data: null,
          }
        );
      }

      // Sort routes by best output amount
      routes.sort(
        (a, b) => parseFloat(b.destAmount) - parseFloat(a.destAmount)
      );

      const quote: SwapQuote = {
        priceRoute,
        destAmount: priceRoute.destAmount || "0",
        srcAmount: priceRoute.srcAmount || amount,
        gasCost: priceRoute.gasCost || "0",
        gasUSD: priceRoute.gasCostUSD || "0",
      };

      console.log("Final processed routes:", routes);
      console.log("Final quote:", quote);

      return { quote, routes };
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to fetch swap quote";
      setError(errorMessage);
      console.error("Error fetching swap quote:", error);

      // Fallback mock data for development
      const mockRoutes: DEXRoute[] = [
        {
          exchange: "Uniswap V3",
          srcAmount: amount,
          destAmount: (parseFloat(amount || "0") * 0.995).toString(),
          percent: 100,
          gasEstimate: "150000",
          priceImpact: 0.1,
          estimatedTime: "~12s",
          totalCostUSD: "8.50",
        },
        {
          exchange: "SushiSwap",
          srcAmount: amount,
          destAmount: (parseFloat(amount || "0") * 0.988).toString(),
          percent: 100,
          gasEstimate: "180000",
          priceImpact: 0.2,
          estimatedTime: "~18s",
          totalCostUSD: "10.20",
        },
        {
          exchange: "Curve Finance",
          srcAmount: amount,
          destAmount: (parseFloat(amount || "0") * 0.982).toString(),
          percent: 100,
          gasEstimate: "120000",
          priceImpact: 0.05,
          estimatedTime: "~20s",
          totalCostUSD: "7.80",
        },
      ];

      const mockQuote: SwapQuote = {
        priceRoute: null,
        destAmount: mockRoutes[0].destAmount,
        srcAmount: amount,
        gasCost: "150000",
        gasUSD: "8.50",
      };

      console.log("Using mock data due to API error");
      return { quote: mockQuote, routes: mockRoutes };
    } finally {
      setLoading(false);
    }
  };

  const executeSwap = async (swapData: any) => {
    if (!sdk || !address) return null;

    try {
      const txParams = await sdk.swap.buildTx({
        srcToken: swapData.srcToken,
        destToken: swapData.destToken,
        srcAmount: swapData.srcAmount,
        slippage: 250,
        priceRoute: swapData.priceRoute,
        userAddress: address,
        partner: import.meta.env.VITE_VELORA_PARTNER_ID || "",
      });

      return txParams;
    } catch (error) {
      console.error("Error building swap transaction:", error);
      setError("Failed to build swap transaction");
      return null;
    }
  };

  return {
    getSwapQuote,
    executeSwap,
    loading,
    error,
    sdk,
    isConnected: !!address,
    chainId,
  };
};
