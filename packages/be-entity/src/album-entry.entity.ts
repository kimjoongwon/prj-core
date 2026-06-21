import type { AlbumEntry as AlbumEntryEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Album } from "./album.entity";
import type { Asset } from "./asset.entity";
import type { Tenant } from "./tenant.entity";

export class AlbumEntry extends AbstractEntity implements AlbumEntryEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	tenantId!: string;
	albumId!: string;
	assetId!: string;
	position!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	caption!: string | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	tenant?: Tenant;
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
