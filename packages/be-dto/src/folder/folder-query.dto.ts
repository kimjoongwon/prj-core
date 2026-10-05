import {
	BigIntIdFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { DeleteFilter } from "@cocrepo/enum";
import { Transform } from "class-transformer";
import { EntityQueryType } from "../query/entity-query-type";
import { Folder } from "@cocrepo/entity";

/**
 * 폴더 목록 조회용 Query DTO
 *
 * 필터 계약:
 * - name -> containsFilter (일반 string)
 * - parentFolderId, tenantId -> 정확 매칭 (*Id)
 *
 * 커스텀 처리:
 * - statusFilter -> removedAt 필터
 */
export class FolderQueryDto extends EntityQueryType(Folder, [
	"spaceId",
] as const) {
	@BigIntIdFieldOptional({ description: "상위 폴더 ID 필터 (null이면 루트)" })
	parentFolderId?: bigint;

	@StringFieldOptional({ description: "폴더명 검색 (부분 일치)" })
	name?: string;

	@EnumFieldOptional(() => DeleteFilter, {
		description: "상태 필터 (active: 활성, deleted: 삭제됨)",
	})
	statusFilter?: DeleteFilter;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name, sortOrder. 예: ?sort=sortOrder&sort=name",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];
}
