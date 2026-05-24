import type { Meta, StoryObj } from "@storybook/react-native";
import { Text, View } from "react-native";
import { ScreenFrame } from "./index";

const meta = {
	title: "layout/ScreenFrame",
	component: ScreenFrame,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ScreenFrame>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScreenFrame
			backgroundColor="#09090b"
			contentClassName="justify-center px-4"
			edges={["top", "right", "bottom", "left"]}
		>
			<View className="gap-2 rounded-lg border border-border bg-surface p-4">
				<Text className="text-lg font-extrabold text-foreground">
					ScreenFrame
				</Text>
				<Text className="text-sm leading-5 text-muted">
					안전 영역과 화면 배경을 하나의 native screen frame으로 관리합니다.
				</Text>
			</View>
		</ScreenFrame>
	),
};
