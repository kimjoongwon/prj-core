import { HStack, Section, Typography, VStack } from "@cocrepo/ui";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
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
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
			<AuthLoginActions />
			<div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] lg:gap-16 lg:px-10">
				<VStack
					justifyContent="center"
					gap="page"
					className="hidden min-h-screen py-16 lg:flex"
				>
					<VStack gap="section" className="max-w-2xl">
						<HStack
							alignItems="center"
							gap="inline"
							className="w-fit rounded-full border border-border bg-surface px-3 py-1.5 !text-foreground opacity-70 shadow-sm"
						>
							<ShieldCheck aria-hidden className="size-4 text-accent" />
							<Typography
								type="body-sm"
								weight="semibold"
								className="!text-foreground opacity-70"
							>
								Plate Admin
							</Typography>
						</HStack>
						<VStack gap="block">
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
						</VStack>
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
							<CheckCircle2 aria-hidden className="size-5 text-success" />
							<VStack gap="dense">
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
							</VStack>
						</HStack>
						<HStack
							fullWidth
							alignItems="center"
							gap="block"
							className="px-5 py-4"
						>
							<Clock3 aria-hidden className="size-5 text-warning" />
							<VStack gap="dense">
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
							</VStack>
						</HStack>
					</VStack>
				</VStack>
				<VStack
					fullWidth
					alignItems="center"
					justifyContent="center"
					gap="roomy"
					className="min-h-screen py-24 lg:py-16"
				>
					<VStack gap="block" className="w-full max-w-[440px] lg:hidden">
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
					</VStack>
					<div className="w-full max-w-[440px]">{children}</div>
				</VStack>
			</div>
		</Section>
	);
}
