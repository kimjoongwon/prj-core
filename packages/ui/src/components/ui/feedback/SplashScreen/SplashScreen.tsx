import { Card, CardBody, Chip, Progress } from "@heroui/react";
import React from "react";
import { Logo } from "../../data-display/Logo/Logo";
import { Text } from "../../data-display/Text/Text";
import { VStack } from "../../surfaces/VStack/VStack";

export interface SplashScreenProps {
	title?: string;
	subtitle?: string;
	progress?: number;
	showProgress?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
	title = "앱을 준비하고 있습니다",
	subtitle = "잠시만 기다려주세요...",
	progress,
	showProgress = true,
}) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-background">
			{/* 배경 그라디언트 */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-default-900 dark:to-default-800" />

			{/* 메인 카드 */}
			<Card className="relative z-10 mx-4 w-full max-w-md border-none shadow-2xl">
				<CardBody className="p-8">
					<VStack className="items-center space-y-6">
						{/* 로고 */}
						<div className="animate-pulse">
							<Logo className="text-3xl" />
						</div>

						{/* 타이틀과 서브타이틀 */}
						<VStack className="items-center space-y-2 text-center">
							<Text variant="h4" className="text-foreground">
								{title}
							</Text>
							<Text variant="subtitle2" className="text-default-500">
								{subtitle}
							</Text>
						</VStack>

						{/* 프로그레스 바 */}
						{showProgress && (
							<div className="w-full space-y-2">
								<Progress
									aria-label="Loading progress"
									value={progress !== undefined ? progress : undefined}
									color="primary"
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
						<Text variant="caption" className="animate-pulse text-default-400">
							시스템을 초기화하는 중...
						</Text>
					</VStack>
				</CardBody>
			</Card>

			{/* 장식용 배경 요소들 */}
			<div className="absolute top-10 left-10 h-20 w-20 animate-pulse rounded-full bg-primary-200/20 blur-xl dark:bg-primary-500/10" />
			<div
				className="absolute top-32 right-20 h-16 w-16 animate-pulse rounded-full bg-secondary-200/20 blur-xl dark:bg-secondary-500/10"
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
};
