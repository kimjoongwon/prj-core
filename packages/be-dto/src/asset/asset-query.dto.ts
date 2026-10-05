import {
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { DeleteFilter } from "@cocrepo/enum";
import { Transform } from "class-transformer";
import { EntityQueryType } from "../query/entity-query-type";
import { Asset } from "@cocrepo/entity";

/**
 * 에셋 목록 조회용 Query DTO
 *
 * 필터 계약:
 * - folderId, tenantId -> 정확 매칭 (*Id)
 * - kind, status -> 직접 매핑 (enum)
 *
 * 커스텀 처리:
 * - search -> originalName 부분 일치
 * - statusFilter -> removedAt 필터
 */
export class AssetQueryDto extends EntityQueryType(Asset, [
	"folderId",
	"spaceId",
	"kind",
	"status",
] as const) {
	@StringFieldOptional({ description: "파일명 검색 (부분 일치)" })
	search?: string;

	@EnumFieldOptional(() => DeleteFilter, {
		description: "상태 필터 (active: 활성, deleted: 삭제됨)",
	})
	statusFilter?: DeleteFilter;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, originalName, sizeBytes. 예: ?sort=originalName&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];
}
