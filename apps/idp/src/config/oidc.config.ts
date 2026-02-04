import { registerAs } from "@nestjs/config";

export interface OidcConfig {
	issuer: string;
	cookieSecret: string;
	cookieKeys: string[];
}

export const oidcConfig = registerAs(
	"oidc",
	(): OidcConfig => ({
		issuer: process.env.OIDC_ISSUER || "http://localhost:3007",
		cookieSecret:
			process.env.OIDC_COOKIE_SECRET ||
			"default-cookie-secret-change-in-production",
		cookieKeys: [
			process.env.OIDC_COOKIE_SECRET ||
				"default-cookie-secret-change-in-production",
		],
	}),
);
