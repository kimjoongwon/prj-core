import { HStack, Section, Typography, VStack } from "@cocrepo/ui";
import { KeyRound, RotateCcw, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthFlowLayoutRoute({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<Section className="relative min-h-screen overflow-hidden bg-background">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
			<div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-20 lg:px-10">
				<div className="idp-auth-layout-grid grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
					<VStack gap="section" className="idp-auth-intro-panel hidden lg:flex">
						<HStack
							alignItems="center"
							gap="inline"
							className="w-fit rounded-full border border-border bg-surface px-3 py-1.5 shadow-sm"
						>
							<ShieldCheck aria-hidden className="size-4 text-accent" />
							<Typography
								type="body-sm"
								weight="semibold"
								className="!text-foreground"
							>
								Plate Auth
							</Typography>
						</HStack>
						<VStack gap="block" className="max-w-2xl">
							<Typography type="h1" className="text-4xl leading-tight">
								계정 확인과 서비스 연동을 같은 흐름에서 처리합니다
							</Typography>
							<Typography
								type="body"
								color="muted"
								className="max-w-xl leading-8 !text-foreground opacity-70"
							>
								로그인, 계정 복구, OIDC 승인 화면을 admin 콘솔 안에 두고 필요한
								화면으로 자연스럽게 돌아갑니다.
							</Typography>
						</VStack>
						<VStack
							gap="flush"
							className="max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
						>
							<HStack
								fullWidth
								alignItems="center"
								gap="block"
								className="border-b border-border px-5 py-4"
							>
								<KeyRound aria-hidden className="size-5 text-primary" />
								<VStack gap="dense">
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
										관리자는 기존 admin 로그인 흐름을 기본으로 사용합니다.
									</Typography>
								</VStack>
							</HStack>
							<HStack
								fullWidth
								alignItems="center"
								gap="block"
								className="px-5 py-4"
							>
								<RotateCcw aria-hidden className="size-5 text-success" />
								<VStack gap="dense">
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
								</VStack>
							</HStack>
						</VStack>
					</VStack>
					<VStack fullWidth alignItems="center" gap="roomy">
						<VStack gap="block" className="w-full max-w-[440px] lg:hidden">
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
						</VStack>
						<div className="w-full max-w-[440px]">{children}</div>
					</VStack>
				</div>
			</div>
		</Section>
	);
}
