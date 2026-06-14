import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Typography } from "../../data-display/Typography";
import { UtilityActions } from "../UtilityActions";

export interface LoginFrameProps {
	contents: ReactNode;
}

const utilityControlClassName =
	"border-border bg-surface/80 text-foreground shadow-sm backdrop-blur-md hover:bg-surface";

/**
 * first-party login 화면의 반응형 소개 영역과 form column을 렌더링합니다.
 */
export function LoginFrame({ contents }: LoginFrameProps) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
			<UtilityActions
				className="absolute right-4 top-4 z-20 flex items-center gap-2"
				controlClassName={utilityControlClassName}
			/>
			<div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] lg:gap-16 lg:px-10">
				<div className="hidden min-h-screen flex-col justify-center gap-8 py-16 lg:flex">
					<div className="flex max-w-2xl flex-col gap-6">
						<div className="flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 !text-foreground opacity-70 shadow-sm">
							<ShieldCheck aria-hidden className="size-4 text-accent" />
							<Typography
								type="body-sm"
								weight="semibold"
								className="!text-foreground opacity-70"
							>
								Plate Console
							</Typography>
						</div>
						<div className="flex flex-col gap-4">
							<Typography type="h1" className="max-w-xl text-5xl leading-tight">
								운영 흐름을 바로 이어갑니다
							</Typography>
							<Typography
								type="body"
								color="muted"
								className="max-w-xl text-lg leading-8 !text-foreground opacity-70"
							>
								예약, 결제, 권한 상태를 확인하고 필요한 조치를 빠르게
								이어가세요.
							</Typography>
						</div>
					</div>
					<div className="flex max-w-xl flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
						<div className="flex w-full items-center gap-4 border-b border-border px-5 py-4">
							<CheckCircle2 aria-hidden className="size-5 text-success" />
							<div className="flex flex-col gap-1">
								<Typography
									type="body-sm"
									weight="semibold"
									className="!text-foreground opacity-90"
								>
									상태를 먼저 확인
								</Typography>
								<Typography
									color="muted"
									type="body-xs"
									className="!text-foreground opacity-70"
								>
									예약 가능, 결제 대기, 권한 변경을 한눈에 봅니다.
								</Typography>
							</div>
						</div>
						<div className="flex w-full items-center gap-4 px-5 py-4">
							<Clock3 aria-hidden className="size-5 text-warning" />
							<div className="flex flex-col gap-1">
								<Typography
									type="body-sm"
									weight="semibold"
									className="!text-foreground opacity-90"
								>
									다음 행동으로 이동
								</Typography>
								<Typography
									color="muted"
									type="body-xs"
									className="!text-foreground opacity-70"
								>
									확인 후 필요한 운영 작업으로 바로 이어집니다.
								</Typography>
							</div>
						</div>
					</div>
				</div>
				<div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 py-24 lg:py-16">
					<div className="flex w-full max-w-[440px] flex-col gap-4 lg:hidden">
						<Typography type="h2" className="leading-tight">
							운영 흐름을 바로 이어갑니다
						</Typography>
						<Typography
							type="body"
							color="muted"
							className="leading-7 !text-foreground opacity-70"
						>
							예약, 결제, 권한 상태를 이어서 확인하세요.
						</Typography>
					</div>
					<div className="w-full max-w-[440px]">{contents}</div>
				</div>
			</div>
		</div>
	);
}
