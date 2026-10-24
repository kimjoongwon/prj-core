import { DEFAULT_OIDC_CLIENT_ID } from "@cocrepo/constant";
import { SessionId } from "@cocrepo/vo";
import { resolveStoredClientId } from "./resolve-stored-client-id";

export function resolveClientIdFromSessionId(sessionSeq?: string): string {
	if (!sessionSeq) {
		return DEFAULT_OIDC_CLIENT_ID;
	}

	try {
		return resolveStoredClientId(SessionId.fromString(sessionSeq).clientId);
	} catch {
		return DEFAULT_OIDC_CLIENT_ID;
	}
}
