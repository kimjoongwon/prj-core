"use client";

import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useEffect } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { getWalletClient } from "wagmi/actions";
import { wagmiConfig } from "@/config/web3.config";
import { useStores } from "@/providers";
import { transactionService } from "@/services";

interface TransactionListProps {
	safeAddress: string;
}

export const TransactionList = observer(function TransactionList({
	safeAddress,
}: TransactionListProps) {
	const { transaction: txStore } = useStores();
	const { isConnected } = useAccount();

	useEffect(() => {
		const loadPendingTransactions = async () => {
			txStore.setLoading(true);
			try {
				const pendingTxs =
					await transactionService.getPendingTransactions(safeAddress);
				txStore.setPendingTransactions(pendingTxs);
			} catch (error) {
				console.error("트랜잭션 목록 로드 실패:", error);
				txStore.setError(
					error instanceof Error
						? error.message
						: "트랜잭션 목록을 불러올 수 없습니다.",
				);
			} finally {
				txStore.setLoading(false);
			}
		};

		loadPendingTransactions();
	}, [safeAddress, txStore]);

	const handleSign = async (safeTxHash: string) => {
		if (!isConnected) {
			txStore.setError("지갑을 먼저 연결해주세요.");
			return;
		}

		txStore.setSigning(true);
		txStore.setError(null);

		try {
			const walletClient = await getWalletClient(wagmiConfig);
			if (!walletClient) {
				txStore.setError("지갑 클라이언트를 불러올 수 없습니다.");
				txStore.setSigning(false);
				return;
			}

			const provider = {
				request: walletClient.request.bind(walletClient),
			};

			await transactionService.signTransaction(
				safeAddress,
				safeTxHash,
				provider as Parameters<typeof transactionService.signTransaction>[2],
			);

			// 트랜잭션 목록 새로고침
			const pendingTxs =
				await transactionService.getPendingTransactions(safeAddress);
			txStore.setPendingTransactions(pendingTxs);
		} catch (error) {
			console.error("서명 실패:", error);
			txStore.setError(
				error instanceof Error ? error.message : "서명에 실패했습니다.",
			);
		} finally {
			txStore.setSigning(false);
		}
	};

	const handleExecute = async (safeTxHash: string) => {
		if (!isConnected) {
			txStore.setError("지갑을 먼저 연결해주세요.");
			return;
		}

		txStore.setExecuting(true);
		txStore.setError(null);

		try {
			const walletClient = await getWalletClient(wagmiConfig);
			if (!walletClient) {
				txStore.setError("지갑 클라이언트를 불러올 수 없습니다.");
				txStore.setExecuting(false);
				return;
			}

			const provider = {
				request: walletClient.request.bind(walletClient),
			};

			await transactionService.executeTransaction(
				safeAddress,
				safeTxHash,
				provider as Parameters<typeof transactionService.executeTransaction>[2],
			);

			// 실행된 트랜잭션 제거
			txStore.removePendingTransaction(safeTxHash);
		} catch (error) {
			console.error("실행 실패:", error);
			txStore.setError(
				error instanceof Error
					? error.message
					: "트랜잭션 실행에 실패했습니다.",
			);
		} finally {
			txStore.setExecuting(false);
		}
	};

	if (!isConnected) {
		return (
			<div className="p-8 text-center">
				<p className="text-gray-500">지갑을 먼저 연결해주세요.</p>
			</div>
		);
	}

	if (txStore.isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl p-6">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link
						href={`/safe/${safeAddress}`}
						className="text-gray-500 hover:text-gray-700"
					>
						← 뒤로
					</Link>
					<h1 className="text-2xl font-bold">대기 중인 트랜잭션</h1>
				</div>
				<Link
					href={`/safe/${safeAddress}/send`}
					className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				>
					새 트랜잭션
				</Link>
			</div>

			{txStore.error && (
				<div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-red-600">{txStore.error}</p>
				</div>
			)}

			{txStore.pendingTransactions.length === 0 ? (
				<div className="rounded-lg bg-white p-8 text-center shadow-md">
					<p className="text-gray-500">대기 중인 트랜잭션이 없습니다.</p>
				</div>
			) : (
				<div className="space-y-4">
					{txStore.pendingTransactions.map((tx) => {
						const canExecute = tx.confirmations >= tx.confirmationsRequired;

						return (
							<div
								key={tx.safeTxHash}
								className="rounded-lg bg-white p-6 shadow-md"
							>
								<div className="mb-4 flex items-start justify-between">
									<div>
										<p className="font-mono text-sm text-gray-500">
											#{tx.nonce}
										</p>
										<p className="mt-1 font-medium">
											{tx.tokenSymbol || "ETH"} 전송
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold">
											{tx.value !== "0"
												? `${formatEther(BigInt(tx.value))} ETH`
												: tx.tokenSymbol || "Contract Call"}
										</p>
										<p className="mt-1 text-sm text-gray-500">
											→ {tx.to.slice(0, 8)}...{tx.to.slice(-6)}
										</p>
									</div>
								</div>

								{/* 서명 진행 상태 */}
								<div className="mb-4">
									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-600">서명 진행</span>
										<span
											className={
												canExecute
													? "font-medium text-green-600"
													: "text-gray-600"
											}
										>
											{tx.confirmations} / {tx.confirmationsRequired}
										</span>
									</div>
									<div className="mt-2 h-2 w-full rounded-full bg-gray-200">
										<div
											className={`h-2 rounded-full ${canExecute ? "bg-green-500" : "bg-blue-500"}`}
											style={{
												width: `${(tx.confirmations / tx.confirmationsRequired) * 100}%`,
											}}
										/>
									</div>
								</div>

								{/* 액션 버튼 */}
								<div className="flex gap-3">
									<button
										type="button"
										onClick={() => handleSign(tx.safeTxHash)}
										disabled={txStore.isSigning}
										className="flex-1 rounded-lg border border-blue-600 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50"
									>
										{txStore.isSigning ? "서명 중..." : "서명"}
									</button>

									{canExecute && (
										<button
											type="button"
											onClick={() => handleExecute(tx.safeTxHash)}
											disabled={txStore.isExecuting}
											className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
										>
											{txStore.isExecuting ? "실행 중..." : "실행"}
										</button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
});

export default TransactionList;
