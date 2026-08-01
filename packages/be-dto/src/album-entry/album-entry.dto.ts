import {
	ClassField,
	NumberField,
	StringFieldOptional,
	ULIDField,
	ULIDFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { AlbumEntry } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";
import { AlbumDto } from "../album/album.dto";
import { AssetDto } from "../asset/asset.dto";

/**
 * 앨범 엔트리 DTO
 */
export class AlbumEntryDto
	extends AbstractDto
	implements DomainEntityModel<AlbumEntry>
{
	@ULIDField({ description: "소속 Space ID" })
	spaceId!: string;

	@ULIDField({ description: "앨범 ID" })
	albumId!: string;

	@ULIDField({ description: "에셋 ID" })
	assetId!: string;

	@NumberField({ description: "표시 순서", int: true })
	position!: number;

	@StringFieldOptional({ nullable: true, description: "캡션" })
	caption!: string | null;

	@ULIDFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: string | null;

	// 관계 필드
	@ClassField(() => AlbumDto, { required: false, description: "소속 앨범" })
	album?: AlbumDto;

	@ClassField(() => AssetDto, { required: false, description: "에셋 정보" })
	asset?: AssetDto;
}
