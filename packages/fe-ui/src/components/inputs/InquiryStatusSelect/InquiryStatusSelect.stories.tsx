import type { Meta, StoryObj } from "@storybook/react";
import { InquiryStatusSelect } from "./InquiryStatusSelect";

const meta: Meta<typeof InquiryStatusSelect> = {
	title: "Inputs/InquiryStatusSelect",
	component: InquiryStatusSelect,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InquiryStatusSelect>;

export const Default: Story = {
	args: {
		label: "상태",
	},
};

export const WithValue: Story = {
	args: {
		label: "상태",
		value: "IN_PROGRESS",
	},
};

export const WithTransitionRules: Story = {
	args: {
		label: "상태",
		value: "IN_PROGRESS",
		currentStatus: "OPEN",
		applyTransitionRules: true,
	},
};

export const Disabled: Story = {
	args: {
		label: "상태",
		value: "RESOLVED",
		isDisabled: true,
	},
};
