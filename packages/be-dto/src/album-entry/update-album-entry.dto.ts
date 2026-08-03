import { StringFieldOptional } from "@cocrepo/decorator/field";

/**
 * 앨범 엔트리 수정 DTO (캡션 등)
 */
export class UpdateAlbumEntryDto {
	@StringFieldOptional({ nullable: true, description: "캡션" })
	caption?: string | null;
}
