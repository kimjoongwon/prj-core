import type { OidcClientProtocolConfig } from "@cocrepo/client";
import type { ResolvedOidcClient } from "./resolved-oidc-client";

export function toProtocolClientConfig(
	client: ResolvedOidcClient,
): OidcClientProtocolConfig {
	return {
		clientId: client.clientId,
		clientSecret: client.clientSecret,
		redirectUri: client.redirectUri,
		scope: client.scope,
	};
}
