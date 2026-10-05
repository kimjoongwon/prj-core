import type { SessionMetadata } from "./session-metadata";

export interface SessionLookupResult {
	userId: string;
	sessionId: string;
	session: SessionMetadata;
}
