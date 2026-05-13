import type { Meta, StoryObj } from "@storybook/react-native";
import { MyReservationsScreen } from "./MyReservationsScreen";

const meta = {
	title: "screen/MyReservationsScreen",
	component: MyReservationsScreen,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof MyReservationsScreen>;

export default meta;

type Story = StoryObj;

export const Ready: Story = {
	render: () => (
		<MyReservationsScreen
			items={[
				{
					dateLabel: "2026.05.13 09:30",
					id: "reservation-1",
					memo: "상체 강도는 낮춰 주세요.",
					metaLabel: "Studio A · Coach Hana",
					statusLabel: "예약 확정",
					title: "Morning Reformer",
				},
				{
					dateLabel: "2026.05.16 11:00",
					id: "reservation-2",
					metaLabel: "Studio B · Coach Jin",
					statusLabel: "대기 2번",
					title: "Weekend Barre",
				},
			]}
			status="ready"
		/>
	),
};

export const Empty: Story = {
	render: () => <MyReservationsScreen items={[]} status="empty" />,
};
