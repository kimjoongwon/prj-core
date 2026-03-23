/**
 * OIDC 클라이언트 기준 데이터입니다.
 *
 * 운영 환경마다 redirect URI가 달라질 수 있으므로, business key는 `clientId`로 유지하고
 * URL 계열 값만 env override로 풀어내는 구조입니다.
 */

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
	const normalizedPathname = pathname.replace(/^\/+/, "");
	return new URL(normalizedPathname, normalizedBaseUrl).toString();
}

// 개별 override가 있으면 그것을 우선하고, 없으면 더 일반적인 base URL에서 redirect URI를 조합합니다.
const oidcAdminBaseUrl =
	process.env.OIDC_ADMIN_BASE_URL || "http://localhost:3000";
const oidcAdminClientSecret =
	process.env.OIDC_ADMIN_CLIENT_SECRET ||
	"admin-secret-change-in-production";
const oidcAdminRedirectUri =
	process.env.OIDC_ADMIN_REDIRECT_URI ||
	resolveOidcSeedUrl(oidcAdminBaseUrl, "/api/v1/auth/callback");
const oidcStorybookBaseUrl =
	process.env.OIDC_STORYBOOK_BASE_URL || "http://localhost:6006";
const oidcStorybookClientSecret =
	process.env.OIDC_STORYBOOK_CLIENT_SECRET ||
	"storybook-secret-change-in-production";
const oidcStorybookRedirectUri =
	process.env.OIDC_STORYBOOK_REDIRECT_URI ||
	resolveOidcSeedUrl(oidcStorybookBaseUrl, "/api/v1/auth/storybook/callback");
const oidcIdpClientUrl = process.env.IDP_CLIENT_URL || "http://localhost:3008";
const oidcIdpWebClientSecret =
	process.env.OIDC_IDP_WEB_CLIENT_SECRET ||
	"idp-web-secret-change-in-production";
const oidcIdpWebRedirectUri =
	process.env.OIDC_IDP_WEB_REDIRECT_URI ||
	resolveOidcSeedUrl(oidcIdpClientUrl, "/api/v1/auth/idp/callback");
const oidcIssuer =
	process.env.OIDC_ISSUER || oidcIdpClientUrl || "http://localhost:3007";
const oidcSwaggerRedirectUri =
	process.env.OIDC_SWAGGER_REDIRECT_URI ||
	resolveOidcSeedUrl(oidcIssuer, "/api/oauth2-redirect.html");

/**
 * OIDC Client 시드 데이터
 * 운영/개발 환경에서 공통으로 유지해야 하는 기본 클라이언트 애플리케이션 정의입니다.
 */
export const oidcClientSeedData: OidcClientSeedData[] = [
	{
		clientId: "admin-web",
		clientSecret: oidcAdminClientSecret,
		clientName: "Admin Web",
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
		clientSecret: oidcStorybookClientSecret,
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
		clientId: "idp-web",
		clientSecret: oidcIdpWebClientSecret,
		clientName: "IDP Web",
		redirectUris: [oidcIdpWebRedirectUri],
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
