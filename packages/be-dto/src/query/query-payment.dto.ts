import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import {
	PaymentMethod,
	PaymentReferenceType,
	PaymentStatus,
	PaymentSubjectType,
	type Prisma,
} from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryPaymentDto extends PrismaQueryDto<Prisma.PaymentWhereInput> {
	@StringFieldOptional({ description: "결제명/제공자/대상 통합 검색" })
	search?: string;

	@UUIDFieldOptional({ description: "테넌트 ID 필터" })
	tenantId?: string;

	@UUIDFieldOptional({ description: "결제자 User ID 필터" })
	payerUserId?: string;

	@EnumFieldOptional(() => PaymentStatus, { description: "결제 상태 필터" })
	status?: PaymentStatus;

	@EnumFieldOptional(() => PaymentMethod, { description: "결제 수단 필터" })
	method?: PaymentMethod;

	@StringFieldOptional({ description: "결제 제공자 필터" })
	provider?: string;

	@StringFieldOptional({ description: "결제 제공자 주문 ID 필터" })
	providerOrderId?: string;

	@EnumFieldOptional(() => PaymentSubjectType, {
		description: "결제 대상 종류 필터",
	})
	subjectType?: PaymentSubjectType;

	@StringFieldOptional({ description: "결제 대상 ID 필터" })
	subjectId?: string;

	@EnumFieldOptional(() => PaymentReferenceType, {
		description: "참조 리소스 종류 필터",
	})
	referenceType?: PaymentReferenceType;

	@StringFieldOptional({ description: "참조 리소스 ID 필터" })
	referenceId?: string;

	@DateFieldOptional({ description: "승인일 시작 필터" })
	approvedFrom?: Date;

	@DateFieldOptional({ description: "승인일 종료 필터" })
	approvedUntil?: Date;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬. 허용 필드: createdAt, approvedAt, totalAmount, status, title. 예: ?sort=-approvedAt&sort=title",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];

	protected excludeFromAutoMap(): string[] {
		return [
			"search",
			"subjectType",
			"subjectId",
			"referenceType",
			"referenceId",
			"approvedFrom",
			"approvedUntil",
			"sort",
		];
	}
}
