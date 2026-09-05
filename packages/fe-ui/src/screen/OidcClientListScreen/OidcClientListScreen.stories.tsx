import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OidcClientListScreen } from "./OidcClientListScreen";

const defaultArgs: ComponentProps<typeof OidcClientListScreen> = {
	isLoading: false,
	oidcClients: [
		{
			updatedAt: null,
			removedAt: null,
			name: "관리 콘솔",
			redirectUris: ["https://example.com/callback"],
			responseTypes: ["code"],
			scope: "openid profile email",
			isFirstParty: true,
			skipConsent: false,
			clientId: "client-1",
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			grantTypes: ["authorization_code", "refresh_token"],
			id: 1n,
			isActive: false,
			tokenEndpointAuthMethod: "token-endpoint-auth-method-1",
		},
		{
			updatedAt: null,
			removedAt: null,
			name: "관리 콘솔",
			redirectUris: ["https://example.com/callback"],
			responseTypes: ["code"],
			scope: "openid profile email",
			isFirstParty: true,
			skipConsent: false,
			clientId: "client-1",
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			grantTypes: ["authorization_code", "refresh_token"],
			id: 1n,
			isActive: false,
			tokenEndpointAuthMethod: "token-endpoint-auth-method-1",
		},
	],
	onClickCreateButton: () => undefined,
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
	oidcClients: [],
	totalCount: 0,
};

const meta = {
	title: "screen/OidcClientListScreen",
	component: OidcClientListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		clients: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof OidcClientListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};
