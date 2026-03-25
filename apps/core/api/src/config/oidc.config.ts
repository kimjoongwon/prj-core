import { registerAs } from "@nestjs/config";

export interface OidcConfig {
	issuer: string;
	jwksUri: string;
}

export const oidcConfig = registerAs("oidc", (): OidcConfig => {
	const issuer = process.env.OIDC_ISSUER || "http://localhost:3007";

	return {
		issuer,
		jwksUri: process.env.OIDC_JWKS_URI || `${issuer}/oidc/jwks`,
	};
});
