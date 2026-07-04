import type { Meta, StoryObj } from "@storybook/react";
import { TenantAccessRequestSummary } from "./TenantAccessRequestSummary";

const meta = {
	title: "widget/TenantAccessRequestSummary",
	component: TenantAccessRequestSummary,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		spaceName: "강남 스페이스",
		roleName: "운영 관리자",
		requesterName: "김온유",
		requesterEmail: "onyu@example.com",
	},
} satisfies Meta<typeof TenantAccessRequestSummary>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Minimal: Story = {
	args: { requesterName: undefined, requesterEmail: undefined },
};
