import {
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Album } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";
import { AssetDto } from "../asset/asset.dto";

/**
 * 앨범 DTO
 */
export class AlbumDto extends AbstractDto implements Album {
	@UUIDField({ description: "소속 Tenant ID" })
	tenantId!: string;

	@StringField({ description: "앨범명" })
	name!: string;

	@StringFieldOptional({ nullable: true, description: "앨범 설명" })
	description!: string | null;

	@NumberField({ description: "정렬 순서", int: true })
	sortOrder!: number;

	@UUIDFieldOptional({ nullable: true, description: "커버 에셋 ID" })
	coverAssetId!: string | null;

	@UUIDFieldOptional({ nullable: true, description: "생성자 ID" })
	creatorId!: string | null;

	// 관계 필드
	@ClassField(() => AssetDto, { required: false, description: "커버 에셋" })
	coverAsset?: AssetDto;
}
