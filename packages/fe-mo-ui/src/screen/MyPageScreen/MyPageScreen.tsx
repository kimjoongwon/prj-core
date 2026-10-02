import { observer } from "mobx-react-lite";
import { ScrollView, View } from "react-native";
import { Chip } from "../../data-display/Chip";
import { Text } from "../../data-display/Text";
import { Icon } from "../../icon";
import { Button } from "../../input/Button";
import { Card } from "../../layout/Card";
import { ScreenFrame } from "../../layout/ScreenFrame";
import { HStack, VStack } from "../../rhythm";
import { QuickActionList } from "../../widget/QuickActionList";
import { myPageScreenClassNames } from "./MyPageScreen.class-names";
import type { MyPageScreenProps } from "./MyPageScreen.props";

/**
 * 모바일 마이 페이지의 계정 상태, 현재 지점, 빠른 이동, 로그아웃 영역을 렌더링합니다.
 *
 * @param props - route가 전달한 인증/지점 표시값과 빠른 이동 이벤트 계약
 * @returns 모바일 마이 페이지 visual composition
 */
export const MyPageScreen = observer(function MyPageScreen({
	accountDescription,
	currentSpaceName,
	displayName,
	isAuthenticated,
	isLogoutPending = false,
	onPressLogout,
	quickActions,
}: MyPageScreenProps) {
	const classNames = myPageScreenClassNames();

	return (
		<ScreenFrame className={classNames.screenFrame()} edges={["right", "left"]}>
			<ScrollView
				contentContainerClassName={classNames.contentContainer()}
				showsVerticalScrollIndicator={false}
			>
				<VStack>
					<Card className={classNames.card()}>
						<VStack>
							<HStack alignItems="center">
								<Icon name="userRound" size="lg" tone="accent" />
								<View className={classNames.accountTitleBlock()}>
									<Text className={classNames.accountName()} numberOfLines={1}>
										{displayName}
									</Text>
									<Text className={classNames.accountDescription()}>
										{accountDescription}
									</Text>
								</View>
								<Chip
									color={isAuthenticated ? "success" : "warning"}
									variant="soft"
								>
									{isAuthenticated ? "로그인됨" : "확인 필요"}
								</Chip>
							</HStack>
						</VStack>
					</Card>
					<Card className={classNames.card()}>
						<HStack alignItems="center">
							<Icon name="mapPin" size="md" tone="accent" />
							<View className={classNames.accountTitleBlock()}>
								<Text className={classNames.spaceLabel()}>현재 지점</Text>
								<Text className={classNames.spaceName()} numberOfLines={2}>
									{currentSpaceName}
								</Text>
							</View>
						</HStack>
					</Card>
					<VStack>
						<Text className={classNames.sectionLabel()}>빠른 이동</Text>
						<QuickActionList items={quickActions} />
					</VStack>
					<Button
						isDisabled={isLogoutPending}
						onPress={onPressLogout}
						variant="danger-soft"
					>
						<HStack
							alignItems="center"
							gap="inline"
							justifyContent="center"
						>
							<Icon name="logOut" size="sm" tone="danger" />
							<Text className={classNames.dangerButtonText()}>
								{isLogoutPending ? "로그아웃 중" : "로그아웃"}
							</Text>
						</HStack>
					</Button>
				</VStack>
			</ScrollView>
		</ScreenFrame>
	);
});

MyPageScreen.displayName = "MyPageScreen";
