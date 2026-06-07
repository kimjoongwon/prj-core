import type { Meta, StoryObj } from "@storybook/react";
import { Description } from "./Description";

const meta: Meta<typeof Description> = {
	title: "control/Description",
	component: Description,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
