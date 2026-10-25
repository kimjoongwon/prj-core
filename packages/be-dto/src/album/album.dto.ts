import { Album } from "@cocrepo/entity";
import { AssetDto } from "../asset/asset.dto";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class AlbumDto extends EntityResponseType(Album, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"name",
		"description",
		"sortOrder",
		"coverAsset",
	],
	relations: { coverAsset: () => AssetDto },
}) {
	declare coverAsset?: AssetDto;
}
