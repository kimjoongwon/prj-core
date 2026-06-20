import type { Prisma } from "@cocrepo/prisma";

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
	loginUi: Prisma.JsonValue | null;
	logoUri: string;
	policyUri: string;
	tosUri: string;
}
