import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { InquiryListScreen } from "./InquiryListScreen";

const defaultArgs: ComponentProps<typeof InquiryListScreen> = {
	activeStatus: "샘플 active status 1",
	inquiries: [
		{
			removedAt: null,
			inquiryNumber: "INQ-20260414-001",
			source: "ONLINE",
			isSlaResponseBreached: false,
			isSlaResolveBreached: false,
			isRealtimeChat: false,
			firstResponseAt: null,
			resolvedAt: null,
			closedAt: null,
			slaResponseDue: null,
			slaResolveDue: null,
			lastMessageAt: null,
			category: "GENERAL",
			channel: "WEB",
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			id: "ENQ00000000000000000000001",
			priority: "LOW",
			sentiment: "POSITIVE",
			status: "NEW",
			title: "샘플 title",
			unreadCount: 12,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		{
			removedAt: null,
			inquiryNumber: "INQ-20260414-001",
			source: "ONLINE",
			isSlaResponseBreached: false,
			isSlaResolveBreached: false,
			isRealtimeChat: false,
			firstResponseAt: null,
			resolvedAt: null,
			closedAt: null,
			slaResponseDue: null,
			slaResolveDue: null,
			lastMessageAt: null,
			category: "GENERAL",
			channel: "WEB",
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			id: "ENQ00000000000000000000002",
			priority: "LOW",
			sentiment: "POSITIVE",
			status: "NEW",
			title: "샘플 title",
			unreadCount: 12,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
	],
	onClickInquiryRow: () => undefined,
	onClickNewInquiry: () => undefined,
	onClickStatusFilter: () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", inquiryStatus: "" },
	setQueryStates: async () => new URLSearchParams(),
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

const emptyStateArgs = {
	...defaultArgs,
	inquiries: [],
	totalCount: 0,
	stats: { total: 0, newCount: 0, inProgress: 0, resolved: 0, slaBreached: 0 },
};

const meta = {
	title: "screen/InquiryListScreen",
	component: InquiryListScreen,
	// Date 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		inquiries: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof InquiryListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
