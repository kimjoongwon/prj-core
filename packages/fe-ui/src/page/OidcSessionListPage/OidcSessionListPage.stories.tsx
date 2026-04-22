import type { Meta, StoryObj } from "@storybook/react";
import { OidcSessionListPage } from "./OidcSessionListPage";

const defaultArgs = {
  "isGrantRevokeModalOpen": false,
  "isLoading": false,
  "isRevokeAllModalOpen": false,
  "isRevokingAll": false,
  "isRevokingByGrant": false,
  "onCloseGrantRevokeModal": (..._args: never[]) => undefined,
  "onCloseRevokeAllModal": (..._args: never[]) => undefined,
  "onConfirmRevokeAll": (..._args: never[]) => undefined,
  "onConfirmRevokeByGrant": (..._args: never[]) => undefined,
  "onOpenGrantRevokeModal": (..._args: never[]) => undefined,
  "onOpenRevokeAllModal": (..._args: never[]) => undefined,
  "onRevokeSession": (..._args: never[]) => undefined,
  "queryStates": {"page": 1, "take": 10, "skip": 0, "search": ""},
  "revokeGrantId": "revoke-grant-1",
  "sessions": [{
  "accountId": "account-1",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "expiresAt": "2026-04-14T09:00:00.000Z",
  "grantId": "grant-1",
  "id": "item-1",
  "key": "session-key-1",
  "modelType": "샘플 model type 1",
}, {
  "accountId": "account-2",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "expiresAt": "2026-04-14T09:00:00.000Z",
  "grantId": "grant-2",
  "id": "item-2",
  "key": "session-key-2",
  "modelType": "RefreshToken",
}],
  "setQueryStates": (..._args: never[]) => undefined,
  "stats": {
  "byModelType": {"AuthorizationCode": 1, "RefreshToken": 1},
  "totalCount": 12,
},
  "totalCount": 12,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const emptyStateArgs = {
  ...defaultArgs,
  "sessions": [],
  "totalCount": 0,
  "stats": {"byModelType": {}, "totalCount": 0},
};

const meta = {
  component: OidcSessionListPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof OidcSessionListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const EmptyState: Story = {
  args: emptyStateArgs as never,
};
