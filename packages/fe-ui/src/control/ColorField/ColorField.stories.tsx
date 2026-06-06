import type { Meta, StoryObj } from "@storybook/react";
import { ColorField } from "./ColorField";

const meta: Meta<typeof ColorField> = {
	title: "Controls/ColorField",
	component: ColorField,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
