import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";

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

interface CookieProps {
	maxAge: number;
	httpOnly: boolean;
	secure: boolean;
	sameSite: "strict" | "lax" | "none";
	path: string;
}

/**
 * JWT 만료 시간을 밀리초로 변환
 * @param expiresIn - "15m", "7d", "24h", 3600 등
 */
function parseExpiration(expiresIn: string | number): number {
	// 숫자인 경우 초 단위로 간주
	if (typeof expiresIn === "number") {
		if (expiresIn <= 0) {
			throw new VoValidationError("만료 시간은 0보다 커야 합니다.");
		}
		return expiresIn * 1000;
	}

	const regex = /^(\d+)([smhd])$/;
	const match = expiresIn.match(regex);

	if (!match) {
		throw new VoValidationError(
			`유효하지 않은 만료 시간 형식입니다: ${expiresIn}. 예: "15m", "7d", "24h"`,
		);
	}

	const value = Number.parseInt(match[1], 10);
	const unit = match[2];

	const unitToMs: Record<string, number> = {
		s: 1000,
		m: 60 * 1000,
		h: 60 * 60 * 1000,
		d: 24 * 60 * 60 * 1000,
	};

	return value * unitToMs[unit];
}

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
