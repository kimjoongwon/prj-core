import {
	DEFAULT_OIDC_CLIENT_ID,
	LEGACY_OIDC_CLIENT_IDS_BY_CANONICAL_ID,
} from "@cocrepo/constant";
import { normalizeOidcClientId } from "./normalize-oidc-client-id";

export function getOidcClientIdCandidates(
	clientId?: string,
	fallbackClientId = DEFAULT_OIDC_CLIENT_ID,
): string[] {
	const rawClientId =
		typeof clientId === "string" && clientId.trim().length > 0
			? clientId.trim()
			: undefined;
	const normalizedClientId =
		normalizeOidcClientId(rawClientId) ??
		normalizeOidcClientId(fallbackClientId) ??
		DEFAULT_OIDC_CLIENT_ID;
	const legacyClientIds =
		LEGACY_OIDC_CLIENT_IDS_BY_CANONICAL_ID[
			normalizedClientId as keyof typeof LEGACY_OIDC_CLIENT_IDS_BY_CANONICAL_ID
		] ?? [];

	return [
		...new Set([rawClientId, normalizedClientId, ...legacyClientIds]),
	].filter((candidate): candidate is string => Boolean(candidate));
}
