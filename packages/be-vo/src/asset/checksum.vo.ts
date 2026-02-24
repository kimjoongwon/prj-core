import { createHash } from "node:crypto";
import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";

interface ChecksumProps {
	algorithm: "md5" | "sha256" | "sha512";
	value: string;
}

/**
 * 체크섬(해시) Value Object
 *
 * - MD5, SHA-256, SHA-512 알고리즘 지원
 * - 알고리즘별 올바른 길이와 형식 검증
 * - 파일 무결성 검증에 사용
 */
export class Checksum extends ValueObject<ChecksumProps> {
	/** 알고리즘별 길이 */
	private static readonly LENGTHS: Record<string, number> = {
		md5: 32,
		sha256: 64,
		sha512: 128,
	};

	/** hex 형식 정규식 */
	private static readonly HEX_REGEX = /^[a-f0-9]+$/;

	/** 지원 알고리즘 */
	private static readonly SUPPORTED_ALGORITHMS = ["md5", "sha256", "sha512"];

	protected validate(props: ChecksumProps): void {
		const { algorithm, value } = props;

		if (!algorithm) {
			throw new VoValidationError("알고리즘은 필수입니다.");
		}

		if (!value) {
			throw new VoValidationError("체크섬 값은 필수입니다.");
		}

		if (!Checksum.SUPPORTED_ALGORITHMS.includes(algorithm)) {
			throw new VoValidationError(
				`지원하지 않는 알고리즘입니다: ${algorithm}`,
			);
		}

		const expectedLength = Checksum.LENGTHS[algorithm];
		if (value.length !== expectedLength) {
			const algorithmName = algorithm.toUpperCase().replace("SHA", "SHA-");
			throw new VoValidationError(
				`${algorithmName} 체크섬은 ${expectedLength}자여야 합니다.`,
			);
		}

		if (!Checksum.HEX_REGEX.test(value)) {
			throw new VoValidationError(
				"체크섬 값은 소문자 hex 형식이어야 합니다.",
			);
		}
	}

	/**
	 * MD5 체크섬 생성 (32자 hex)
	 */
	public static md5(value: string): Checksum {
		return new Checksum({
			algorithm: "md5",
			value: value.toLowerCase(),
		});
	}

	/**
	 * SHA-256 체크섬 생성 (64자 hex)
	 */
	public static sha256(value: string): Checksum {
		return new Checksum({
			algorithm: "sha256",
			value: value.toLowerCase(),
		});
	}

	/**
	 * SHA-512 체크섬 생성 (128자 hex)
	 */
	public static sha512(value: string): Checksum {
		return new Checksum({
			algorithm: "sha512",
			value: value.toLowerCase(),
		});
	}

	/**
	 * "algorithm:value" 형식 문자열 파싱
	 */
	public static fromString(str: string): Checksum {
		const colonIndex = str.indexOf(":");
		if (colonIndex === -1) {
			throw new VoValidationError(
				"잘못된 체크섬 형식입니다. 'algorithm:value' 형식이어야 합니다.",
			);
		}

		const algorithm = str.slice(0, colonIndex).toLowerCase();
		const value = str.slice(colonIndex + 1);

		if (!Checksum.SUPPORTED_ALGORITHMS.includes(algorithm)) {
			throw new VoValidationError(
				`지원하지 않는 알고리즘입니다: ${algorithm}`,
			);
		}

		return new Checksum({
			algorithm: algorithm as ChecksumProps["algorithm"],
			value: value.toLowerCase(),
		});
	}

	/**
	 * 알고리즘 반환
	 */
	public get algorithm(): "md5" | "sha256" | "sha512" {
		return this.props.algorithm;
	}

	/**
	 * 해시 값 반환
	 */
	public get value(): string {
		return this.props.value;
	}

	/**
	 * "algorithm:value" 형식 반환
	 */
	public toString(): string {
		return `${this.props.algorithm}:${this.props.value}`;
	}

	/**
	 * Buffer 내용의 해시와 비교
	 */
	public async verify(content: Buffer): Promise<boolean> {
		const hash = createHash(this.props.algorithm)
			.update(content)
			.digest("hex");
		return hash === this.props.value;
	}
}
