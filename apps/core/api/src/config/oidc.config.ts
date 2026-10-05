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

/**
 * 셸(source)은 .env의 이중 인용과 \" 이스케이프를 해석해 내려주지만 dotenv는
 * 원문 그대로 읽는다. 두 실행 방식에서 같은 JSON 값을 얻도록 정규화한다.
 */
export function normalizeJsonEnvironmentValue(rawValue: string): string {
	return rawValue
		.trim()
		.replace(/^"+|"+$/g, "")
		.replace(/\\"/g, '"');
}

export const oidcConfig = registerAs("oidc", (): OidcConfig => {
	const isProduction = process.env.NODE_ENV === "production";
	let jwks: JwksKeys | undefined;

	if (process.env.OIDC_JWKS_KEYS) {
		try {
			jwks = JSON.parse(
				normalizeJsonEnvironmentValue(process.env.OIDC_JWKS_KEYS),
			);
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
	if (isProduction && !process.env.OIDC_COOKIE_SECRET?.trim()) {
		throw new Error("OIDC_COOKIE_SECRET must be defined in production.");
	}

	return {
		issuer,
		cookieSecret,
		cookieKeys: [cookieSecret],
		jwksUri: process.env.OIDC_JWKS_URI || `${issuer}/oidc/jwks`,
		interactionBaseUrl:
			process.env.OIDC_INTERACTION_BASE_URL || `${adminBaseUrl}/admin`,
		...(jwks ? { jwks } : {}),
	};
});
