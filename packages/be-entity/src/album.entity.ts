import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
	NumberFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { AlbumSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { AlbumEntry } from "./album-entry.entity";
import { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

@AbstractEntityFields()
export class Album extends AlbumSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare albumId: AlbumSchema["albumId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdFieldMetadata({ description: "소속 Space ID" })
	declare spaceId: AlbumSchema["spaceId"];
	@StringFieldMetadata({ description: "앨범명" })
	declare name: AlbumSchema["name"];
	@NumberFieldMetadata({ description: "정렬 순서", int: true })
	declare sortOrder: AlbumSchema["sortOrder"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldOptionalMetadata({ nullable: true, description: "앨범 설명" })
	declare description: AlbumSchema["description"];
	@BigIntIdFieldOptionalMetadata({
		nullable: true,
		description: "커버 에셋 ID",
	})
	declare coverAssetId: AlbumSchema["coverAssetId"];
	@BigIntIdFieldOptionalMetadata({ nullable: true, description: "생성자 ID" })
	declare createdById: AlbumSchema["createdById"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	@ClassField(() => Asset, { required: false, description: "커버 에셋" })
	coverAsset?: Asset | null;
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => AlbumEntry, {
		isArray: true,
		required: false,
		description: "앨범에 포함된 에셋 목록",
	})
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
