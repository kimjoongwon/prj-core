import type { JsonValue } from "@cocrepo/type";

export interface OidcClientData {
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
	loginUi?: JsonValue | null;
	logoUri?: string | null;
	policyUri?: string | null;
	tosUri?: string | null;
}
