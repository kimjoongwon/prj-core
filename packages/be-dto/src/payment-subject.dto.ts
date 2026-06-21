import {
	EnumField,
	NumberField,
	StringField,
	UUIDField,
} from "@cocrepo/decorator";
import {
	type PaymentSubject,
	PaymentSubjectType,
	type Prisma,
} from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

export class PaymentSubjectDto extends AbstractDto implements PaymentSubject {
	@UUIDField({ description: "결제 ID" })
	paymentId!: string;

	@UUIDField({ description: "소속 Tenant ID" })
	tenantId!: string;

	@StringField({ description: "서비스 코드", maxLength: 80 })
	serviceCode!: string;

	@EnumField(() => PaymentSubjectType, { description: "결제 대상 종류" })
	subjectType!: PaymentSubjectType;

	@StringField({ description: "결제 대상 ID", maxLength: 160 })
	subjectId!: string;

	@StringField({ description: "결제 대상 표시명", maxLength: 160 })
	subjectLabel!: string;

	@NumberField({ description: "수량", int: true, min: 1 })
	quantity!: number;

	@NumberField({ description: "단가", int: true, min: 0 })
	unitAmount!: number;

	@NumberField({ description: "합계 금액", int: true, min: 0 })
	totalAmount!: number;

	@StringField({
		description: "통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
	})
	currency!: string;

	metadata!: Prisma.JsonValue | null;
}
