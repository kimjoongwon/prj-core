import { registerAs } from "@nestjs/config";

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
	const storybookBaseUrl = process.env.STORYBOOK_URL || "http://localhost:6006";

	return {
		issuer,
		jwksUri: process.env.OIDC_JWKS_URI || `${issuer}/oidc/jwks`,
		clients: {
			admin: {
				clientId:
					process.env.OIDC_ADMIN_CLIENT_ID ||
					process.env.OIDC_CLIENT_ID ||
					"prj-core-admin",
				clientSecret:
					process.env.OIDC_ADMIN_CLIENT_SECRET ||
					process.env.OIDC_CLIENT_SECRET ||
					"admin-secret-change-in-production",
				redirectUri:
					process.env.OIDC_ADMIN_REDIRECT_URI ||
					process.env.OIDC_REDIRECT_URI ||
					"http://localhost:3000/api/v1/auth/callback",
				loginUrl:
					process.env.OIDC_ADMIN_LOGIN_URL ||
					"http://localhost:3000/admin/auth/login",
				defaultReturnTo:
					process.env.OIDC_ADMIN_DEFAULT_RETURN_TO ||
					"http://localhost:3000/admin/dashboard",
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
					`${storybookBaseUrl}/api/v1/auth/storybook/callback`,
				loginUrl:
					process.env.OIDC_STORYBOOK_LOGIN_URL ||
					`${storybookBaseUrl}/__storybook_auth/login`,
				defaultReturnTo:
					process.env.OIDC_STORYBOOK_DEFAULT_RETURN_TO ||
					`${storybookBaseUrl}/`,
			},
		},
	};
});
