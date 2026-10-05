import type { JsonValue } from "@cocrepo/type";

export interface UpdateOidcClientCommandInput {
	name?: string;
	skipConsent?: boolean;
	clientSecret?: string;
	redirectUris?: string[];
	loginUrl?: string;
	defaultReturnTo?: string;
	grantTypes?: string[];
	responseTypes?: string[];
	tokenEndpointAuthMethod?: string;
	scope?: string;
	isFirstParty?: boolean;
	loginUi?: JsonValue | null;
	logoUri?: string;
	policyUri?: string;
	tosUri?: string;
}
