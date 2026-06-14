import { KeyRound, RotateCcw, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Typography } from "../../data-display/Typography";
import { UtilityActions } from "../UtilityActions";

export interface AuthFlowFrameProps {
	contents: ReactNode;
}

/**
 * login 외 인증 flow의 반응형 소개 영역과 form column을 렌더링합니다.
 */
export function AuthFlowFrame({ contents }: AuthFlowFrameProps) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
			<UtilityActions />
			<div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-20 lg:px-10">
				<div className="idp-auth-layout-grid grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
					<div className="idp-auth-intro-panel hidden flex-col gap-6 lg:flex">
						<div className="flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 shadow-sm">
							<ShieldCheck aria-hidden className="size-4 text-accent" />
							<Typography
								type="body-sm"
								weight="semibold"
								className="!text-foreground"
							>
								Plate Auth
							</Typography>
						</div>
						<div className="flex max-w-2xl flex-col gap-4">
							<Typography type="h1" className="text-4xl leading-tight">
								계정 확인과 서비스 연동을 같은 흐름에서 처리합니다
							</Typography>
							<Typography
								type="body"
								color="muted"
								className="max-w-xl leading-8 !text-foreground opacity-70"
							>
								로그인, 계정 복구, OIDC 승인 화면을 콘솔 안에 두고 필요한
								화면으로 자연스럽게 돌아갑니다.
							</Typography>
						</div>
						<div className="flex max-w-xl flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
							<div className="flex w-full items-center gap-4 border-b border-border px-5 py-4">
								<KeyRound aria-hidden className="size-5 text-primary" />
								<div className="flex flex-col gap-1">
									<Typography
										type="body-sm"
										weight="semibold"
										className="!text-foreground"
									>
										Native login 기본
									</Typography>
									<Typography
										color="muted"
										type="body-xs"
										className="!text-foreground opacity-70"
									>
										콘솔 로그인 흐름을 기본으로 사용합니다.
									</Typography>
								</div>
							</div>
							<div className="flex w-full items-center gap-4 px-5 py-4">
								<RotateCcw aria-hidden className="size-5 text-success" />
								<div className="flex flex-col gap-1">
									<Typography
										type="body-sm"
										weight="semibold"
										className="!text-foreground"
									>
										OIDC 확장 유지
									</Typography>
									<Typography
										color="muted"
										type="body-xs"
										className="!text-foreground opacity-70"
									>
										프로토콜 endpoint와 interaction flow는 추후 확장을 위해 남겨
										둡니다.
									</Typography>
								</div>
							</div>
						</div>
					</div>
					<div className="flex w-full flex-col items-center gap-6">
						<div className="flex w-full max-w-[440px] flex-col gap-4 lg:hidden">
							<Typography type="h2" className="leading-tight">
								계정 확인을 진행해 주세요
							</Typography>
							<Typography
								type="body"
								color="muted"
								className="leading-7 !text-foreground opacity-70"
							>
								인증을 마치면 필요한 화면으로 돌아갑니다.
							</Typography>
						</div>
						<div className="w-full max-w-[440px]">{contents}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
