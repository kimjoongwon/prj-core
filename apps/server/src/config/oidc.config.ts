import { registerAs } from "@nestjs/config";

export interface OidcServerConfig {
	issuer: string;
	jwksUri: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

export default registerAs<OidcServerConfig>("oidc", () => {
	const issuer = process.env.OIDC_ISSUER || "http://localhost:3007";

	return {
		issuer,
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
