"use client";

import { Spinner } from "@heroui/react";

/**
 * 인터랙션 데이터 로딩 화면
 */
export function LoadingScreen() {
	return (
		<div className="min-h-screen flex items-center justify-center relative">
			{/* 배경 블러 오브 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

			<div className="relative z-10 flex flex-col items-center gap-4">
				<Spinner size="lg" />
				<p className="text-default-500">로딩 중...</p>
			</div>
		</div>
	);
}
