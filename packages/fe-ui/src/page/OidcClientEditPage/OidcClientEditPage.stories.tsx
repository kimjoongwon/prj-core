import type { Meta, StoryObj } from "@storybook/react";
import { createStorybookMock } from "../storybookMock";
import { OidcClientEditPage } from "./OidcClientEditPage";

const defaultArgs = {
  "client": {
  "clientId": "client-1",
  "clientSecret": "client-secret-1",
  "defaultReturnTo": "default-return-to-1",
  "grantTypes": ["authorization_code", "refresh_token"],
  "loginUrl": "https://example.com/login-url-1",
  "logoUri": "https://placehold.co/96x96/png?text=Logo+1",
  "oidcClientId": "oidc-client-1",
  "policyUri": "https://example.com/policy-1",
  "redirectUris": ["https://example.com/auth/callback", "https://example.com/auth/secondary"],
  "responseTypes": ["code"],
  "scope": "scope-1",
  "tokenEndpointAuthMethod": "token-endpoint-auth-method-1",
  "tosUri": "https://example.com/tos-uri-1",
},
  "formState": {
  "clientId": "client-1",
  "clientSecret": "client-secret-1",
  "defaultReturnTo": "default-return-to-1",
  "errors": {},
  "grantTypes": ["authorization_code", "refresh_token"],
  "isInitialized": false,
  "isPublic": false,
  "loginUrl": "https://example.com/login-url-1",
  "logoUri": "https://placehold.co/96x96/png?text=Logo+1",
  "policyUri": "https://example.com/policy-1",
  "redirectUriErrors": createStorybookMock("redirectUriErrors") as never,
  "redirectUris": ["https://example.com/auth/callback", "https://example.com/auth/secondary"],
  "responseTypes": ["code"],
  "scope": "scope-1",
  "tokenEndpointAuthMethod": "token-endpoint-auth-method-1",
  "tosUri": "https://example.com/tos-uri-1",
},
  "isLoading": false,
  "isSubmitting": false,
  "onClickBackButton": (..._args: never[]) => undefined,
  "onClickListButton": (..._args: never[]) => undefined,
  "onSubmit": (..._args: never[]) => undefined,
};

const loadingArgs = {
  ...defaultArgs,
  "isLoading": true,
};

const busyArgs = {
  ...defaultArgs,
  "isSubmitting": true,
};

const meta = {
  component: OidcClientEditPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof OidcClientEditPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: loadingArgs as never,
};

export const Busy: Story = {
  args: busyArgs as never,
};
