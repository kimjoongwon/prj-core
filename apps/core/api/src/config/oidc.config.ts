import { registerAs } from "@nestjs/config";

export interface JwksKeys {
	keys: Array<Record<string, unknown>>;
}

export interface OidcConfig {
	issuer: string;
	cookieSecret: string;
	cookieKeys: string[];
	jwks?: JwksKeys;
	jwksUri: string;
	interactionBaseUrl: string;
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

	const adminBaseUrl =
		process.env.OIDC_ADMIN_BASE_URL || "http://localhost:3000";
	const issuer = process.env.OIDC_ISSUER || adminBaseUrl;
	const cookieSecret =
		process.env.OIDC_COOKIE_SECRET ||
		"default-cookie-secret-change-in-production";

	return {
		issuer,
		cookieSecret,
		cookieKeys: [cookieSecret],
		jwks,
		jwksUri: process.env.OIDC_JWKS_URI || `${issuer}/oidc/jwks`,
		interactionBaseUrl:
			process.env.OIDC_INTERACTION_BASE_URL || `${adminBaseUrl}/admin`,
	};
});
