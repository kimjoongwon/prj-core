import type { Meta, StoryObj } from "@storybook/react";
import { InquirySourceSelect } from "./InquirySourceSelect";

const meta: Meta<typeof InquirySourceSelect> = {
	title: "Inputs/InquirySourceSelect",
	component: InquirySourceSelect,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InquirySourceSelect>;

export const Default: Story = {
	args: {
		label: "접수 유형",
	},
};

export const WithValue: Story = {
	args: {
		label: "접수 유형",
		value: "OFFLINE",
	},
};

export const Required: Story = {
	args: {
		label: "접수 유형",
		isRequired: true,
	},
};

export const Disabled: Story = {
	args: {
		label: "접수 유형",
		value: "ONLINE",
		isDisabled: true,
	},
};
