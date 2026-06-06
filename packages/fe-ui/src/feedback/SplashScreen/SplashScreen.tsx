"use client";

import { Card, ProgressBar } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { Logo } from "../../data-display/Logo/Logo";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm/VStack/VStack";

export interface SplashScreenProps {
	/** 메인 타이틀 @default "앱을 준비하고 있습니다" */
	title?: string;
	/** 서브 타이틀 @default "잠시만 기다려주세요..." */
	subtitle?: string;
	/** 진행률 (0-100, 미제공시 무한 로딩) */
	progress?: number;
	/** 프로그레스 바 표시 여부 @default true */
	showProgress?: boolean;
}

/**
 * SplashScreen 컴포넌트
 * 앱 초기화 중 표시하는 스플래시 화면입니다.
 *
 * @example
 * ```tsx
 * // 기본 사용 (무한 로딩)
 * <SplashScreen />
 *
 * // 진행률 표시
 * <SplashScreen progress={75} />
 *
 * // 커스텀 메시지
 * <SplashScreen
 *   title="데이터를 불러오는 중"
 *   subtitle="잠시만 기다려주세요"
 *   progress={loadingProgress}
 * />
 * ```
 */
export const SplashScreen = observer(function SplashScreen({
	title = "앱을 준비하고 있습니다",
	subtitle = "잠시만 기다려주세요...",
	progress,
	showProgress = true,
}: SplashScreenProps) {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-background">
			{/* 배경 그라디언트 */}
			<div className="absolute inset-0 bg-gradient-to-br from-accent-soft to-default dark:from-default dark:to-default" />

			{/* 메인 카드 */}
			<Card className="relative z-10 mx-4 w-full max-w-md border-none shadow-2xl">
				<Card.Content className="p-8">
					<VStack className="items-center space-y-6">
						{/* 로고 */}
						<div className="animate-pulse">
							<Logo className="text-3xl" />
						</div>

						{/* 타이틀과 서브타이틀 */}
						<VStack className="items-center space-y-2 text-center">
							<Typography.Heading level={4} className="text-foreground">
								{title}
							</Typography.Heading>
							<Typography.Paragraph
								color="muted"
								size="sm"
								className="text-muted"
							>
								{subtitle}
							</Typography.Paragraph>
						</VStack>

						{/* 프로그레스 바 */}
						{showProgress && (
							<div className="w-full space-y-2">
								<ProgressBar
									aria-label="Loading progress"
									value={progress !== undefined ? progress : undefined}
									color="accent"
									className="max-w-md"
									isIndeterminate={progress === undefined}
									size="sm"
								/>

								{/* 퍼센티지 표시 */}
								{progress !== undefined && (
									<div className="text-center">
										<Chip
											size="sm"
											variant="flat"
											color="primary"
											className="text-xs"
										>
											{Math.round(progress)}%
										</Chip>
									</div>
								)}
							</div>
						)}

						{/* 로딩 상태 텍스트 */}
						<Typography.Paragraph
							color="muted"
							size="xs"
							className="animate-pulse text-muted"
						>
							시스템을 초기화하는 중...
						</Typography.Paragraph>
					</VStack>
				</Card.Content>
			</Card>

			{/* 장식용 배경 요소들 */}
			<div className="absolute top-10 left-10 h-20 w-20 animate-pulse rounded-full bg-accent-soft/20 blur-xl dark:bg-accent/10" />
			<div
				className="absolute top-32 right-20 h-16 w-16 animate-pulse rounded-full bg-default/20 blur-xl dark:bg-default/10"
				style={{ animationDelay: "1s" }}
			/>
			<div
				className="absolute bottom-20 left-1/4 h-24 w-24 animate-pulse rounded-full bg-success-200/20 blur-xl dark:bg-success-500/10"
				style={{ animationDelay: "2s" }}
			/>
			<div
				className="absolute right-10 bottom-32 h-18 w-18 animate-pulse rounded-full bg-warning-200/20 blur-xl dark:bg-warning-500/10"
				style={{ animationDelay: "0.5s" }}
			/>
		</div>
	);
});
