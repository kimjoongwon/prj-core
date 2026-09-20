export interface ResolvedOidcClient {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
	loginUrl: string | null;
	defaultReturnTo: string | null;
	/** RP-Initiated Logout(post_logout_redirect_uri) 등록 URI */
	postLogoutRedirectUris: string[];
	scope: string;
	hasLoginPage: boolean;
}
