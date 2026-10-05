import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OidcSessionListScreen } from "./OidcSessionListScreen";

const defaultArgs: ComponentProps<typeof OidcSessionListScreen> = {
	isLoading: false,
	isRevokingAll: false,
	onClickRevokeAllButton: () => undefined,
	onClickRevokeByGrantButton: () => undefined,
	onRevokeSession: () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", modelType: "", accountId: "" },
	sessions: [
		{
			accountId: "account-1",
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			expiresAt: new Date("2026-04-14T09:00:00.000Z"),
			grantId: "grant-1",
			id: 1n,
			key: "session-key-1",
			modelType: "샘플 model type 1",
		},
		{
			accountId: "account-2",
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			expiresAt: new Date("2026-04-14T09:00:00.000Z"),
			grantId: "grant-2",
			id: 2n,
			key: "session-key-2",
			modelType: "RefreshToken",
		},
	],
	setQueryStates: async () => new URLSearchParams(),
	stats: {
		byModelType: { AuthorizationCode: 1, RefreshToken: 1 },
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
	sessions: [],
	totalCount: 0,
	stats: { byModelType: {}, totalCount: 0 },
};

const meta = {
	title: "screen/OidcSessionListScreen",
	component: OidcSessionListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		sessions: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof OidcSessionListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
