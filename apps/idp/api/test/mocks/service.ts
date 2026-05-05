export class AuthAuditLogService {}

export const FIRST_PARTY_OIDC_CLIENT_IDS = [
	"admin-web",
	"storybook-web",
	"idp-web",
	"user-mobile",
	"swagger-web",
] as const;

export const isFirstPartyOidcClientId = (clientId: string) =>
	FIRST_PARTY_OIDC_CLIENT_IDS.includes(
		clientId as (typeof FIRST_PARTY_OIDC_CLIENT_IDS)[number],
	);

export const applyFirstPartyOidcRuntimeConfig = <TClient>(client: TClient) =>
	client;
