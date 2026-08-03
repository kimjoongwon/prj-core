import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Album } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "../abstract.dto";
import { AssetDto } from "../asset/asset.dto";

/**
 * 앨범 DTO
 */
export class AlbumDto
	extends AbstractDto
	implements DomainEntityModel<Album, "albumId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly albumId?: never;

	@BigIntIdField({ description: "소속 Space ID" })
	spaceId!: bigint;

	@StringField({ description: "앨범명" })
	name!: string;

	@StringFieldOptional({ nullable: true, description: "앨범 설명" })
	description!: string | null;

	@NumberField({ description: "정렬 순서", int: true })
	sortOrder!: number;

	@BigIntIdFieldOptional({ nullable: true, description: "커버 에셋 ID" })
	coverAssetId!: bigint | null;

	@BigIntIdFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

	// 관계 필드
	@ClassField(() => AssetDto, { required: false, description: "커버 에셋" })
	coverAsset?: AssetDto;
}
