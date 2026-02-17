import { registerAs } from "@nestjs/config";

export interface JwksKeys {
	keys: Array<Record<string, unknown>>;
}

export interface OidcConfig {
	// OIDC Provider 설정
	issuer: string;
	cookieSecret: string;
	cookieKeys: string[];
	jwks?: JwksKeys;
	// OIDC Client 설정 (AuthFacade에서 사용)
	jwksUri: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
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
		// OIDC Client 설정 (AuthFacade에서 사용)
		jwksUri: process.env.OIDC_JWKS_URI || `${issuer}/oidc/jwks`,
		clientId: process.env.OIDC_CLIENT_ID || "prj-core-admin",
		clientSecret:
			process.env.OIDC_CLIENT_SECRET ||
			"admin-secret-change-in-production",
		redirectUri:
			process.env.OIDC_REDIRECT_URI ||
			"http://localhost:3000/api/v1/auth/callback",
	};
});
