interface RuntimeOidcClientConfig {
	clientId: string;
	redirectUri?: string;
	redirectUris?: string[];
	loginUrl?: string | null;
	defaultReturnTo?: string | null;
}

interface FirstPartyOidcClientEnvConfig {
	baseUrlEnv?: string;
	defaultReturnToEnv?: string;
	defaultReturnToPath?: string;
	loginUrlEnv?: string;
	loginUrlPath?: string;
	redirectUriEnv: string;
	redirectUriPath?: string;
}

const FIRST_PARTY_OIDC_CLIENT_ENV_CONFIG: Record<
	string,
	FirstPartyOidcClientEnvConfig
> = {
	"admin-web": {
		baseUrlEnv: "OIDC_ADMIN_BASE_URL",
		redirectUriEnv: "OIDC_ADMIN_REDIRECT_URI",
		redirectUriPath: "/api/v1/auth/callback?clientId=admin-web",
		loginUrlEnv: "OIDC_ADMIN_LOGIN_URL",
		loginUrlPath: "/admin/auth/login",
		defaultReturnToEnv: "OIDC_ADMIN_DEFAULT_RETURN_TO",
		defaultReturnToPath: "/admin/dashboard",
	},
	"storybook-web": {
		baseUrlEnv: "OIDC_STORYBOOK_BASE_URL",
		redirectUriEnv: "OIDC_STORYBOOK_REDIRECT_URI",
		redirectUriPath: "/api/v1/auth/callback?clientId=storybook-web",
		loginUrlEnv: "OIDC_STORYBOOK_LOGIN_URL",
		loginUrlPath: "/__storybook_auth/login",
		defaultReturnToEnv: "OIDC_STORYBOOK_DEFAULT_RETURN_TO",
		defaultReturnToPath: "/",
	},
	"idp-web": {
		baseUrlEnv: "IDP_CLIENT_URL",
		redirectUriEnv: "OIDC_IDP_WEB_REDIRECT_URI",
		redirectUriPath: "/api/v1/auth/callback?clientId=idp-web",
		loginUrlEnv: "OIDC_IDP_WEB_LOGIN_URL",
		loginUrlPath: "/auth/login",
		defaultReturnToEnv: "OIDC_IDP_WEB_DEFAULT_RETURN_TO",
		defaultReturnToPath: "/dashboard",
	},
	"swagger-web": {
		baseUrlEnv: "OIDC_ISSUER",
		redirectUriEnv: "OIDC_SWAGGER_REDIRECT_URI",
		redirectUriPath: "/api/oauth2-redirect.html",
	},
};

export function applyFirstPartyOidcRuntimeConfig<
	TClient extends RuntimeOidcClientConfig,
>(client: TClient): TClient {
	const envConfig = FIRST_PARTY_OIDC_CLIENT_ENV_CONFIG[client.clientId];
	if (!envConfig) {
		return client;
	}

	const redirectUri = resolveRuntimeUrl(
		envConfig.redirectUriEnv,
		envConfig.baseUrlEnv,
		envConfig.redirectUriPath,
	);
	const loginUrl = resolveRuntimeUrl(
		envConfig.loginUrlEnv,
		envConfig.baseUrlEnv,
		envConfig.loginUrlPath,
	);
	const defaultReturnTo = resolveRuntimeUrl(
		envConfig.defaultReturnToEnv,
		envConfig.baseUrlEnv,
		envConfig.defaultReturnToPath,
	);
	const existingRedirectUris =
		client.redirectUris ?? (client.redirectUri ? [client.redirectUri] : []);
	const redirectUris = redirectUri
		? uniqueValues([redirectUri, ...existingRedirectUris])
		: existingRedirectUris;

	return {
		...client,
		...("redirectUris" in client ? { redirectUris } : {}),
		...("redirectUri" in client
			? { redirectUri: redirectUris[0] ?? client.redirectUri }
			: {}),
		...(loginUrl ? { loginUrl } : {}),
		...(defaultReturnTo ? { defaultReturnTo } : {}),
	} as TClient;
}

function resolveRuntimeUrl(
	explicitEnvName?: string,
	baseUrlEnvName?: string,
	pathname?: string,
): string | undefined {
	const explicitUrl = explicitEnvName
		? normalizeOptionalEnv(process.env[explicitEnvName])
		: undefined;
	if (explicitUrl) {
		return explicitUrl;
	}

	const baseUrl = baseUrlEnvName
		? normalizeOptionalEnv(process.env[baseUrlEnvName])
		: undefined;
	if (!baseUrl || !pathname) {
		return undefined;
	}

	const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
	const normalizedPathname = pathname.replace(/^\/+/, "");
	return new URL(normalizedPathname, normalizedBaseUrl).toString();
}

function normalizeOptionalEnv(value?: string): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

function uniqueValues(values: string[]): string[] {
	return [...new Set(values.filter(Boolean))];
}
