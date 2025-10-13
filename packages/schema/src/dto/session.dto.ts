import { $Enums, Session } from "@prisma/client";
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
	@EnumField(() => $Enums.SessionTypes)
	@Transform(({ value }) => SessionTypes.findName(value))
	type: $Enums.SessionTypes;

	@EnumFieldOptional(() => $Enums.RepeatCycleTypes, { nullable: true })
	@Transform(({ value }) => RepeatCycleTypes.findName(value))
	repeatCycleType: $Enums.RepeatCycleTypes | null;

	@DateFieldOptional()
	startDateTime: Date | null;

	@DateFieldOptional()
	endDateTime: Date | null;

	@EnumFieldOptional(() => $Enums.RecurringDayOfWeek, { nullable: true })
	recurringDayOfWeek: $Enums.RecurringDayOfWeek | null;

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
