"use client";

import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useEffect } from "react";
import { formatEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { useStores } from "@/providers";
import { safeService } from "@/services";

interface SafeDashboardProps {
	safeAddress: string;
}

export const SafeDashboard = observer(function SafeDashboard({
	safeAddress,
}: SafeDashboardProps) {
	const { safe: safeStore } = useStores();
	const { isConnected } = useAccount();
	const { data: walletClient } = useWalletClient();

	useEffect(() => {
		const loadSafeInfo = async () => {
			if (!walletClient || !safeAddress) return;

			safeStore.setLoading(true);
			try {
				const provider = {
					request: walletClient.request.bind(walletClient),
				};

				const [safeInfo, ethBalance] = await Promise.all([
					safeService.getSafeInfo(
						safeAddress,
						provider as Parameters<typeof safeService.getSafeInfo>[1],
					),
					safeService.getEthBalance(
						safeAddress,
						provider as Parameters<typeof safeService.getEthBalance>[1],
					),
				]);

				safeStore.setSafe(safeInfo);
				safeStore.setEthBalance(ethBalance);
			} catch (error) {
				console.error("Safe 정보 로드 실패:", error);
				safeStore.setError(
					error instanceof Error
						? error.message
						: "Safe 정보를 불러올 수 없습니다.",
				);
			} finally {
				safeStore.setLoading(false);
			}
		};

		loadSafeInfo();
	}, [walletClient, safeAddress, safeStore]);

	if (!isConnected) {
		return (
			<div className="p-8 text-center">
				<p className="text-gray-500">지갑을 먼저 연결해주세요.</p>
			</div>
		);
	}

	if (safeStore.isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
			</div>
		);
	}

	if (safeStore.error) {
		return (
			<div className="mx-auto max-w-2xl p-6">
				<div className="rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-red-600">{safeStore.error}</p>
				</div>
			</div>
		);
	}

	const { currentSafe } = safeStore;

	if (!currentSafe) {
		return (
			<div className="p-8 text-center">
				<p className="text-gray-500">Safe 정보를 찾을 수 없습니다.</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Safe 대시보드</h1>
				<Link
					href={`/safe/${safeAddress}/send`}
					className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				>
					송금하기
				</Link>
			</div>

			{/* Safe 정보 카드 */}
			<div className="mb-6 rounded-lg bg-white p-6 shadow-md">
				<h2 className="mb-4 text-lg font-semibold">Safe 정보</h2>

				<div className="space-y-3">
					<div className="flex justify-between border-b pb-2">
						<span className="text-gray-600">주소</span>
						<span className="font-mono text-sm">{currentSafe.address}</span>
					</div>
					<div className="flex justify-between border-b pb-2">
						<span className="text-gray-600">네트워크</span>
						<span>
							{currentSafe.chainId === 1
								? "Ethereum Mainnet"
								: "Sepolia Testnet"}
						</span>
					</div>
					<div className="flex justify-between border-b pb-2">
						<span className="text-gray-600">필요 서명 수</span>
						<span>
							{currentSafe.threshold} / {currentSafe.owners.length}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">Nonce</span>
						<span>{currentSafe.nonce}</span>
					</div>
				</div>
			</div>

			{/* 잔액 카드 */}
			<div className="mb-6 rounded-lg bg-white p-6 shadow-md">
				<h2 className="mb-4 text-lg font-semibold">잔액</h2>

				<div className="rounded-lg bg-gray-50 p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
								<span className="text-lg">Ξ</span>
							</div>
							<span className="font-medium">Ethereum</span>
						</div>
						<span className="text-xl font-bold">
							{formatEther(BigInt(safeStore.ethBalance || "0"))} ETH
						</span>
					</div>
				</div>

				{/* ERC-20 토큰 목록 */}
				{safeStore.tokenBalances.length > 0 && (
					<div className="mt-4 space-y-2">
						{safeStore.tokenBalances.map((token) => (
							<div
								key={token.tokenAddress}
								className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
										<span className="text-sm">{token.symbol.slice(0, 2)}</span>
									</div>
									<span className="font-medium">{token.name}</span>
								</div>
								<span className="font-bold">
									{(parseFloat(token.balance) / 10 ** token.decimals).toFixed(
										4,
									)}{" "}
									{token.symbol}
								</span>
							</div>
						))}
					</div>
				)}
			</div>

			{/* 소유자 목록 카드 */}
			<div className="rounded-lg bg-white p-6 shadow-md">
				<h2 className="mb-4 text-lg font-semibold">
					소유자 ({currentSafe.owners.length}명)
				</h2>

				<div className="space-y-2">
					{currentSafe.owners.map((owner, index) => (
						<div
							key={owner}
							className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
						>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium">
								{index + 1}
							</div>
							<span className="font-mono text-sm">{owner}</span>
						</div>
					))}
				</div>
			</div>

			{/* 대기 중인 트랜잭션 링크 */}
			<div className="mt-6">
				<Link
					href={`/safe/${safeAddress}/transactions`}
					className="block rounded-lg bg-gray-100 p-4 text-center transition-colors hover:bg-gray-200"
				>
					대기 중인 트랜잭션 보기 →
				</Link>
			</div>
		</div>
	);
});

export default SafeDashboard;
