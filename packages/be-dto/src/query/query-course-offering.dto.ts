import {
	BooleanFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import {
	CourseOfferingStatus,
	type Prisma,
	TimelineProvisioningMode,
} from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "./prisma-query.dto";

/**
 * CourseOffering 목록 조회용 Query DTO
 *
 * 자동 매핑: courseId, tenantId, timelineId, status, timelineProvisioningMode
 * 커스텀 처리: search(name OR course.name OR timeline.name), recruitingOnly
 */
export class QueryCourseOfferingDto extends PrismaQueryDto<Prisma.CourseOfferingWhereInput> {
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

	protected excludeFromAutoMap(): string[] {
		return ["search", "recruitingOnly"];
	}

	toPrismaWhere(
		baseWhere?: Partial<Prisma.CourseOfferingWhereInput>,
	): Prisma.CourseOfferingWhereInput {
		const where = super.toPrismaWhere(baseWhere);

		if (this.search) {
			const search = this.containsFilter(this.search);
			where.OR = [
				{ name: search },
				{ course: { name: search } },
				{ timeline: { is: { name: search } } },
			];
		}

		if (this.recruitingOnly) {
			const now = new Date();
			const existingAnd = Array.isArray(where.AND)
				? where.AND
				: where.AND
					? [where.AND]
					: [];

			where.AND = [
				...existingAnd,
				{ status: CourseOfferingStatus.ENROLLING },
				{
					OR: [
						{ enrollmentStartsAt: null },
						{ enrollmentStartsAt: { lte: now } },
					],
				},
				{
					OR: [{ enrollmentEndsAt: null }, { enrollmentEndsAt: { gte: now } }],
				},
			];
		}

		return where;
	}
}
