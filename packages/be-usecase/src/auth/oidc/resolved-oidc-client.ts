export interface ResolvedOidcClient {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
	loginUrl: string | null;
	defaultReturnTo: string | null;
	scope: string;
	hasLoginPage: boolean;
}
