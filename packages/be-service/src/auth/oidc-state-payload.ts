export interface OidcStatePayload {
	codeVerifier: string;
	returnTo?: string;
	clientId?: string;
	clientKey?: string;
}
