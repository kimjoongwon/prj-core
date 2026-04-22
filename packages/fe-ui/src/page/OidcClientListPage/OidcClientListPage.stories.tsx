import type { Meta, StoryObj } from "@storybook/react";
import { OidcClientListPage } from "./OidcClientListPage";

const defaultArgs = {
  "isLoading": false,
  "oidcClients": [{
  "clientId": "client-1",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "grantTypes": ["authorization_code", "refresh_token"],
  "id": "item-1",
  "isActive": false,
  "tokenEndpointAuthMethod": "token-endpoint-auth-method-1",
}, {
  "clientId": "client-1",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "grantTypes": ["authorization_code", "refresh_token"],
  "id": "item-1",
  "isActive": false,
  "tokenEndpointAuthMethod": "token-endpoint-auth-method-1",
}],
  "onClickCreateButton": (..._args: never[]) => undefined,
  "queryStates": {"page": 1, "take": 10, "skip": 0, "search": ""},
  "setQueryStates": (..._args: never[]) => undefined,
  "totalCount": 12,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "oidcClients": [],
  "totalCount": 0,
};

const meta = {
  component: OidcClientListPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof OidcClientListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
