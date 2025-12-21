import { Button, Card, CardBody } from "@heroui/react";
import React from "react";
import { Container } from "../../surfaces/Container/Container";
import { Spacer } from "../../surfaces/Spacer/Spacer";
import { Text } from "../../data-display/Text/Text";
import { VStack } from "../../surfaces/VStack/VStack";

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
 * 404 Not Found 페이지 컴포넌트 (Pure Function)
 */
export function NotFound({
	title = "페이지를 찾을 수 없습니다",
	description = "요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.",
	homeButtonText = "홈으로 돌아가기",
	backButtonText = "이전 페이지",
	onHomeClick,
	onBackClick,
	actions,
	icon,
}: NotFoundProps) {
	const defaultIcon = (
		<div className="font-bold text-9xl text-gray-300">404</div>
	);

	return (
		<Container className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-md">
				<CardBody className="p-8 text-center">
					<VStack className="items-center gap-6">
						{icon || defaultIcon}

						<VStack className="items-center gap-2">
							<Text variant="h2">{title}</Text>
							<Text variant="body1" className="text-center">
								{description}
							</Text>
						</VStack>

						<Spacer size={8} />

						{actions || (
							<VStack className="w-full gap-3">
								<Button
									color="primary"
									variant="solid"
									size="lg"
									onPress={onHomeClick}
									className="w-full"
								>
									{homeButtonText}
								</Button>

								<Button
									color="default"
									variant="bordered"
									size="md"
									onPress={onBackClick}
									className="w-full"
								>
									{backButtonText}
								</Button>
							</VStack>
						)}
					</VStack>
				</CardBody>
			</Card>
		</Container>
	);
}

export default NotFound;
