import type { ReactNode } from "react";

/**
 * 인증 플로우 레이아웃
 *
 * 공개 인증 플로우의 공통 바깥 레이아웃을 담당합니다.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-default-50">
			<div className="absolute inset-x-0 top-0 h-64 bg-primary/10 blur-3xl" />
			<div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)]" />

			<div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
				<div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
					<div className="hidden lg:block">
						<p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">
							OIDC Identity Provider
						</p>
						<h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground">
							인증, 계정 복구, 동의 흐름을 같은 기준으로 정리한 인증 환경
						</h1>
						<p className="mt-4 max-w-xl text-base leading-7 text-default-600">
							과한 장식은 줄이고, 필요한 정보와 복구 동작은 더 빨리 확인할 수
							있도록 인증 화면을 단순하게 구성했습니다.
						</p>

						<div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
							<div className="rounded-2xl border border-default-200/70 bg-content1/80 p-4 shadow-sm">
								<p className="text-sm font-semibold text-foreground">
									명확한 상태 안내
								</p>
								<p className="mt-2 text-sm leading-6 text-default-500">
									잠금, 실패, 만료 상태를 같은 위치와 톤으로 안내합니다.
								</p>
							</div>
							<div className="rounded-2xl border border-default-200/70 bg-content1/80 p-4 shadow-sm">
								<p className="text-sm font-semibold text-foreground">
									빠른 복구 경로
								</p>
								<p className="mt-2 text-sm leading-6 text-default-500">
									비밀번호 재설정과 재로그인 경로를 화면 안에서 바로 제공합니다.
								</p>
							</div>
							<div className="rounded-2xl border border-default-200/70 bg-content1/80 p-4 shadow-sm">
								<p className="text-sm font-semibold text-foreground">
									일관된 인증 경험
								</p>
								<p className="mt-2 text-sm leading-6 text-default-500">
									로그인, 동의, 재설정 화면이 같은 간격과 정보 위계를
									사용합니다.
								</p>
							</div>
						</div>
					</div>

					<div className="mx-auto w-full max-w-[440px]">{children}</div>
				</div>

				<div className="mt-8 flex flex-col gap-2 text-sm text-default-500 sm:flex-row sm:items-center sm:justify-between">
					<p>OIDC Identity Provider</p>
					<p>보안 로그인 · 계정 복구 · 동의 관리</p>
				</div>
			</div>
		</div>
	);
}
