import { DEFAULT_OIDC_CLIENT_ID } from "@cocrepo/constant";
import { normalizeOidcClientId } from "./normalize-oidc-client-id";

export function resolveStoredClientId(
	clientId?: string,
	legacyClientKey?: string,
	fallbackClientId = DEFAULT_OIDC_CLIENT_ID,
): string {
	const normalizedClientId = normalizeOidcClientId(clientId);
	if (normalizedClientId) {
		return normalizedClientId;
	}

	const legacyClientId = normalizeOidcClientId(legacyClientKey);
	return (
		legacyClientId ??
		normalizeOidcClientId(fallbackClientId) ??
		DEFAULT_OIDC_CLIENT_ID
	);
}
