import type { Meta, StoryObj } from "@storybook/react";
import { IdpConsoleOidcClientsOidcClientIdPage } from "./IdpConsoleOidcClientsOidcClientIdPage";

const defaultArgs = {
  "client": {
  "clientId": "client-1",
  "clientSecret": "client-secret-1",
  "createdAt": "2026-04-14T09:00:00.000Z",
  "defaultReturnTo": "default-return-to-1",
  "grantTypes": ["authorization_code", "refresh_token"],
  "isActive": false,
  "loginUrl": "https://example.com/login-url-1",
  "logoUri": "https://placehold.co/96x96/png?text=Logo+1",
  "policyUri": "https://example.com/policy-1",
  "redirectUris": ["https://example.com/auth/callback", "https://example.com/auth/secondary"],
  "responseTypes": ["code"],
  "scope": "scope-1",
  "tokenEndpointAuthMethod": "token-endpoint-auth-method-1",
  "tosUri": "https://example.com/tos-uri-1",
},
  "isDeleting": false,
  "isLoading": false,
  "isToggling": false,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickDeleteConfirmButton": (..._args: never[]) => undefined,
  "onClickEditButton": (..._args: never[]) => undefined,
  "onClickToggleActiveButton": (..._args: never[]) => undefined,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const busyArgs = {
  ...defaultArgs,
  "isDeleting": true,
};

const meta = {
  component: IdpConsoleOidcClientsOidcClientIdPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof IdpConsoleOidcClientsOidcClientIdPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const Busy: Story = {
  args: busyArgs as never,
};
