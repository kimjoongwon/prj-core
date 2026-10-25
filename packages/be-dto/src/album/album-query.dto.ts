import {
	EnumFieldOptional,
	StringFieldOptional,
	ULIDFieldOptional,
} from "@cocrepo/decorator/field";
import { Album } from "@cocrepo/entity";
import { DeleteFilter } from "@cocrepo/enum";
import { Transform } from "class-transformer";
import { EntityQueryType } from "../query/entity-query-type";

/**
 * 앨범 목록 조회용 Query DTO
 *
 * 필터 계약:
 * - spaceId -> 공개 ULID 정확 매칭
 * - name -> containsFilter (일반 string)
 *
 * 커스텀 처리:
 * - statusFilter -> removedAt 필터
 */
export class AlbumQueryDto extends EntityQueryType(Album, [] as const) {
	@ULIDFieldOptional({ description: "공간 공개 ID (ULID) 정확 매칭" })
	spaceId?: string;

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
