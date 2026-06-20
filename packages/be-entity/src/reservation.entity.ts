import {
	type Reservation as ReservationEntity,
	ReservationStatus,
} from "@cocrepo/prisma";
import { AbstractAggregateEntity } from "./abstract-aggregate.entity";
import type { CoursePass } from "./course-pass.entity";
import type { Program } from "./program.entity";
import type { Session } from "./session.entity";
import type { Space } from "./space.entity";
import type { Timeline } from "./timeline.entity";
import type { User } from "./user.entity";

export class Reservation
	extends AbstractAggregateEntity
	implements ReservationEntity
{
	spaceId!: string;
	userId!: string;
	coursePassId!: string;
	timelineId!: string;
	sessionId!: string;
	programId!: string;
	occurrenceStartAt!: Date;
	status!: ReservationStatus;
	memo!: string | null;
	idempotencyKey!: string;
	waitlistPosition!: number | null;
	confirmedAt!: Date | null;
	canceledAt!: Date | null;
	cancelReason!: string | null;

	space?: Space;
	user?: User;
	coursePass?: CoursePass;
	timeline?: Timeline;
	session?: Session;
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
