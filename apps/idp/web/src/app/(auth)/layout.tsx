import type { ReactNode } from "react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

/**
 * 인증 플로우 레이아웃
 *
 * 공개 인증 플로우의 공통 바깥 레이아웃을 담당합니다.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-[#090c12] dark:text-slate-50">
			<ThemeToggleButton className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,111,238,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(23,201,100,0.10),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,251,0.94)_100%)] dark:hidden" />
			<div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top_left,rgba(51,142,247,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(23,201,100,0.14),transparent_32%),linear-gradient(180deg,rgba(9,12,18,0.98)_0%,rgba(16,22,30,0.95)_100%)] dark:block" />
			<div className="absolute left-[-5rem] top-[-4rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
			<div className="absolute bottom-[-6rem] right-[-2rem] h-80 w-80 rounded-full bg-success/10 blur-3xl dark:bg-success/15" />

			<div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
				<div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
					<div className="lg:hidden">
						<p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-400">
							Plate Account Center
						</p>
						<h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
							서비스 이용에 필요한 계정 확인을 진행해 주세요.
						</h1>
						<p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
							로그인, 계정 복구, 서비스 연동 승인을 한 흐름으로 정리해
							예약 서비스 이용을 바로 이어갈 수 있게 구성했습니다.
						</p>
					</div>

					<div className="hidden lg:block">
						<p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600 dark:text-primary-400">
							Plate Account Center
						</p>
						<h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
							로그인과 계정 복구, 서비스 연동 승인을 한 곳에서 처리합니다.
						</h1>
						<p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
							예약 서비스 이용에 필요한 인증 단계를 같은 흐름으로 묶어
							고객과 운영자가 계정 문제를 빠르게 해결하고 필요한 화면으로
							돌아갈 수 있도록 구성했습니다.
						</p>

						<div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
							<div className="rounded-2xl border border-primary/10 bg-white/75 p-5 shadow-[0_20px_50px_-36px_rgba(0,111,238,0.35)] backdrop-blur-sm dark:border-primary/20 dark:bg-slate-950/70 dark:shadow-[0_24px_60px_-40px_rgba(51,142,247,0.45)]">
								<p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
									계정 상태 바로 확인
								</p>
								<p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
									로그인 실패, 세션 만료, 계정 잠금 여부를 같은 위치에서 바로
									확인할 수 있습니다.
								</p>
							</div>
							<div className="rounded-2xl border border-success/10 bg-white/75 p-5 shadow-[0_20px_50px_-36px_rgba(23,201,100,0.28)] backdrop-blur-sm dark:border-success/20 dark:bg-slate-950/70 dark:shadow-[0_24px_60px_-40px_rgba(23,201,100,0.36)]">
								<p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
									빠른 접근 복구
								</p>
								<p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
									재로그인과 비밀번호 재설정 이후에도 필요한 화면으로
									자연스럽게 돌아갈 수 있습니다.
								</p>
							</div>
							<div className="rounded-2xl border border-slate-200/70 bg-white/75 p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.18)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_24px_60px_-42px_rgba(0,0,0,0.65)]">
								<p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
									안전한 연동 승인
								</p>
								<p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
									서비스 연동 권한 승인과 계정 보호 흐름을 단순하게 유지해
									실수 가능성을 낮춥니다.
								</p>
							</div>
						</div>
					</div>

					<div className="mx-auto w-full max-w-[440px]">{children}</div>
				</div>

				<div className="mt-8 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
					<p>플레이트 계정 센터</p>
					<p>로그인 · 계정 복구 · 서비스 연동 승인</p>
				</div>
			</div>
		</div>
	);
}
