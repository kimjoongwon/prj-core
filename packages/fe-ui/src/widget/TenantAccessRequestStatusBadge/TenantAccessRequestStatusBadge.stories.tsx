import type { Meta, StoryObj } from "@storybook/react";
import { TenantAccessRequestStatusBadge } from "./TenantAccessRequestStatusBadge";

const meta = {
	title: "widget/TenantAccessRequestStatusBadge",
	component: TenantAccessRequestStatusBadge,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { status: "PENDING" },
} satisfies Meta<typeof TenantAccessRequestStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Pending: Story = {};
export const Approved: Story = { args: { status: "APPROVED" } };
export const Rejected: Story = { args: { status: "REJECTED" } };
