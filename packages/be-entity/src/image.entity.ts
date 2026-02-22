import type { Image as ImageEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Asset } from "./asset.entity";

export class Image extends AbstractEntity implements ImageEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	width!: number;
	height!: number;
	hasAlpha!: boolean;
	assetId!: string;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	orientation!: number | null;
	colorSpace!: string | null;

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
