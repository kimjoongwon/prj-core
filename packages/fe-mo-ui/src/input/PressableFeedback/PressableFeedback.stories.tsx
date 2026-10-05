import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Typography } from "../../data-display/Typography";
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
				<Typography align="center" className="text-accent-foreground" type="body-sm" weight="semibold">
					눌림 피드백
				</Typography>
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
						<Typography type="body-sm" weight="semibold">복합 피드백</Typography>
						<Typography color="muted" type="body-sm">
							Highlight, Ripple, Scale slot을 함께 조합합니다.
						</Typography>
					</VStack>
				</PressableFeedback.Scale>
			</PressableFeedback>
			<PressableFeedback
				className="rounded-xl border border-border p-4"
				isDisabled
			>
				<Typography color="muted" type="body-sm" weight="semibold">
					비활성 상태
				</Typography>
			</PressableFeedback>
		</VStack>
	),
};
