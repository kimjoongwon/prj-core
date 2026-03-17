// ============================================================================
// OIDC Client 시드 데이터
// ============================================================================

/**
 * OIDC Client 시드 데이터 인터페이스
 */
export interface OidcClientSeedData {
	clientId: string;
	clientSecret: string | null;
	clientName: string;
	redirectUris: string[];
	grantTypes: string[];
	responseTypes: string[];
	tokenEndpointAuthMethod: string;
	scope: string;
	isActive: boolean;
	logoUri?: string | null;
	policyUri?: string | null;
	tosUri?: string | null;
}

function resolveOidcSeedUrl(baseUrl: string, pathname: string): string {
	const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
	return new URL(pathname, normalizedBaseUrl).toString();
}

const oidcAdminRedirectUri =
	process.env.OIDC_ADMIN_REDIRECT_URI ||
	process.env.OIDC_REDIRECT_URI ||
	"http://localhost:3000/api/v1/auth/callback";
const oidcStorybookBaseUrl = process.env.STORYBOOK_URL || "http://localhost:6006";
const oidcStorybookRedirectUri =
	process.env.OIDC_STORYBOOK_REDIRECT_URI ||
	resolveOidcSeedUrl(oidcStorybookBaseUrl, "/api/v1/auth/storybook/callback");
const oidcIdpClientUrl = process.env.IDP_CLIENT_URL || "http://localhost:3008";
const oidcIdpConsoleRedirectUri =
	process.env.OIDC_IDP_CONSOLE_REDIRECT_URI ||
	resolveOidcSeedUrl(oidcIdpClientUrl, "/api/v1/auth/callback");
const oidcIssuer = process.env.OIDC_ISSUER || oidcIdpClientUrl || "http://localhost:3007";
const oidcSwaggerRedirectUri =
	process.env.OIDC_SWAGGER_REDIRECT_URI ||
	resolveOidcSeedUrl(oidcIssuer, "/api/oauth2-redirect.html");

/**
 * OIDC Client 시드 데이터
 * 기본 클라이언트 애플리케이션 정의
 */
export const oidcClientSeedData: OidcClientSeedData[] = [
	{
		clientId: "prj-core-admin",
		clientSecret: "admin-secret-change-in-production",
		clientName: "PRJ Core Admin",
		redirectUris: [oidcAdminRedirectUri],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email roles",
		isActive: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "storybook",
		clientSecret: "storybook-secret-change-in-production",
		clientName: "PRJ Core Storybook",
		redirectUris: [oidcStorybookRedirectUri],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email roles",
		isActive: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "prj-core-mobile",
		clientSecret: null, // Public client (PKCE required)
		clientName: "PRJ Core Mobile App",
		redirectUris: [
			"prjcore://auth/callback",
			"exp://localhost:8081/--/auth/callback",
		],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "none", // Public client
		scope: "openid profile email",
		isActive: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "prj-core-idp-console",
		clientSecret: "idp-console-secret-change-in-production",
		clientName: "PRJ Core IDP 관리 콘솔",
		redirectUris: [oidcIdpConsoleRedirectUri],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email roles",
		isActive: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "prj-core-swagger",
		clientSecret: null,
		clientName: "PRJ Core Swagger UI",
		redirectUris: [oidcSwaggerRedirectUri],
		grantTypes: ["authorization_code"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "none",
		scope: "openid profile email roles",
		isActive: true,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
];
