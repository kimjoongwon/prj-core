import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { EnrollmentStatus, PaymentStatus, type Prisma } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "./prisma-query.dto";

/**
 * Enrollment 목록 조회용 Query DTO
 *
 * 자동 매핑: courseId, courseOfferingId, userId, paymentStatus, status
 * 커스텀 처리: timelineId(assignedTimelineId), validOn, search
 */
export class QueryEnrollmentDto extends PrismaQueryDto<Prisma.EnrollmentWhereInput> {
	@StringFieldOptional({
		description: "수강자명/이메일, 코스명, 개설 과정명, 결제 참조 통합 검색",
	})
	search?: string;

	@UUIDFieldOptional({ description: "코스 ID 필터" })
	courseId?: string;

	@UUIDFieldOptional({ description: "개설 과정 ID 필터" })
	courseOfferingId?: string;

	@UUIDFieldOptional({ description: "사용자 ID 필터" })
	userId?: string;

	@UUIDFieldOptional({ description: "할당 타임라인 ID 필터" })
	timelineId?: string;

	@EnumFieldOptional(() => PaymentStatus, {
		description: "결제 상태 필터 (PENDING, PAID, FAILED, CANCELED, REFUNDED)",
	})
	paymentStatus?: PaymentStatus;

	@EnumFieldOptional(() => EnrollmentStatus, {
		description:
			"수강 등록 상태 필터 (PENDING, ACTIVE, CANCELED, COMPLETED, EXPIRED)",
	})
	status?: EnrollmentStatus;

	@DateFieldOptional({
		description: "해당 일시에 유효한 수강 등록만 조회 (ISO8601)",
	})
	validOn?: Date;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, paidAt, validFrom, validUntil, paymentStatus, status. 예: ?sort=-paidAt&sort=status",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];

	protected excludeFromAutoMap(): string[] {
		return ["search", "timelineId", "validOn"];
	}

	toPrismaWhere(
		baseWhere?: Partial<Prisma.EnrollmentWhereInput>,
	): Prisma.EnrollmentWhereInput {
		const where = super.toPrismaWhere(baseWhere);

		if (this.timelineId) {
			where.assignedTimelineId = this.timelineId;
		}

		if (this.validOn) {
			where.validFrom = { lte: this.validOn };
			where.validUntil = { gte: this.validOn };
		}

		if (this.search) {
			const search = this.containsFilter(this.search);
			where.OR = [
				{ user: { name: search } },
				{ user: { email: search } },
				{ course: { name: search } },
				{ courseOffering: { name: search } },
				{ paymentProvider: search },
				{ paymentExternalId: search },
			];
		}

		return where;
	}
}
