import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, Text, View } from "react-native";
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
				<Text className="text-lg font-extrabold text-foreground">Alert</Text>
				<Text className="text-sm leading-5 text-muted">
					짧은 안내문이나 주의 메시지를 표시합니다.
				</Text>
			</View>
			<Alert>
				<Text>수업 시작 3시간 전까지 예약을 취소할 수 있습니다.</Text>
			</Alert>
		</ScrollView>
	),
};
