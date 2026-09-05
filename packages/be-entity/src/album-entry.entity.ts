import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	NumberField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Album } from "./album.entity";
import { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

export class AlbumEntry extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	albumEntryId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdField({ description: "소속 Space ID" })
	spaceId!: bigint;
	@BigIntIdField({ description: "앨범 ID" })
	albumId!: bigint;
	@BigIntIdField({ description: "에셋 ID" })
	assetId!: bigint;
	@NumberField({ description: "표시 순서", int: true })
	position!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldOptional({ nullable: true, description: "캡션" })
	caption!: string | null;
	@BigIntIdFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

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
