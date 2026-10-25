import type { Meta, StoryObj } from "@storybook/react-native";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { DateStripOption } from "../../input/DateStrip";
import type { BookingClassFeedItem } from "../../widget/BookingClassCard";
import {
	ReservationHomeScreen,
	type ReservationHomeFilterValue,
} from "./ReservationHomeScreen";
import { useStorybookState } from "../../storybook";

function createReservationHomeStoryState() {
	return makeAutoObservable(
		{
			selectedDate: "2026-05-13",
			selectedFilter: "all" as ReservationHomeFilterValue,
			policyItemId: null as string | null,
			memoValue: "",
			selectDate(value: string) { this.selectedDate = value; },
			selectFilter(value: "all" | "bookable" | "mine" | "waitlist") { this.selectedFilter = value; },
			openPolicy(itemId: string) { this.policyItemId = itemId; },
			closePolicy() { this.policyItemId = null; },
			setMemo(value: string) { this.memoValue = value; },
		},
		{},
		{ autoBind: true, name: "ReservationHomeScreenStoryState" },
	);
}

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
	render: () => <ReservationHomeStory />,
};

const ReservationHomeStory = observer(function ReservationHomeStory() {
	const state = useLocalObservable(createReservationHomeStoryState);
	useStorybookState(() => ({
		memoValue: state.memoValue,
		policyItemId: state.policyItemId,
		selectedDate: state.selectedDate,
		selectedFilter: state.selectedFilter,
	}));
	const visibleCardItems = cardItems.filter((item) => {
		if (state.selectedFilter === "bookable") return (item.availableCount ?? 0) > 0;
		if (state.selectedFilter === "mine") return item.id === "home-reformer";
		return true;
	});
	const selectedDateLabel = dateOptions.find((option) => option.value === state.selectedDate);
	return (
		<ReservationHomeScreen
			bookingWindowDays={14}
			cardItems={visibleCardItems}
			dateOptions={dateOptions}
			feedStatus="ready"
			filterOptions={[
				{ label: "전체", value: "all" },
				{ label: "예약 가능", value: "bookable" },
				{ label: "내 예약", value: "mine" },
				{ label: "대기 가능", value: "waitlist" },
			]}
			onPressBookingCta={(item) => state.openPolicy(item.id)}
			onPressFilter={state.selectFilter}
			onSelectDate={(value) => state.selectDate(value)}
			policySheet={{
				isOpen: state.policyItemId !== null,
				item: cardItems.find((item) => item.id === state.policyItemId) ?? null,
				memoValue: state.memoValue,
				onCancel: state.closePolicy,
				onChangeMemo: state.setMemo,
				onConfirm: state.closePolicy,
			}}
			reservedCount={1}
			selectedDate={state.selectedDate}
			selectedDateLabel={selectedDateLabel ? `${selectedDateLabel.value} · ${selectedDateLabel.dayLabel}` : "선택한 날짜"}
			selectedFilter={state.selectedFilter}
		/>
);
});
