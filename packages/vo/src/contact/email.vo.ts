import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";

interface EmailProps {
	value: string;
}

/**
 * 이메일 Value Object
 *
 * - RFC 5322 표준 형식 검증
 * - 자동 소문자 변환
 * - 불변성 보장
 */
export class Email extends ValueObject<EmailProps> {
	private static readonly EMAIL_REGEX =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

	protected validate(props: EmailProps): void {
		const { value } = props;

		if (!value) {
			throw new VoValidationError("이메일은 필수입니다.");
		}

		if (!Email.EMAIL_REGEX.test(value)) {
			throw new VoValidationError(`유효하지 않은 이메일 형식입니다: ${value}`);
		}
	}

	/**
	 * 팩토리 메서드 (자동 소문자 변환)
	 */
	public static create(email: string): Email {
		const normalized = email.trim().toLowerCase();
		return new Email({ value: normalized });
	}

	/**
	 * 값 반환
	 */
	public get value(): string {
		return this.props.value;
	}

	/**
	 * 도메인 추출
	 */
	public getDomain(): string {
		return this.props.value.split("@")[1];
	}

	/**
	 * 로컬 파트 추출
	 */
	public getLocalPart(): string {
		return this.props.value.split("@")[0];
	}

	/**
	 * 문자열 표현
	 */
	public toString(): string {
		return this.props.value;
	}
}
