import {
	BooleanFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import {
	CourseOfferingStatus,
	TimelineProvisioningMode,
} from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { QueryDto } from "./query.dto";

/**
 * CourseOffering 목록 조회용 Query DTO
 *
 * 필터 계약: courseId, tenantId, timelineId, status, timelineProvisioningMode
 * 커스텀 처리: search(name OR course.name OR timeline.name), recruitingOnly
 */
export class QueryCourseOfferingDto extends QueryDto {
	@StringFieldOptional({
		description: "개설 과정명, 코스명, 타임라인명 통합 검색",
	})
	search?: string;

	@UUIDFieldOptional({ description: "코스 ID 필터" })
	courseId?: string;

	@UUIDFieldOptional({ description: "테넌트 ID 필터" })
	tenantId?: string;

	@UUIDFieldOptional({ description: "타임라인 ID 필터" })
	timelineId?: string;

	@EnumFieldOptional(() => CourseOfferingStatus, {
		description: "개설 상태 필터 (DRAFT, ENROLLING, ACTIVE, CLOSED, CANCELED)",
	})
	status?: CourseOfferingStatus;

	@EnumFieldOptional(() => TimelineProvisioningMode, {
		description: "타임라인 준비 방식 필터 (SHARED, DEDICATED_ON_ENROLLMENT)",
	})
	timelineProvisioningMode?: TimelineProvisioningMode;

	@BooleanFieldOptional({
		description: "현재 모집 중인 개설 과정만 조회",
	})
	recruitingOnly?: boolean;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name, startsAt, endsAt, enrollmentStartsAt, enrollmentEndsAt, capacity, enrolledCount, status. 예: ?sort=startsAt&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];

}
