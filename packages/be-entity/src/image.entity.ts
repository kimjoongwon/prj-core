import { ImageSchema } from "@cocrepo/schema";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import type { Asset } from "./asset.entity";

@AbstractEntityFields()
export class Image extends ImageSchema {
	/** 공개 식별자 ULID */
	declare imageId: ImageSchema["imageId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	declare width: ImageSchema["width"];
	declare height: ImageSchema["height"];
	declare hasAlpha: ImageSchema["hasAlpha"];
	declare assetId: ImageSchema["assetId"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	declare orientation: ImageSchema["orientation"];
	declare colorSpace: ImageSchema["colorSpace"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	asset?: Asset;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 가로세로 비율을 반환합니다 (width / height)
	 */
	getAspectRatio(): number {
		if (this.height === 0) return 0;
		return this.width / this.height;
	}

	/**
	 * 가로 방향 여부를 확인합니다
	 */
	isLandscape(): boolean {
		return this.width > this.height;
	}

	/**
	 * 세로 방향 여부를 확인합니다
	 */
	isPortrait(): boolean {
		return this.height > this.width;
	}

	/**
	 * 해상도 문자열을 반환합니다 (예: "1920x1080")
	 */
	getResolution(): string {
		return `${this.width}x${this.height}`;
	}

	/**
	 * 메가픽셀 수를 반환합니다
	 */
	getMegapixels(): number {
		const pixels = this.width * this.height;
		return Math.round(pixels / 1_000_000);
	}
}
