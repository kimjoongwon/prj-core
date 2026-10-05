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
