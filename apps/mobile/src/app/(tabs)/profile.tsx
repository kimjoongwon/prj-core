import { Button, Icon, ScreenFrame, Text } from "@cocrepo/mo-ui";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { ScrollView, View } from "react-native";
import { mobileAuthStore } from "@/auth/auth-store";
import { mainTabClassNames } from "@/tabs/main-tab-class-names";

const classNames = mainTabClassNames();

const ProfileTabRoute = observer(() => {
	const router = useRouter();

	const onPressLogoutButton = async () => {
		await mobileAuthStore.logout();
		router.replace("/auth/login" as Href);
	};

	return (
		<ScreenFrame
			className={classNames.screenFrame()}
			contentClassName={classNames.root()}
			edges={["right", "left"]}
		>
			<ScrollView
				contentContainerClassName={classNames.contentContainer()}
				showsVerticalScrollIndicator={false}
			>
				<View className={classNames.tabContent()}>
					<View className={classNames.profileCard()}>
						<Text className={classNames.sectionTitle()}>내 정보</Text>
						<Text className={classNames.sectionDescription()}>
							오노라 예약 알림과 계정 상태를 관리합니다.
						</Text>
						<View className={classNames.sessionRow()}>
							<View className={classNames.sessionLabelRow()}>
								<Icon name="shieldCheck" size="xs" tone="success" />
								<Text className={classNames.sessionLabel()}>로그인 상태</Text>
							</View>
							<Text className={classNames.sessionValue()}>
								{mobileAuthStore.isAuthenticated ? "로그인됨" : "확인 필요"}
							</Text>
						</View>
						<Button
							className="rounded-lg"
							isDisabled={mobileAuthStore.isVerifying}
							onPress={onPressLogoutButton}
							variant="danger-soft"
						>
							<View className={classNames.buttonContent()}>
								<Icon name="logOut" size="sm" tone="danger" />
								<Text className={classNames.dangerButtonText()}>로그아웃</Text>
							</View>
						</Button>
					</View>
				</View>
			</ScrollView>
		</ScreenFrame>
	);
});

export default ProfileTabRoute;
