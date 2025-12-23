"use client";

import { observer } from "mobx-react-lite";
import Link from "next/link";
import { ConnectWalletButton } from "@/components";
import { useStores } from "@/providers";

const Home = observer(() => {
	const store = useStores();

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
			{/* Header */}
			<header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
				<div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
					<h1 className="text-xl font-bold text-zinc-900 dark:text-white">
						Safe Wallet
					</h1>
					<ConnectWalletButton />
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 py-8">
				{store.wallet.isConnected ? (
					<div className="space-y-6">
						{/* 연결된 상태 */}
						<div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
							<h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
								지갑 정보
							</h2>
							<div className="space-y-2 text-sm">
								<p className="text-zinc-600 dark:text-zinc-400">
									<span className="font-medium">주소:</span>{" "}
									<code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
										{store.wallet.address}
									</code>
								</p>
								<p className="text-zinc-600 dark:text-zinc-400">
									<span className="font-medium">체인 ID:</span>{" "}
									{store.wallet.chainId}
								</p>
							</div>
						</div>

						{/* Safe 액션 버튼 */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Link
								href="/safe/create"
								className="block p-6 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors"
							>
								<h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
									새 Safe 생성
								</h3>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">
									3명의 서명자로 새로운 멀티시그 지갑을 생성합니다.
								</p>
							</Link>
							<Link
								href="/safe/manage"
								className="block p-6 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors"
							>
								<h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
									Safe 관리
								</h3>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">
									기존 Safe 지갑을 조회하고 트랜잭션을 관리합니다.
								</p>
							</Link>
						</div>
					</div>
				) : (
					/* 연결되지 않은 상태 */
					<div className="text-center py-20">
						<h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
							지갑을 연결해주세요
						</h2>
						<p className="text-zinc-600 dark:text-zinc-400 mb-8">
							Safe 멀티시그 지갑을 사용하려면 먼저 지갑을 연결해야 합니다.
						</p>
						<div className="flex justify-center">
							<ConnectWalletButton />
						</div>
					</div>
				)}
			</main>
		</div>
	);
});

export default Home;
