import { Album } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 앨범 수정 DTO
 */
export class UpdateAlbumDto extends PartialType(
	PickType(Album, [
		"spaceId",
		"name",
		"description",
		"sortOrder",
		"coverAssetId",
		"createdById",
	] as const),
) {}
