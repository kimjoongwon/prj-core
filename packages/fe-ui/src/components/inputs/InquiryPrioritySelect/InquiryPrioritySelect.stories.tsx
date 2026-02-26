import type { Meta, StoryObj } from "@storybook/react";
import { InquiryPrioritySelect } from "./InquiryPrioritySelect";

const meta: Meta<typeof InquiryPrioritySelect> = {
	title: "Inputs/InquiryPrioritySelect",
	component: InquiryPrioritySelect,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InquiryPrioritySelect>;

export const Default: Story = {
	args: {
		label: "우선순위",
	},
};

export const WithValue: Story = {
	args: {
		label: "우선순위",
		value: "HIGH",
	},
};

export const Required: Story = {
	args: {
		label: "우선순위",
		isRequired: true,
	},
};

export const Disabled: Story = {
	args: {
		label: "우선순위",
		value: "URGENT",
		isDisabled: true,
	},
};
