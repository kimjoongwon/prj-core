import type { AlbumEntry as AlbumEntryEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Album } from "./album.entity";
import type { Asset } from "./asset.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class AlbumEntry
	extends AbstractEntity
	implements DomainEntityModel<AlbumEntryEntity>
{
	// ============================================================================
	// 필수 필드
	// ============================================================================
	spaceId!: string;
	albumId!: string;
	assetId!: string;
	position!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	caption!: string | null;
	createdById!: string | null;

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
