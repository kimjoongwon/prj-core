/**
 * OIDC 클라이언트 기준 데이터입니다.
 *
 * 운영 환경마다 redirect URI가 달라질 수 있으므로, business key는 `clientId`로 유지하고
 * URL 계열 값만 env override로 풀어내는 구조입니다.
 *
 * clientId 표준 명명 규칙:
 * - 신규/정비 대상 first-party 클라이언트는 `{realm}-{surface}` 패턴을 사용합니다.
 * - 예: `admin-web`, `storybook-web`, `user-mobile`, `swagger-web`
 */

/**
 * OIDC Client 시드 데이터 인터페이스
 */
type OidcClientLoginUi = {
	variant?: "default" | "compact" | "branded";
	headline?: string;
	description?: string;
	brandLabel?: string;
	brandColor?: string;
	showIntroPanel?: boolean;
	mobileFullScreen?: boolean;
};

export interface OidcClientSeedData {
	clientId: string;
	clientSecret: string | null;
	name: string;
	redirectUris: string[];
	loginUrl?: string | null;
	defaultReturnTo?: string | null;
	/** RP-Initiated Logout(post_logout_redirect_uri) 등록 URI */
	postLogoutRedirectUris?: string[];
	grantTypes: string[];
	responseTypes: string[];
	tokenEndpointAuthMethod: string;
	scope: string;
	isActive: boolean;
	isFirstParty?: boolean;
	skipConsent?: boolean;
	loginUi?: OidcClientLoginUi | null;
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
	process.env.OIDC_ADMIN_CLIENT_SECRET || "admin-secret-change-in-production";
const oidcAdminRedirectUri =
	process.env.OIDC_ADMIN_REDIRECT_URI ||
	resolveOidcSeedUrl(
		oidcAdminBaseUrl,
		"/api/v1/auth/callback?clientId=admin-web",
	);
const oidcAdminLoginUrl =
	process.env.OIDC_ADMIN_LOGIN_URL ||
	resolveOidcSeedUrl(oidcAdminBaseUrl, "/admin/auth/login");
const oidcAdminPostLogoutRedirectUri =
	process.env.OIDC_ADMIN_POST_LOGOUT_REDIRECT_URI || oidcAdminLoginUrl;
const oidcAdminDefaultReturnTo =
	process.env.OIDC_ADMIN_DEFAULT_RETURN_TO ||
	resolveOidcSeedUrl(oidcAdminBaseUrl, "/admin/dashboard");
const oidcStorybookBaseUrl =
	process.env.OIDC_STORYBOOK_BASE_URL || "http://localhost:6006";
const oidcStorybookClientSecret =
	process.env.OIDC_STORYBOOK_CLIENT_SECRET ||
	"storybook-secret-change-in-production";
const oidcStorybookRedirectUri =
	process.env.OIDC_STORYBOOK_REDIRECT_URI ||
	resolveOidcSeedUrl(
		oidcStorybookBaseUrl,
		"/api/v1/auth/callback?clientId=storybook-web",
	);
const oidcStorybookLoginUrl =
	process.env.OIDC_STORYBOOK_LOGIN_URL ||
	resolveOidcSeedUrl(oidcStorybookBaseUrl, "/__storybook_auth/login");
const oidcStorybookPostLogoutRedirectUri =
	process.env.OIDC_STORYBOOK_POST_LOGOUT_REDIRECT_URI ||
	oidcStorybookLoginUrl;
const oidcStorybookDefaultReturnTo =
	process.env.OIDC_STORYBOOK_DEFAULT_RETURN_TO ||
	resolveOidcSeedUrl(oidcStorybookBaseUrl, "/");
const oidcIssuer = process.env.OIDC_ISSUER || oidcAdminBaseUrl;
const oidcSwaggerRedirectUri =
	process.env.OIDC_SWAGGER_REDIRECT_URI ||
	resolveOidcSeedUrl(oidcIssuer, "/api/oauth2-redirect.html");
const oidcUserMobileRedirectUri =
	process.env.OIDC_USER_MOBILE_REDIRECT_URI ||
	"kr.co.cocdev.onoramobile://auth/callback";

/**
 * OIDC Client 시드 데이터
 * 운영/개발 환경에서 공통으로 유지해야 하는 기본 클라이언트 애플리케이션 정의입니다.
 */
export const oidcClientSeedData: OidcClientSeedData[] = [
	{
		clientId: "admin-web",
		clientSecret: oidcAdminClientSecret,
		name: "Admin Web",
		redirectUris: [oidcAdminRedirectUri],
		loginUrl: oidcAdminLoginUrl,
		defaultReturnTo: oidcAdminDefaultReturnTo,
		postLogoutRedirectUris: [oidcAdminPostLogoutRedirectUri],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email roles offline_access",
		isActive: true,
		isFirstParty: true,
		skipConsent: true,
		loginUi: {
			variant: "branded",
			headline: "관리자 계정으로 로그인",
			description: "운영 콘솔 접근을 위해 Onora 계정으로 로그인하세요.",
			brandLabel: "Admin Web",
			brandColor: "#2563eb",
			showIntroPanel: true,
			mobileFullScreen: false,
		},
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "storybook-web",
		clientSecret: oidcStorybookClientSecret,
		name: "PRJ Core Storybook",
		redirectUris: [oidcStorybookRedirectUri],
		loginUrl: oidcStorybookLoginUrl,
		defaultReturnTo: oidcStorybookDefaultReturnTo,
		postLogoutRedirectUris: [oidcStorybookPostLogoutRedirectUri],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "client_secret_post",
		scope: "openid profile email roles offline_access",
		isActive: true,
		isFirstParty: true,
		skipConsent: true,
		loginUi: null,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "user-mobile",
		clientSecret: null, // Public client (PKCE required)
		name: "PRJ Core Mobile App",
		redirectUris: [oidcUserMobileRedirectUri],
		loginUrl: null,
		defaultReturnTo: null,
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "none", // Public client
		scope: "openid profile email offline_access",
		isActive: true,
		isFirstParty: true,
		skipConsent: true,
		loginUi: {
			variant: "compact",
			headline: "오노라 로그인",
			description: "예약과 방문 일정을 계속 확인하려면 계정으로 로그인하세요.",
			brandLabel: "Onora Mobile",
			brandColor: "#16a34a",
			showIntroPanel: false,
			mobileFullScreen: true,
		},
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
	{
		clientId: "swagger-web",
		clientSecret: null,
		name: "PRJ Core Swagger UI",
		redirectUris: [oidcSwaggerRedirectUri],
		loginUrl: null,
		defaultReturnTo: null,
		grantTypes: ["authorization_code"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "none",
		scope: "openid profile email roles offline_access",
		isActive: true,
		isFirstParty: true,
		skipConsent: true,
		loginUi: null,
		logoUri: null,
		policyUri: null,
		tosUri: null,
	},
];

/**
 * reference-data가 ownership을 가지는 OIDC client의 legacy 식별자 목록입니다.
 *
 * seed business key가 바뀐 후에도 이전 레코드가 DB에 남아 provider에 다시 노출되지 않도록
 * sync 단계에서 비활성화/removed 처리합니다.
 */
export const legacyOidcClientIds = [
	"storybook",
	"idp-web",
	"prj-core-mobile",
	"prj-core-swagger",
] as const;
