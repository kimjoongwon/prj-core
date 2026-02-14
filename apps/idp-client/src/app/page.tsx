/**
 * IDP Client 루트 페이지
 *
 * OIDC 인증 흐름을 통해 접근하는 안내 메시지를 표시합니다.
 */
export default function HomePage() {
	return (
		<div className="min-h-screen flex items-center justify-center relative">
			{/* 배경 블러 오브 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

			<div className="relative z-10 w-full max-w-md px-6">
				<div className="bg-content1 p-8 rounded-2xl shadow-xl border border-divider">
					<div className="text-center">
						<div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
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
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h1 className="text-2xl font-bold">Identity Provider</h1>
						<p className="text-default-500 mt-2">OIDC 인증 서비스</p>
						<p className="text-default-400 text-sm mt-4">
							이 페이지는 OIDC 인증 흐름을 통해 접근됩니다.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
