"use client";

import { Card } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type React from "react";
import { Button } from "../../control/Button/Button";
import { Typography } from "../../data-display/Typography";
import { translateNode, useT } from "../../i18n";
import { Container } from "../../layout/Container/Container";
import { Spacer } from "../../rhythm/Spacer/Spacer";
import { VStack } from "../../rhythm/VStack/VStack";

export interface NotFoundProps {
	/**
	 * 페이지 제목
	 */
	title?: string;
	/**
	 * 페이지 설명
	 */
	description?: string;
	/**
	 * 홈으로 돌아가기 버튼 텍스트
	 */
	homeButtonText?: string;
	/**
	 * 이전 페이지로 돌아가기 버튼 텍스트
	 */
	backButtonText?: string;
	/**
	 * 홈으로 돌아가기 클릭 핸들러
	 */
	onHomeClick?: () => void;
	/**
	 * 이전 페이지로 돌아가기 클릭 핸들러
	 */
	onBackClick?: () => void;
	/**
	 * 추가 액션 버튼들
	 */
	actions?: React.ReactNode;
	/**
	 * 커스텀 아이콘
	 */
	icon?: React.ReactNode;
}

/**
 * NotFound 컴포넌트
 * 404 페이지를 찾을 수 없을 때 표시하는 페이지입니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <NotFound
 *   onHomeClick={() => router.push("/")}
 *   onBackClick={() => router.back()}
 * />
 *
 * // 커스텀 메시지
 * <NotFound
 *   title="접근 권한이 없습니다"
 *   description="이 페이지에 접근할 권한이 없습니다."
 *   homeButtonText="대시보드로 이동"
 *   onHomeClick={() => router.push("/dashboard")}
 * />
 * ```
 */
export const NotFound = observer(function NotFound({
	title = "페이지를 찾을 수 없습니다",
	description = "요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.",
	homeButtonText = "홈으로 돌아가기",
	backButtonText = "이전 페이지",
	onHomeClick,
	onBackClick,
	actions,
	icon,
}: NotFoundProps) {
	const t = useT();
	const defaultIcon = (
		<div className="font-bold text-9xl text-gray-300">404</div>
	);

	return (
		<Container className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-md">
				<Card.Content className="p-8 text-center">
					<VStack className="items-center gap-6">
						{icon || defaultIcon}

						<VStack className="items-center gap-2">
							<Typography.Heading level={2}>{t(title)}</Typography.Heading>
							<Typography.Paragraph className="text-center">
								{t(description)}
							</Typography.Paragraph>
						</VStack>

						<Spacer size={8} />

						{actions ? (
							translateNode(actions, t)
						) : (
							<VStack className="w-full gap-3">
								<Button
									color="primary"
									variant="solid"
									size="lg"
									onPress={onHomeClick}
									className="w-full"
								>
									{t(homeButtonText)}
								</Button>

								<Button
									color="default"
									variant="bordered"
									size="md"
									onPress={onBackClick}
									className="w-full"
								>
									{t(backButtonText)}
								</Button>
							</VStack>
						)}
					</VStack>
				</Card.Content>
			</Card>
		</Container>
	);
});

export default NotFound;
