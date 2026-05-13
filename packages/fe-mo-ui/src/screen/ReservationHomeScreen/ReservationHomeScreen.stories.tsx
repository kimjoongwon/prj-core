import type { Meta, StoryObj } from "@storybook/react-native";
import type { BookingClassFeedItem } from "../../data-display/BookingClassCard";
import type { DateStripOption } from "../../selection/DateStrip";
import { ReservationHomeScreen } from "./ReservationHomeScreen";

const dateOptions: DateStripOption[] = [
	{
		badge: "오늘",
		count: 6,
		dateLabel: "13",
		dayLabel: "수",
		value: "2026-05-13",
	},
	{
		count: 3,
		dateLabel: "14",
		dayLabel: "목",
		value: "2026-05-14",
	},
	{
		count: 7,
		dateLabel: "16",
		dayLabel: "토",
		value: "2026-05-16",
	},
];

const cardItems: BookingClassFeedItem[] = [
	{
		availableCount: 3,
		capacity: 12,
		coachName: "Hana",
		confirmedCount: 9,
		id: "home-reformer",
		level: "Intermediate",
		previewExerciseTags: ["core", "balance"],
		programName: "Morning Reformer",
		routineLabel: "50분",
		sessionName: "Tower + Reformer",
		status: "FEW_LEFT",
		statusLabel: "마감 임박",
		timeLabel: "09:30",
		timelineName: "Studio A",
	},
	{
		availableCount: 8,
		capacity: 14,
		coachName: "Jin",
		confirmedCount: 6,
		id: "home-barre",
		level: "All level",
		previewExerciseTags: ["barre", "stretch"],
		programName: "Evening Barre",
		sessionName: "Balance Flow",
		status: "AVAILABLE",
		statusLabel: "예약 가능",
		timeLabel: "19:00",
		timelineName: "Studio B",
	},
];

const meta = {
	title: "screen/ReservationHomeScreen",
	component: ReservationHomeScreen,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ReservationHomeScreen>;

export default meta;

type Story = StoryObj;

export const Ready: Story = {
	render: () => (
		<ReservationHomeScreen
			bookingWindowDays={14}
			cardItems={cardItems}
			dateOptions={dateOptions}
			feedStatus="ready"
			filterOptions={[
				{ label: "전체", value: "all" },
				{ label: "예약 가능", value: "bookable" },
				{ label: "내 예약", value: "mine" },
				{ label: "대기 가능", value: "waitlist" },
			]}
			onPressBookingCta={() => undefined}
			onPressFilter={() => undefined}
			onSelectDate={() => undefined}
			policySheet={{
				isOpen: false,
				item: null,
			}}
			reservedCount={1}
			selectedDate="2026-05-13"
			selectedDateLabel="5월 13일 수요일"
			selectedFilter="all"
		/>
	),
};
