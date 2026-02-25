import type { ReactNode } from "react";

/**
 * 인증 플로우 레이아웃
 *
 * 미니멀 레이아웃: 블러 오브 배경 + 중앙 정렬
 * (로그인, 동의, 비밀번호 찾기/재설정, 에러)
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen flex items-center justify-center relative">
			{/* 배경 블러 오브 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

			<div className="relative z-10 w-full max-w-md px-6">{children}</div>
		</div>
	);
}
