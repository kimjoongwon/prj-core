import type { Meta, StoryObj } from "@storybook/react";
import { BackButton } from "./BackButton";

const meta = {
	title: "widget/BackButton",
	component: BackButton,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { onClick: () => undefined },
} satisfies Meta<typeof BackButton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const IconOnly: Story = { args: { iconOnly: true } };
