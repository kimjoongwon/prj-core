import { ReservationStatus } from "@cocrepo/enum";
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
{
	reservationId!: string;

	@BigIntIdValidation({ description: "Space ID" })
	spaceId!: bigint;

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

	@BigIntIdValidation({ description: "예약 사용자 ID" })
	userId!: bigint;

	@BigIntIdValidation({ description: "타임라인 ID" })
	timelineId!: bigint;

	@BigIntIdValidation({ description: "세션 ID" })
	sessionId!: bigint;

	@BigIntIdValidation({ description: "프로그램 ID" })
	programId!: bigint;

	@DateValidation({ description: "예약 발생 회차 시작 시각" })
	occurrenceStartAt!: Date;

	@EnumValidation(() => ReservationStatus, { description: "예약 상태" })
	status!: ReservationStatus;

	@StringValidationOptional({ description: "예약 메모", nullable: true })
	memo!: string | null;

	@StringValidation({ description: "멱등성 키" })
	idempotencyKey!: string;

	@NumberValidationOptional({
		description: "대기 순번",
		nullable: true,
		int: true,
		minimum: 1,
	})
	waitlistPosition!: number | null;

	@DateValidation({ description: "확정 시각", nullable: true })
	confirmedAt!: Date | null;

	@DateValidation({ description: "취소 시각", nullable: true })
	canceledAt!: Date | null;

	@StringValidationOptional({ description: "취소 사유", nullable: true })
	cancelReason!: string | null;
}
