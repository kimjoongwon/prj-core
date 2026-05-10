import {
	ClassField,
	DateFieldOptional,
	EnumField,
	EnumFieldOptional,
	NumberFieldOptional,
	StringField,
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
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreatePaymentSubjectDto {
	@StringFieldOptional({
		description: "서비스 코드",
		maxLength: 80,
		default: "core",
	})
	serviceCode?: string;

	@EnumField(() => PaymentSubjectType, { description: "결제 대상 종류" })
	subjectType!: PaymentSubjectType;

	@StringField({ description: "결제 대상 ID", maxLength: 160 })
	subjectId!: string;

	@StringField({ description: "결제 대상 표시명", maxLength: 160 })
	subjectLabel!: string;

	@NumberFieldOptional({
		description: "수량",
		int: true,
		min: 1,
		default: 1,
	})
	quantity?: number;

	@NumberFieldOptional({
		description: "단가",
		int: true,
		min: 0,
		default: 0,
	})
	unitAmount?: number;

	@NumberFieldOptional({
		description: "합계 금액",
		int: true,
		min: 0,
		default: 0,
	})
	totalAmount?: number;

	@StringFieldOptional({
		description: "통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
		default: "KRW",
	})
	currency?: string;

	@ApiPropertyOptional({
		description: "결제 대상 snapshot metadata",
		type: "object",
		additionalProperties: true,
		nullable: true,
	})
	@IsOptional()
	metadata?: Prisma.InputJsonValue | null;
}

export class CreatePaymentReferenceDto {
	@StringFieldOptional({
		description: "서비스 코드",
		maxLength: 80,
		default: "core",
	})
	serviceCode?: string;

	@EnumField(() => PaymentReferenceType, { description: "참조 리소스 종류" })
	referenceType!: PaymentReferenceType;

	@StringField({ description: "참조 리소스 ID", maxLength: 160 })
	referenceId!: string;

	@StringFieldOptional({
		description: "참조 역할",
		maxLength: 80,
		default: "primary",
	})
	role?: string;

	@StringFieldOptional({
		description: "참조 표시명",
		maxLength: 160,
		nullable: true,
	})
	label?: string | null;

	@ApiPropertyOptional({
		description: "참조 metadata",
		type: "object",
		additionalProperties: true,
		nullable: true,
	})
	@IsOptional()
	metadata?: Prisma.InputJsonValue | null;
}

export class CreatePaymentDto {
	@UUIDFieldOptional({ description: "결제자 User ID", nullable: true })
	payerUserId?: string | null;

	@StringField({ description: "결제명", minLength: 1, maxLength: 160 })
	title!: string;

	@EnumFieldOptional(() => PaymentStatus, {
		description: "결제 상태",
		default: PaymentStatus.PENDING,
	})
	status?: PaymentStatus;

	@EnumFieldOptional(() => PaymentMethod, {
		description: "결제 수단",
		nullable: true,
	})
	method?: PaymentMethod | null;

	@StringFieldOptional({
		description: "결제 제공자",
		maxLength: 80,
		nullable: true,
	})
	provider?: string | null;

	@StringFieldOptional({
		description: "결제 제공자 결제 ID",
		maxLength: 160,
		nullable: true,
	})
	providerPaymentId?: string | null;

	@StringFieldOptional({
		description: "결제 제공자 주문 ID",
		maxLength: 160,
		nullable: true,
	})
	providerOrderId?: string | null;

	@NumberFieldOptional({
		description: "총 결제 금액. 생략하면 subjects 합계로 계산합니다.",
		int: true,
		min: 0,
	})
	totalAmount?: number;

	@StringFieldOptional({
		description: "통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
		default: "KRW",
	})
	currency?: string;

	@DateFieldOptional({ description: "결제 요청 시각", nullable: true })
	requestedAt?: Date | null;

	@DateFieldOptional({ description: "결제 승인 시각", nullable: true })
	approvedAt?: Date | null;

	@DateFieldOptional({ description: "결제 취소 시각", nullable: true })
	canceledAt?: Date | null;

	@StringFieldOptional({
		description: "영수증 URL",
		maxLength: 1000,
		nullable: true,
	})
	receiptUrl?: string | null;

	@StringFieldOptional({
		description: "관리 메모",
		maxLength: 1000,
		nullable: true,
	})
	memo?: string | null;

	@ApiPropertyOptional({
		description: "결제 metadata",
		type: "object",
		additionalProperties: true,
		nullable: true,
	})
	@IsOptional()
	metadata?: Prisma.InputJsonValue | null;

	@ClassField(() => CreatePaymentSubjectDto, {
		description: "결제 대상 목록",
		each: true,
		isArray: true,
		required: false,
	})
	subjects?: CreatePaymentSubjectDto[];

	@ClassField(() => CreatePaymentReferenceDto, {
		description: "결제 참조 목록",
		each: true,
		isArray: true,
		required: false,
	})
	references?: CreatePaymentReferenceDto[];
}
