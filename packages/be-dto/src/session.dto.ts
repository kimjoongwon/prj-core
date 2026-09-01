import {
	BigIntIdField,
	ClassField,
	DateFieldOptional,
	EnumField,
	EnumFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import {
	RepeatCycleType as RepeatCycleTypeNames,
	SessionType as SessionTypeNames,
} from "@cocrepo/enum";
import {
	type RepeatCycleTypes as PrismaRepeatCycleTypes,
	RepeatCycleTypes as PrismaRepeatCycleTypesEnum,
	type SessionTypes as PrismaSessionTypes,
	SessionTypes as PrismaSessionTypesEnum,
	RecurringDayOfWeek,
	type Session,
} from "@cocrepo/prisma";
import { Exclude, Transform } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { ProgramDto } from "./program.dto";
import { TimelineDto } from "./timeline.dto";

export class SessionDto
	extends AbstractDto
	implements DomainEntityModel<Session, "sessionId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly sessionId?: never;

	@EnumField(() => PrismaSessionTypesEnum)
	@Transform(
		({ value }) =>
			typeof value === "string"
				? (SessionTypeNames.findName(value) ?? value)
				: value,
		{ toPlainOnly: true },
	)
	type: PrismaSessionTypes;

	@EnumFieldOptional(() => PrismaRepeatCycleTypesEnum, { nullable: true })
	@Transform(
		({ value }) =>
			typeof value === "string"
				? (RepeatCycleTypeNames.findName(value) ?? value)
				: value,
		{ toPlainOnly: true },
	)
	repeatCycleType: PrismaRepeatCycleTypes | null;

	@DateFieldOptional({ nullable: true })
	startDateTime: Date | null;

	@DateFieldOptional({ nullable: true })
	endDateTime: Date | null;

	@EnumFieldOptional(() => RecurringDayOfWeek, { nullable: true })
	recurringDayOfWeek: RecurringDayOfWeek | null;

	@BigIntIdField()
	timelineId: bigint;

	@StringField()
	name: string;

	@StringFieldOptional({ nullable: true })
	description: string | null;

	@ClassField(() => ProgramDto, { isArray: true })
	programs?: ProgramDto[];

	@ClassField(() => TimelineDto)
	timeline?: TimelineDto;
}
