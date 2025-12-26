import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";
import { JwtExpiration } from "./jwt-expiration.vo";

/**
 * Express CookieOptions 호환 인터페이스
 */
export interface CookieOptions {
	maxAge?: number;
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: "strict" | "lax" | "none";
	path?: string;
	domain?: string;
}

interface CookieOptionsProps {
	maxAge: number;
	httpOnly: boolean;
	secure: boolean;
	sameSite: "strict" | "lax" | "none";
	path: string;
}

/**
 * 쿠키 옵션 기본 Value Object
 *
 * - 쿠키 설정 캡슐화
 * - Express CookieOptions 변환
 */
export class CookieOptionsVo extends ValueObject<CookieOptionsProps> {
	protected validate(props: CookieOptionsProps): void {
		if (props.maxAge <= 0) {
			throw new VoValidationError("maxAge는 0보다 커야 합니다.");
		}

		if (!props.path) {
			throw new VoValidationError("path는 필수입니다.");
		}
	}

	/**
	 * 팩토리 메서드 - 기본 옵션
	 */
	public static create(
		maxAge: number,
		isProduction = process.env.NODE_ENV === "production",
	): CookieOptionsVo {
		return new CookieOptionsVo({
			maxAge,
			httpOnly: true,
			secure: isProduction,
			sameSite: "strict",
			path: "/",
		});
	}

	/**
	 * JWT 만료 시간으로부터 생성
	 */
	public static fromJwtExpiration(
		expiration: JwtExpiration,
		isProduction = process.env.NODE_ENV === "production",
	): CookieOptionsVo {
		return CookieOptionsVo.create(expiration.toMilliseconds(), isProduction);
	}

	/**
	 * Express CookieOptions로 변환
	 */
	public toExpressCookieOptions(): CookieOptions {
		return {
			httpOnly: this.props.httpOnly,
			secure: this.props.secure,
			sameSite: this.props.sameSite,
			maxAge: this.props.maxAge,
			path: this.props.path,
		};
	}

	/**
	 * 속성 접근자
	 */
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
