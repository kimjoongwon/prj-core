import { registerAs } from "@nestjs/config";

function resolveClientUrl(baseUrl: string, pathname: string): string {
	const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
	const normalizedPathname = pathname.replace(/^\/+/, "");
	return new URL(normalizedPathname, normalizedBaseUrl).toString();
}

export interface JwksKeys {
	keys: Array<Record<string, unknown>>;
}

export type OidcRpClientKey = "admin" | "storybook" | "idpWeb";

export interface OidcRpClientConfig {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	loginUrl: string;
	defaultReturnTo: string;
}

export interface OidcConfig {
	// OIDC Provider 설정
	issuer: string;
	cookieSecret: string;
	cookieKeys: string[];
	jwks?: JwksKeys;
	// OIDC RP 설정 (OidcFacade/AuthController에서 사용)
	jwksUri: string;
	clients: Record<OidcRpClientKey, OidcRpClientConfig>;
}

export const oidcConfig = registerAs("oidc", (): OidcConfig => {
	let jwks: JwksKeys | undefined;

	if (process.env.OIDC_JWKS_KEYS) {
		try {
			jwks = JSON.parse(process.env.OIDC_JWKS_KEYS);
		} catch {
			throw new Error("OIDC_JWKS_KEYS is not valid JSON");
		}
	}

	const issuer = process.env.OIDC_ISSUER || "http://localhost:3007";
	const adminBaseUrl =
		process.env.OIDC_ADMIN_BASE_URL || "http://localhost:3000";
	const storybookBaseUrl =
		process.env.OIDC_STORYBOOK_BASE_URL || "http://localhost:6006";
	const idpWebBaseUrl =
		process.env.OIDC_IDP_WEB_BASE_URL ||
		process.env.IDP_CLIENT_URL ||
		"http://localhost:3008";

	return {
		// OIDC Provider 설정
		issuer,
		cookieSecret:
			process.env.OIDC_COOKIE_SECRET ||
			"default-cookie-secret-change-in-production",
		cookieKeys: [
			process.env.OIDC_COOKIE_SECRET ||
				"default-cookie-secret-change-in-production",
		],
		jwks,
		// OIDC RP 설정 (OidcFacade/AuthController에서 사용)
		jwksUri: process.env.OIDC_JWKS_URI || `${issuer}/oidc/jwks`,
		clients: {
			admin: {
				clientId: process.env.OIDC_ADMIN_CLIENT_ID || "admin-web",
				clientSecret:
					process.env.OIDC_ADMIN_CLIENT_SECRET ||
					"admin-secret-change-in-production",
				redirectUri:
					process.env.OIDC_ADMIN_REDIRECT_URI ||
					resolveClientUrl(adminBaseUrl, "/api/v1/auth/callback"),
				loginUrl:
					process.env.OIDC_ADMIN_LOGIN_URL ||
					resolveClientUrl(adminBaseUrl, "/admin/auth/login"),
				defaultReturnTo:
					process.env.OIDC_ADMIN_DEFAULT_RETURN_TO ||
					resolveClientUrl(adminBaseUrl, "/admin/dashboard"),
			},
			storybook: {
				clientId:
					process.env.OIDC_STORYBOOK_CLIENT_ID ||
					"storybook",
				clientSecret:
					process.env.OIDC_STORYBOOK_CLIENT_SECRET ||
					"storybook-secret-change-in-production",
				redirectUri:
					process.env.OIDC_STORYBOOK_REDIRECT_URI ||
					resolveClientUrl(storybookBaseUrl, "/api/v1/auth/storybook/callback"),
				loginUrl:
					process.env.OIDC_STORYBOOK_LOGIN_URL ||
					resolveClientUrl(storybookBaseUrl, "/__storybook_auth/login"),
				defaultReturnTo:
					process.env.OIDC_STORYBOOK_DEFAULT_RETURN_TO ||
					resolveClientUrl(storybookBaseUrl, "/"),
			},
			idpWeb: {
				clientId:
					process.env.OIDC_IDP_WEB_CLIENT_ID ||
					"idp-web",
				clientSecret:
					process.env.OIDC_IDP_WEB_CLIENT_SECRET ||
					"idp-web-secret-change-in-production",
				redirectUri:
					process.env.OIDC_IDP_WEB_REDIRECT_URI ||
					resolveClientUrl(idpWebBaseUrl, "/api/v1/auth/idp/callback"),
				loginUrl:
					process.env.OIDC_IDP_WEB_LOGIN_URL ||
					resolveClientUrl(idpWebBaseUrl, "/auth/login"),
				defaultReturnTo:
					process.env.OIDC_IDP_WEB_DEFAULT_RETURN_TO ||
					resolveClientUrl(idpWebBaseUrl, "/dashboard"),
			},
		},
	};
});
