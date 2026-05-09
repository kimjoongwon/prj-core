import {
	ClassField,
	DateField,
	EnumField,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import type { Reservation as ReservationModel } from "@cocrepo/prisma";
import { ReservationStatus } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";
import { ProgramDto } from "../program.dto";
import { SessionDto } from "../session.dto";
import { SpaceDto } from "../space.dto";
import { TimelineDto } from "../timeline.dto";
import { UserDto } from "../user.dto";

export class ReservationDto extends AbstractDto implements ReservationModel {
	@UUIDField({ description: "Space ID" })
	spaceId!: string;

	@UUIDField({ description: "예약 사용자 ID" })
	userId!: string;

	@UUIDField({ description: "예약 권리를 소비하는 수강권 ID" })
	coursePassId!: string;

	@UUIDField({ description: "타임라인 ID" })
	timelineId!: string;

	@UUIDField({ description: "세션 ID" })
	sessionId!: string;

	@UUIDField({ description: "프로그램 ID" })
	programId!: string;

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

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;

	@ClassField(() => UserDto, { required: false })
	user?: UserDto;

	@ClassField(() => TimelineDto, { required: false })
	timeline?: TimelineDto;

	@ClassField(() => SessionDto, { required: false })
	session?: SessionDto;

	@ClassField(() => ProgramDto, { required: false })
	program?: ProgramDto;
}
