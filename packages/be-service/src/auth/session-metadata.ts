export interface SessionMetadata {
	refreshToken: string;
	userAgent: string;
	ipAddress: string;
	createdAt: string;
	lastActivityAt: string;
	clientId?: string;
	clientKey?: string;
}
