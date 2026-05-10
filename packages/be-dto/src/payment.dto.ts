import {
	ClassField,
	DateFieldOptional,
	EnumField,
	EnumFieldOptional,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import {
	type Payment,
	PaymentMethod,
	PaymentStatus,
	type Prisma,
} from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { PaymentReferenceDto } from "./payment-reference.dto";
import { PaymentSubjectDto } from "./payment-subject.dto";
import { SpaceDto } from "./space.dto";
import { UserDto } from "./user.dto";

export class PaymentDto extends AbstractDto implements Payment {
	@UUIDField({ description: "소속 Space ID" })
	spaceId!: string;

	@UUIDFieldOptional({ description: "결제자 User ID", nullable: true })
	payerUserId!: string | null;

	@StringField({ description: "결제명", minLength: 1, maxLength: 160 })
	title!: string;

	@EnumField(() => PaymentStatus, { description: "결제 상태" })
	status!: PaymentStatus;

	@EnumFieldOptional(() => PaymentMethod, {
		description: "결제 수단",
		nullable: true,
	})
	method!: PaymentMethod | null;

	@StringFieldOptional({
		description: "결제 제공자",
		maxLength: 80,
		nullable: true,
	})
	provider!: string | null;

	@StringFieldOptional({
		description: "결제 제공자 결제 ID",
		maxLength: 160,
		nullable: true,
	})
	providerPaymentId!: string | null;

	@StringFieldOptional({
		description: "결제 제공자 주문 ID",
		maxLength: 160,
		nullable: true,
	})
	providerOrderId!: string | null;

	@NumberField({ description: "총 결제 금액", int: true, min: 0 })
	totalAmount!: number;

	@StringField({
		description: "통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
	})
	currency!: string;

	@DateFieldOptional({ description: "결제 요청 시각", nullable: true })
	requestedAt!: Date | null;

	@DateFieldOptional({ description: "결제 승인 시각", nullable: true })
	approvedAt!: Date | null;

	@DateFieldOptional({ description: "결제 취소 시각", nullable: true })
	canceledAt!: Date | null;

	@StringFieldOptional({
		description: "영수증 URL",
		maxLength: 1000,
		nullable: true,
	})
	receiptUrl!: string | null;

	@StringFieldOptional({
		description: "관리 메모",
		maxLength: 1000,
		nullable: true,
	})
	memo!: string | null;

	metadata!: Prisma.JsonValue | null;

	@ClassField(() => SpaceDto, {
		description: "소속 Space",
		required: false,
	})
	space?: SpaceDto;

	@ClassField(() => UserDto, {
		description: "결제자",
		required: false,
	})
	payer?: UserDto;

	@ClassField(() => PaymentSubjectDto, {
		description: "결제 대상 목록",
		each: true,
		isArray: true,
		required: false,
	})
	subjects?: PaymentSubjectDto[];

	@ClassField(() => PaymentReferenceDto, {
		description: "결제 참조 목록",
		each: true,
		isArray: true,
		required: false,
	})
	references?: PaymentReferenceDto[];
}
