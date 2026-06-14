import type { Meta, StoryObj } from "@storybook/react";
import { AccountListScreen } from "./AccountListScreen";

const defaultArgs = {
	accounts: [
		{
			email: "member1@example.com",
			failedLoginAttempts: 1,
			id: "item-1",
			isActive: false,
			isPermanentlyLocked: false,
			lastLoginAt: "2026-04-14T09:00:00.000Z",
			lockedUntil: "locked-until-1",
		},
		{
			email: "member1@example.com",
			failedLoginAttempts: 1,
			id: "item-1",
			isActive: false,
			isPermanentlyLocked: false,
			lastLoginAt: "2026-04-14T09:00:00.000Z",
			lockedUntil: "locked-until-1",
		},
	],
	isLoading: false,
	isUnlocking: false,
	onConfirmUnlockAccount: (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: (..._args: never[]) => undefined,
	totalCount: 12,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	accounts: [],
	totalCount: 0,
};

const meta = {
	component: AccountListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AccountListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
