import { AbstractEntity } from "./abstract.entity";
import type { AlbumEntry } from "./album-entry.entity";
import type { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Album extends AbstractEntity {
	/** 공개 식별자 ULID */
	albumId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: bigint;
	name!: string;
	sortOrder!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	description!: string | null;
	coverAssetId!: bigint | null;
	createdById!: bigint | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	coverAsset?: Asset | null;
	createdBy?: User | null;
	entries?: AlbumEntry[];

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 앨범에 포함된 에셋 수를 반환합니다
	 */
	getAssetCount(): number {
		return this.entries?.length ?? 0;
	}

	/**
	 * 커버 이미지가 설정되어 있는지 확인합니다
	 */
	hasCover(): boolean {
		return this.coverAssetId !== null;
	}
}
