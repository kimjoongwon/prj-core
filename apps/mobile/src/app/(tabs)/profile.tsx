import { Button, ScreenFrame } from "@cocrepo/mo-ui";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { ScrollView, Text, View } from "react-native";
import { mobileAuthStore } from "@/auth/auth-store";
import { mainTabStyles as styles } from "@/tabs/main-tab-styles";

export default observer(function ProfileTabRoute() {
	const router = useRouter();

	const onPressLogoutButton = async () => {
		await mobileAuthStore.logout();
		router.replace("/auth/login" as Href);
	};

	return (
		<ScreenFrame
			backgroundColor="#0c0f0b"
			contentStyle={styles.root}
			edges={["top", "right", "left"]}
		>
			<ScrollView
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.tabContent}>
					<View style={styles.profileCard}>
						<Text style={styles.sectionTitle}>내 정보</Text>
						<Text style={styles.sectionDescription}>
							오노라 예약 알림과 계정 상태를 관리합니다.
						</Text>
						<View style={styles.sessionRow}>
							<Text style={styles.sessionLabel}>로그인 상태</Text>
							<Text style={styles.sessionValue}>
								{mobileAuthStore.isAuthenticated ? "로그인됨" : "확인 필요"}
							</Text>
						</View>
						<Button
							isDisabled={mobileAuthStore.isVerifying}
							onPress={onPressLogoutButton}
							variant="danger-soft"
						>
							로그아웃
						</Button>
					</View>
				</View>
			</ScrollView>
		</ScreenFrame>
	);
});
