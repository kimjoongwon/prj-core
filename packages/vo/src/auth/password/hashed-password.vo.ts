import { compare, hash, hashSync } from "bcrypt";
import { ValueObject } from "../../common/value-object.base";
import { VoValidationError } from "../../errors/vo.error";
import { PlainPassword } from "./plain-password.vo";

interface HashedPasswordProps {
	value: string;
}

/**
 * 해시된 비밀번호 Value Object
 *
 * - bcrypt 해시 형식 검증
 * - 비밀번호 비교 로직 캡슐화
 * - 불변성 보장
 */
export class HashedPassword extends ValueObject<HashedPasswordProps> {
	private static readonly BCRYPT_REGEX = /^\$2[aby]\$\d{2}\$.{53}$/;
	private static readonly DEFAULT_SALT_ROUNDS = 10;

	protected validate(props: HashedPasswordProps): void {
		const { value } = props;

		if (!value) {
			throw new VoValidationError("해시된 비밀번호는 필수입니다.");
		}

		if (!HashedPassword.BCRYPT_REGEX.test(value)) {
			throw new VoValidationError("유효하지 않은 bcrypt 해시 형식입니다.");
		}
	}

	/**
	 * 평문 비밀번호를 해싱하여 생성 (비동기)
	 */
	public static async fromPlain(
		plainPassword: PlainPassword,
		saltRounds: number = HashedPassword.DEFAULT_SALT_ROUNDS,
	): Promise<HashedPassword> {
		const hashed = await hash(plainPassword.value, saltRounds);
		return new HashedPassword({ value: hashed });
	}

	/**
	 * 평문 비밀번호를 해싱하여 생성 (동기)
	 */
	public static fromPlainSync(
		plainPassword: PlainPassword,
		saltRounds: number = HashedPassword.DEFAULT_SALT_ROUNDS,
	): HashedPassword {
		const hashed = hashSync(plainPassword.value, saltRounds);
		return new HashedPassword({ value: hashed });
	}

	/**
	 * 이미 해시된 값으로 생성
	 */
	public static fromHash(hashedValue: string): HashedPassword {
		return new HashedPassword({ value: hashedValue });
	}

	/**
	 * 평문 비밀번호와 비교
	 */
	public async compare(plainPassword: PlainPassword): Promise<boolean> {
		return compare(plainPassword.value, this.props.value);
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
		return "[HASHED]";
	}
}
