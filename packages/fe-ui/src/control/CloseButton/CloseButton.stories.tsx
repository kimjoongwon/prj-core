import type { Meta, StoryObj } from "@storybook/react";
import { CloseButton } from "./CloseButton";

const meta: Meta<typeof CloseButton> = {
	title: "Controls/CloseButton",
	component: CloseButton,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
