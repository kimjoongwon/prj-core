import type {
	Derivative as DerivativeEntity,
	DerivativeKind,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Asset } from "./asset.entity";
import type { Space } from "./space.entity";

export class Derivative extends AbstractEntity implements DerivativeEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: string;
	assetId!: string;
	kind!: DerivativeKind;
	profile!: string;
	storageKey!: string;
	mimeType!: string;
	sizeBytes!: bigint; // BigInt 타입

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	width!: number | null;
	height!: number | null;
	durationMs!: number | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	asset?: Asset;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 이미지 파일인지 확인합니다 (MIME 타입 기반)
	 */
	isImage(): boolean {
		return this.mimeType.startsWith("image/");
	}

	/**
	 * 비디오 파일인지 확인합니다 (MIME 타입 기반)
	 */
	isVideo(): boolean {
		return this.mimeType.startsWith("video/");
	}

	/**
	 * 썸네일인지 확인합니다
	 */
	isThumbnail(): boolean {
		return this.kind === "THUMBNAIL";
	}

	/**
	 * 프리뷰인지 확인합니다
	 */
	isPreview(): boolean {
		return this.kind === "PREVIEW";
	}

	/**
	 * 트랜스코딩된 비디오인지 확인합니다
	 */
	isTranscode(): boolean {
		return this.kind === "TRANSCODE";
	}

	/**
	 * 추출된 텍스트인지 확인합니다
	 */
	isText(): boolean {
		return this.kind === "TEXT";
	}

	/**
	 * 사람이 읽기 쉬운 크기를 반환합니다
	 */
	getHumanReadableSize(): string {
		const bytes = Number(this.sizeBytes);
		if (bytes === 0) return "0 B";

		const units = ["B", "KB", "MB", "GB", "TB"];
		const k = 1024;
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const size = bytes / k ** i;

		return i === 0
			? `${bytes} ${units[i]}`
			: `${size.toFixed(size < 10 ? 1 : 0)} ${units[i]}`;
	}

	/**
	 * 해상도 문자열을 반환합니다 (이미지/비디오인 경우)
	 */
	getResolution(): string | null {
		if (this.width !== null && this.height !== null) {
			return `${this.width}x${this.height}`;
		}
		return null;
	}

	/**
	 * 해상도 라벨을 반환합니다 (SD, HD, Full HD, 4K 등)
	 */
	getResolutionLabel(): string | null {
		if (this.width === null || this.height === null) {
			return null;
		}

		const { width, height } = this;
		const max = Math.max(width, height);
		const min = Math.min(width, height);

		// 4K 이상
		if (max >= 3840) return "4K+";
		// 4K (UHD)
		if (max >= 2160) return "4K";
		// Full HD
		if (max >= 1920 || min >= 1080) return "Full HD";
		// HD
		if (max >= 1280 || min >= 720) return "HD";
		// SD
		if (max >= 640 || min >= 480) return "SD";
		// 저해상도
		return "Low";
	}
}
