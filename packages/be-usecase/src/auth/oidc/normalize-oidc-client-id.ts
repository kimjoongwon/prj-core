import { LEGACY_OIDC_CLIENT_ID_MAP } from "@cocrepo/constant";
import { OidcClientId } from "@cocrepo/vo";

export function normalizeOidcClientId(clientId?: string): string | undefined {
	if (typeof clientId !== "string") {
		return undefined;
	}

	const trimmedClientId = clientId.trim();
	if (!trimmedClientId) {
		return undefined;
	}

	const mappedClientId =
		LEGACY_OIDC_CLIENT_ID_MAP[
			trimmedClientId as keyof typeof LEGACY_OIDC_CLIENT_ID_MAP
		] ?? trimmedClientId;

	try {
		return OidcClientId.create(mappedClientId).value;
	} catch {
		return undefined;
	}
}
