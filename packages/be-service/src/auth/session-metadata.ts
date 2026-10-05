export interface SessionMetadata {
	refreshToken: string;
	userAgent: string;
	ipAddress: string;
	createdAt: string;
	lastActivityAt: string;
	clientId?: string;
	clientKey?: string;
	/**
	 * OIDC RP-Initiated Logout(end_session)의 id_token_hint로 쓰기 위해
	 * 로그인 시 발급받은 ID Token을 세션 레코드에 보관한다.
	 */
	idToken?: string;
}
