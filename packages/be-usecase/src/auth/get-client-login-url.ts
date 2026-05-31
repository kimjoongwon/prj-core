import { OidcClientAggregateRoot } from "@cocrepo/aggregate";
import { applyRuntimeManagedOidcClientConfig } from "@cocrepo/service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { getOidcClientIdCandidates } from "./get-oidc-client-id-candidates";

export async function getClientLoginUrl(
	oidcClientService: OidcClientAggregateRoot,
	clientId: string,
): Promise<string | null> {
	const lookupCandidates = getOidcClientIdCandidates(clientId);
	let lastNotFoundError: NotFoundException | undefined;

	for (const lookupClientId of lookupCandidates) {
		try {
			const client = await oidcClientService.getByClientId(lookupClientId);
			const redirectUri = client.redirectUris[0];
			if (!redirectUri) {
				throw new BadRequestException("Redirect URI가 설정되지 않았습니다");
			}
			return applyRuntimeManagedOidcClientConfig({
				clientId: client.clientId,
				clientSecret: client.clientSecret,
				redirectUri,
				loginUrl: client.loginUrl,
				defaultReturnTo: client.defaultReturnTo,
				scope: client.scope,
			}).loginUrl;
		} catch (error) {
			if (error instanceof NotFoundException) {
				lastNotFoundError = error;
				continue;
			}
			throw error;
		}
	}

	throw (
		lastNotFoundError ??
		new NotFoundException("OIDC 클라이언트를 찾을 수 없습니다")
	);
}
