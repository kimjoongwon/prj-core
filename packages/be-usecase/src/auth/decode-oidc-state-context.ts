import { DEFAULT_OIDC_CLIENT_ID } from "./default-oidc-client-id";
import type { OidcStateContext } from "./oidc-state.context";
import { OIDC_STATE_CONTEXT_PREFIX } from "./oidc-state-context-prefix";
import { resolveStoredClientId } from "./resolve-stored-client-id";

export function decodeOidcStateContext(
	serializedReturnTo?: string,
): OidcStateContext {
	if (!serializedReturnTo) {
		return { clientId: DEFAULT_OIDC_CLIENT_ID };
	}

	if (!serializedReturnTo.startsWith(OIDC_STATE_CONTEXT_PREFIX)) {
		return {
			clientId: DEFAULT_OIDC_CLIENT_ID,
			returnTo: serializedReturnTo,
		};
	}

	try {
		const payload = JSON.parse(
			Buffer.from(
				serializedReturnTo.slice(OIDC_STATE_CONTEXT_PREFIX.length),
				"base64url",
			).toString("utf-8"),
		) as Partial<OidcStateContext & { clientKey?: string }>;

		return {
			clientId: resolveStoredClientId(payload.clientId, payload.clientKey),
			returnTo:
				typeof payload.returnTo === "string" ? payload.returnTo : undefined,
		};
	} catch {
		return { clientId: DEFAULT_OIDC_CLIENT_ID };
	}
}
