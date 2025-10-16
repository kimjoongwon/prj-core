import type { Meta, StoryObj } from "@storybook/react";
import { BooleanCell } from "./BooleanCell";

const meta: Meta<typeof BooleanCell> = {
	title: "Cell/BooleanCell",
	component: BooleanCell,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: [true, false, null, undefined],
			description: "Boolean value to display",
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: true,
	},
};

export const True: Story = {
	args: {
		value: true,
	},
};

export const False: Story = {
	args: {
		value: false,
	},
};

export const Null: Story = {
	args: {
		value: null,
	},
};

export const Undefined: Story = {
	args: {
		value: undefined,
	},
};
