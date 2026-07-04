import type { Meta, StoryObj } from "@storybook/react";
import { CustomerInfoCard } from "./CustomerInfoCard";

const meta = {
	title: "widget/CustomerInfoCard",
	component: CustomerInfoCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		name: "김온유",
		email: "onyu@example.com",
		phone: "010-1234-5678",
		joinedAt: "2026-07-04",
		inquiryCount: 12,
	},
} satisfies Meta<typeof CustomerInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[360px]">
			<CustomerInfoCard {...args} />
		</div>
	),
};
export const Minimal: Story = {
	args: {
		email: undefined,
		phone: undefined,
		joinedAt: undefined,
		inquiryCount: undefined,
	},
	render: Default.render,
};
