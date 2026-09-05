import { AlbumEntry } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

/**
 * 앨범 엔트리 수정 DTO (캡션 등)
 */
export class UpdateAlbumEntryDto extends PickType(AlbumEntry, [
	"caption",
] as const) {}
