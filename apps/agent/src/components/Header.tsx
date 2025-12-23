"use client";

export function Header() {
	return (
		<header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
							<span className="text-white font-bold text-lg">A</span>
						</div>
						<div>
							<h1 className="text-xl font-bold">Agent Config Manager</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Qoder & Claude Code 설정 관리
							</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
						>
							새로고침
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
