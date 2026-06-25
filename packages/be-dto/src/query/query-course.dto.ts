import {
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { CourseStatus } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { QueryDto } from "./query.dto";

/**
 * Course 목록 조회용 Query DTO
 *
 * 필터 계약: status(enum), tenantId(*Id)
 * 커스텀 처리: search(name OR description)
 */
export class QueryCourseDto extends QueryDto {
	@StringFieldOptional({ description: "코스명 또는 설명 통합 검색" })
	search?: string;

	@EnumFieldOptional(() => CourseStatus, {
		description: "코스 상태 필터 (DRAFT, ACTIVE, ARCHIVED)",
	})
	status?: CourseStatus;

	@UUIDFieldOptional({ description: "테넌트 ID 필터" })
	tenantId?: string;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name, status, activeOfferingCount, activeEnrollmentCount. 예: ?sort=name&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];

}
