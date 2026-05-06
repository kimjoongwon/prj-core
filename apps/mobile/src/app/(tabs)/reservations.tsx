import { ScreenFrame } from "@cocrepo/mo-ui";
import { observer } from "mobx-react-lite";
import { ScrollView, Text, View } from "react-native";
import {
	type ReservationPreview,
	upcomingReservations,
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

export default observer(function ReservationsTabRoute() {
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
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>내 예약</Text>
						<Text style={styles.sectionDescription}>
							요청부터 확정까지 다가오는 예약을 확인합니다.
						</Text>
					</View>
					{upcomingReservations.map(renderReservationCard)}
				</View>
			</ScrollView>
		</ScreenFrame>
	);
});
