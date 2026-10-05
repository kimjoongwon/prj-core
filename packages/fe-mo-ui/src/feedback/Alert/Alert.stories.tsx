import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Alert } from "./index";

const meta = {
	title: "feedback/Alert",
	component: Alert,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">Alert</Typography>
				<Typography color="muted" type="body-sm">
					짧은 안내문이나 주의 메시지를 표시합니다.
				</Typography>
			</View>
			<Alert>
				<Typography type="body-sm">
					수업 시작 3시간 전까지 예약을 취소할 수 있습니다.
				</Typography>
			</Alert>
		</ScrollView>
	),
};
