export interface OidcRedisSession {
	key: string;
	modelType: string;
	grantId: string | null;
	uid: string | null;
	accountId: string | null;
	expiresAt: Date | null;
	createdAt: Date;
}
