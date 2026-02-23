import type { Album as AlbumEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { AlbumEntry } from "./album-entry.entity";
import type { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Album extends AbstractEntity implements AlbumEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: string;
	name!: string;
	sortOrder!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	description!: string | null;
	coverAssetId!: string | null;
	creatorId!: string | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	coverAsset?: Asset | null;
	creator?: User | null;
	entries?: AlbumEntry[];

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 커버 이미지가 설정되어 있는지 확인합니다
	 */
	hasCover(): boolean {
		return this.coverAssetId !== null;
	}

	/**
	 * 앨범에 포함된 엔트리 수를 반환합니다
	 */
	getEntryCount(): number {
		return this.entries?.length ?? 0;
	}

	/**
	 * 앨범에 포함된 에셋 수를 반환합니다
	 * @deprecated getEntryCount()를 사용하세요
	 */
	getAssetCount(): number {
		return this.getEntryCount();
	}
}
