export class AuthAuditLogService {}

export const RUNTIME_MANAGED_OIDC_CLIENT_IDS = [
	"admin-web",
	"storybook-web",
	"idp-web",
	"user-mobile",
	"swagger-web",
] as const;

export const isRuntimeManagedOidcClientId = (clientId: string) =>
	RUNTIME_MANAGED_OIDC_CLIENT_IDS.includes(
		clientId as (typeof RUNTIME_MANAGED_OIDC_CLIENT_IDS)[number],
	);

export const applyRuntimeManagedOidcClientConfig = <TClient>(
	client: TClient,
) => client;
