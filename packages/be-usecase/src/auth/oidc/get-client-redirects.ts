import { OidcClientAggregate } from "@cocrepo/aggregate";
import { resolveOidcClient } from "./resolve-oidc-client";

export async function getClientRedirects(
	oidcClientService: OidcClientAggregate,
	clientId: string,
): Promise<{
	loginUrl: string | null;
	defaultReturnTo: string | null;
	hasLoginPage: boolean;
}> {
	const client = await resolveOidcClient(oidcClientService, clientId, {
		requireActive: false,
	});

	return {
		loginUrl: client.loginUrl,
		defaultReturnTo: client.defaultReturnTo,
		hasLoginPage: client.hasLoginPage,
	};
}
