import { AbstractEntity } from "./abstract.entity";
import type { Album } from "./album.entity";
import type { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class AlbumEntry extends AbstractEntity {
	/** 공개 식별자 ULID */
	albumEntryId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: bigint;
	albumId!: bigint;
	assetId!: bigint;
	position!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	caption!: string | null;
	createdById!: bigint | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	createdBy?: User | null;
	album?: Album;
	asset?: Asset;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 캡션이 있는지 확인합니다
	 */
	hasCaption(): boolean {
		return this.caption !== null && this.caption.length > 0;
	}
}
