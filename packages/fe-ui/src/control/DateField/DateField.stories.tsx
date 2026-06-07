import type { Meta, StoryObj } from "@storybook/react";
import { DateField } from "./DateField";

const meta: Meta<typeof DateField> = {
	title: "control/DateField",
	component: DateField,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
