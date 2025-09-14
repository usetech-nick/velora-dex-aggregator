# 🦄 Velora DEX Aggregator

A modern React-based decentralized exchange (DEX) aggregator that finds the best swap routes across multiple DEXs using the Velora API. Built with Vite, TypeScript, RainbowKit, and Tailwind CSS.

![Velora DEX Aggregator](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)
![RainbowKit](https://img.shields.io/badge/RainbowKit-2.x-FF6B6B?style=for-the-badge)

## ✨ Features

- 🔗 **Multi-Wallet Support** - Connect with 100+ wallets via RainbowKit
- 🌐 **Multi-Chain** - Supports Ethereum, Polygon, Arbitrum, Optimism, and Base
- 💱 **DEX Aggregation** - Compare rates across multiple DEXs (Uniswap, SushiSwap, Curve, etc.)
- ⚡ **Real-time Quotes** - Live price updates and gas cost estimation
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 📱 **Mobile Friendly** - Optimized for both desktop and mobile devices
- 🔍 **Token Search** - Easy token selection with search functionality
- 💸 **Gas Optimization** - Shows gas costs in ETH and USD

## 📦 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Web3**: RainbowKit, Wagmi, Viem
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Velora SDK (@velora-dex/sdk)
- **HTTP Client**: Axios

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Clone & Setup

Clone the repository
git clone https://github.com/usetech-nick/velora-dex-aggregator.git
cd velora-dex-aggregator

Install dependencies
npm install

Create environment file
cp .env.example .env

text

### Environment Variables

Create a `.env` file in the root directory:

VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_VELORA_PARTNER_ID=your_partner_id

**Getting WalletConnect Project ID:**

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID

### Run Development Server

npm run dev

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Build

Build for production
npm run build

Preview production build
npm run preview

## 📁 Project Structure

velora-dex-aggregator/
├── src/
│ ├── components/
│ │ ├── TokenSelector.tsx # Token selection dropdown
│ │ └── DEXResults.tsx # DEX routes display
│ ├── hooks/
│ │ └── useVelora.ts # Velora SDK integration
│ ├── config/
│ │ └── web3.ts # RainbowKit configuration
│ ├── App.tsx # Main application
│ ├── main.tsx # Application entry point
│ └── index.css # Global styles
├── public/
├── .env # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts

## 🔧 Configuration

### Supported Networks

- **Ethereum Mainnet** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Arbitrum** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)
- **Base** (Chain ID: 8453)

### Supported Tokens

The app includes popular tokens for each network:

- **ETH/MATIC** (Native tokens)
- **USDC, USDT, DAI** (Stablecoins)
- **WBTC, WETH** (Wrapped tokens)
- **Network-specific tokens** (ARB, etc.)

## 🎯 Usage

1. **Connect Wallet** - Click "Connect Wallet" and select your preferred wallet
2. **Select Tokens** - Choose source and destination tokens from the dropdown
3. **Enter Amount** - Input the amount you want to swap
4. **Get Quote** - Click "Get Quote" to see available routes
5. **Review Routes** - Compare different DEX routes, gas costs, and price impact
6. **Execute Swap** - Proceed with the transaction through your wallet

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Velora](https://velora.finance) - For the powerful DEX aggregation API
- [RainbowKit](https://rainbowkit.com) - For seamless wallet connections
- [Wagmi](https://wagmi.sh) - For React hooks for Ethereum
- [Tailwind CSS](https://tailwindcss.com) - For utility-first CSS framework

## 🐛 Known Issues

- Gas cost estimation may occasionally show inflated values (being addressed)
- Some DEX names may display as "DEX 1" instead of proper names (API dependent)

## 🔮 Roadmap

- [ ] Add swap execution functionality
- [ ] Implement price charts and historical data
- [ ] Add slippage tolerance settings
- [ ] Support for limit orders
- [ ] Portfolio tracking
- [ ] Advanced routing preferences
- [ ] Mobile app version

Made with ❤️ by [Nishant Kumar](https://github.com/usetech-nick)
