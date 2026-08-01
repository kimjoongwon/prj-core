import {
	ClassField,
	DateFieldOptional,
	EnumField,
	EnumFieldOptional,
	StringField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator";
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
import { Transform } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { ProgramDto } from "./program.dto";
import { TimelineDto } from "./timeline.dto";

export class SessionDto
	extends AbstractDto
	implements DomainEntityModel<Session>
{
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

	@DateFieldOptional()
	startDateTime: Date | null;

	@DateFieldOptional()
	endDateTime: Date | null;

	@EnumFieldOptional(() => RecurringDayOfWeek, { nullable: true })
	recurringDayOfWeek: RecurringDayOfWeek | null;

	@ULIDField()
	timelineId: string;

	@StringField()
	name: string;

	@StringFieldOptional()
	description: string | null;

	@ClassField(() => ProgramDto, { isArray: true })
	programs?: ProgramDto[];

	@ClassField(() => TimelineDto)
	timeline?: TimelineDto;
}
