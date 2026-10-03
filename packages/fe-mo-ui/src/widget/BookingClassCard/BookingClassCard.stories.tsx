import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { BookingClassCard, type BookingClassFeedItem } from "./index";

const item: BookingClassFeedItem = {
	availableCount: 3,
	capacity: 12,
	coachName: "Hana",
	confirmedCount: 9,
	id: "class-morning-reformer",
	level: "Intermediate",
	previewExerciseTags: ["core", "balance", "mobility"],
	programName: "Morning Reformer",
	routineLabel: "50분",
	sessionName: "Tower + Reformer",
	status: "FEW_LEFT",
	statusLabel: "마감 임박",
	timeLabel: "09:30",
	timelineName: "Studio A",
};

const reservedItem: BookingClassFeedItem = {
	capacity: 10,
	coachName: "Jin",
	confirmedCount: 10,
	id: "class-evening-barre",
	myReservationStatus: "예약 확정",
	previewExerciseTags: ["barre", "stretch"],
	programName: "Evening Barre",
	sessionName: "Balance Flow",
	status: "RESERVED",
	statusLabel: "예약됨",
	timeLabel: "19:00",
	timelineName: "Studio B",
};

const meta = {
	title: "widget/BookingClassCard",
	component: BookingClassCard,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof BookingClassCard>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					BookingClassCard
				</Typography>
				<Typography color="muted" type="body-sm">
					예약 피드에서 수업 정보, 잔여석, 예약 상태, CTA를 표시합니다.
				</Typography>
			</View>
			<BookingClassCard item={item} onPressCta={() => undefined} />
			<BookingClassCard item={reservedItem} onPressCta={() => undefined} />
		</ScrollView>
	),
};
