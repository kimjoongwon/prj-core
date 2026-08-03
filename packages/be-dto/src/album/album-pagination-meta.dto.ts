import { NumberField } from "@cocrepo/decorator/field";

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
