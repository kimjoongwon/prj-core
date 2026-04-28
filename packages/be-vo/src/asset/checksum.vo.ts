import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";

export type ChecksumAlgorithm = "md5" | "sha256" | "sha512";

interface ChecksumProps {
	algorithm: ChecksumAlgorithm;
	value: string;
}

export class Checksum extends ValueObject<ChecksumProps> {
	private static readonly HEX_REGEX = /^[a-f0-9]+$/;

	private static readonly LENGTH_BY_ALGORITHM: Record<
		ChecksumAlgorithm,
		number
	> = {
		md5: 32,
		sha256: 64,
		sha512: 128,
	};

	protected validate(props: ChecksumProps): void {
		const { algorithm, value } = props;

		if (!algorithm) {
			throw new VoValidationError("알고리즘은 필수입니다.");
		}

		if (!(algorithm in Checksum.LENGTH_BY_ALGORITHM)) {
			throw new VoValidationError(`지원하지 않는 알고리즘입니다: ${algorithm}`);
		}

		if (!value) {
			throw new VoValidationError("체크섬 값은 필수입니다.");
		}

		const expectedLength = Checksum.LENGTH_BY_ALGORITHM[algorithm];
		if (value.length !== expectedLength) {
			if (algorithm === "md5") {
				throw new VoValidationError("MD5 체크섬은 32자여야 합니다.");
			}

			if (algorithm === "sha256") {
				throw new VoValidationError("SHA-256 체크섬은 64자여야 합니다.");
			}

			throw new VoValidationError("SHA-512 체크섬은 128자여야 합니다.");
		}

		if (!Checksum.HEX_REGEX.test(value)) {
			throw new VoValidationError("체크섬 값은 소문자 hex 형식이어야 합니다.");
		}
	}

	public static md5(value: string): Checksum {
		return new Checksum({ algorithm: "md5", value: value.toLowerCase() });
	}

	public static sha256(value: string): Checksum {
		return new Checksum({ algorithm: "sha256", value: value.toLowerCase() });
	}

	public static sha512(value: string): Checksum {
		return new Checksum({ algorithm: "sha512", value: value.toLowerCase() });
	}

	public static fromString(str: string): Checksum {
		const [algorithm, value, ...rest] = str.split(":");
		if (!algorithm || !value || rest.length > 0) {
			throw new VoValidationError(
				"잘못된 체크섬 형식입니다. 'algorithm:value' 형식이어야 합니다.",
			);
		}

		if (
			algorithm !== "md5" &&
			algorithm !== "sha256" &&
			algorithm !== "sha512"
		) {
			throw new VoValidationError(`지원하지 않는 알고리즘입니다: ${algorithm}`);
		}

		return new Checksum({
			algorithm,
			value: value.toLowerCase(),
		});
	}

	public get algorithm(): ChecksumAlgorithm {
		return this.props.algorithm;
	}

	public get value(): string {
		return this.props.value;
	}

	public toString(): string {
		return `${this.props.algorithm}:${this.props.value}`;
	}
}
