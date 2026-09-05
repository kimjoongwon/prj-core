import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { AlbumEntry } from "./album-entry.entity";
import { Asset } from "./asset.entity";
import type { Space } from "./space.entity";
import { User } from "./user.entity";

export class Album extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	albumId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@BigIntIdField({ description: "소속 Space ID" })
	spaceId!: bigint;
	@StringField({ description: "앨범명" })
	name!: string;
	@NumberField({ description: "정렬 순서", int: true })
	sortOrder!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldOptional({ nullable: true, description: "앨범 설명" })
	description!: string | null;
	@BigIntIdFieldOptional({ nullable: true, description: "커버 에셋 ID" })
	coverAssetId!: bigint | null;
	@BigIntIdFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

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
