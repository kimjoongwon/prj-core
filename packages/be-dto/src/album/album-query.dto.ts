import {
	BigIntIdFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { DeleteFilter } from "@cocrepo/enum";
import { Transform } from "class-transformer";
import { QueryDto } from "../query/query.dto";

/**
 * 앨범 목록 조회용 Query DTO
 *
 * 필터 계약:
 * - name -> containsFilter (일반 string)
 * - tenantId -> 정확 매핑 (*Id)
 *
 * 커스텀 처리:
 * - statusFilter -> removedAt 필터
 */
export class AlbumQueryDto extends QueryDto {
	@BigIntIdFieldOptional({ description: "테넌트 ID 필터" })
	spaceId?: bigint;

	@StringFieldOptional({ description: "앨범명 검색 (부분 일치)" })
	name?: string;

	@EnumFieldOptional(() => DeleteFilter, {
		description: "상태 필터 (active: 활성, deleted: 삭제됨)",
	})
	statusFilter?: DeleteFilter;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name, sortOrder. 예: ?sort=sortOrder&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];
}
