import {
	type Reservation as ReservationEntity,
	ReservationStatus,
} from "@cocrepo/prisma";
import { AbstractAggregateEntity } from "./abstract-aggregate.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Program } from "./program.entity";
import type { Session } from "./session.entity";
import type { Space } from "./space.entity";
import type { Timeline } from "./timeline.entity";
import type { User } from "./user.entity";

export class Reservation
	extends AbstractAggregateEntity
	implements DomainEntityModel<ReservationEntity>
{
	spaceId!: string;
	createdById!: string | null;
	userId!: string;
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
	createdBy?: User | null;
	user?: User;
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
