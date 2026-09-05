import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AccountListScreen } from "./AccountListScreen";

const defaultArgs: ComponentProps<typeof AccountListScreen> = {
	accounts: [
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			name: "운영 계정",
			mustChangePassword: false,
			email: "member1@example.com",
			failedLoginAttempts: 1,
			id: 1n,
			isActive: false,
			isPermanentlyLocked: false,
			lastLoginAt: new Date("2026-04-14T09:00:00.000Z"),
			lockedUntil: new Date("locked-until-1"),
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			name: "운영 계정",
			mustChangePassword: false,
			email: "member1@example.com",
			failedLoginAttempts: 1,
			id: 1n,
			isActive: false,
			isPermanentlyLocked: false,
			lastLoginAt: new Date("2026-04-14T09:00:00.000Z"),
			lockedUntil: new Date("locked-until-1"),
		},
	],
	isLoading: false,
	onClickUnlockAccountButton: () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: async () => new URLSearchParams(),
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
	title: "screen/AccountListScreen",
	component: AccountListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		accounts: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof AccountListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
