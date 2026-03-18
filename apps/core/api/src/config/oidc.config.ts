import { registerAs } from "@nestjs/config";

function resolveClientUrl(baseUrl: string, pathname: string): string {
	const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
	const normalizedPathname = pathname.replace(/^\/+/, "");
	return new URL(normalizedPathname, normalizedBaseUrl).toString();
}

interface OidcRpClientConfig {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	loginUrl?: string;
	defaultReturnTo?: string;
}

export interface OidcConfig {
	issuer: string;
	jwksUri: string;
	clients: {
		admin: OidcRpClientConfig;
		storybook: OidcRpClientConfig;
	};
}

export const oidcConfig = registerAs("oidc", (): OidcConfig => {
	const issuer = process.env.OIDC_ISSUER || "http://localhost:3007";
	const adminBaseUrl =
		process.env.OIDC_ADMIN_BASE_URL || "http://localhost:3000";
	const storybookBaseUrl =
		process.env.OIDC_STORYBOOK_BASE_URL || "http://localhost:6006";

	return {
		issuer,
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
		},
	};
});
