import type { Meta, StoryObj } from "@storybook/react";
import { NumberField } from "./NumberField";

const meta: Meta<typeof NumberField> = {
	title: "Controls/NumberField",
	component: NumberField,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
