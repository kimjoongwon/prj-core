import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
	DateFieldMetadata,
	EnumFieldMetadata,
	NumberFieldOptionalMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { ReservationStatus } from "@cocrepo/enum";
import { ReservationSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Program } from "./program.entity";
import { Session } from "./session.entity";
import { Space } from "./space.entity";
import { Timeline } from "./timeline.entity";
import { User } from "./user.entity";

@AbstractEntityFields()
export class Reservation extends ReservationSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare reservationId: ReservationSchema["reservationId"];

	@BigIntIdFieldMetadata({ description: "Space ID" })
	declare spaceId: ReservationSchema["spaceId"];
	@BigIntIdFieldOptionalMetadata({ nullable: true, description: "생성자 ID" })
	declare createdById: ReservationSchema["createdById"];
	@BigIntIdFieldMetadata({ description: "예약 사용자 ID" })
	declare userId: ReservationSchema["userId"];
	@BigIntIdFieldMetadata({ description: "타임라인 ID" })
	declare timelineId: ReservationSchema["timelineId"];
	@BigIntIdFieldMetadata({ description: "세션 ID" })
	declare sessionId: ReservationSchema["sessionId"];
	@BigIntIdFieldMetadata({ description: "프로그램 ID" })
	declare programId: ReservationSchema["programId"];
	@DateFieldMetadata({ description: "예약 발생 회차 시작 시각" })
	declare occurrenceStartAt: ReservationSchema["occurrenceStartAt"];
	@EnumFieldMetadata(() => ReservationStatus, { description: "예약 상태" })
	declare status: ReservationSchema["status"];
	@StringFieldOptionalMetadata({ description: "예약 메모", nullable: true })
	declare memo: ReservationSchema["memo"];
	@StringFieldMetadata({ description: "멱등성 키" })
	declare idempotencyKey: ReservationSchema["idempotencyKey"];
	@NumberFieldOptionalMetadata({
		description: "대기 순번",
		nullable: true,
		int: true,
		minimum: 1,
	})
	declare waitlistPosition: ReservationSchema["waitlistPosition"];
	@DateFieldMetadata({ description: "확정 시각", nullable: true })
	declare confirmedAt: ReservationSchema["confirmedAt"];
	@DateFieldMetadata({ description: "취소 시각", nullable: true })
	declare canceledAt: ReservationSchema["canceledAt"];
	@StringFieldOptionalMetadata({ description: "취소 사유", nullable: true })
	declare cancelReason: ReservationSchema["cancelReason"];

	space?: Space;
	@ClassField(() => User, { required: false, nullable: true })
	createdBy?: User | null;
	@ClassField(() => User, { required: false })
	user?: User;
	@ClassField(() => Timeline, { required: false })
	timeline?: Timeline;
	@ClassField(() => Session, { required: false })
	session?: Session;
	@ClassField(() => Program, { required: false })
	program?: Program;

	cancel(params: { now: Date; cancelReason?: string | null }): void {
		this.status = ReservationStatus.CANCELED;
		this.canceledAt = params.now;
		this.cancelReason = params.cancelReason ?? null;
		this.waitlistPosition = null;
	}

	confirmFromWaitlist(now: Date): void {
		this.status = ReservationStatus.CONFIRMED;
		this.confirmedAt = now;
		this.waitlistPosition = null;
	}
}
