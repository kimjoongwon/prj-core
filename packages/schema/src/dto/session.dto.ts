import {
	Session,
	RecurringDayOfWeek,
	RepeatCycleTypes as PrismaRepeatCycleTypes,
	SessionTypes as PrismaSessionTypes
} from "@prisma/client";
import { Transform } from "class-transformer";
import {
	ClassField,
	DateFieldOptional,
	EnumField,
	EnumFieldOptional,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "../decorator/field";
import { RepeatCycleTypes } from "../enum/repeat-cycle-types.enum";
import { SessionTypes } from "../enum/session-types.enum";
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
