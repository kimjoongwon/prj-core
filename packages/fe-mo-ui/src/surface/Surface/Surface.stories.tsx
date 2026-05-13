import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, Text, View } from "react-native";
import { Surface } from "./index";

const meta = {
	title: "surface/Surface",
	component: Surface,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Surface</Text>
				<Text className="text-sm leading-5 text-muted">
					화면 배경 위에 놓이는 기본 정보 그룹입니다.
				</Text>
			</View>
			<Surface className="gap-3 rounded-2xl border border-border p-4">
				<Text className="text-base font-extrabold text-foreground">
					Surface
				</Text>
				<Text className="text-sm leading-5 text-muted">
					className 기반 spacing과 border를 스토리북에서도 그대로 확인합니다.
				</Text>
			</Surface>
		</ScrollView>
	),
};
