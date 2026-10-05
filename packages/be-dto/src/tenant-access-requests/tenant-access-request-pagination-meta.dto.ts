import { NumberField } from "@cocrepo/decorator/field";

export class TenantAccessRequestPaginationMetaDto {
	@NumberField({ description: "전체 신청 수" })
	total!: number;

	@NumberField({ description: "건너뛴 항목 수 (offset)" })
	skip!: number;

	@NumberField({ description: "조회 항목 수" })
	take!: number;

	@NumberField({ description: "전체 페이지 수" })
	totalPages!: number;
}
