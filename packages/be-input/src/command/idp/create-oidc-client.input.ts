import type { JsonValue } from "@cocrepo/type";

export interface CreateOidcClientCommandInput {
	skipConsent?: boolean;
	name: string;
	clientId: string;
	clientSecret: string;
	redirectUris: string[];
	loginUrl: string;
	defaultReturnTo: string;
	grantTypes: string[];
	responseTypes: string[];
	tokenEndpointAuthMethod: string;
	scope: string;
	isFirstParty: boolean;
	loginUi: JsonValue | null;
	logoUri: string;
	policyUri: string;
	tosUri: string;
}
