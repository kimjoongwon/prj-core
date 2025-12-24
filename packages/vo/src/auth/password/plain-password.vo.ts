import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";

interface PlainPasswordProps {
	value: string;
}

/**
 * 평문 비밀번호 Value Object
 *
 * - 최소 8자, 최대 72자 (bcrypt 제한)
 * - 영문, 숫자, 특수문자 조합 검증
 */
export class PlainPassword extends ValueObject<PlainPasswordProps> {
	private static readonly MIN_LENGTH = 8;
	private static readonly MAX_LENGTH = 72;
	private static readonly PASSWORD_REGEX = /^[\d!#$%&*@A-Z^a-z]*$/;

	protected validate(props: PlainPasswordProps): void {
		const { value } = props;

		if (!value) {
			throw new VoValidationError("비밀번호는 필수입니다.");
		}

		if (value.length < PlainPassword.MIN_LENGTH) {
			throw new VoValidationError(
				`비밀번호는 최소 ${PlainPassword.MIN_LENGTH}자 이상이어야 합니다.`,
			);
		}

		if (value.length > PlainPassword.MAX_LENGTH) {
			throw new VoValidationError(
				`비밀번호는 최대 ${PlainPassword.MAX_LENGTH}자를 초과할 수 없습니다.`,
			);
		}

		if (!PlainPassword.PASSWORD_REGEX.test(value)) {
			throw new VoValidationError(
				"비밀번호는 영문, 숫자, 특수문자만 포함할 수 있습니다.",
			);
		}
	}

	/**
	 * 팩토리 메서드
	 */
	public static create(password: string): PlainPassword {
		return new PlainPassword({ value: password });
	}

	/**
	 * 값 반환
	 */
	public get value(): string {
		return this.props.value;
	}

	/**
	 * 문자열 표현 (보안상 마스킹)
	 */
	public toString(): string {
		return "********";
	}
}
