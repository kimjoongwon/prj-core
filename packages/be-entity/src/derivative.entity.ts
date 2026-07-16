import type {
	Derivative as DerivativeEntity,
	DerivativeKind,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Derivative extends AbstractEntity implements DerivativeEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: string;
	createdById!: string | null;
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
	createdBy?: User | null;
	asset?: Asset;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

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
}
