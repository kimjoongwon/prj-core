import {
	ClassField,
	DateField,
	EnumField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { PaymentStatus } from "@cocrepo/prisma";
import { PaymentDto } from "./payment.dto";

export enum ReservationPaymentCheckoutNextActionType {
	PROVIDER_HANDOFF_PENDING = "PROVIDER_HANDOFF_PENDING",
	REDIRECT = "REDIRECT",
	NONE = "NONE",
}

export class CreateReservationPaymentCheckoutDto {
	@UUIDField({ description: "예약할 타임라인 ID" })
	timelineId!: string;

	@UUIDField({ description: "예약할 세션 ID" })
	sessionId!: string;

	@UUIDField({ description: "예약할 프로그램 ID" })
	programId!: string;

	@DateField({ description: "예약 발생 회차 시작 시각" })
	occurrenceStartAt!: Date;

	@StringField({
		description: "예약 결제 체크아웃 멱등성 키",
		minLength: 8,
		maxLength: 120,
	})
	idempotencyKey!: string;

	@StringFieldOptional({
		description: "결제 제공자 식별자. 미지정 시 provider-neutral로 기록합니다.",
		maxLength: 80,
		nullable: true,
	})
	provider?: string | null;

	@StringFieldOptional({
		description: "예약/결제 요청 메모",
		maxLength: 1000,
		nullable: true,
	})
	memo?: string | null;
}

export class ReservationPaymentCheckoutLineItemDto {
	@StringField({ description: "체크아웃 표시명" })
	label!: string;

	@NumberField({ description: "수량", int: true, minimum: 1 })
	quantity!: number;

	@NumberField({ description: "단가", int: true, minimum: 0 })
	unitAmount!: number;

	@NumberField({ description: "합계 금액", int: true, minimum: 0 })
	totalAmount!: number;

	@StringField({
		description: "통화 코드",
		minLength: 3,
		maxLength: 3,
	})
	currency!: string;
}

export class ReservationPaymentCheckoutNextActionDto {
	@EnumField(() => ReservationPaymentCheckoutNextActionType, {
		description: "체크아웃 다음 액션",
	})
	type!: ReservationPaymentCheckoutNextActionType;

	@StringFieldOptional({
		description: "외부 결제창 URL. provider-neutral 단계에서는 null입니다.",
		maxLength: 1000,
		nullable: true,
	})
	redirectUrl!: string | null;
}

export class ReservationPaymentCheckoutDto {
	@ClassField(() => PaymentDto, { description: "생성 또는 재사용한 결제 원장" })
	payment!: PaymentDto;

	@StringField({ description: "provider-neutral 주문 ID" })
	providerOrderId!: string;

	@EnumField(() => PaymentStatus, { description: "결제 상태" })
	status!: PaymentStatus;

	@NumberField({ description: "총 결제 금액", int: true, minimum: 0 })
	totalAmount!: number;

	@StringField({
		description: "통화 코드",
		minLength: 3,
		maxLength: 3,
	})
	currency!: string;

	@ClassField(() => ReservationPaymentCheckoutLineItemDto, {
		description: "체크아웃 표시 항목",
		each: true,
		isArray: true,
	})
	lineItems!: ReservationPaymentCheckoutLineItemDto[];

	@ClassField(() => ReservationPaymentCheckoutNextActionDto, {
		description: "결제 provider 연결을 위한 다음 액션",
	})
	nextAction!: ReservationPaymentCheckoutNextActionDto;
}
