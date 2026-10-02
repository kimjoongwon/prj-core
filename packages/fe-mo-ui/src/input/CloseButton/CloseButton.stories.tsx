import type { Meta, StoryObj } from "@storybook/react-native";
import { Text } from "../../data-display/Text";
import { HStack, VStack } from "../../rhythm";
import { CloseButton } from "./index";

const meta = {
	title: "input/CloseButton",
	component: CloseButton,
	args: {
		accessibilityLabel: "닫기",
		size: "sm",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
	},
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof CloseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<VStack alignItems="center" gap="section">
			<Text className="text-sm font-semibold text-muted">Close actions</Text>
			<HStack
				alignItems="center"
				className="rounded-lg border border-border bg-surface p-3"
				gap="block"
			>
				<CloseButton accessibilityLabel="작게 닫기" size="sm" />
				<CloseButton accessibilityLabel="기본 닫기" size="md" />
				<CloseButton accessibilityLabel="크게 닫기" size="lg" />
			</HStack>
		</VStack>
	),
};
