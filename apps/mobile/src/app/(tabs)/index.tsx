import { ScreenFrame } from "@cocrepo/mo-ui";
import { observer } from "mobx-react-lite";
import { ScrollView, Text, View } from "react-native";
import {
	todayReservations,
	type ReservationPreview,
} from "@/tabs/reservation-data";
import { mainTabStyles as styles } from "@/tabs/main-tab-styles";

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

export default observer(function HomeTabRoute() {
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
			</ScrollView>
		</ScreenFrame>
	);
});
