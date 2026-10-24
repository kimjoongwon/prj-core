import type { SessionMetadata } from "./session-metadata";

export interface SessionLookupResult {
	userSeq: string;
	sessionSeq: string;
	session: SessionMetadata;
}
