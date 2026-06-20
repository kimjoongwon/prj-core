import type { AuthSessionResult } from "./auth-session.result";

export interface OidcCallbackResult {
	returnTo?: string;
	defaultReturnTo: string;
	loginUrl: string | null;
	session?: AuthSessionResult;
}
