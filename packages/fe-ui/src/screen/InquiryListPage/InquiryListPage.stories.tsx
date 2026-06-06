import type { Meta, StoryObj } from "@storybook/react";
import { InquiryListPage } from "./InquiryListPage";

const defaultArgs = {
	activeStatus: "샘플 active status 1",
	inquiries: [
		{
			assigneeId: "assignee-1",
			assigneeName: "샘플 assignee name 1",
			category: "GENERAL",
			channel: "WEB",
			createdAt: "2026-04-14T09:00:00.000Z",
			customerId: "customer-1",
			customerName: "샘플 customer name 1",
			id: "item-1",
			priority: "LOW",
			sentiment: "POSITIVE",
			slaRemainingMinutes: 15,
			slaStatus: "ok",
			status: "NEW",
			title: "샘플 title",
			unreadCount: 12,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		{
			assigneeId: "assignee-1",
			assigneeName: "샘플 assignee name 1",
			category: "GENERAL",
			channel: "WEB",
			createdAt: "2026-04-14T09:00:00.000Z",
			customerId: "customer-1",
			customerName: "샘플 customer name 1",
			id: "item-1",
			priority: "LOW",
			sentiment: "POSITIVE",
			slaRemainingMinutes: 15,
			slaStatus: "ok",
			status: "NEW",
			title: "샘플 title",
			unreadCount: 12,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
	],
	isLoading: false,
	onClickInquiryRow: (..._args: never[]) => undefined,
	onClickNewInquiry: (..._args: never[]) => undefined,
	onClickStatusFilter: (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: (..._args: never[]) => undefined,
	stats: {
		inProgress: 1,
		newCount: 12,
		resolved: 1,
		slaBreached: 1,
		total: 12,
	},
	statusOptions: [
		{ label: "신규", value: "NEW" },
		{ label: "진행중", value: "IN_PROGRESS" },
		{ label: "고객대기", value: "WAITING_CUSTOMER" },
		{ label: "해결", value: "RESOLVED" },
		{ label: "종료", value: "CLOSED" },
	],
	totalCount: 12,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	inquiries: [],
	totalCount: 0,
	stats: { total: 0, active: 0, inactive: 0 },
};

const meta = {
	component: InquiryListPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof InquiryListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
