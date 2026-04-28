import type { Meta, StoryObj } from "@storybook/react";
import { AuthAuditLogListPage } from "./AuthAuditLogListPage";

const defaultArgs = {
	isLoading: false,
	logs: [
		{
			email: "member1@example.com",
			failureReason: "스토리북에서 확인할 failure reason 예시입니다.",
			id: "item-1",
			ipAddress: "ip-address-1",
			occurredAt: "2026-04-14T09:00:00.000Z",
			result: "result-1",
			userAgent: "user-agent-1",
		},
		{
			email: "member1@example.com",
			failureReason: "스토리북에서 확인할 failure reason 예시입니다.",
			id: "item-1",
			ipAddress: "ip-address-1",
			occurredAt: "2026-04-14T09:00:00.000Z",
			result: "result-1",
			userAgent: "user-agent-1",
		},
	],
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: (..._args: never[]) => undefined,
	stats: {
		todayFailureCount: 12,
		todayLockedCount: 12,
		todaySuccessCount: 12,
		totalCount: 12,
	},
	totalCount: 12,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	logs: [],
	totalCount: 0,
	stats: { total: 0, active: 0, inactive: 0 },
};

const meta = {
	component: AuthAuditLogListPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AuthAuditLogListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
