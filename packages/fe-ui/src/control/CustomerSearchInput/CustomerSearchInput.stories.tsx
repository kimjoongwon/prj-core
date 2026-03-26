import type { Meta, StoryObj } from "@storybook/react";
import { CustomerSearchInput } from "./CustomerSearchInput";

const meta: Meta<typeof CustomerSearchInput> = {
	title: "Inputs/CustomerSearchInput",
	component: CustomerSearchInput,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CustomerSearchInput>;

const mockCustomers = [
	{
		id: "1",
		name: "홍길동",
		email: "hong@example.com",
		phone: "010-1234-5678",
		label: "홍길동",
		description: "hong@example.com | 010-1234-5678",
	},
	{
		id: "2",
		name: "김철수",
		email: "kim@example.com",
		phone: "010-9876-5432",
		label: "김철수",
		description: "kim@example.com | 010-9876-5432",
	},
	{
		id: "3",
		name: "이영희",
		email: "lee@example.com",
		phone: "010-5555-1234",
		label: "이영희",
		description: "lee@example.com",
	},
];

export const Default: Story = {
	args: {
		label: "고객 검색",
		items: [],
	},
};

export const WithResults: Story = {
	args: {
		label: "고객 검색",
		items: mockCustomers,
	},
};

export const Disabled: Story = {
	args: {
		label: "고객 검색",
		items: mockCustomers,
		isDisabled: true,
	},
};
