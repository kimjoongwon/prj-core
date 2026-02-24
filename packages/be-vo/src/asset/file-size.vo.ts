import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";

interface FileSizeProps {
	bytes: bigint;
}

/**
 * 파일 크기 Value Object
 *
 * - 바이트 단위의 정확한 크기 저장
 * - KB/MB/GB 단위 변환 제공
 * - 사람이 읽기 쉬운 형식으로 변환
 * - 파일 업로드 크기 제한 검증에 활용
 */
export class FileSize extends ValueObject<FileSizeProps> {
	/** 단위 변환 상수 */
	private static readonly KB = 1024n;
	private static readonly MB = 1048576n; // 1024 * 1024
	private static readonly GB = 1073741824n; // 1024 * 1024 * 1024
	private static readonly TB = 1099511627776n; // 1024^4

	protected validate(props: FileSizeProps): void {
		const { bytes } = props;

		if (bytes === undefined || bytes === null) {
			throw new VoValidationError("파일 크기는 필수입니다.");
		}

		if (bytes < 0n) {
			throw new VoValidationError("파일 크기는 0 이상이어야 합니다.");
		}
	}

	/**
	 * 바이트 단위로 생성
	 */
	public static fromBytes(bytes: bigint | number): FileSize {
		const bytesBigInt = typeof bytes === "number" ? BigInt(bytes) : bytes;
		return new FileSize({ bytes: bytesBigInt });
	}

	/**
	 * 킬로바이트 단위로 생성
	 */
	public static fromKB(kilobytes: number): FileSize {
		const bytes = BigInt(Math.floor(kilobytes * 1024));
		return new FileSize({ bytes });
	}

	/**
	 * 메가바이트 단위로 생성
	 */
	public static fromMB(megabytes: number): FileSize {
		const bytes = BigInt(Math.floor(megabytes * 1024 * 1024));
		return new FileSize({ bytes });
	}

	/**
	 * 기가바이트 단위로 생성
	 */
	public static fromGB(gigabytes: number): FileSize {
		const bytes = BigInt(Math.floor(gigabytes * 1024 * 1024 * 1024));
		return new FileSize({ bytes });
	}

	/**
	 * 바이트 단위 크기 반환
	 */
	public get bytes(): bigint {
		return this.props.bytes;
	}

	/**
	 * 킬로바이트로 변환
	 */
	public toKB(): number {
		return Number(this.props.bytes) / Number(FileSize.KB);
	}

	/**
	 * 메가바이트로 변환
	 */
	public toMB(): number {
		return Number(this.props.bytes) / Number(FileSize.MB);
	}

	/**
	 * 기가바이트로 변환
	 */
	public toGB(): number {
		return Number(this.props.bytes) / Number(FileSize.GB);
	}

	/**
	 * 사람이 읽기 쉬운 형식 반환
	 * 예: "2.4 MB", "500 bytes"
	 */
	public toHumanReadable(): string {
		const bytes = this.props.bytes;

		if (bytes >= FileSize.TB) {
			return `${(Number(bytes) / Number(FileSize.TB)).toFixed(2)} TB`;
		}
		if (bytes >= FileSize.GB) {
			return `${(Number(bytes) / Number(FileSize.GB)).toFixed(2)} GB`;
		}
		if (bytes >= FileSize.MB) {
			return `${(Number(bytes) / Number(FileSize.MB)).toFixed(2)} MB`;
		}
		if (bytes >= FileSize.KB) {
			return `${(Number(bytes) / Number(FileSize.KB)).toFixed(2)} KB`;
		}
		return `${bytes} bytes`;
	}

	/**
	 * 다른 FileSize보다 큰지 비교
	 */
	public isLargerThan(other: FileSize): boolean {
		return this.props.bytes > other.bytes;
	}

	/**
	 * 다른 FileSize보다 작은지 비교
	 */
	public isSmallerThan(other: FileSize): boolean {
		return this.props.bytes < other.bytes;
	}

	/**
	 * 문자열 표현 (바이트 단위)
	 */
	public toString(): string {
		return `${this.props.bytes} bytes`;
	}
}
