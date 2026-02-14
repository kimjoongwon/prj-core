"use client";

interface ErrorScreenProps {
	message: string;
}

/**
 * 인터랙션 데이터 로드 실패 에러 화면
 */
export function ErrorScreen({ message }: ErrorScreenProps) {
	return (
		<div className="min-h-screen flex items-center justify-center relative">
			{/* 배경 블러 오브 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-danger/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

			<div className="relative z-10 w-full max-w-md px-6">
				<div className="bg-content1 p-8 rounded-2xl shadow-xl border border-divider">
					{/* 에러 아이콘 */}
					<div className="text-center mb-6">
						<div className="w-16 h-16 bg-gradient-to-br from-danger to-danger-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-danger">오류 발생</h1>
					</div>

					{/* 에러 메시지 */}
					<div className="bg-danger/10 border border-danger/30 rounded-lg p-4 mb-6">
						<p className="text-sm text-danger">{message}</p>
					</div>

					{/* 돌아가기 */}
					<div className="text-center">
						<button
							type="button"
							className="px-6 py-2.5 bg-default-100 hover:bg-default-200 text-foreground font-medium rounded-lg transition-colors"
							onClick={() => window.history.back()}
						>
							돌아가기
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
