import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";

interface FileSizeProps {
	bytes: bigint;
}

export class FileSize extends ValueObject<FileSizeProps> {
	private static readonly KB = 1024n;
	private static readonly MB = 1024n * 1024n;
	private static readonly GB = 1024n * 1024n * 1024n;
	private static readonly TB = 1024n * 1024n * 1024n * 1024n;

	protected validate(props: FileSizeProps): void {
		const { bytes } = props;

		if (bytes === null || bytes === undefined) {
			throw new VoValidationError("파일 크기는 필수입니다.");
		}

		if (bytes < 0n) {
			throw new VoValidationError("파일 크기는 0 이상이어야 합니다.");
		}
	}

	public static fromBytes(bytes: bigint | number): FileSize {
		const value = typeof bytes === "number" ? BigInt(bytes) : bytes;
		return new FileSize({ bytes: value });
	}

	public static fromKB(kilobytes: number): FileSize {
		if (!Number.isFinite(kilobytes) || kilobytes < 0) {
			throw new VoValidationError("파일 크기는 0 이상이어야 합니다.");
		}

		return new FileSize({
			bytes: BigInt(Math.round(kilobytes * 1024)),
		});
	}

	public static fromMB(megabytes: number): FileSize {
		if (!Number.isFinite(megabytes) || megabytes < 0) {
			throw new VoValidationError("파일 크기는 0 이상이어야 합니다.");
		}

		return new FileSize({
			bytes: BigInt(Math.round(megabytes * 1024 * 1024)),
		});
	}

	public static fromGB(gigabytes: number): FileSize {
		if (!Number.isFinite(gigabytes) || gigabytes < 0) {
			throw new VoValidationError("파일 크기는 0 이상이어야 합니다.");
		}

		return new FileSize({
			bytes: BigInt(Math.round(gigabytes * 1024 * 1024 * 1024)),
		});
	}

	public get bytes(): bigint {
		return this.props.bytes;
	}

	public toKB(): number {
		return Number(this.props.bytes) / Number(FileSize.KB);
	}

	public toMB(): number {
		return Number(this.props.bytes) / Number(FileSize.MB);
	}

	public toGB(): number {
		return Number(this.props.bytes) / Number(FileSize.GB);
	}

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

	public isLargerThan(other: FileSize): boolean {
		return this.props.bytes > other.bytes;
	}

	public isSmallerThan(other: FileSize): boolean {
		return this.props.bytes < other.bytes;
	}

	public toString(): string {
		return `${this.props.bytes} bytes`;
	}
}
