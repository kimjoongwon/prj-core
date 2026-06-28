import type { Meta, StoryObj } from "@storybook/react";
import { IdentityDashboardScreen } from "./IdentityDashboardScreen";

const defaultArgs = {
	stats: {
		activeClientCount: 12,
		activeSessionCount: 12,
		lockedAccountCount: 12,
		todayFailureCount: 12,
		todayLockedCount: 12,
		todaySuccessCount: 12,
	},
	trendItems: [
		{
			date: "2026-04-14T09:00:00.000Z",
			failureCount: 12,
			successCount: 12,
		},
		{
			date: "2026-04-14T09:00:00.000Z",
			failureCount: 12,
			successCount: 12,
		},
	],
};

const emptyStateArgs = {
	...defaultArgs,
	trendItems: [],
	stats: { total: 0, active: 0, inactive: 0 },
};

const meta = {
	title: "screen/IdentityDashboardScreen",
	component: IdentityDashboardScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof IdentityDashboardScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
