import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";

interface StorageKeyProps {
	value: string;
}

export class StorageKey extends ValueObject<StorageKeyProps> {
	private static readonly MAX_LENGTH = 1024;
	private static readonly ALLOWED_REGEX = /^[a-zA-Z0-9\-_.\/]+$/;

	protected validate(props: StorageKeyProps): void {
		const { value } = props;

		if (!value) {
			throw new VoValidationError("스토리지 키는 필수입니다.");
		}

		if (value.length < 1) {
			throw new VoValidationError("스토리지 키는 최소 1자 이상이어야 합니다.");
		}

		if (value.length > StorageKey.MAX_LENGTH) {
			throw new VoValidationError("스토리지 키는 최대 1024자까지 가능합니다.");
		}

		if (/\s/.test(value)) {
			throw new VoValidationError("스토리지 키에 공백을 포함할 수 없습니다.");
		}

		if (value.startsWith("/")) {
			throw new VoValidationError(
				"스토리지 키는 슬래시(/)로 시작할 수 없습니다.",
			);
		}

		if (value.endsWith("/")) {
			throw new VoValidationError("스토리지 키는 슬래시(/)로 끝날 수 없습니다.");
		}

		if (!StorageKey.ALLOWED_REGEX.test(value)) {
			throw new VoValidationError(
				`스토리지 키에 허용되지 않는 문자가 포함되어 있습니다: ${value}`,
			);
		}
	}

	public static fromPath(path: string): StorageKey {
		return new StorageKey({ value: path });
	}

	public static generate(prefix: string, filename: string): StorageKey {
		const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, "");
		const normalizedFilename = filename.replace(/^\/+|\/+$/g, "");
		const key = normalizedPrefix
			? `${normalizedPrefix}/${normalizedFilename}`
			: normalizedFilename;

		return new StorageKey({ value: key });
	}

	public get value(): string {
		return this.props.value;
	}

	public getExtension(): string {
		const filename = this.getFilename();
		const lastDotIndex = filename.lastIndexOf(".");

		if (lastDotIndex < 1 || lastDotIndex === filename.length - 1) {
			return "";
		}

		return filename.slice(lastDotIndex + 1).toLowerCase();
	}

	public getDirectory(): string {
		const lastSlashIndex = this.props.value.lastIndexOf("/");
		if (lastSlashIndex < 0) return "";
		return this.props.value.slice(0, lastSlashIndex);
	}

	public getFilename(): string {
		const lastSlashIndex = this.props.value.lastIndexOf("/");
		if (lastSlashIndex < 0) return this.props.value;
		return this.props.value.slice(lastSlashIndex + 1);
	}

	public toString(): string {
		return this.props.value;
	}
}
