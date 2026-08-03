import { ClassField } from "@cocrepo/decorator/field";
import { AlbumEntryDto } from "../album-entry/album-entry.dto";
import { AlbumDto } from "./album.dto";

/**
 * 앨범 상세 응답 DTO
 */
export class AlbumDetailResponseDto extends AlbumDto {
	@ClassField(() => AlbumEntryDto, {
		isArray: true,
		required: false,
		description: "앨범에 포함된 에셋 목록",
	})
	entries?: AlbumEntryDto[];
}
