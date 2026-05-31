import { OidcClientAggregateRoot } from "@cocrepo/aggregate";
import { resolveOidcClient } from "./resolve-oidc-client";

export async function getClientRedirects(
	oidcClientService: OidcClientAggregateRoot,
	clientId: string,
): Promise<{
	loginUrl: string | null;
	defaultReturnTo: string | null;
	hasAuthShell: boolean;
}> {
	const client = await resolveOidcClient(oidcClientService, clientId, {
		requireActive: false,
	});

	return {
		loginUrl: client.loginUrl,
		defaultReturnTo: client.defaultReturnTo,
		hasAuthShell: client.hasAuthShell,
	};
}
