import { CookieOptions } from "express";

/**
 * JWT expiresIn 형식 문자열을 밀리초로 변환
 * @param expiresIn - JWT expiresIn 값 (예: "15m", "7d", "24h", "3600")
 * @returns 밀리초 단위 숫자
 */
export function parseJwtExpiresInToMs(expiresIn: string | number): number {
	if (typeof expiresIn === "number") {
		return expiresIn * 1000; // 초를 밀리초로 변환
	}

	const match = expiresIn.match(/^(\d+)([smhd])$/);
	if (!match) {
		throw new Error(`Invalid expiresIn format: ${expiresIn}`);
	}

	const value = Number.parseInt(match[1], 10);
	const unit = match[2];

	const unitToMs: Record<string, number> = {
		s: 1000, // 초
		m: 60 * 1000, // 분
		h: 60 * 60 * 1000, // 시간
		d: 24 * 60 * 60 * 1000, // 일
	};

	return value * unitToMs[unit];
}

/**
 * 쿠키 옵션 생성
 * @param maxAge - 쿠키 최대 유효 시간 (밀리초)
 * @param isProduction - 프로덕션 환경 여부
 * @returns CookieOptions
 */
export function createCookieOptions(
	maxAge: number,
	isProduction = process.env.NODE_ENV === "production",
): CookieOptions {
	return {
		httpOnly: true, // XSS 공격 방지 (클라이언트 스크립트에서 접근 불가)
		secure: isProduction, // HTTPS 전용 (프로덕션에서만)
		sameSite: "strict", // CSRF 공격 방지 (strict: 동일 사이트에서만 전송)
		maxAge, // 쿠키 최대 유효 시간 (밀리초)
		path: "/", // 쿠키 경로
	};
}

/**
 * Access Token 쿠키 옵션
 * @param expiresIn - JWT expiresIn 값
 * @returns CookieOptions
 */
export function getAccessTokenCookieOptions(
	expiresIn: string | number,
): CookieOptions {
	const maxAge = parseJwtExpiresInToMs(expiresIn);
	return createCookieOptions(maxAge);
}

/**
 * Refresh Token 쿠키 옵션
 * @param expiresIn - JWT expiresIn 값
 * @returns CookieOptions
 */
export function getRefreshTokenCookieOptions(
	expiresIn: string | number,
): CookieOptions {
	const maxAge = parseJwtExpiresInToMs(expiresIn);
	return createCookieOptions(maxAge);
}

/**
 * 일반 쿠키 옵션 (maxAge 없음)
 * @returns CookieOptions
 */
export function getDefaultCookieOptions(): CookieOptions {
	const isProduction = process.env.NODE_ENV === "production";
	return {
		httpOnly: false, // 일반 쿠키는 클라이언트에서 접근 가능
		secure: isProduction,
		sameSite: "strict",
		path: "/",
	};
}
