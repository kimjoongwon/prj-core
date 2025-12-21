import type { Meta, StoryObj } from "@storybook/react";
import { NumberCell } from "./NumberCell";

const meta: Meta<typeof NumberCell> = {
	title: "Cell/NumberCell",
	component: NumberCell,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "number",
			description: "Number or string value to display",
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 1234,
	},
};

export const WithInteger: Story = {
	args: {
		value: 42,
	},
};

export const WithLargeNumber: Story = {
	args: {
		value: 1234567890,
	},
};

export const WithDecimal: Story = {
	args: {
		value: 123.45,
	},
};

export const WithZero: Story = {
	args: {
		value: 0,
	},
};

export const WithNegative: Story = {
	args: {
		value: -123456,
	},
};

export const WithStringNumber: Story = {
	args: {
		value: "9876543",
	},
};

export const WithInvalidString: Story = {
	args: {
		value: "not a number",
	},
};

export const WithNull: Story = {
	args: {
		value: null,
	},
};

export const WithUndefined: Story = {
	args: {
		value: undefined,
	},
};
