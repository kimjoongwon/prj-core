import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Separator } from "./index";

const meta = {
	title: "layout/Separator",
	component: Separator,
	args: {
		orientation: "horizontal",
		variant: "thin",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
		variant: {
			control: "select",
			options: ["thin", "thick"],
		},
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Examples: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">
					Separator
				</Text>
				<Text className="text-sm leading-5 text-muted">
					관련 정보 사이에 낮은 강도의 구분선을 넣습니다.
				</Text>
			</View>
			<View className="gap-3 rounded-lg border border-border bg-surface p-4">
				<Text className="text-sm font-bold text-foreground">예약 정보</Text>
				<Separator />
				<Text className="text-sm leading-5 text-muted">5월 23일 09:30</Text>
				<View className="h-8 flex-row items-center gap-3">
					<Text className="text-sm text-foreground">Studio A</Text>
					<Separator orientation="vertical" />
					<Text className="text-sm text-foreground">Hana coach</Text>
				</View>
				<Separator variant="thick" />
			</View>
		</ScrollView>
	),
};
