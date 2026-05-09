import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { CoursePassKind, CoursePassStatus, type Prisma } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "./prisma-query.dto";

/**
 * CoursePass 목록 조회용 Query DTO
 *
 * 자동 매핑: courseId, courseOfferingId, enrollmentId, userId, timelineId, status, kind
 * 커스텀 처리: validOn, expiresBefore, search
 */
export class QueryCoursePassDto extends PrismaQueryDto<Prisma.CoursePassWhereInput> {
	@StringFieldOptional({
		description: "보유자명/이메일, 코스명, 개설 과정명, 타임라인명 통합 검색",
	})
	search?: string;

	@UUIDFieldOptional({ description: "코스 ID 필터" })
	courseId?: string;

	@UUIDFieldOptional({ description: "개설 과정 ID 필터" })
	courseOfferingId?: string;

	@UUIDFieldOptional({ description: "수강 등록 ID 필터" })
	enrollmentId?: string;

	@UUIDFieldOptional({ description: "사용자 ID 필터" })
	userId?: string;

	@UUIDFieldOptional({ description: "타임라인 ID 필터" })
	timelineId?: string;

	@EnumFieldOptional(() => CoursePassStatus, {
		description: "수강권 상태 필터 (ACTIVE, SUSPENDED, EXPIRED, CANCELED)",
	})
	status?: CoursePassStatus;

	@EnumFieldOptional(() => CoursePassKind, {
		description: "수강권 종류 필터 (STANDARD, MANUAL_GRANT, MAKEUP)",
	})
	kind?: CoursePassKind;

	@DateFieldOptional({
		description: "해당 일시에 유효한 수강권만 조회 (ISO8601)",
	})
	validOn?: Date;

	@DateFieldOptional({
		description: "만료일 상한 필터 (expiresAt <= 값, ISO8601)",
	})
	expiresBefore?: Date;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, issuedAt, validFrom, expiresAt, reservationRemainingCount, status. 예: ?sort=expiresAt&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];

	protected excludeFromAutoMap(): string[] {
		return ["search", "validOn", "expiresBefore"];
	}

	toPrismaWhere(
		baseWhere?: Partial<Prisma.CoursePassWhereInput>,
	): Prisma.CoursePassWhereInput {
		const where = super.toPrismaWhere(baseWhere);

		if (this.validOn) {
			where.validFrom = { lte: this.validOn };
			where.expiresAt = { gte: this.validOn };
		}

		if (this.expiresBefore) {
			where.expiresAt = {
				...(typeof where.expiresAt === "object" && where.expiresAt !== null
					? where.expiresAt
					: {}),
				lte: this.expiresBefore,
			};
		}

		if (this.search) {
			const search = this.containsFilter(this.search);
			where.OR = [
				{ user: { name: search } },
				{ user: { email: search } },
				{ course: { name: search } },
				{ courseOffering: { name: search } },
				{ timeline: { name: search } },
			];
		}

		return where;
	}
}
