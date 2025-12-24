import { CookieOptionsVo } from "./cookie-options.vo";
import { JwtExpiration } from "./jwt-expiration.vo";

/**
 * Access Token 쿠키 옵션 Value Object
 *
 * - Access Token 전용 쿠키 옵션
 * - 기본값: httpOnly=true, sameSite=strict
 */
export class AccessTokenCookieOptions extends CookieOptionsVo {
	/**
	 * Access Token 전용 팩토리 메서드
	 */
	public static forAccessToken(
		expiresIn: string | number,
		isProduction = process.env.NODE_ENV === "production",
	): AccessTokenCookieOptions {
		const expiration = JwtExpiration.create(expiresIn);
		const baseOptions = CookieOptionsVo.fromJwtExpiration(
			expiration,
			isProduction,
		);

		return new AccessTokenCookieOptions(baseOptions.getValue());
	}
}
