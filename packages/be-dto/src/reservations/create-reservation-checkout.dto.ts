import {
	DateField,
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { PaymentMethod } from "@cocrepo/prisma";

export class CreateReservationCheckoutDto {
	@UUIDField({ description: "구매할 코스 개설 ID" })
	courseOfferingId!: string;

	@UUIDField({ description: "타임라인 ID" })
	timelineId!: string;

	@UUIDField({ description: "세션 ID" })
	sessionId!: string;

	@UUIDField({ description: "프로그램 ID" })
	programId!: string;

	@DateField({ description: "예약 회차 시작 시각" })
	occurrenceStartAt!: Date;

	@StringField({
		description: "checkout/예약 멱등성 키",
		minLength: 8,
		maxLength: 120,
	})
	idempotencyKey!: string;

	@EnumField(() => PaymentMethod, { description: "placeholder 결제 수단" })
	paymentMethod!: PaymentMethod;

	@StringFieldOptional({
		description: "예약 메모",
		maxLength: 1000,
		nullable: true,
	})
	memo?: string | null;
}
