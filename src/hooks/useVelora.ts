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
    // Try different possible locations for the exchange name
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

    // Check for nested exchange data
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

      const routes: DEXRoute[] =
        priceRoute.bestRoute?.map((route: any, index: number) => {
          const dexName = extractDEXName(route);

          console.log(`Route ${index}:`, {
            route,
            extractedName: dexName,
          }); // Debug log

          return {
            exchange: dexName,
            srcAmount: route.srcAmount || "0",
            destAmount: route.destAmount || "0",
            percent: parseFloat(route.percent || "0"),
            gasEstimate: route.gasUSD || "0",
            priceImpact: parseFloat(route.priceImpactPercent || "0"),
            data: route,
          };
        }) || [];

      const quote: SwapQuote = {
        priceRoute,
        destAmount: priceRoute.destAmount || "0",
        srcAmount: priceRoute.srcAmount || amount,
        gasCost: priceRoute.gasCost || "0",
        gasUSD: priceRoute.gasCostUSD || "0",
      };

      return { quote, routes };
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to fetch swap quote";
      setError(errorMessage);
      console.error("Error fetching swap quote:", error);
      return null;
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
