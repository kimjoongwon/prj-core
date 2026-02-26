import type { Meta, StoryObj } from "@storybook/react";
import { InquiryCategorySelect } from "./InquiryCategorySelect";

const meta: Meta<typeof InquiryCategorySelect> = {
	title: "Inputs/InquiryCategorySelect",
	component: InquiryCategorySelect,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InquiryCategorySelect>;

export const Default: Story = {
	args: {
		label: "카테고리",
	},
};

export const WithValue: Story = {
	args: {
		label: "카테고리",
		value: "DELIVERY",
	},
};

export const Required: Story = {
	args: {
		label: "카테고리",
		isRequired: true,
	},
};

export const Disabled: Story = {
	args: {
		label: "카테고리",
		value: "PAYMENT",
		isDisabled: true,
	},
};
