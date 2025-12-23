"use client";

import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useAccount } from "wagmi";
import { getWalletClient } from "wagmi/actions";
import { SAFE_CONFIG, wagmiConfig } from "@/config/web3.config";
import { useStores } from "@/providers";
import { safeService } from "@/services";

export const CreateSafeForm = observer(function CreateSafeForm() {
	const { safe: safeStore } = useStores();
	const { address, isConnected, chainId } = useAccount();

	const [owners, setOwners] = useState<string[]>(["", "", ""]);
	const [threshold, setThreshold] = useState(SAFE_CONFIG.threshold);

	// 첫 번째 소유자를 현재 연결된 지갑으로 설정
	const handleSetCurrentWallet = (index: number) => {
		if (address) {
			const newOwners = [...owners];
			newOwners[index] = address;
			setOwners(newOwners);
		}
	};

	const handleOwnerChange = (index: number, value: string) => {
		const newOwners = [...owners];
		newOwners[index] = value;
		setOwners(newOwners);
	};

	const validateOwners = (): boolean => {
		// 모든 소유자 주소가 입력되었는지 확인
		for (const owner of owners) {
			if (!owner || !/^0x[a-fA-F0-9]{40}$/.test(owner)) {
				safeStore.setError("모든 소유자 주소를 올바르게 입력해주세요.");
				return false;
			}
		}

		// 중복 주소 확인
		const uniqueOwners = new Set(owners.map((o) => o.toLowerCase()));
		if (uniqueOwners.size !== owners.length) {
			safeStore.setError("중복된 소유자 주소가 있습니다.");
			return false;
		}

		return true;
	};

	const handleCreateSafe = async () => {
		if (!isConnected) {
			safeStore.setError("지갑을 먼저 연결해주세요.");
			return;
		}

		if (!validateOwners()) {
			return;
		}

		safeStore.setCreating(true);
		safeStore.setError(null);

		try {
			// 액션 시점에 walletClient 가져오기
			const walletClient = await getWalletClient(wagmiConfig);
			if (!walletClient) {
				safeStore.setError("지갑 클라이언트를 불러올 수 없습니다.");
				safeStore.setCreating(false);
				return;
			}

			// walletClient를 EIP-1193 Provider로 변환
			const provider = {
				request: walletClient.request.bind(walletClient),
			};

			const safeAddress = await safeService.createSafe(
				owners,
				threshold,
				provider as Parameters<typeof safeService.createSafe>[2],
			);

			// Safe 정보 조회 및 저장
			const safeInfo = await safeService.getSafeInfo(
				safeAddress,
				provider as Parameters<typeof safeService.getSafeInfo>[1],
			);

			safeStore.setSafe(safeInfo);
			safeStore.addSafe(safeInfo);

			// 성공 시 대시보드로 이동
			window.location.href = `/safe/${safeAddress}`;
		} catch (error) {
			console.error("Safe 생성 실패:", error);
			safeStore.setError(
				error instanceof Error ? error.message : "Safe 생성에 실패했습니다.",
			);
		} finally {
			safeStore.setCreating(false);
		}
	};

	if (!isConnected) {
		return (
			<div className="text-center p-8">
				<p className="text-gray-500">지갑을 먼저 연결해주세요.</p>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">새 Safe 생성</h1>

			<div className="bg-white rounded-lg shadow-md p-6">
				{/* 네트워크 정보 */}
				<div className="mb-6 p-4 bg-gray-50 rounded-lg">
					<p className="text-sm text-gray-600">
						연결된 네트워크:{" "}
						<span className="font-medium">
							{chainId === 1 ? "Ethereum Mainnet" : "Sepolia Testnet"}
						</span>
					</p>
					<p className="text-sm text-gray-600 mt-1">
						연결된 지갑: <span className="font-mono text-xs">{address}</span>
					</p>
				</div>

				{/* 소유자 입력 */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-3">
						소유자 주소 ({SAFE_CONFIG.ownerCount}명)
					</label>

					{owners.map((owner, index) => (
						<div key={index} className="mb-3">
							<div className="flex gap-2">
								<input
									type="text"
									value={owner}
									onChange={(e) => handleOwnerChange(index, e.target.value)}
									placeholder={`소유자 ${index + 1} 주소 (0x...)`}
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
								/>
								<button
									type="button"
									onClick={() => handleSetCurrentWallet(index)}
									className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
								>
									내 지갑
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Threshold 설정 */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						필요 서명 수 (Threshold)
					</label>
					<select
						value={threshold}
						onChange={(e) => setThreshold(Number(e.target.value))}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{[1, 2, 3].map((t) => (
							<option key={t} value={t}>
								{t} / {SAFE_CONFIG.ownerCount} 서명 필요
							</option>
						))}
					</select>
					<p className="mt-2 text-sm text-gray-500">
						트랜잭션 실행에 필요한 최소 서명 수입니다.
					</p>
				</div>

				{/* 에러 메시지 */}
				{safeStore.error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-600 text-sm">{safeStore.error}</p>
					</div>
				)}

				{/* 생성 버튼 */}
				<button
					onClick={handleCreateSafe}
					disabled={safeStore.isCreating}
					className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
				>
					{safeStore.isCreating ? (
						<span className="flex items-center justify-center gap-2">
							<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
							Safe 생성 중...
						</span>
					) : (
						"Safe 생성"
					)}
				</button>

				{/* 안내 메시지 */}
				<p className="mt-4 text-xs text-gray-500 text-center">
					Safe 생성에는 가스 비용이 발생합니다.
				</p>
			</div>
		</div>
	);
});

export default CreateSafeForm;
