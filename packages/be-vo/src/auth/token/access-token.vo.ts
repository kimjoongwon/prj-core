import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";

interface AccessTokenProps {
	value: string;
}

/**
 * Access Token Value Object
 *
 * - JWT 형식 검증
 * - 불변성 보장
 */
export class AccessToken extends ValueObject<AccessTokenProps> {
	private static readonly JWT_REGEX =
		/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

	protected validate(props: AccessTokenProps): void {
		const { value } = props;

		if (!value) {
			throw new VoValidationError("Access Token은 필수입니다.");
		}

		if (!AccessToken.JWT_REGEX.test(value)) {
			throw new VoValidationError("유효하지 않은 JWT 형식입니다.");
		}
	}

	/**
	 * 팩토리 메서드
	 */
	public static create(token: string): AccessToken {
		return new AccessToken({ value: token });
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
