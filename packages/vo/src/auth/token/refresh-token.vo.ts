import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";

interface RefreshTokenProps {
	value: string;
}

/**
 * Refresh Token Value Object
 *
 * - JWT 형식 검증
 * - 불변성 보장
 */
export class RefreshToken extends ValueObject<RefreshTokenProps> {
	private static readonly JWT_REGEX =
		/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

	protected validate(props: RefreshTokenProps): void {
		const { value } = props;

		if (!value) {
			throw new VoValidationError("Refresh Token은 필수입니다.");
		}

		if (!RefreshToken.JWT_REGEX.test(value)) {
			throw new VoValidationError("유효하지 않은 JWT 형식입니다.");
		}
	}

	/**
	 * 팩토리 메서드
	 */
	public static create(token: string): RefreshToken {
		return new RefreshToken({ value: token });
	}

	/**
	 * 값 반환
	 */
	public get value(): string {
		return this.props.value;
	}

	/**
	 * 문자열 표현
	 */
	public toString(): string {
		return this.props.value;
	}
}
