import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// 지원하는 체인 목록
export const supportedChains = [mainnet, sepolia] as const;

// Wagmi 설정 (MetaMask 전용)
export const wagmiConfig = createConfig({
	chains: supportedChains,
	connectors: [
		injected(), // 브라우저 확장 지갑 (MetaMask 등)
	],
	transports: {
		[mainnet.id]: http(process.env.NEXT_PUBLIC_ETH_RPC_URL),
		[sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
	},
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true, // Next.js SSR 지원
});

// Safe Transaction Service URL
export const SAFE_TX_SERVICE_URL: Record<number, string> = {
	[mainnet.id]: "https://safe-transaction-mainnet.safe.global",
	[sepolia.id]: "https://safe-transaction-sepolia.safe.global",
};

// Safe 설정
export const SAFE_CONFIG = {
	threshold: 3, // 필요한 서명 수
	ownerCount: 3, // 소유자 수
};

// 기본 체인 ID
export const DEFAULT_CHAIN_ID = mainnet.id;
