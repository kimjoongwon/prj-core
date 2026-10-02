import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../../rhythm";
import { PressableFeedback } from "./index";

const meta = {
	title: "input/PressableFeedback",
	component: PressableFeedback,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof PressableFeedback>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<View className="w-[280px] rounded-xl border border-border bg-surface p-4">
			<PressableFeedback className="rounded-xl bg-accent px-4 py-3">
				<Text align="center" className="text-accent-foreground" variant="label">
					눌림 피드백
				</Text>
			</PressableFeedback>
		</View>
	),
};

export const Composition: Story = {
	render: () => (
		<VStack
			className="w-[280px] rounded-xl border border-border bg-surface p-4"
			gap="block"
		>
			<PressableFeedback className="relative rounded-xl border border-border bg-surface-secondary p-4">
				<PressableFeedback.Highlight />
				<PressableFeedback.Ripple />
				<PressableFeedback.Scale>
					<VStack gap="dense">
						<Text variant="label">복합 피드백</Text>
						<Text tone="muted">
							Highlight, Ripple, Scale slot을 함께 조합합니다.
						</Text>
					</VStack>
				</PressableFeedback.Scale>
			</PressableFeedback>
			<PressableFeedback
				className="rounded-xl border border-border p-4"
				isDisabled
			>
				<Text tone="muted" variant="label">
					비활성 상태
				</Text>
			</PressableFeedback>
		</VStack>
	),
};
