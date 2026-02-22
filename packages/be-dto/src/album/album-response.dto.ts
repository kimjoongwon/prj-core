import { ClassField, NumberField } from "@cocrepo/decorator";
import { AlbumDto } from "./album.dto";
import { AlbumEntryDto } from "../album-entry/album-entry.dto";

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

/**
 * 앨범 상세 조회 래퍼 응답 DTO
 */
export class AlbumDetailWrapperResponseDto {
	@ClassField(() => AlbumDetailResponseDto, {
		description: "앨범 상세 정보",
	})
	data!: AlbumDetailResponseDto;
}

/**
 * 앨범 목록 메타 정보 DTO
 */
export class AlbumPaginationMetaDto {
	@NumberField({ description: "전체 개수" })
	total!: number;

	@NumberField({ description: "건너뛴 항목 수 (offset)" })
	skip!: number;

	@NumberField({ description: "조회 항목 수" })
	take!: number;

	@NumberField({ description: "전체 페이지 수" })
	totalPages!: number;
}
