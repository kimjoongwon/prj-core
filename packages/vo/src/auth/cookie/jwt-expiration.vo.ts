import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";

interface JwtExpirationProps {
	value: string | number;
}

/**
 * JWT 만료 시간 Value Object
 *
 * - JWT expiresIn 형식 파싱 ("15m", "7d", "24h", 3600)
 * - 밀리초 변환 로직 캡슐화
 */
export class JwtExpiration extends ValueObject<JwtExpirationProps> {
	private static readonly EXPIRATION_REGEX = /^(\d+)([smhd])$/;

	private readonly milliseconds: number;

	protected validate(props: JwtExpirationProps): void {
		const { value } = props;

		if (value === null || value === undefined) {
			throw new VoValidationError("만료 시간은 필수입니다.");
		}

		// 숫자인 경우 초 단위로 간주
		if (typeof value === "number") {
			if (value <= 0) {
				throw new VoValidationError("만료 시간은 0보다 커야 합니다.");
			}
			return;
		}

		// 문자열인 경우 형식 검증
		if (!JwtExpiration.EXPIRATION_REGEX.test(value)) {
			throw new VoValidationError(
				`유효하지 않은 만료 시간 형식입니다: ${value}. 예: "15m", "7d", "24h"`,
			);
		}
	}

	constructor(props: JwtExpirationProps) {
		super(props);
		this.milliseconds = this.parseToMilliseconds(props.value);
	}

	/**
	 * 팩토리 메서드
	 */
	public static create(expiresIn: string | number): JwtExpiration {
		return new JwtExpiration({ value: expiresIn });
	}

	/**
	 * 밀리초로 변환
	 */
	private parseToMilliseconds(expiresIn: string | number): number {
		if (typeof expiresIn === "number") {
			return expiresIn * 1000; // 초를 밀리초로 변환
		}

		const match = expiresIn.match(JwtExpiration.EXPIRATION_REGEX);
		if (!match) {
			throw new VoValidationError(`파싱 실패: ${expiresIn}`);
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
	 * 밀리초 반환
	 */
	public toMilliseconds(): number {
		return this.milliseconds;
	}

	/**
	 * 초 반환
	 */
	public toSeconds(): number {
		return Math.floor(this.milliseconds / 1000);
	}

	/**
	 * 원본 값 반환
	 */
	public get value(): string | number {
		return this.props.value;
	}
}
