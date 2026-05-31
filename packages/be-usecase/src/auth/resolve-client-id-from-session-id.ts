import { SessionId } from "@cocrepo/vo";
import { DEFAULT_OIDC_CLIENT_ID } from "./default-oidc-client-id";
import { resolveStoredClientId } from "./resolve-stored-client-id";

export function resolveClientIdFromSessionId(sessionId?: string): string {
	if (!sessionId) {
		return DEFAULT_OIDC_CLIENT_ID;
	}

	try {
		return resolveStoredClientId(SessionId.fromString(sessionId).clientId);
	} catch {
		return DEFAULT_OIDC_CLIENT_ID;
	}
}
