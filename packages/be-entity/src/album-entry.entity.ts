import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
	NumberFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { AlbumEntrySchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Album } from "./album.entity";
import { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

@AbstractEntityFields()
export class AlbumEntry extends AlbumEntrySchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare albumEntryId: AlbumEntrySchema["albumEntryId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdFieldMetadata({ description: "소속 Space ID" })
	declare spaceId: AlbumEntrySchema["spaceId"];
	@BigIntIdFieldMetadata({ description: "앨범 ID" })
	declare albumId: AlbumEntrySchema["albumId"];
	@BigIntIdFieldMetadata({ description: "에셋 ID" })
	declare assetId: AlbumEntrySchema["assetId"];
	@NumberFieldMetadata({ description: "표시 순서", int: true })
	declare position: AlbumEntrySchema["position"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldOptionalMetadata({ nullable: true, description: "캡션" })
	declare caption: AlbumEntrySchema["caption"];
	@BigIntIdFieldOptionalMetadata({ nullable: true, description: "생성자 ID" })
	declare createdById: AlbumEntrySchema["createdById"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	space?: Space;
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => Album, { required: false, description: "소속 앨범" })
	album?: Album;
	@ClassField(() => Asset, { required: false, description: "에셋 정보" })
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
