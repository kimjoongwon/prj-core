"use client";

import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useState } from "react";
import { formatEther, isAddress } from "viem";
import { useAccount } from "wagmi";
import { getWalletClient } from "wagmi/actions";
import { wagmiConfig } from "@/config/web3.config";
import { useStores } from "@/providers";
import { transactionService } from "@/services";

// 일반적인 ERC-20 토큰 목록
const COMMON_TOKENS = [
	{
		address: "",
		symbol: "ETH",
		name: "Ethereum",
		decimals: 18,
		isNative: true,
	},
	{
		address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
		symbol: "USDT",
		name: "Tether USD",
		decimals: 6,
		isNative: false,
	},
	{
		address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
		symbol: "USDC",
		name: "USD Coin",
		decimals: 6,
		isNative: false,
	},
	{
		address: "0x6B175474E89094C44Da98b954EescdeCBc5fBAD",
		symbol: "DAI",
		name: "Dai Stablecoin",
		decimals: 18,
		isNative: false,
	},
];

interface SendFormProps {
	safeAddress: string;
}

export const SendForm = observer(function SendForm({
	safeAddress,
}: SendFormProps) {
	const { safe: safeStore, transaction: txStore } = useStores();
	const { isConnected } = useAccount();

	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("");
	const [selectedToken, setSelectedToken] = useState(COMMON_TOKENS[0]);
	const [customTokenAddress, setCustomTokenAddress] = useState("");
	const [useCustomToken, setUseCustomToken] = useState(false);

	const validateForm = (): boolean => {
		txStore.setError(null);

		if (!recipient || !isAddress(recipient)) {
			txStore.setError("올바른 수신자 주소를 입력해주세요.");
			return false;
		}

		if (!amount || parseFloat(amount) <= 0) {
			txStore.setError("올바른 금액을 입력해주세요.");
			return false;
		}

		if (
			useCustomToken &&
			(!customTokenAddress || !isAddress(customTokenAddress))
		) {
			txStore.setError("올바른 토큰 주소를 입력해주세요.");
			return false;
		}

		return true;
	};

	const handleSend = async () => {
		if (!isConnected) {
			txStore.setError("지갑을 먼저 연결해주세요.");
			return;
		}

		if (!validateForm()) {
			return;
		}

		txStore.setCreating(true);
		txStore.setError(null);

		try {
			const walletClient = await getWalletClient(wagmiConfig);
			if (!walletClient) {
				txStore.setError("지갑 클라이언트를 불러올 수 없습니다.");
				txStore.setCreating(false);
				return;
			}

			const provider = {
				request: walletClient.request.bind(walletClient),
			};

			if (selectedToken.isNative && !useCustomToken) {
				// ETH 송금
				await transactionService.createEthTransaction(
					safeAddress,
					recipient,
					amount,
					provider as Parameters<
						typeof transactionService.createEthTransaction
					>[3],
				);
			} else {
				// ERC-20 토큰 송금
				const tokenAddress = useCustomToken
					? customTokenAddress
					: selectedToken.address;
				const decimals = useCustomToken ? 18 : selectedToken.decimals;

				await transactionService.createTokenTransaction(
					safeAddress,
					tokenAddress,
					recipient,
					amount,
					decimals,
					provider as Parameters<
						typeof transactionService.createTokenTransaction
					>[5],
				);
			}

			// 성공 시 트랜잭션 목록으로 이동
			window.location.href = `/safe/${safeAddress}/transactions`;
		} catch (error) {
			console.error("트랜잭션 생성 실패:", error);
			txStore.setError(
				error instanceof Error
					? error.message
					: "트랜잭션 생성에 실패했습니다.",
			);
		} finally {
			txStore.setCreating(false);
		}
	};

	if (!isConnected) {
		return (
			<div className="p-8 text-center">
				<p className="text-gray-500">지갑을 먼저 연결해주세요.</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-2xl p-6">
			<div className="mb-6 flex items-center gap-4">
				<Link
					href={`/safe/${safeAddress}`}
					className="text-gray-500 hover:text-gray-700"
				>
					← 뒤로
				</Link>
				<h1 className="text-2xl font-bold">송금하기</h1>
			</div>

			<div className="rounded-lg bg-white p-6 shadow-md">
				{/* Safe 잔액 표시 */}
				<div className="mb-6 rounded-lg bg-gray-50 p-4">
					<p className="text-sm text-gray-600">사용 가능 잔액</p>
					<p className="text-xl font-bold">
						{formatEther(BigInt(safeStore.ethBalance || "0"))} ETH
					</p>
				</div>

				{/* 토큰 선택 */}
				<div className="mb-4">
					<label className="mb-2 block text-sm font-medium text-gray-700">
						토큰 선택
					</label>
					<select
						value={useCustomToken ? "custom" : selectedToken.symbol}
						onChange={(e) => {
							if (e.target.value === "custom") {
								setUseCustomToken(true);
							} else {
								setUseCustomToken(false);
								const token = COMMON_TOKENS.find(
									(t) => t.symbol === e.target.value,
								);
								if (token) setSelectedToken(token);
							}
						}}
						className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					>
						{COMMON_TOKENS.map((token) => (
							<option key={token.symbol} value={token.symbol}>
								{token.symbol} - {token.name}
							</option>
						))}
						<option value="custom">기타 토큰 (주소 입력)</option>
					</select>
				</div>

				{/* 커스텀 토큰 주소 입력 */}
				{useCustomToken && (
					<div className="mb-4">
						<label className="mb-2 block text-sm font-medium text-gray-700">
							토큰 컨트랙트 주소
						</label>
						<input
							type="text"
							value={customTokenAddress}
							onChange={(e) => setCustomTokenAddress(e.target.value)}
							placeholder="0x..."
							className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				)}

				{/* 수신자 주소 */}
				<div className="mb-4">
					<label className="mb-2 block text-sm font-medium text-gray-700">
						수신자 주소
					</label>
					<input
						type="text"
						value={recipient}
						onChange={(e) => setRecipient(e.target.value)}
						placeholder="0x..."
						className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{/* 금액 */}
				<div className="mb-6">
					<label className="mb-2 block text-sm font-medium text-gray-700">
						금액
					</label>
					<div className="flex gap-2">
						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0.0"
							step="0.0001"
							min="0"
							className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						/>
						<span className="flex items-center rounded-lg bg-gray-100 px-4">
							{useCustomToken ? "TOKEN" : selectedToken.symbol}
						</span>
					</div>
				</div>

				{/* 에러 메시지 */}
				{txStore.error && (
					<div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
						<p className="text-sm text-red-600">{txStore.error}</p>
					</div>
				)}

				{/* 전송 버튼 */}
				<button
					type="button"
					onClick={handleSend}
					disabled={txStore.isCreating}
					className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
				>
					{txStore.isCreating ? (
						<span className="flex items-center justify-center gap-2">
							<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							트랜잭션 생성 중...
						</span>
					) : (
						"트랜잭션 생성"
					)}
				</button>

				<p className="mt-4 text-center text-xs text-gray-500">
					트랜잭션 생성 후 다른 소유자들의 서명이 필요합니다.
				</p>
			</div>
		</div>
	);
});

export default SendForm;
