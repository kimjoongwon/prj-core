import type { UserService } from "@cocrepo/service";

export interface AuthSessionResult {
	accessToken: string;
	refreshToken: string;
	/**
	 * 세션 쿠키 기반 웹 클라이언트가 스토어를 부트스트랩할 수 있도록 회신하는 세션 식별자.
	 * sessionId 쿠키 없이 헤더만으로 갱신한 클라이언트에서는 null이다.
	 */
	sessionId?: string | null;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
	user: NonNullable<Awaited<ReturnType<UserService["getByIdWithTenants"]>>>;
}
