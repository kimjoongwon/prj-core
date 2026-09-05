import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	DateField,
	EnumField,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

import { ReservationStatus } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractAggregateEntity } from "./abstract-aggregate.entity";
import { Program } from "./program.entity";
import { Session } from "./session.entity";
import { Space } from "./space.entity";
import { Timeline } from "./timeline.entity";
import { User } from "./user.entity";

export class Reservation extends AbstractAggregateEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) reservationId!: string;

	@BigIntIdField({ description: "Space ID" })
	spaceId!: bigint;
	@BigIntIdFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;
	@BigIntIdField({ description: "예약 사용자 ID" })
	userId!: bigint;
	@BigIntIdField({ description: "타임라인 ID" })
	timelineId!: bigint;
	@BigIntIdField({ description: "세션 ID" })
	sessionId!: bigint;
	@BigIntIdField({ description: "프로그램 ID" })
	programId!: bigint;
	@DateField({ description: "예약 발생 회차 시작 시각" })
	occurrenceStartAt!: Date;
	@EnumField(() => ReservationStatus, { description: "예약 상태" })
	status!: ReservationStatus;
	@StringFieldOptional({ description: "예약 메모", nullable: true })
	memo!: string | null;
	@StringField({ description: "멱등성 키" })
	idempotencyKey!: string;
	@NumberFieldOptional({
		description: "대기 순번",
		nullable: true,
		int: true,
		minimum: 1,
	})
	waitlistPosition!: number | null;
	@DateField({ description: "확정 시각", nullable: true })
	confirmedAt!: Date | null;
	@DateField({ description: "취소 시각", nullable: true })
	canceledAt!: Date | null;
	@StringFieldOptional({ description: "취소 사유", nullable: true })
	cancelReason!: string | null;

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
