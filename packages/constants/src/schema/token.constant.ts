/**
 * JWT 토큰 쿠키 이름 상수
 * 보안상 기능을 과도하게 노출하지 않는 범용적인 명명 사용
 */
export const Token = {
	ACCESS: "accessToken",
	REFRESH: "refreshToken",
} as const;

export type TokenValues = (typeof Token)[keyof typeof Token];
