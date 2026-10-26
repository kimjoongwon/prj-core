import { AlbumEntry } from "@cocrepo/entity";
import { AlbumDto } from "../album/album.dto";
import { AssetDto } from "../asset/asset.dto";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class AlbumEntryDto extends EntityResponseType(AlbumEntry, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"albumId",
		"assetId",
		"position",
		"caption",
		"createdById",
		"album",
		"asset",
	],
	relations: { album: () => AlbumDto, asset: () => AssetDto },
}) {
	declare album?: AlbumDto;
	declare asset?: AssetDto;
}
