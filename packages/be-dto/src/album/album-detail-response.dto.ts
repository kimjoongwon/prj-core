import { Album } from "@cocrepo/entity";
import { AlbumEntryDto } from "../album-entry/album-entry.dto";
import { AssetDto } from "../asset/asset.dto";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class AlbumDetailResponseDto extends EntityResponseType(Album, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"name",
		"description",
		"sortOrder",
		"coverAssetId",
		"createdById",
		"coverAsset",
		"entries",
	],
	relations: { coverAsset: () => AssetDto, entries: () => AlbumEntryDto },
}) {
	declare coverAsset?: AssetDto;
	declare entries?: AlbumEntryDto[];
}
