import { ReservationStatus } from "@cocrepo/enum";
import type { Reservation as PrismaReservation } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	DateValidation,
	EnumValidation,
	NumberValidationOptional,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Reservation의 DB 필드 타입과 공통 검증입니다. */
export class ReservationSchema
	extends AbstractSchema
	implements PrismaReservation
{
	reservationId!: PrismaReservation["reservationId"];

	@BigIntIdValidation({ description: "Space ID" })
	spaceId!: PrismaReservation["spaceId"];

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: PrismaReservation["createdById"];

	@BigIntIdValidation({ description: "예약 사용자 ID" })
	userId!: PrismaReservation["userId"];

	@BigIntIdValidation({ description: "타임라인 ID" })
	timelineId!: PrismaReservation["timelineId"];

	@BigIntIdValidation({ description: "세션 ID" })
	sessionId!: PrismaReservation["sessionId"];

	@BigIntIdValidation({ description: "프로그램 ID" })
	programId!: PrismaReservation["programId"];

	@DateValidation({ description: "예약 발생 회차 시작 시각" })
	occurrenceStartAt!: PrismaReservation["occurrenceStartAt"];

	@EnumValidation(() => ReservationStatus, { description: "예약 상태" })
	status!: PrismaReservation["status"];

	@StringValidationOptional({ description: "예약 메모", nullable: true })
	memo!: PrismaReservation["memo"];

	@StringValidation({ description: "멱등성 키" })
	idempotencyKey!: PrismaReservation["idempotencyKey"];

	@NumberValidationOptional({
		description: "대기 순번",
		nullable: true,
		int: true,
		minimum: 1,
	})
	waitlistPosition!: PrismaReservation["waitlistPosition"];

	@DateValidation({ description: "확정 시각", nullable: true })
	confirmedAt!: PrismaReservation["confirmedAt"];

	@DateValidation({ description: "취소 시각", nullable: true })
	canceledAt!: PrismaReservation["canceledAt"];

	@StringValidationOptional({ description: "취소 사유", nullable: true })
	cancelReason!: PrismaReservation["cancelReason"];
}
