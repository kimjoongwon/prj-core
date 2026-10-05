import { Album } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

/**
 * 앨범 생성 DTO
 */
export class CreateAlbumDto extends PickType(Album, [
	"spaceId",
	"name",
	"description",
	"sortOrder",
	"coverAssetId",
	"createdById",
] as const) {}
