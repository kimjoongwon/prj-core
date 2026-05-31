import { SessionId } from "@cocrepo/vo";

export function buildSessionId(clientId: string, sessionId: string): string {
	return SessionId.create(clientId, sessionId).value;
}
