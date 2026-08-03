import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	NumberField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { AlbumEntry } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "../abstract.dto";
import { AlbumDto } from "../album/album.dto";
import { AssetDto } from "../asset/asset.dto";

/**
 * 앨범 엔트리 DTO
 */
export class AlbumEntryDto
	extends AbstractDto
	implements DomainEntityModel<AlbumEntry, "albumEntryId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly albumEntryId?: never;

	@BigIntIdField({ description: "소속 Space ID" })
	spaceId!: bigint;

	@BigIntIdField({ description: "앨범 ID" })
	albumId!: bigint;

	@BigIntIdField({ description: "에셋 ID" })
	assetId!: bigint;

	@NumberField({ description: "표시 순서", int: true })
	position!: number;

	@StringFieldOptional({ nullable: true, description: "캡션" })
	caption!: string | null;

	@BigIntIdFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

	// 관계 필드
	@ClassField(() => AlbumDto, { required: false, description: "소속 앨범" })
	album?: AlbumDto;

	@ClassField(() => AssetDto, { required: false, description: "에셋 정보" })
	asset?: AssetDto;
}
