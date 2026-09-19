import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";
import type { CookieProps } from "./cookie.props";
import type { CookieOptions } from "./cookie-options";
import { parseExpiration } from "./parse-expiration";

/**
 * HTTP 쿠키 설정 Value Object
 */
export class Cookie extends ValueObject<CookieProps> {
	protected validate(props: CookieProps): void {
		if (props.maxAge <= 0) {
			throw new VoValidationError("maxAge는 0보다 커야 합니다.");
		}

		if (!props.path) {
			throw new VoValidationError("path는 필수입니다.");
		}
	}

	/**
	 * 기본 쿠키 생성
	 */
	public static create(
		maxAge: number,
		isProduction = process.env.NODE_ENV === "production",
	): Cookie {
		return new Cookie({
			maxAge,
			httpOnly: true,
			secure: isProduction,
			sameSite: "lax",
			path: "/",
		});
	}

	/**
	 * 토큰용 쿠키 (Access/Refresh 공통)
	 * @param expiresIn - "15m", "7d", "24h", 3600 등
	 */
	public static forToken(
		expiresIn: string | number,
		isProduction = process.env.NODE_ENV === "production",
	): Cookie {
		const maxAge = parseExpiration(expiresIn);
		return Cookie.create(maxAge, isProduction);
	}

	/**
	 * 세션 존재 표시용 쿠키. 민감한 값이 없어 클라이언트 스크립트가 읽을 수 있어야
	 * 하므로 httpOnly를 끈다. 웹 앱이 인증되지 않은 방문자의 토큰 갱신 시도를
	 * 만들기 전에 로그인 화면으로 보내는 데 사용한다.
	 */
	public static forPresence(
		expiresIn: string | number,
		isProduction = process.env.NODE_ENV === "production",
	): Cookie {
		const maxAge = parseExpiration(expiresIn);
		return new Cookie({
			maxAge,
			httpOnly: false,
			secure: isProduction,
			sameSite: "lax",
			path: "/",
		});
	}

	/**
	 * Express CookieOptions로 변환
	 */
	public toExpressOptions(): CookieOptions {
		return {
			httpOnly: this.props.httpOnly,
			secure: this.props.secure,
			sameSite: this.props.sameSite,
			maxAge: this.props.maxAge,
			path: this.props.path,
		};
	}

	public get maxAge(): number {
		return this.props.maxAge;
	}

	public get httpOnly(): boolean {
		return this.props.httpOnly;
	}

	public get secure(): boolean {
		return this.props.secure;
	}

	public get sameSite(): "strict" | "lax" | "none" {
		return this.props.sameSite;
	}

	public get path(): string {
		return this.props.path;
	}
}
