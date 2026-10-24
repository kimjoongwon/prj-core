import { Album } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 앨범 수정 DTO
 */
export class UpdateAlbumDto extends PartialType(
	PickType(Album, [
		"spaceSeq",
		"name",
		"description",
		"sortOrder",
		"coverAssetSeq",
		"createdBySeq",
	] as const),
) {}
