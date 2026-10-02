import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView } from "react-native";
import { Text } from "../../data-display/Text";
import { HStack, VStack } from "../../rhythm";
import { PureRadio as Radio } from "./index";

const meta = {
	title: "input/Radio",
	component: Radio,
	args: {
		isSelected: true,
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="section">
				<VStack gap="block">
					<Text className="text-lg font-extrabold text-foreground">Radio</Text>
					<Text className="text-sm leading-5 text-muted">
						단독 radio primitive 또는 RadioGroup 내부 indicator로 사용합니다.
					</Text>
				</VStack>
				<VStack
					className="rounded-lg border border-border bg-surface p-4"
					gap="block"
				>
					<HStack alignItems="center" gap="block">
						<Radio isSelected />
						<Text className="text-sm font-semibold text-foreground">
							SMS 알림
						</Text>
					</HStack>
					<HStack alignItems="center" gap="block">
						<Radio />
						<Text className="text-sm font-semibold text-foreground">앱 푸시</Text>
					</HStack>
					<HStack alignItems="center" className="opacity-50" gap="block">
						<Radio isDisabled />
						<Text className="text-sm font-semibold text-foreground">이메일</Text>
					</HStack>
				</VStack>
			</VStack>
		</ScrollView>
	),
};
