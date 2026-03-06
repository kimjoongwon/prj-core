import type { Meta, StoryObj } from "@storybook/react";
import { InquiryChannelSelect } from "./InquiryChannelSelect";

const meta: Meta<typeof InquiryChannelSelect> = {
	title: "Inputs/InquiryChannelSelect",
	component: InquiryChannelSelect,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InquiryChannelSelect>;

export const Default: Story = {
	args: {
		label: "접수 채널",
	},
};

export const WithValue: Story = {
	args: {
		label: "접수 채널",
		value: "PHONE",
	},
};

export const Required: Story = {
	args: {
		label: "접수 채널",
		isRequired: true,
	},
};

export const Disabled: Story = {
	args: {
		label: "접수 채널",
		value: "EMAIL",
		isDisabled: true,
	},
};
