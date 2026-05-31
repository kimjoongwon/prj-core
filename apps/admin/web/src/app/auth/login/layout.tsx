import { Section, VStack } from "@cocrepo/ui";
import type { ReactNode } from "react";
import { AuthLoginActions } from "./AuthLoginActions";

/**
 * 로그인 페이지 레이아웃
 *
 * 계층 구조:
 * - App (app/layout.tsx)
 *     - Page (auth/layout.tsx)
 *         - Section (여기) - children만 (중앙 정렬)
 */
export default function LoginLayoutRoute({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<Section className="relative min-h-screen overflow-hidden bg-background">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-24 border-b border-divider bg-content1/70" />
			<AuthLoginActions />
			<div className="relative z-10 grid min-h-screen w-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(380px,500px)]">
				<VStack
					justifyContent="center"
					gap="page"
					className="hidden min-h-screen border-r border-divider px-12 py-16 lg:flex"
				>
					<VStack gap="block" className="max-w-2xl">
						<span className="w-fit rounded-full border border-divider bg-content2 px-3 py-1 text-sm font-medium text-default-600">
							Admin Native Login
						</span>
						<h1 className="text-5xl font-bold leading-tight text-foreground">
							운영 흐름을 바로 이어갑니다
						</h1>
						<p className="max-w-xl text-lg leading-8 text-default-500">
							오늘의 예약, 결제, 권한 확인을 한 화면에서 계속 관리합니다.
						</p>
					</VStack>
					<div className="grid max-w-2xl grid-cols-3 gap-3">
						<div className="rounded-2xl border border-divider bg-content1 p-4 shadow-sm">
							<p className="text-sm text-default-500">예약</p>
							<p className="mt-2 text-lg font-semibold text-foreground">
								확인 대기
							</p>
						</div>
						<div className="rounded-2xl border border-divider bg-content1 p-4 shadow-sm">
							<p className="text-sm text-default-500">결제</p>
							<p className="mt-2 text-lg font-semibold text-foreground">
								정산 점검
							</p>
						</div>
						<div className="rounded-2xl border border-divider bg-content1 p-4 shadow-sm">
							<p className="text-sm text-default-500">권한</p>
							<p className="mt-2 text-lg font-semibold text-foreground">
								접근 관리
							</p>
						</div>
					</div>
				</VStack>
				<VStack
					fullWidth
					alignItems="center"
					justifyContent="center"
					gap="roomy"
					className="min-h-screen px-5 py-24 lg:px-12"
				>
					<VStack gap="block" className="w-full max-w-[440px] lg:hidden">
						<h1 className="text-3xl font-bold leading-tight text-foreground">
							운영 흐름을 바로 이어갑니다
						</h1>
						<p className="text-base leading-7 text-default-500">
							예약, 결제, 권한 확인을 계속 관리합니다.
						</p>
					</VStack>
					<div className="w-full max-w-[440px]">{children}</div>
				</VStack>
			</div>
		</Section>
	);
}
