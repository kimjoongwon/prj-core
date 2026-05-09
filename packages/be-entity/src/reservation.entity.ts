import type {
	Reservation as ReservationEntity,
	ReservationStatus,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { CoursePass } from "./course-pass.entity";
import type { Program } from "./program.entity";
import type { Session } from "./session.entity";
import type { Space } from "./space.entity";
import type { Timeline } from "./timeline.entity";
import type { User } from "./user.entity";

export class Reservation extends AbstractEntity implements ReservationEntity {
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
}
