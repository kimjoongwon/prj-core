import type { Meta, StoryObj } from "@storybook/react";
import { FeeTable } from "./FeeTable";

const meta = {
	title: "UI/FeeTable",
	component: FeeTable,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof FeeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		items: [
			{ day: "Tue", time: "7AM - 8 AM", fee: 12 },
			{ day: "Wed", time: "7AM - 8 AM", fee: 12 },
			{ day: "Fri", time: "7AM - 8 AM", fee: 12 },
		],
	},
};

export const WithTotal: Story = {
	args: {
		items: [
			{ day: "Tue", time: "7AM - 8 AM", fee: 12 },
			{ day: "Wed", time: "7AM - 8 AM", fee: 12 },
			{ day: "Fri", time: "7AM - 8 AM", fee: 12 },
		],
		total: 36,
	},
};
