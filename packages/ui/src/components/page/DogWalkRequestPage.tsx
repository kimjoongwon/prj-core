import { Card, CardBody, Checkbox, Divider, Textarea } from "@heroui/react";
import { Button } from "../ui/Button/Button";
import { CharacterCounter } from "../ui/CharacterCounter/CharacterCounter";
import { CircularImage } from "../ui/CircularImage/CircularImage";
import { FeeTable } from "../ui/FeeTable/FeeTable";
import { HStack } from "../ui/HStack/HStack";
import { InfoIcon } from "../ui/Icon/InfoIcon";
import { StarIcon } from "../ui/Icon/StarIcon";
import { InfoMessage } from "../ui/InfoMessage/InfoMessage";
import { SectionHeader } from "../ui/SectionHeader/SectionHeader";
import { Text } from "../ui/Text/Text";
import { VStack } from "../ui/VStack/VStack";

export interface DogWalkRequestPageProps {
	className?: string;
}

export function DogWalkRequestPage({ className }: DogWalkRequestPageProps) {
	// 샘플 데이터
	const walker = {
		name: "김산책",
		avatar: "https://i.pravatar.cc/150?u=walker",
		rating: 4.8,
		completedWalks: 127,
	};

	const feeItems = [
		{ day: "월", time: "10:00-11:00", fee: 15000 },
		{ day: "수", time: "10:00-11:00", fee: 15000 },
		{ day: "금", time: "10:00-11:00", fee: 15000 },
	];

	return (
		<div className={className}>
			{/* 헤더 영역 */}
			<div className="mb-4 flex items-center justify-between">
				<Button variant="light" isIconOnly>
					<Text variant="body1">←</Text>
				</Button>
				<Text variant="h6">산책 요청하기</Text>
				<Button variant="light" isIconOnly>
					<StarIcon size={24} />
				</Button>
			</div>

			<Card>
				<CardBody className="p-6">
					<VStack gap={6}>
						{/* 위치 섹션 */}
						<VStack gap={3}>
							<SectionHeader>위치</SectionHeader>
							<Text variant="body1">서울특별시 강남구 역삼동 123-45</Text>
							<InfoMessage
								variant="info"
								message="위치는 정확한 주소로 자동 설정됩니다"
							/>
						</VStack>

						<Divider />

						{/* 서비스 타입 섹션 */}
						<VStack gap={3}>
							<SectionHeader>서비스 타입</SectionHeader>
							<HStack gap={2}>
								<Checkbox defaultSelected>산책</Checkbox>
								<Checkbox>목욕</Checkbox>
								<Checkbox>놀이</Checkbox>
							</HStack>
						</VStack>

						<Divider />

						{/* 산책러 정보 섹션 */}
						<VStack gap={3}>
							<SectionHeader>산책러 정보</SectionHeader>
							<HStack gap={3} alignItems="center">
								<CircularImage
									src={walker.avatar}
									alt={walker.name}
									size="md"
								/>
								<VStack gap={1}>
									<HStack gap={1} alignItems="center">
										<Text variant="subtitle1">{walker.name}</Text>
										<HStack gap={1} alignItems="center">
											<StarIcon size={16} filled color="#FFC107" />
											<Text variant="caption">{walker.rating}</Text>
										</HStack>
									</HStack>
									<Text variant="caption">
										완료한 산책: {walker.completedWalks}회
									</Text>
								</VStack>
							</HStack>
						</VStack>

						<Divider />

						{/* 일정 및 요금 섹션 */}
						<VStack gap={3}>
							<SectionHeader>일정 및 요금</SectionHeader>
							<FeeTable items={feeItems} total={45000} />
							<InfoMessage
								variant="warning"
								message="요금은 서비스 시간과 유형에 따라 변경될 수 있습니다"
							/>
						</VStack>

						<Divider />

						{/* 특이사항 섹션 */}
						<VStack gap={3}>
							<SectionHeader>특이사항</SectionHeader>
							<Textarea
								placeholder="반려견의 특이사항이나 요청사항을 입력해주세요"
								minRows={4}
								maxLength={500}
							/>
							<CharacterCounter current={0} max={500} />
							<InfoMessage
								variant="info"
								icon={<InfoIcon size={16} />}
								message="특이사항은 산책러에게 전달되어 더 나은 서비스를 제공하는데 도움이 됩니다"
							/>
						</VStack>
					</VStack>
				</CardBody>
			</Card>

			{/* 하단 버튼 */}
			<div className="mt-6">
				<Button color="primary" fullWidth size="lg">
					산책 요청하기
				</Button>
			</div>
		</div>
	);
}
