import { CookieOptionsVo } from "./cookie-options.vo";
import { JwtExpiration } from "./jwt-expiration.vo";

/**
 * Refresh Token 쿠키 옵션 Value Object
 *
 * - Refresh Token 전용 쿠키 옵션
 * - 기본값: httpOnly=true, sameSite=strict
 */
export class RefreshTokenCookieOptions extends CookieOptionsVo {
	/**
	 * Refresh Token 전용 팩토리 메서드
	 */
	public static forRefreshToken(
		expiresIn: string | number,
		isProduction = process.env.NODE_ENV === "production",
	): RefreshTokenCookieOptions {
		const expiration = JwtExpiration.create(expiresIn);
		const baseOptions = CookieOptionsVo.fromJwtExpiration(
			expiration,
			isProduction,
		);

		return new RefreshTokenCookieOptions(baseOptions.getValue());
	}
}
