import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { AlbumDto } from "./album.dto";

/**
 * 앨범 생성 DTO
 */
export class CreateAlbumDto extends OmitType(AlbumDto, [
	...COMMON_ENTITY_FIELDS,
	"coverAsset",
] as const) {}
