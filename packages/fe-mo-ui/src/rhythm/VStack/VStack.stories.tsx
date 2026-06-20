import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "./index";

const meta = {
	title: "rhythm/VStack",
	component: VStack,
	args: {
		alignItems: "stretch",
		fullWidth: true,
		gap: "section",
		justifyContent: "start",
	},
	argTypes: {
		alignItems: {
			control: "select",
			options: ["start", "center", "end", "stretch", "baseline"],
		},
		gap: {
			control: "select",
			options: [
				"flush",
				"dense",
				"inline",
				"block",
				"section",
				"page",
				"roomy",
			],
		},
		justifyContent: {
			control: "select",
			options: ["start", "center", "end", "between", "around", "evenly"],
		},
	},
	parameters: {
		layout: "centered",
	},
	render: (args) => (
		<VStack {...args} className="w-[260px]">
			<View className="rounded-xl bg-content1 p-4">
				<Text className="text-base font-bold text-foreground">예약 상태</Text>
			</View>
			<View className="rounded-xl bg-content1 p-4">
				<Text className="text-sm text-muted">다음 행동을 안내합니다.</Text>
			</View>
			<View className="rounded-xl bg-content1 p-4">
				<Text className="text-sm text-muted">필요한 정보만 묶습니다.</Text>
			</View>
		</VStack>
	),
} satisfies Meta<typeof VStack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
