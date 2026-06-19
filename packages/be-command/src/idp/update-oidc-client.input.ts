export interface UpdateOidcClientCommandInput {
	name?: string;
	skipConsent?: boolean;
	clientSecret?: string;
	redirectUris?: any[];
	loginUrl?: string;
	defaultReturnTo?: string;
	grantTypes?: any[];
	responseTypes?: any[];
	tokenEndpointAuthMethod?: string;
	scope?: string;
	isFirstParty?: boolean;
	loginUi?: any;
	logoUri?: string;
	policyUri?: string;
	tosUri?: string;
}
