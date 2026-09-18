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
	jwksUri: string;
	// 로그인 인터랙션 UI(idp-web)의 공개 base URL
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
		jwksUri: process.env.OIDC_JWKS_URI || `${issuer}/oidc/jwks`,
		interactionBaseUrl:
			process.env.OIDC_INTERACTION_BASE_URL || "http://localhost:3008",
	};
});
