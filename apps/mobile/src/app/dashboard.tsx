import { useRouter } from "expo-router";
import { Button } from "@cocrepo/mo-ui";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import { mobileAuthStore } from "@/auth/auth-store";

export default observer(function MobileDashboardPage() {
	const router = useRouter();

	const onPressLogout = async () => {
		await mobileAuthStore.logout();
		router.replace("/auth/login");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>모바일 대시보드</Text>
			<Text style={styles.description}>현재 인증된 앱 영역입니다.</Text>
			<Text style={styles.status}>
				상태: {mobileAuthStore.isAuthenticated ? "인증됨" : "인증 확인 필요"}
			</Text>
			<Button onPress={onPressLogout} style={styles.button}>
				로그아웃
			</Button>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		padding: 24,
	},
	title: {
		color: "#111827",
		fontSize: 28,
		fontWeight: "700",
		marginBottom: 8,
	},
	description: {
		color: "#64748b",
		fontSize: 16,
		marginBottom: 12,
		textAlign: "center",
	},
	status: {
		color: "#334155",
		fontSize: 16,
		marginBottom: 24,
	},
	button: {
		width: "100%",
	},
});
