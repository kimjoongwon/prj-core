import type { Meta, StoryObj } from "@storybook/react";
import { TypingIndicator } from "./TypingIndicator";

const meta = {
	title: "feedback/TypingIndicator",
	component: TypingIndicator,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { userNames: ["김온유"] },
} satisfies Meta<typeof TypingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleUser: Story = {};
export const MultipleUsers: Story = {
	args: { userNames: ["김온유", "이하늘", "박서준"] },
};
