import { Button, ScreenFrame, Tabs } from "@cocrepo/mo-ui";
import type { Href } from "expo-router";
import { observer, useLocalObservable } from "mobx-react-lite";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { mobileAuthStore } from "@/auth/auth-store";

type HomeTab = "home" | "reservations" | "profile";

interface ReservationPreview {
	date: string;
	id: string;
	label: string;
	place: string;
	status: string;
	time: string;
}

const mainTabs = [
	{ text: "홈", value: "home" },
	{ text: "예약", value: "reservations" },
	{ text: "내 정보", value: "profile" },
];

const todayReservations: ReservationPreview[] = [
	{
		date: "오늘",
		id: "visit-1",
		label: "헤어 케어 예약",
		place: "라운지 온 성수",
		status: "방문 예정",
		time: "14:30",
	},
	{
		date: "오늘",
		id: "visit-2",
		label: "피부 상담",
		place: "오노라 클리닉 한남",
		status: "확정",
		time: "18:00",
	},
];

const upcomingReservations: ReservationPreview[] = [
	{
		date: "5월 8일",
		id: "upcoming-1",
		label: "스튜디오 촬영 상담",
		place: "무드 스튜디오",
		status: "예약 요청",
		time: "11:00",
	},
	{
		date: "5월 10일",
		id: "upcoming-2",
		label: "필라테스 체험",
		place: "바른핏 센터",
		status: "확정",
		time: "09:30",
	},
];

const renderReservationCard = (reservation: ReservationPreview) => (
	<View key={reservation.id} style={styles.reservationCard}>
		<View style={styles.reservationHeader}>
			<Text style={styles.reservationDate}>{reservation.date}</Text>
			<Text style={styles.statusBadge}>{reservation.status}</Text>
		</View>
		<Text style={styles.reservationTitle}>{reservation.label}</Text>
		<Text style={styles.reservationMeta}>
			{reservation.time} · {reservation.place}
		</Text>
	</View>
);

export default observer(function HomeScreen() {
	const router = useRouter();
	const tabState = useLocalObservable<{ selectedTab: HomeTab }>(() => ({
		selectedTab: "home",
	}));

	const onPressLogoutButton = async () => {
		await mobileAuthStore.logout();
		router.replace("/auth/login" as Href);
	};

	return (
		<ScreenFrame backgroundColor="#0c0f0b" contentStyle={styles.root}>
			<ScrollView
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				{tabState.selectedTab === "home" && (
					<View style={styles.tabContent}>
						<View style={styles.hero}>
							<Text style={styles.eyebrow}>오노라</Text>
							<Text style={styles.heroTitle}>오늘의 예약을 한눈에</Text>
							<Text style={styles.heroDescription}>
								방문 일정과 예약 상태를 오노라에서 바로 확인하세요.
							</Text>
						</View>

						<View style={styles.summaryGrid}>
							<View style={styles.summaryCard}>
								<Text style={styles.summaryValue}>2</Text>
								<Text style={styles.summaryLabel}>오늘 방문</Text>
							</View>
							<View style={styles.summaryCard}>
								<Text style={styles.summaryValue}>4</Text>
								<Text style={styles.summaryLabel}>예정 예약</Text>
							</View>
						</View>

						<View style={styles.section}>
							<Text style={styles.sectionTitle}>오늘 일정</Text>
							{todayReservations.map(renderReservationCard)}
						</View>
					</View>
				)}

				{tabState.selectedTab === "reservations" && (
					<View style={styles.tabContent}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>내 예약</Text>
							<Text style={styles.sectionDescription}>
								요청부터 확정까지 다가오는 예약을 확인합니다.
							</Text>
						</View>
						{upcomingReservations.map(renderReservationCard)}
					</View>
				)}

				{tabState.selectedTab === "profile" && (
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
				)}
			</ScrollView>

			<View style={styles.bottomTabs}>
				<Tabs options={mainTabs} path="selectedTab" state={tabState} />
			</View>
		</ScreenFrame>
	);
});

const styles = StyleSheet.create({
	bottomTabs: {
		backgroundColor: "#111310",
		borderTopColor: "#2c3128",
		borderTopWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	contentContainer: {
		padding: 20,
		paddingBottom: 28,
	},
	eyebrow: {
		color: "#f59e0b",
		fontSize: 14,
		fontWeight: "700",
	},
	hero: {
		backgroundColor: "#181712",
		borderColor: "#353126",
		borderRadius: 20,
		borderWidth: 1,
		gap: 10,
		padding: 20,
	},
	heroDescription: {
		color: "#d6d3c7",
		fontSize: 15,
		lineHeight: 22,
	},
	heroTitle: {
		color: "#fffaf0",
		fontSize: 28,
		fontWeight: "800",
		lineHeight: 34,
	},
	profileCard: {
		backgroundColor: "#181712",
		borderColor: "#353126",
		borderRadius: 18,
		borderWidth: 1,
		gap: 16,
		padding: 18,
	},
	reservationCard: {
		backgroundColor: "#151a16",
		borderColor: "#2e382f",
		borderRadius: 16,
		borderWidth: 1,
		gap: 8,
		padding: 16,
	},
	reservationDate: {
		color: "#86efac",
		fontSize: 13,
		fontWeight: "700",
	},
	reservationHeader: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	reservationMeta: {
		color: "#d6d3c7",
		fontSize: 14,
	},
	reservationTitle: {
		color: "#fffaf0",
		fontSize: 17,
		fontWeight: "700",
	},
	root: {
		backgroundColor: "#0c0f0b",
		flex: 1,
	},
	section: {
		gap: 12,
	},
	sectionDescription: {
		color: "#a8a29e",
		fontSize: 14,
		lineHeight: 21,
	},
	sectionHeader: {
		gap: 6,
	},
	sectionTitle: {
		color: "#fffaf0",
		fontSize: 22,
		fontWeight: "800",
	},
	sessionLabel: {
		color: "#a8a29e",
		fontSize: 14,
	},
	sessionRow: {
		alignItems: "center",
		backgroundColor: "#111310",
		borderRadius: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 14,
	},
	sessionValue: {
		color: "#86efac",
		fontSize: 14,
		fontWeight: "700",
	},
	statusBadge: {
		backgroundColor: "#7c2d12",
		borderRadius: 999,
		color: "#ffedd5",
		fontSize: 12,
		fontWeight: "700",
		overflow: "hidden",
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	summaryCard: {
		backgroundColor: "#151a16",
		borderColor: "#2e382f",
		borderRadius: 16,
		borderWidth: 1,
		flex: 1,
		gap: 4,
		padding: 16,
	},
	summaryGrid: {
		flexDirection: "row",
		gap: 12,
	},
	summaryLabel: {
		color: "#a8a29e",
		fontSize: 13,
	},
	summaryValue: {
		color: "#fffaf0",
		fontSize: 26,
		fontWeight: "800",
	},
	tabContent: {
		gap: 18,
	},
});
