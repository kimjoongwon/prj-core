import {
	ClassField,
	DateFieldOptional,
	EnumField,
	EnumFieldOptional,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { RepeatCycleTypes, SessionTypes } from "@cocrepo/enum";
import {
	RepeatCycleTypes as PrismaRepeatCycleTypes,
	SessionTypes as PrismaSessionTypes,
	RecurringDayOfWeek,
	Session,
} from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { ProgramDto } from "./program.dto";
import { TimelineDto } from "./timeline.dto";

export class SessionDto extends AbstractDto implements Session {
	@EnumField(() => SessionTypes)
	@Transform(({ value }) => SessionTypes.findName(value))
	type: PrismaSessionTypes;

	@EnumFieldOptional(() => RepeatCycleTypes, { nullable: true })
	@Transform(({ value }) => RepeatCycleTypes.findName(value))
	repeatCycleType: PrismaRepeatCycleTypes | null;

	@DateFieldOptional()
	startDateTime: Date | null;

	@DateFieldOptional()
	endDateTime: Date | null;

	@EnumFieldOptional(() => RecurringDayOfWeek, { nullable: true })
	recurringDayOfWeek: RecurringDayOfWeek | null;

	@UUIDField()
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
