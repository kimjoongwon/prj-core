import { Album } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

/**
 * 앨범 생성 DTO
 */
export class CreateAlbumDto extends PickType(Album, [
	"spaceSeq",
	"name",
	"description",
	"sortOrder",
	"coverAssetSeq",
	"createdBySeq",
] as const) {}
