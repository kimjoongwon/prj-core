import { ValueObject } from "../common/value-object.base";
import { VoValidationError } from "../errors/vo.error";

interface StorageKeyProps {
	value: string;
}

/**
 * 스토리지 키 Value Object
 *
 * - S3/Object Storage 경로 표현
 * - 스토리지 키 형식 검증
 * - 경로 조작, 확장자 추출 등의 기능 제공
 * - 파일 업로드 시 안전한 키 생성 보장
 */
export class StorageKey extends ValueObject<StorageKeyProps> {
	/** 최대 길이 */
	private static readonly MAX_LENGTH = 1024;

	/** 허용 문자 정규식 */
	private static readonly ALLOWED_CHARS_REGEX = /^[a-zA-Z0-9\-_.\/]+$/;

	protected validate(props: StorageKeyProps): void {
		const { value } = props;

		if (!value) {
			throw new VoValidationError("스토리지 키는 필수입니다.");
		}

		if (value.length < 1) {
			throw new VoValidationError(
				"스토리지 키는 최소 1자 이상이어야 합니다.",
			);
		}

		if (value.length > StorageKey.MAX_LENGTH) {
			throw new VoValidationError(
				`스토리지 키는 최대 ${StorageKey.MAX_LENGTH}자까지 가능합니다.`,
			);
		}

		if (value.includes(" ")) {
			throw new VoValidationError(
				"스토리지 키에 공백을 포함할 수 없습니다.",
			);
		}

		if (!StorageKey.ALLOWED_CHARS_REGEX.test(value)) {
			throw new VoValidationError(
				`스토리지 키에 허용되지 않는 문자가 포함되어 있습니다: ${value}`,
			);
		}

		if (value.startsWith("/")) {
			throw new VoValidationError(
				"스토리지 키는 슬래시(/)로 시작할 수 없습니다.",
			);
		}

		if (value.endsWith("/")) {
			throw new VoValidationError(
				"스토리지 키는 슬래시(/)로 끝날 수 없습니다.",
			);
		}
	}

	/**
	 * 경로 문자열로부터 생성 (유효성 검사 수행)
	 */
	public static fromPath(path: string): StorageKey {
		return new StorageKey({ value: path });
	}

	/**
	 * prefix와 filename을 조합하여 안전한 키 생성
	 */
	public static generate(prefix: string, filename: string): StorageKey {
		const key = prefix ? `${prefix}/${filename}` : filename;
		return new StorageKey({ value: key });
	}

	/**
	 * 스토리지 키 문자열 반환
	 */
	public get value(): string {
		return this.props.value;
	}

	/**
	 * 파일 확장자 추출 (점 제외, 소문자)
	 * 예: "profile.png" → "png"
	 */
	public getExtension(): string {
		const filename = this.getFilename();
		const lastDotIndex = filename.lastIndexOf(".");
		if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
			return "";
		}
		return filename.slice(lastDotIndex + 1).toLowerCase();
	}

	/**
	 * 디렉토리 경로 추출 (파일명 제외)
	 * 예: "uploads/images/profile.png" → "uploads/images"
	 */
	public getDirectory(): string {
		const lastSlashIndex = this.props.value.lastIndexOf("/");
		if (lastSlashIndex === -1) {
			return "";
		}
		return this.props.value.slice(0, lastSlashIndex);
	}

	/**
	 * 파일명 추출 (디렉토리 제외)
	 * 예: "uploads/images/profile.png" → "profile.png"
	 */
	public getFilename(): string {
		const lastSlashIndex = this.props.value.lastIndexOf("/");
		if (lastSlashIndex === -1) {
			return this.props.value;
		}
		return this.props.value.slice(lastSlashIndex + 1);
	}

	/**
	 * 스토리지 키 문자열 반환
	 */
	public toString(): string {
		return this.props.value;
	}
}
