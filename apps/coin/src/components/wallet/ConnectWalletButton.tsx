"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
	useAccount,
	useBalance,
	useChainId,
	useConnect,
	useDisconnect,
} from "wagmi";
import { useStores } from "@/providers";

export const ConnectWalletButton = observer(() => {
	const store = useStores();
	const { address, isConnected, isConnecting } = useAccount();
	const { connect, connectors, isPending } = useConnect();
	const { disconnect } = useDisconnect();
	const chainId = useChainId();
	const { data: balance } = useBalance({ address });

	const [showModal, setShowModal] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	// wagmi 상태를 MobX store와 동기화
	useEffect(() => {
		if (isConnected && address) {
			store.wallet.setConnected(address, chainId);
		} else {
			store.wallet.disconnect();
		}
	}, [isConnected, address, chainId, store.wallet]);

	useEffect(() => {
		store.wallet.setConnecting(isConnecting || isPending);
	}, [isConnecting, isPending, store.wallet]);

	// 주소 압축 표시
	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	// 잔액 표시
	const formatBalance = () => {
		if (!balance) return "0";
		return parseFloat(balance.formatted).toFixed(4);
	};

	// 연결된 상태
	if (isConnected && address) {
		return (
			<div className="relative">
				<button
					onClick={() => setShowMenu(!showMenu)}
					className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
				>
					<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
					<div className="text-left">
						<div className="text-sm font-medium">{formatAddress(address)}</div>
						<div className="text-xs text-gray-500">{formatBalance()} ETH</div>
					</div>
				</button>

				{showMenu && (
					<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
						<div className="p-3 border-b">
							<div className="text-sm font-medium">연결된 지갑</div>
							<div className="text-xs text-gray-500 truncate">{address}</div>
						</div>
						<button
							onClick={() => {
								disconnect();
								setShowMenu(false);
							}}
							className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
						>
							연결 해제
						</button>
					</div>
				)}
			</div>
		);
	}

	// 연결 안 된 상태
	return (
		<>
			<button
				onClick={() => setShowModal(true)}
				disabled={isConnecting || isPending}
				className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
			>
				{isConnecting || isPending ? (
					<span className="flex items-center gap-2">
						<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
						연결 중...
					</span>
				) : (
					"지갑 연결"
				)}
			</button>

			{/* 지갑 선택 모달 */}
			{showModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold">지갑 연결</h2>
							<button
								onClick={() => setShowModal(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-3">
							{connectors.length > 0 && (
								<button
									onClick={() => {
										connect({ connector: connectors[0] });
										setShowModal(false);
									}}
									disabled={isPending}
									className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
								>
									<div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
										<span className="text-2xl">🦊</span>
									</div>
									<div className="text-left">
										<div className="font-medium">MetaMask</div>
										<div className="text-sm text-gray-500">
											브라우저 확장 지갑
										</div>
									</div>
								</button>
							)}
							{connectors.length === 0 && (
								<p className="text-center text-gray-500">
									MetaMask를 설치해주세요.
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
});
