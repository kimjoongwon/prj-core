import type { JsonValue } from "@cocrepo/type";

export interface OidcRuntimeClientData {
	clientId: string;
	clientSecret: string | null;
	name: string;
	redirectUris: string[];
	grantTypes: string[];
	responseTypes: string[];
	tokenEndpointAuthMethod: string;
	scope: string;
	isFirstParty: boolean;
	skipConsent: boolean;
	/** RP-Initiated Logout 완료 후 되돌릴 클라이언트 로그인 화면 URL */
	loginUrl?: string | null;
	/** RP-Initiated Logout(post_logout_redirect_uri) 등록 URI */
	postLogoutRedirectUris?: string[] | null;
	loginUi?: JsonValue | null;
	logoUri?: string | null;
	policyUri?: string | null;
	tosUri?: string | null;
}
