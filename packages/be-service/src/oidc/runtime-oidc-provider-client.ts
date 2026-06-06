import type { OidcClientConfig } from "./types";

export interface RuntimeOidcProviderClient extends OidcClientConfig {
	isFirstParty: boolean;
	skipConsent: boolean;
}
