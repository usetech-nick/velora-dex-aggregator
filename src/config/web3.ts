import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";

const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo-project-id";

export const config = getDefaultConfig({
  appName: "Velora DEX Aggregator",
  projectId,
  chains: [mainnet, polygon, arbitrum, optimism, base],
  ssr: false,
});

export { projectId };
