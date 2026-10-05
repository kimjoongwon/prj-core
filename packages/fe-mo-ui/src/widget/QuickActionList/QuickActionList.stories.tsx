import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { QuickActionList } from "./QuickActionList";

const meta = {
	title: "widget/QuickActionList",
	component: QuickActionList,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof QuickActionList>;

export default meta;

type Story = StoryObj<typeof QuickActionList>;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					QuickActionList
				</Typography>
				<Typography color="muted" type="body-sm">
					자주 쓰는 이동을 compact list로 제공합니다.
				</Typography>
			</View>
			<QuickActionList
				items={[
					{
						description: "예약 확정과 대기 상태를 확인합니다.",
						iconName: "calendarCheck",
						id: "reservations",
						label: "내 예약",
						onPress: () => undefined,
					},
					{
						description: "예약 알림과 앱 설정 관리는 다음 단계에서 제공합니다.",
						disabled: true,
						iconName: "info",
						id: "settings",
						label: "알림/설정",
					},
				]}
			/>
		</ScrollView>
	),
};
